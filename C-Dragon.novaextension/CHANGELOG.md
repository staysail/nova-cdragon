# Version 1.0.3

Format on save was not working.

Fix for finding clangd or CCLS when using the custom installation.

Several other minor errors (probably unnoticed by users) corrected.

# Version 1.0.2

The update message was not displaying the new version of clangd
that is available. While here, also display the user's current version.

# Version 1.0.1

Forgot to push the release notes! ;-)

# Version 1.0.0

Finally, an "official" release! Essentially we believe that this
extension works well enough and has achieved enough of our key release
criteria to warrant being released.

Button fix for rename.

Numerous symbolication fixes. More of the symbols should be identified,
and properly characterized. There are some extreme cases (for example
when using more than 4 levels of pointer indirection) that might be missed.

Objective-C support is still mostly a best effort case. It likely can
use additional improvement, especially in the preprocessor handling, but
it is also better than anything else available at the moment (for Nova).

# Version 0.9.12

Find Symbol dialog. This adds another pane to the side bar,
and lets you find symbols by a name or a portion of their name.

The Find References pane got a new quick search button, to make
it faster to access if you have the pane open.

Find References no longer opens duplicate documents. (Unfortunately
we still have to make sure at least one editor window is opened for
each text document, so that we can obtain the details. It would be nice
if Nova gave us a better API to get this information directly.)

Format selection.

Extension Preferences added to the editor context menu.

# Version 0.9.11

Clear references results (very minor bug) when starting a new search.

Add some more information to the extension metadata and README.

# Version 0.9.10

Find References is now a supported menu option.
This populates a new side bar.

Workaround for rename in the first two columns.

## Version 0.9.9

Bug fix (prepRename not forwarding the error properly).

## Version 0.9.8

Initial support for Objective-C, including limited support for
Objective-C++ (which is treated as Objective-C for now).

## Version 0.9.7

Some improvements to highlighting for both C and C++, making
better attempts at labeling function identifiers and certain C++ keywords.

Initial version of Symbolication for C++. Note that we don't use C++ really,
so these results are mostly a result of exploring the syntax with
the Syntax Inspector looking at CCLS sources (because that's what we had handy.)
Consequently they're likely not perfect.

Bug reports and/or pull requests are welcome!

## Version 0.9.6

Refactoring. This utilizes the work we did for **D-Velop** to try to
facilitate further development of this Extension.

This also was a "break" in the Git History, as we are are now so different
from Ben Beshara's original _clangd_ extension that it felt improper to continue
to list that as an "upstream".

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
