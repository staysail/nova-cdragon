//
// Copyright 2022 Staysail Systems, Inc.
//
// Distributed under the terms of the MIT license.

class Position {
  static toLsp(document, where) {
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
}

module.exports = Position;
