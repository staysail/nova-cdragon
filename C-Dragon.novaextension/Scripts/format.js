//
// Copyright 2022 Staysail Systems, Inc.
//
// Distributed under the terms of the MIT license.

const Commands = require("./commands.js");
const Messages = require("./Messages.js");
const Config = require("./config.js");
const Edits = require("./edits.js");
const State = require("./state.js");
const Prefs = require("./prefs.js");
const Ranges = require("./ranges.js");
const Lsp = require("./lsp.js");

async function formatFileCmd(editor) {
  try {
    await formatFile(editor);
  } catch (err) {
    Messages.showError(err.message);
  }
}

async function formatSelectionCmd(editor) {
  try {
    await formatSelection(editor);
  } catch (err) {
    Messages.showError(err.message);
  }
}

async function formatFile(editor) {
  var cmdArgs = {
    textDocument: {
      uri: editor.document.uri,
    },
    options: {
      tabSize: editor.tabLength,
      insertSpaces: editor.softTabs,
    },
    // TBD: options
  };
  const changes = await Lsp.sendRequest("textDocument/formatting", cmdArgs);

  if (!changes) {
    return;
  }
  await Edits.applyEdits(editor, changes);
}

async function formatSelection(editor) {
  let cmdArgs = {
    textDocument: {
      uri: editor.document.uri,
    },
    range: Ranges.toLsp(editor.document, editor.selectedRange),
    options: {
      tabSize: editor.tabLength,
      insertSpaces: editor.softTabs,
    },
  };
  const changes = await Lsp.sendRequest(
    "textDocument/rangeFormatting",
    cmdArgs
  );

  if (!changes) {
    return;
  }
  await Edits.applyEdits(editor, changes);
}

function formatOnSave(editor) {
  if (
    editor.document.syntax != "c" &&
    editor.document.syntax != "cpp" &&
    editor.document.syntax != "objc"
  ) {
    return;
  }
  if (Prefs.getConfig(Config.lspFlavor == "none")) {
    return;
  }
  const formatOnSave = Prefs.getConfig(Config.formatOnSave);
  if (formatOnSave) {
    return formatFile(editor);
  }
}

function register() {
  State.registerCommand(Commands.formatFile, formatFileCmd);
  State.registerCommand(Commands.formatSelection, formatSelectionCmd);

  State.disposal.add(
    nova.workspace.onDidAddTextEditor((editor) => {
      if (
        editor.document.syntax == "c" ||
        editor.document.syntax == "cpp" ||
        editor.document.syntax == "objc"
      ) {
        State.disposal.add(editor.onWillSave((editor) => formatOnSave(editor)));
      }
    })
  );
}

module.exports = { register: register };
