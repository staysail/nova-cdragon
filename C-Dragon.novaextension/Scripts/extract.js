//
// Copyright 2022 Staysail Systems, Inc.
//
// Distributed under the terms of the MIT license.

const tarExtractor = {
  exts: [
    ".tar.xz",
    ".tar.gz",
    ".tar.bz2",
    ".tar.z",
    ".tar.Z",
    ".tar.zstd",
    ".tar.lz",
    ".tar.lzo",
    ".tar.lzma",
    ".taz",
    ".tgz",
    ".tbz",
    ".tbz2",
    ".txz",
    ".tzst",
    ".tlz",
    ".tar",
  ],
  command: "/usr/bin/tar",
  args: ["xf"],
};

const zipExtractor = {
  exts: [".zip", ".zipx", ".jar"],
  command: "/usr/bin/unzip",
  args: ["-q", "-o"],
};

// extract extracts the files -- it understands .zip, .tar, .tar.xz, etc.
// The supplied callback will be called when the extraction is complete.
function extract(path, dest, cb) {
  nova.fs.mkdir(dest);

  for (let extractor of [tarExtractor, zipExtractor]) {
    for (let ext of extractor.exts) {
      if (!path.endsWith(ext)) continue;
      let args = [].concat(extractor.args, path);
      let proc = new Process(extractor.command, { cwd: dest, args: args });

      if (cb) {
        proc.onDidExit(cb);
      }
      proc.start();
      return;
    }
  }
}

module.exports = extract;
