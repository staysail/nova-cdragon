//
// Copyright 2022 Staysail Systems, Inc.
//
// Distributed under the terms of the MIT license.

// These are command identifiers. If exposed to users they should be
// exposed via the extension.json file.  Note that these all have
// the above prefix.

const keys = {
  preferences: "cdragon.preferences",
  extensionPreferences: "cdragon.extensionPreferences",
  restartServer: "cdragon.restartServer",
  jumpToDefinition: "cdragon.jumpToDefinition",
  jumpToTypeDefinition: "cdragon.jumpToTypeDefinition",
  jumpToDeclaration: "cdragon.jumpToDeclaration",
  jumpToImplementation: "cdragon.jumpToImplementation",
  formatFile: "cdragon.formatFile",
  checkForUpdate: "cdragon.checkForUpdate",
  renameSymbol: "cdragon.renameSymbol",
  findReferences: "cdragon.findReferences",
  showReferences: "cdragon.showReferences",
};

module.exports = keys;
