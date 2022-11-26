// Copyright 2022 Staysail Systems, Inc.
//
// Distributed under the terms of the MIT license.

const Messages = require("./messages.js");
const Catalog = require("./catalog.js");
const Cache = require("./cache.js");

// with clangd, we are only going to support installation of
// official releases at this time.  This also means be are able
// to benefit from caching on the server.

const repoUrl = "https://api.github.com/repos/clangd/clangd";
const tmpDir = nova.fs.tempdir;
const novaVersion = "nova " + nova.versionString;
const macosVersion = "macos " + nova.systemVersion.join(".");
const extName = nova.extension.name;
const extVersion = nova.extension.versionString;
const userAgent = `${extName}/${extVersion} (${novaVersion} ${macosVersion})`;
const latestUrl = `${repoUrl}/releases/latest`;

function findAsset(release) {
  if (!release || !release.assets) {
    return null;
  }
  // look for something like "clangd-mac-*{.zip}"
  for (let a of release.assets) {
    if (a.name.startsWith("clangd-mac-") && a.name.endsWith(".zip")) {
      return a;
    }
  }
  return null;
}

class GitHub {
  // latest returns a promise that resolves to a GitHub release object for language server.
  // It should be an object corresponding to a release.
  // Within the release may be an array of associated assets.
  static latest(force) {
    // This code has support for using caching, if Nova ever exposes ETags to
    // us, or if the Last-Modified header is present in GitHub (it isn't for
    // these requests for some reason, although the releases/latest header does
    // in fact have it.

    // This check needs to be done infrequently, because it can be expensive.
    // We actually prefer it be done only manually.

    return Cache.fetch(
      "latest_clangd",
      latestUrl,
      {
        headers: { Accept: "application/vnd.github+json" },
      },
      force
    );
  }

  // this attempts to download a specific asset, which should be supplied.
  // it returns a promise that resolves to the saved asset path.
  static async downloadAsset(release, dir = tmpDir) {
    let asset = findAsset(release);
    let path = nova.path.join(dir, asset.name);
    if (!asset) {
      // we don't expect to be here
      throw new Error("Asset not found for release " + release.tag_name);
    }
    console.log("Starting download of", asset.url, "into", dir);

    let response = await fetch(asset.url, {
      headers: { Accept: "application/octet-stream", "User-Agent": userAgent },
    });

    if (!response.ok) {
      console.error("Failed GitHub", response.status, response.statusText);
      return null;
    }

    let ab = await response.arrayBuffer();
    try {
      let f = nova.fs.open(path, "wb");
      f.write(ab);
      f.close();
    } catch (e) {
      // clean up the file if it is there (it's probably garbage)
      nova.fs.remove(path);
      Messages.showError(Catalog.msgDownloadFailed);
      console.error("Failed to download asset", e.message);
      return null;
    }
    return path;
  }
}

module.exports = GitHub;
