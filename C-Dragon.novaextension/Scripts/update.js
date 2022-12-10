//
// Copyright 2022 Staysail Systems, Inc.
//
// Distributed under the terms of the MIT license.

const GitHub = require("./github.js");
const Config = require("./config.js");
const Commands = require("./commands.js");
const Messages = require("./messages.js");
const Catalog = require("./catalog.js");
const State = require("./state.js");
const Prefs = require("./prefs.js");
const extract = require("./extract.js");

const extPath = nova.extension.globalStoragePath;
let srvPath = nova.path.join(extPath, "clangd");

async function checkForUpdate(force = false) {
  let release = await GitHub.latest(force);

  let next = nova.config.get(Config.releaseClangD);
  if (release != null && next != release.tag_name) {
    next = release.tag_name;
    nova.config.set(Config.releaseClangD, next);
  }
  let curr = nova.config.get(Config.currentClangD);
  if (curr) {
    srvPath = nova.path.join(
      nova.extension.globalStoragePath,
      `clangd_${curr}/bin/clangd`
    );
  }

  if (curr && !nova.fs.access(srvPath, nova.fs.X_OK)) {
    console.error("We should have had a binary, but it appears to be missing.");
    curr = null;
  }

  if (curr == next && nova.fs.access(srvPath, nova.fs.X_OK)) {
    Messages.showNotice(Catalog.msgUpToDate, curr);
    console.log("Language server is current.");
    return true;
  }

  let title = Messages.getMsg(
    curr ? Catalog.msgNewLspTitle : Catalog.msgMissingLspTitle
  );
  let text = Messages.getMsg(
    curr ? Catalog.msgNewLspBody : Catalog.msgMissingLspBody
  );
  let n = new NotificationRequest("autoUpdate");
  n.title = title;
  n.body = text
    .replace("_VERSION_", next)
    .replace("_OLD_VERSION_", curr ?? "none");
  n.actions = [
    Messages.getMsg(curr ? Catalog.msgUpdate : Catalog.msgInstall),
    Messages.getMsg(Catalog.msgCancel),
  ];
  let response = await nova.notifications.add(n);
  if (response == null) {
    return null;
  }
  if (response.actionIdx != 0) {
    return false;
  }
  // do it!
  let path = await GitHub.downloadAsset(release, nova.fs.tempdir);

  let result = null;
  try {
    console.log("Extracting", path);
    result = extract(path, extPath, (status) => {
      if (status == 0) {
        // let's remove the temporary asset since we're done with it.
        nova.fs.remove(path);
        // notify watchers (should cause a reboot)
        State.emitter.emit(State.events.onUpdate);
        nova.config.set(Config.currentClangD, release.tag_name);
      } else {
        console.error("Update failed", status);
      }
    });
  } catch (e) {
    console.error(e.message);
  }

  return result;
}

//nova.commands.register(Commands.checkForUpdate, async function (_) {

async function checkForUpdateCmd() {
  if (Prefs.getConfig(Config.lspFlavor) != "auto") {
    Messages.showNotice(
      Catalog.msgLspIsNotAutoTitle,
      Catalog.msgLspIsNotAutoBody
    );
    return;
  }
  try {
    await checkForUpdate(true);
  } catch (error) {
    Messages.showError(error.message);
  }
}

async function checkForUpdateSilent() {
  // If we should check for new versions at start up, try to download from
  // GitHub releases.  But we don't do this if the server is disabled or we
  // are using a custom server.
  if (Prefs.getConfig(Config.lspFlavor) != "auto") {
    return;
  }
  if (Prefs.getConfig(Config.checkForUpdates)) {
    // if it doesn't work, don't bother warning about it.
    try {
      await checkForUpdate();
    } catch (error) {}
  }
}

function onStart() {
  checkForUpdateSilent();
  // consider restarting this periodically, but we need to make
  // make sure that we only do it once for the entire editor, not
  // per server.
}

function register() {
  State.disposal.add(
    nova.config.onDidChange(Config.lspFlavor, (nv, ov) => {
      if (nv != ov && nv == "auto") {
        checkForUpdateSilent();
      }
    })
  );
  State.registerCommand(Commands.checkForUpdate, checkForUpdateCmd);
  State.emitter.on(State.events.onActivate, onStart);
}

module.exports = { register: register };
