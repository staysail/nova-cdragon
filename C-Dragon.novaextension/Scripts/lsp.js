//
// Copyright 2022 Staysail Systems, Inc.
//
// Distributed under the terms of the MIT license.

const Commands = require("./commands.js");
const Config = require("./config.js");
const Messages = require("./messages.js");
const Catalog = require("./catalog.js");
const State = require("./state.js");
const Prefs = require("./prefs.js");
const Paths = require("./paths.js");
const delay = require("./delay.js");

var lspClient = null;

// LSP flavors
const flavorApple = "apple";
const flavorLLVM = "clangd";
const flavorCCLS = "ccls";
const flavorAuto = "auto"; // automatic download from GitHub
const flavorNone = "none";

function stopClient() {
  if (lspClient) {
    lspClient.stop();
    lspClient = null;
  }
}

function findClangd() {
  let paths = Paths.findProgram([
    ["/usr/local/bin", "/opt/homebrew/bin", "/usr/bin"],
    ["clangd"],
  ]);
  if (paths.length > 0) {
    return paths[0];
  }
  return null;
}

function findCcls() {
  let paths = Paths.findProgram([
    ["/usr/local/bin", "/opt/homebrew/bin", "/usr/bin"],
    ["ccls"],
  ]);
  if (paths.length > 0) {
    return paths[0];
  }
  return null;
}

async function startClient() {
  let flavor = Prefs.getConfig(Config.lspFlavor);
  if (flavor == flavorNone) {
    Messages.showNotice(
      Catalog.msgLspDisabledTitle,
      Catalog.msgLspDisabledBody
    );
    return null;
  }
  if (!flavor) {
    flavor = flavorApple;
  }

  // determine compile commands
  let ccdir = Prefs.getConfig(Config.compileCommandsDir);
  if (!ccdir) ccdir = nova.workspace.path;

  let path = Prefs.getConfig(Config.lspPath);
  let args = [];
  let server = null;

  switch (flavor) {
    case flavorAuto:
      args = ["--compile-commands-dir=" + ccdir];
      let ver = Prefs.getConfig(Config.currentClangD);
      if (ver) {
        path = nova.path.join(
          nova.extension.globalStoragePath,
          `clangd_${ver}/bin/clangd`
        );
      } else {
        path = nova.path.join(nova.extension.globalStoragePath, "clangd");
      }
      server = "clangd";
      break;
    case flavorApple:
      args = ["--compile-commands-dir=" + ccdir];
      path = "/usr/bin/clangd";
      server = "clangd";
      break;
    case flavorLLVM:
      args = ["--compile-commands-dir=" + ccdir, "--log=verbose"];
      path = path ?? findClangd();
      server = "clangd";
      break;
    case flavorCCLS:
      let init = { compilationDatabaseDirectory: ccdir };
      args = ["--init=" + JSON.stringify(init), "--print-all-options"];
      path = path ?? findCcls();
      server = "ccls";
      break;
    default:
      console.error("Unknown LSP flavor. Please submit a bug report.");
      return;
  }

  if (!path || !nova.fs.access(path, nova.fs.X_OK)) {
    if (flavor != flavorAuto) {
      // auto flavor does an update check
      Messages.showNotice(Catalog.msgNoLspClient, "");
    }
    return;
  }

  // Create the client
  var serverOptions = {
    path: path,
    args: args,
  };
  var clientOptions = {
    // The set of document syntaxes for which the server is valid
    syntaxes: ["c", "cpp", "objc"],
  };

  lspClient = new LanguageClient(
    server + Date.now(), // use a unique server id for each call
    "C-Dragon Language Server",
    serverOptions,
    clientOptions
  );

  lspClient.onDidStop((error) => {
    console.warn("Language server stopped.");
    if (error) {
      console.error(
        "Language encountered error:",
        error.message || "unknown exit"
      );
      Messages.showNotice(Catalog.msgLspStoppedErr, error.message);
    }
  });

  try {
    // Start the client
    lspClient.start();
  } catch (err) {
    Messages.showNotice(Catalog.msgLspDidNotStart, err.message);
    return false;
  }

  var limit = 1000;
  while (!lspClient.running && limit > 0) {
    delay(10);
    limit -= 10;
  }

  if (lspClient.running) {
    return true;
  }

  Messages.showNotice(Catalog.msgLspDidNotStart, "");
  return false;
}

async function restartClient() {
  console.warn("Stopping language server for restart.");
  stopClient();
  if (Prefs.getConfig(Config.lspFlavor) == flavorNone) {
    return;
  }
  delay(2000); // wait a while before trying to restart
  console.warn("Start language server in restart.");
  let rv = await startClient();
  if (rv) {
    console.warn("Language server resetart complete");
    Messages.showNotice(Catalog.msgLspRestarted, "");
  }
  return rv;
}

async function sendRequest(method, params) {
  if (lspClient == null) {
    Messages.showError(Catalog.msgNoLspClient);
    return null;
  } else {
    return lspClient.sendRequest(method, params);
  }
}

function sendNotification(method, params) {
  if (lspClient) {
    return lspClient.sendNotification(method, params);
  }
}

function watchConfigVarCb(name, cb) {
  State.disposal.add(
    nova.config.onDidChange(name, (nv, ov) => {
      // this doesn't send an update a workspace override exists
      if (nova.workspace.config.get(name) == null) {
        if (nv != ov) {
          cb(nv, ov);
        }
      }
    })
  );
  State.disposal.add(
    nova.workspace.config.onDidChange(name, (nv, ov) => {
      // this always sends an update
      if (nv != ov) {
        cb(nv, ov);
      }
    })
  );
}

function onFlavorChanged(newV, oldV) {
  if (newV == oldV) {
    return;
  }
  switch (newV) {
    case flavorApple:
      nova.config.remove(Config.lspPath);
      break;
    case flavorAuto:
      nova.config.remove(Config.lspPath);
      break;
    case flavorLLVM:
      let clangd = findClangd();
      if (clangd != null) {
        nova.config.set(Config.lspPath, clangd);
      }
      break;
    case flavorCCLS:
      let ccls = findCcls();
      if (ccls != null) {
        nova.config.set(Config.lspPath, ccls);
      }
      break;
    case flavorNone:
      nova.config.remove(cfgLspPath);
      break;
  }
  restartClient();
}

function watchConfigRestart() {
  watchConfigVarCb(Config.lspFlavor, onFlavorChanged);
  watchConfigVarCb(Config.lspPath, restartClient);
  watchConfigVarCb(Config.compileCommandsDir, restartClient);
}

function register() {
  watchConfigRestart();
  State.registerCommand(Commands.restartServer, restartClient);
  State.emitter.on(State.events.onUpdate, restartClient);
  State.emitter.on(State.events.onActivate, startClient);
}

let Lsp = {
  deactivate: stopClient,
  sendRequest: sendRequest,
  sendNotification: sendNotification,
  register: register,
};
module.exports = Lsp;
