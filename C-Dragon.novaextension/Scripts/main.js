//
// Copyright 2022 Staysail Systems, Inc.
//
// Distributed under the terms of the MIT license.
//

// configuration keys
const cfgLspFlavor = "tech.staysail.cdragon.lsp.flavor";
const cfgLspPath = "tech.staysail.cdragon.lsp.path";
const cfgFormatOnSave = "tech.staysail.cdragon.format.onSave";
const cfgClangdPath = "tech.staysail.cdragon.clangd.path";
const cfgClangdCached = "tech.staysail.cdragon.clangd.cached";
const cfgClangdVersion = "tech.staysail.cdragon.clangd.version";

// command names
const cmdFormatFile = "tech.staysail.cdragon.formatFile";
const cmdRenameSymbol = "tech.staysail.cdragon.renameSymbol";
const cmdPreferences = "tech.staysail.cdragon.preferences";
const cmdExtensionPreferences = "tech.staysail.cdragon.extensionPreferences";
const cmdRestart = "tech.staysail.cdragon.restart";
const cmdJumpToDefinition = "tech.staysail.cdragon.jumpToDefinition";
const cmdJumpToDeclaration = "tech.staysail.cdragon.jumpToDeclaration";
const cmdJumpToTypeDefinition = "tech.staysail.cdragon.jumpToTypeDefinition";
const cmdJumpToImplementation = "tech.staysail.cdragon.jumpToImplementation";
const cmdCheckForUpdate = "tech.staysail.cdragon.checkForUpdate";

// messages (to aid localization)
let messages = {};

const msgNoLspClient = "msgNoLspClient";
const msgNothingSelected = "msgNothingSelected";
const msgUnableToResolveSelection = "msgUnableToResolveSelection";
const msgRenameSymbol = "msgRenameSymbol";
const msgNewName = "msgNewName"; // for renaming symbols
const msgSelectionNotSymbol = "msgSelectionNotSymbol";
const msgCouldNotRenameSym = "msgCouldNotRenameSymbol";
const msgUnableToApply = "msgUnableToApply";
const msgUnableToOpen = "msgUnableToOpen";
const msgLspStoppedErr = "msgLspStoppedErr";
const msgLspDidNotStart = "msgLspDidNotStart";
const msgLspRestarted = "msgLspRestarted";
const msgNothingFound = "msgNothingFound";
const msgSelectLocation = "msgSelectLocation";
const msgNoPathToLsp = "msgNoPathToLsp";
const msgNothingToDownload = "msgNothingToDownload";
const msgActivatingNewLSP = "msgActivatingNewLSP";
const msgLspCurrent = "msgLspCurrent";
const msgDownloadingClang = "msgDownloadingClang";

messages[msgNoLspClient] = "No LSP client";
messages[msgNothingSelected] = "Nothing is selected";
messages[msgUnableToResolveSelection] = "Unable to resolve selection";
messages[msgRenameSymbol] = "Rename symbol _OLD_SYMBOL_";
messages[msgNewName] = "New name";
messages[msgSelectionNotSymbol] = "Selection is not a symbol";
messages[msgCouldNotRenameSym] = "Could not rename symbol";
messages[msgUnableToApply] = "Unable to apply changes";
messages[msgUnableToOpen] = "Unable to open URI";
messages[msgLspStoppedErr] = "Language server stopped with an error.";
messages[msgLspDidNotStart] = "Language server failed to start.";
messages[msgLspRestarted] = "Language server restarted.";
messages[msgNothingFound] = "No matches found.";
messages[msgSelectLocation] = "Select location";
messages[msgNoPathToLsp] = "No path to LSP server";
messages[msgNothingToDownload] = "Nothing to download";
messages[msgActivatingNewLSP] = "Activating new ClangD version.";
messages[msgLspCurrent] = "CLangD is up to date.";
messages[msgDownloadingClang] = "Downloading CLangD.";

// LSP flavors
const flavorApple = "apple";
const flavorLLVM = "clangd";
const flavorCCLS = "ccls";
const flavorAuto = "auto"; // automatic download from GitHub
const flavorNone = "none";

// URL for the clangd GitHub Repo
const clangdUrl = "https://api.github.com/repos/clangd/clangd";
const userAgent = [
  "Staysail-CDragon", // we have no way to obtain our own version number
  "(nova " +
    nova.versionString +
    "; macOS " +
    nova.systemVersion.join(".") +
    ")",
].join(" ");

const extPath = nova.extension.globalStoragePath;

// global variables
var lspServer = null;

exports.activate = async function () {
  // Do work when the extension is activated
  lspServer = new ClangDLanguageServer();
  try {
    await lspServer.start();
  } catch (error) {
    console.error("Failed starting up", error.message);
  }

  nova.workspace.onDidAddTextEditor((editor) => {
    if (editor.document.syntax != "c" && editor.document.syntax != "cpp")
      return;
    editor.onWillSave((editor) => {
      const formatOnSave = nova.workspace.config.get(cfgFormatOnSave);
      if (formatOnSave) {
        return formatFile(editor);
      }
    });
  });

  nova.commands.register(cmdJumpToDeclaration, jumpToDeclaration);
  nova.commands.register(cmdJumpToDefinition, jumpToDefinition);
  nova.commands.register(cmdJumpToTypeDefinition, jumpToTypeDefinition);
  nova.commands.register(cmdJumpToImplementation, jumpToImplementation);
  nova.commands.register(cmdFormatFile, formatFileCmd);
  nova.commands.register(cmdRenameSymbol, renameSymbolCmd);
  nova.commands.register(cmdPreferences, openPreferences);
  nova.commands.register(cmdExtensionPreferences, openExtensionPreferences);
  nova.commands.register(cmdRestart, restartServer);
  nova.commands.register(cmdCheckForUpdate, () => {
    checkForNewerClangD(true);
  });

  nova.config.onDidChange(cfgLspFlavor, (newV, oldV) => {
    if (newV == oldV) {
      return;
    }
    switch (newV) {
      case flavorApple:
        nova.config.remove(cfgLspPath);
        break;
      case flavorAuto:
        nova.config.remove(cfgLspPath);
        break;
      case flavorLLVM:
        if (!nova.config.get(cfgLspPath)) {
          nova.config.set(cfgLspPath, "/usr/local/bin/clangd");
        }
        break;
      case flavorCCLS:
        if (!nova.config.get(cfgLspPath)) {
          nova.config.set(cfgLspPath, "/usr/local/bin/ccls");
        }
        break;
      case flavorNone:
        nova.config.remove(cfgLspPath);
        break;
    }
    restartServer();
  });
  nova.config.onDidChange(cfgLspPath, (newV, oldV) => {
    if (newV == oldV && newV) {
      return;
    }
    restartServer();
  });
};

exports.deactivate = function () {
  // Clean up state before the extension is deactivated
  if (lspServer) {
    lspServer.deactivate();
    lspServer = null;
  }
};

function makeExtensionDir() {
  // make sure the workspace directory exists
  try {
    nova.fs.mkdir(nova.extension.globalStoragePath);
  } catch (e) {
    showError(e.message);
  }
}

function checkForNewerClangD(interactive = true) {
  try {
    checkForUpdate(interactive);
  } catch (e) {
    showError(e.message);
  }
}

async function clangdLatestVersion() {
  // My instinct is that there is probably a better way to do this,
  // but I'm not a Javascript expert.  Would be grateful for any
  // suggestions to clean it up.
  let cached = nova.config.get(cfgClangdCached);
  let options = {
    headers: { "User-Agent": userAgent },
  };
  if (cached && cached.length == 2) {
    options.headers["If-Modified-Since"] = cached[0];
  }
  let response = await fetch(`${clangdUrl}/releases/latest`, options);
  let modified = response.headers.get("Last-Modified");
  if (response.status == 304 && cached) {
    return Promise.resolve(JSON.parse(cached[1]));
  }
  if (response.status != 200) {
    return null;
  }
  let latest = await response.json();
  nova.config.set(cfgClangdCached, [modified, JSON.stringify(latest)]);
  return Promise.resolve(latest);
}

function checkForUpdate(interactive = true) {
  clangdLatestVersion().then((latest) => {
    // save this for later
    let assets = latest.assets_url;
    let ver = latest.name;
    let zip = `clangd-mac-${ver}.zip`; // hate hard coding this, but we have no other metadata to use

    console.error(zip);
    let clangd_path = extPath + `/clangd_${ver}/bin/clangd`;
    console.error(clangd_path);
    if (
      nova.fs.access(clangd_path, nova.fs.X_OK) &&
      nova.config.get(cfgClangdPath) == clangd_path
    ) {
      console.log(`clangd version ${ver} is current`);
      if (interactive) {
        showNotice(getMsg(msgLspCurrent), ver);
      }
      return;
    }
    for (let asset of latest.assets) {
      if (asset.name == zip) {
        if (interactive) {
          showNotice(getMsg(msgDownloadingClang), ver);
        }
        return downloadClangD(asset, ver, interactive);
      }
    }

    // this should not happen, but if clangd ever changes how they publish assets,
    // we might need to fix this.
    showError(getMsg(msgNothingToDownload));
  });
}

async function downloadClangD(asset, ver, interactive) {
  let clangd_path = extPath + `/clangd_${ver}/bin/clangd`;

  console.log(`Starting clangd download version ${ver}`);
  // remove the directory if it already exists
  nova.fs.rmdir(extPath + `/clangd_${ver}`);
  let zip = extPath + "/" + asset.name;
  asset.uploader = {};
  return fetch(asset.url, {
    headers: { Accept: "application/octet-stream", "User-Agent": userAgent },
  })
    .then((response) => {
      return response.arrayBuffer();
    })
    .then((ab) => {
      makeExtensionDir();
      let f = nova.fs.open(zip, "w+b");
      f.write(ab);
      f.close();
      // now we need to unzip the file
      let proc = new Process("/usr/bin/unzip", {
        cwd: extPath,
        args: [zip],
      });
      let disp = proc.onDidExit((status) => {
        if (interactive) {
          showNotice(getMsg(msgActivatingNewLSP), ver);
        }
        if (status == 0 && nova.config.get(cfgLspFlavor) == flavorAuto) {
          nova.config.set(cfgClangdPath, clangd_path);
          nova.config.set(cfgClangdVersion, ver);
          restartServer();
        }
        disp.dispose();
      });
      proc.start();
    });
}

function getMsg(key) {
  return nova.localize(key, messages[key]);
}

function showError(err) {
  // strip off the LSP error code; few users can grok it anyway
  var m = err.match(/-3\d\d\d\d\s+(.*)/);
  if (m && m[1]) {
    nova.workspace.showErrorMessage(m[1]);
  } else {
    nova.workspace.showErrorMessage(err);
  }
}

function showNotice(title, body) {
  var req = new NotificationRequest();
  req.title = title;
  req.body = body;
  nova.notifications.add(req);
}

function openPreferences(_) {
  nova.workspace.openConfig();
}

function openExtensionPreferences(_) {
  nova.openConfig();
}

// Hey @Panic:
// NB: formatSelection would be nice, but it's unlikely to be
// useful in Nova today as the selection almost certainly will
// start in column 0, and Nova does not have a way to express
// such positions as it tries to turn that into `false`.

async function formatFileCmd(editor) {
  try {
    await formatFile(editor);
  } catch (err) {
    showError(err);
  }
}

async function formatFile(editor) {
  if (lspServer && lspServer.lspClient) {
    let cmdArgs = {
      textDocument: {
        uri: editor.document.uri,
      },
      options: {
        tabSize: editor.tabLength,
        insertSpaces: editor.softTabs,
      },
      // TBD: options
    };
    let client = lspServer.lspClient;
    if (!client) {
      nova.workspace.showErrorMessage(getMsg(msgNoLspClient));
      return;
    }
    const changes = await client.sendRequest(
      "textDocument/formatting",
      cmdArgs
    );

    if (!changes) {
      return;
    }
    await lspApplyEdits(editor, changes);
  }
}

// showLocation will either jump to a Location,
// or to a LocationLink.  It will apply the text selection
// appropriately.  Note that CCLS returns LocationLink
// whereas CLangD returns plain Location.
async function showLocation(loc) {
  // this might be a Location, or it might be a LocationLink
  if (loc.targetUri) {
    return nova.workspace
      .openFile(loc.targetUri, {
        line: loc.targetRange.start.line + 1,
        column: loc.targetRange.start.character + 1,
      })
      .then((editor) => {
        let selected = lspRangeToNovaRange(
          editor.document,
          loc.targetSelectionRange
        );
        editor.selectedRange = selected;
      });
  }
  return nova.workspace
    .openFile(loc.uri, {
      // this object starts counting at 1
      line: loc.range.start.line + 1,
      column: loc.range.start.character + 1,
    })
    .then((editor) => {
      let selection = lspRangeToNovaRange(editor.document, loc.range);
      editor.selectedRange = selection;
    });
}

async function chooseLocation(locs) {
  if (!Array.isArray(locs)) {
    if (loc) {
      return showLocation(loc);
    }
    showNotice(getMsg(msgNothingFound), "");
    return;
  }
  if (locs.length == 0) {
    showNotice(getMsg(msgNothingFound), "");
    return;
  }
  if (locs.length == 1) {
    return showLocation(locs[0]);
  }
  let choices = [];
  for (let i in locs) {
    let uri = "";
    let line = 1;
    if (locs[i].targetUri) {
      uri = locs[i].targetUri;
      line = locs[i].targetRange.start.line + 1;
    } else {
      uri = locs[i].uri;
      line = locs[i].range.start.line + 1;
    }
    let file = uri.replace(/^file:\/\//, "");
    file = nova.workspace.relativizePath(file);
    choices.push(`${file}:${line}`);
  }
  nova.workspace.showChoicePalette(
    choices,
    { placeholder: getMsg(msgSelectLocation) },
    (choice, index) => {
      if (choice != null) {
        showLocation(locs[index]);
      }
    }
  );
}

async function jumpTo(editor, thing) {
  console.error(`Jumping to ${thing}`);
  if (!lspServer || !lspServer.lspClient) {
    console.error("lspServer not set?");
    nova.workspace.showErrorMessage(getMsg(msgNoLspClient));
    return;
  }
  let client = lspServer.lspClient;

  const selected = editor.selectedRange;
  if (!selected) {
    nova.workspace.showErrorMessage(getMsg(msgNothingSelected));
    return;
  }
  const position = novaPositionToLspPosition(editor.document, selected.start);
  const response = await client.sendRequest(`textDocument/${thing}`, {
    textDocument: { uri: editor.document.uri },
    position: position,
  });
  await chooseLocation(response);
}

async function jumpToDefinition(editor) {
  try {
    await jumpTo(editor, "definition");
  } catch (err) {
    showError(err);
  }
}

async function jumpToDeclaration(editor) {
  try {
    await jumpTo(editor, "declaration");
  } catch (err) {
    showError(err);
  }
}

async function jumpToTypeDefinition(editor) {
  try {
    await jumpTo(editor, "typeDefinition");
  } catch (err) {
    showError(err);
  }
}

async function jumpToImplementation(editor) {
  try {
    await jumpTo(editor, "implementation");
  } catch (err) {
    showError(err);
  }
}

async function renameSymbolCmd(editor) {
  try {
    await renameSymbol(editor);
  } catch (err) {
    showError(err);
  }
}

async function renameSymbol(editor) {
  var client = lspServer.lspClient;

  const selected = editor.selectedRange;
  if (!selected) {
    nova.workspace.showErrorMessage(getMsg(msgNothingSelected));
    return;
  }
  selectedPos = novaPositionToLspPosition(editor.document, selected.start);
  if (!selectedPos) {
    nova.workspace.showErrorMessage(getMsg(msgUnableToResolveSelection));
    return;
  }
  let oldName = editor.selectedText;

  switch (nova.config.get(cfgLspFlavor)) {
    case flavorApple:
    case flavorLLVM:
    case flavorAuto:
      // these (version 13 and newer at least) have prepare rename support
      const prepResult = await client.sendRequest(
        "textDocument/prepareRename",
        {
          textDocument: { uri: editor.document.uri },
          position: selectedPos,
        }
      );
      if (prepResult.placeholder) {
        oldName = prepResult.placeholder;
      } else if (prepResult.range) {
        oldName = editor.document.getTextInRange(
          lspRangeToNovaRange(editor.document, prepResult.range)
        );
      } else if (prepResult.start) {
        oldName = editor.document.getTextInRange(
          lspRangeToNovaRange(editor.document, prepResult)
        );
      }
      break;
    case flavorCCLS:
      // CCLS does not have support for prepRename yet.
      // When Nova supports unicode classes, change this:
      // if (oldName.match(/^[_\p{XID_Start}][\p{XID_Continue}]*/)) {
      // }
      let m = oldName.match(/[_a-zA-Z][A-Za-z0-9_]*/);
      if (!m || m[0] != oldName) {
        nova.workspace.showErrorMessage(getMsg(msgSelectionNotSymbol));
        return;
      }
  }

  const newName = await new Promise((resolve) => {
    nova.workspace.showInputPanel(
      getMsg(msgRenameSymbol).replace("_OLD_SYMBOL_", oldName),
      { placeholder: oldName, value: oldName, label: getMsg(msgNewName) },
      resolve
    );
  });

  if (!newName || newName == oldName) {
    return;
  }

  const params = {
    newName: newName,
    position: {
      line: Number(selectedPos.line),
      character: Number(selectedPos.character),
    },
    textDocument: { uri: editor.document.uri },
  };

  const response = await client.sendRequest("textDocument/rename", params);

  if (!response) {
    nova.workspace.showWarningMessage(getMsg(msgCouldNotRenameSym));
  }

  lspApplyWorkspaceEdits(response);

  // return to original location
  await nova.workspace.openFile(editor.document.uri);
  editor.scrollToCursorPosition();
}

// changes in reverse order, so that earlier changes
// do not disrupt later ones.  some methods and
// servers give them to us in sensible order,
// others do it in reverse.
function sortChangesReverse(changes) {
  let result = changes.sort(function (a, b) {
    if (a.range.start.line != b.range.start.line) {
      return b.range.start.line - a.range.start.line;
    }
    return b.range.start.character - a.range.start.character;
  });

  return result;
}
function lspApplyEdits(editor, edits) {
  return editor.edit((textEditorEdit) => {
    for (const change of sortChangesReverse(edits)) {
      const range = lspRangeToNovaRange(editor.document, change.range);
      textEditorEdit.replace(range, change.newText);
    }
  });
}

async function lspApplyWorkspaceEdits(edit) {
  // at present we only support the simple changes field.
  // to support richer document changes we will need to express
  // more capabilities during negotiation.
  if (!edit.changes) {
    // this should come in the form of a documentChanges
    if (!edit.documentChanges) {
      nova.workspace.showWarningMessage(getMsg(msgUnableToApply));
      return;
    }
    // Note that we can only support edits not creates or renames
    // and not annotations.  But this is good enough for CCLS.
    // We also don't have any notion of document versioning.
    for (const dc in edit.documentChanges) {
      // Possibly support rename, create, and delete operations
      const uri = edit.documentChanges[dc].textDocument.uri;
      let edits = edit.documentChanges[dc].edits;
      if (!edits.length) {
        continue;
      }
      const editor = await nova.workspace.openFile(uri);
      if (!editor) {
        nova.workspace.showWarningMessage(
          getMsg(msgUnableToOpen).replace("URI", uri)
        );
        continue;
      }
      lspApplyEdits(editor, edits);
    }
    return;
  }

  // legacy simple changes
  for (const uri in edit.changes) {
    const changes = edit.changes[uri];
    if (!changes.length) {
      continue; // this should not happen
    }
    const editor = await nova.workspace.openFile(uri);
    if (!editor) {
      nova.workspace.showWarningMessage(
        getMsg(msgUnableToOpen).replace("URI", uri)
      );
      continue;
    }
    lspApplyEdits(editor, changes);
  }
}

// Nova ranges are absolute character offsets
// LSP ranges based on line/column.
function lspRangeToNovaRange(document, range) {
  let pos = 0;
  let start = 0;
  let end = document.length;
  const lines = document
    .getTextInRange(new Range(0, document.length))
    .split(document.eol);
  for (let line = 0; line < lines.length; line++) {
    if (range.start.line == line) {
      start = pos + range.start.character;
    }
    if (range.end.line == line) {
      end = pos + range.end.character;
      break; // we finished, so no need to keep scanning the doc
    }
    pos += lines[line].length + document.eol.length;
  }
  return new Range(start, end);
}

function novaRangeToLspRange(document, range) {
  const lines = document
    .getTextInRange(new Range(0, document.length))
    .split(document.eol);
  let pos = 0;
  let start = undefined;
  let end = undefined;
  for (let line = 0; line < lines.length; line++) {
    if (!start && pos + lines[line].length >= range.start) {
      start = { line: line, character: range.start - pos };
    }
    if (!end && pos + lines[line].length >= range.end) {
      end = { line: line, character: range.end - pos };
      return { start: start, end: end };
    }
    pos += lines[line].length + document.eol.length;
  }
  return null;
}

function novaPositionToLspPosition(document, where) {
  const lines = document
    .getTextInRange(new Range(0, document.length))
    .split(document.eol);
  let pos = 0;
  for (let line = 0; line < lines.length; line++) {
    if (pos + lines[line].length >= where) {
      return { character: Number(where - pos), line: Number(line) };
    }
    pos += lines[line].length + document.eol.length;
  }
  return null;
}

async function restartServer() {
  await lspServer.restart();
}

class ClangDLanguageServer extends Disposable {
  constructor() {
    super();
    this.lspClient = null;
  }

  deactivate() {
    this.dispose();
  }

  didStop(error) {
    if (error) {
      showError(getMsg(msgLspStoppedErr));
      console.error("Language server stopped with error:", error.message);
    }
  }

  async start() {
    if (this.lspClient) {
      await this.dispose();
      nova.subscriptions.remove(this.lspClient);
      this.lspClient = null;
    }

    let flavor = nova.config.get(cfgLspFlavor);
    if (flavor == flavorNone) {
      return;
    }
    if (!flavor) {
      flavor = flavorApple;
    }

    let CCPath = nova.config.get("staysail.clangd-cc-path", "string");
    if (!CCPath)
      CCPath = nova.workspace.config.get("staysail.clangd-cc-path", "string");
    if (!CCPath) CCPath = nova.workspace.path;

    let path = nova.config.get(cfgLspPath);
    let args = [];
    let server = "";

    switch (flavor) {
      case flavorAuto:
        args = ["--compile-commands-dir=" + CCPath];
        path = path ?? nova.config.get(cfgClangdPath);
        server = "clangd";
        break;
      case flavorApple:
        args = ["--compile-commands-dir=" + CCPath];
        path = path ?? "/usr/bin/clangd";
        server = "clangd";
        break;
      case flavorLLVM:
        args = ["--compile-commands-dir=" + CCPath, "--log=verbose"];
        path = path ?? "/usr/local/bin/clangd";
        server = "clangd";
        break;
      case flavorCCLS:
        args = [
          '--init={ "compilationDatabaseDirectory": "' + CCPath + '" }',
          "--print-all-options",
        ];
        path = path ?? "/usr/local/bin/ccls";
        server = "ccls";
        break;
      default:
        console.error("Unknown LSP flavor. Please submit a bug report.");
        return;
    }
    if (!path) {
      // TODO: if flavor is auto, offer to download
      showNotice(getMsg(msgNoPathToLsp), "");
      return;
    }

    // Create the client
    var serverOptions = {
      path: path,
      args: args,
    };
    var clientOptions = {
      // The set of document syntaxes for which the server is valid
      syntaxes: ["c", "cpp"],
    };

    try {
      this.lspClient = new LanguageClient(
        server,
        "C-Dragon Language Server",
        serverOptions,
        clientOptions
      );

      this.didStopDispose = this.lspClient.onDidStop(this.didStop);

      // Start the client
      this.lspClient.start();

      nova.subscriptions.add(this);
    } catch (err) {
      showNotice(getMsg(msgLspDidNotStart), "");
      console.error(err);
    }
  }

  async restart() {
    let client = this.lspClient;
    this.lspClient = null;
    if (client) {
      let onStop = client.onDidStop((_) => {
        onStop.dispose();
        this.start();
        showNotice(getMsg(msgLspRestarted), "");
      });

      await client.stop();
    } else {
      this.start();
    }
  }

  async dispose() {
    if (this.didStopDispose) {
      this.didStopDispose.dispose();
      this.didStopDispose = null;
    }
    if (this.lspClient) {
      this.lspClient.stop();
      this.lspClient = null;
    }
  }
}
