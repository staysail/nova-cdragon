//
// Copyright 2022 Staysail Systems, Inc.
//
// Distributed under the terms of the MIT license.

// This file supports delve based debugging over DAP.

const State = require("./state.js");
const Config = require("./config.js");
const Prefs = require("./prefs.js");
const Paths = require("./paths.js");

let dapPath = "";

// it would be nice if we could search brew
function findTool(toolname) {
  if (nova.path.isAbsolute(toolname)) {
    return nova.fs.access(toolname, nova.fs.X_OK) ? toolname : null;
  }
  let dirs = [];
  dirs = dirs.concat(Paths.expandPath());
  dirs = dirs.concat(["/usr/local/bin", "/opt/homebrew/bin", "/usr/bin"]);
  let paths = Paths.findProgram(dirs, [toolname]);
  if (paths.length > 0) {
    return paths[0];
  }
  return null;
}

async function resolveTaskAction(context) {
  let actionType = context.action;
  if (actionType == Task.Run) {
    let config = context.config;
    let data = context.data;
    let debugArgs = {};

    let action = new TaskDebugAdapterAction("lldb");
    action.debugArgs = {};

    if ((config?.get("cdragon.dap.mode") ?? "local") == "remote") {
      console.warn("TRYING TO USE REMOTE");
      action.transport = "socket";
      action.adapterStart = "attach";
      action.socketHost = config?.get("cdragon.dap.host") ?? "127.0.0.1";
      action.socketPort = config?.get("cdragon.dap.port") ?? 34567;
    } else {
      console.warn("TRYING TO USE LOCAL");
      action.adapterStart = "lanch";
      action.command = dapPath;
      action.args = [];
      action.transport = "stdio";
    }

    if (context.data && context.data.type == "attach") {
      action.debugRequest = "attach"; // we launch the program
      // TODO: command:pickMyProcess ?
      debugArgs.pid = config?.get("cdragon.dap.pid");
      debugArgs.waitFor = config?.get("cdragon.dap.waitFor");
    } else {
      action.debugRequest = "launch"; // we launch the program
      console.warn("TRYING TO LAUNCH");
    }

    if (config?.get("cdragon.dap.env")) {
      debugArgs.env = {};
      for (item of config.get("cdragon.dap.env")) {
        let m = item.split("=", 1);
        debugArgs.env[m[0]] = item.slice(m[0].length);
      }
    }

    debugArgs.cwd = config?.get("cdragon.dap.cwd") ?? data.cwd ?? "";
    debugArgs.sourceMap = [];
    debugArgs.program = config?.get("cdragon.dap.program") ?? "";
    for (item of config?.get("cdragon.dap.pathMappings") ?? []) {
      let m = item.split(":", 1);
      debugArgs.sourceMap.push([m[0], item.slice(m[0].length)]);
    }
    debugArgs.stopOnEntry = !!config?.get("cdragon.dap.stopOnEntry");
    debugArgs.initCommands = config?.get("cdragon.dap.initCommands") ?? [];
    debugArgs.preRunCommands = config?.get("cdragon.dap.preRunCommands") ?? [];
    debugArgs.stopCommands = config?.get("cdragon.dap.stopCommands") ?? [];
    debugArgs.exitCommands = config?.get("cdragon.dap.exitCommands") ?? [];
    debugArgs.debuggerRoot = config?.get("cdragon.dap.debuggerRoot") ?? "";

    action.debugArgs = debugArgs;

    return action;
  } else {
    return null;
  }
}

function provideTasks() {
  switch (Prefs.getConfig(Config.dapFlavor)) {
    case "none":
      return [];
    case "auto":
      dapPath = nova.path.join(nova.extension.globalStoragePath, "lldb-vscode");
      break;
    default:
      dapPath = findTool(Prefs.getConfig(Config.dapPath) ?? "lldb-vscode");
      break;
  }

  // TODO: debug targets based on build rules

  return [];
}

function register() {
  // TODO: Watch the dapFlavor and dapPath configs

  State.disposal.add(
    nova.assistants.registerTaskAssistant(
      {
        resolveTaskAction: resolveTaskAction,
        provideTasks: provideTasks,
      },
      { identifier: "lldb", name: "LLDB (DAP)" }
    )
  );
}

module.exports = { register: register };
