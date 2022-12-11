//
// Copyright 2022 Staysail Systems, Inc.
//
// Distributed under the terms of the MIT license.

// These are configuration parameters. If public they should be
// exposed via the extension.json file.  Note that these all have
// the above prefix.

const keys = {
  lspFlavor: "cdragon.lsp.flavor",
  lspPath: "cdragon.lsp.path",
  compileCommandsDir: "cdragon.compileCommandsDir",

  formatOnSave: "cdragon.format.onSave",
  checkForUpdates: "cdragon.checkForUpdates",

  // context keys that don't get written out
  version: "cdragon.version", // our version so that other extensions can find us
  currentClangD: "cdragon.clangd.current",
  releaseClangD: "cdragon.clangd.release",
};

module.exports = keys;
