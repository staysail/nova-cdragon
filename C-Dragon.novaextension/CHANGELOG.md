## Version 0.9.5

Initial swag at symbols for C syntax.

## Version 0.9.4

Fixes for GH download. Also, cache results from GitHub.

Fixes for internationalization.

## Version 0.9.3

Support for using a private clangd, downloaded from GitHub.

## Version 0.9.2

Jump To Declaration, Definition, Type Definition.

Do not select the symbol when trying to perform a rename.
This avoids moving the selection, and offers a workaround for renaming
symbols that are starting in the first two columns. (Hopefully Panic
will actually fix the bug that causes this someday.)

## Version 0.9.1

Added ability to manually restart in extension menu.

Fix startup issue with clangd.

Preference values have been renamed, but some effort is made to convert
old values to the new automatically.

## Version 0.9

Refactored configuration dialog, to make configuration with Apple Clang easier,
and fixed several LSP selection/path bugs.

Improved the error pop ups to eliminate ugly numeric JSON-RPC error codes.

Use prepareRename on CLang. (Requires ClangD v 13.0 or better, which we aren't
checking, yet.) This gives better diagnostic hints when renaming, and it also
provides a nicer UI. For CCLS we check that the symbol passes a basic (ASCII only)
regular expression. (When Nova supports Unicode escapes we can do better.)

Converted the code to support localization. (Although no localization is done,
PRs for .lproj files gratefully accepted. Ask me if you need guidance on what
messages/content needs to be localized.)

## Version 0.8

New name, "C-Dragon", with a new icon.

Added support for CCLS language server.

Added menu access to extension preferences.

Added a sponsorship link.

## Version 0.7

Initial support for symbol renames. This seems to work well when
executed for local symbols, or when done at the declaration site,
but there is something preventing renames at other sites.

## Version 0.6

Added syntax support via Tree-sitter grammars for C and C++.
The C grammar and queries are lifted from our C extension, but the C++
grammar and and queries are new.

This also includes automatic detection of C vs C++ for header files based
on content expressions.

The C++ grammar does not include every possible C++ construct, because the
upstream Tree-sitter is missing some things. Additionally there is no
doubt opportunity to further improve on what is here, and contributions
from C++ gurus are welcome. (We don't normally work in C++ ourselves.)

As part of the Tree-sitter support, this includes support for folding,
and some simple support for automatic indentation. (Open blocks are now
recognized.)

## Version 0.5

Staysail release. This includes support automatic formatting, including
format on save.

---

_These release notes are from Ben Beshara._

## Version 0.1

I really have no idea what I'm doing but it's better than nothing... I think ¯\\\_(ツ)\_/¯
