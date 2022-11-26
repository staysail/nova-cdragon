//
// Copyright 2022 Staysail Systems, Inc.
//
// Distributed under the terms of the MIT license.

const Commands = require("./commands.js");
const Config = require("./config.js");
const State = require("./state.js");

function getConfig(name) {
  return nova.workspace.config.get(name) ?? nova.config.get(name);
}

function register() {
  State.registerCommand(Commands.preferences, (_) =>
    nova.workspace.openConfig()
  );
  State.registerCommand(Commands.extensionPreferences, (_) =>
    nova.openConfig()
  );

  // convert some configuration parameters from old style to new style.
  // if the second array member is null, then the configuration is just removed.
  for (let cvt of [
    ["tech.staysail.cdragon.lsp.flavor", Config.lspFlavor],
    ["staysail.clangd-lsp", Config.lspFlavor],
    ["tech.staysail.cdragon.clangd.path", Config.lspPath],
    ["staysail.clangd-lsp", Config.lspFlavor],
    ["staysail.clangd-path", Config.lspPath],
    ["tech.staysail.cdragon.compileCommandsDir", Config.compileCommandsDir],
    ["tech.staysail.cdragon.fmt.onSave", Config.formatOnSave],
    ["tech.staysail.cdragon.clangd.cached", null],
    ["tech.staysail.cdragon.clangd.version", null],
    ["tech.staysail.cdragon.clangd.latest", null],
  ]) {
    if (nova.config.get(cvt[0]) != null) {
      console.warn("Updating", cvt[0], "to", cvt[1]);
      if (cvt[1] != null) {
        nova.config.set(cvt[1], nova.config.get(cvt[0]));
      }
      nova.config.remove(cvt[0]);
    }
    if (nova.workspace.config.get(cvt[0]) != null) {
      console.warn("Updating workspace", cvt[0], "to", cvt[1]);
      if (cvt[1] != null) {
        nova.workspace.config.set(cvt[1], nova.workspace.config.get(cvt[0]));
      }
      nova.workspace.config.remove(cvt[0]);
    }
  }

  if (nova.config.get(Config.version) != nova.extension.version) {
    nova.config.set(Config.version, nova.extension.version);
  }
}

module.exports = {
  register: register,
  getConfig: getConfig,
};
