# C-Dragon - C/C++ Extension

---

**C-Dragon** provides rich support for C and C++ development in Nova via
a language server like _clangd_, and fast syntactic analysis thanks to [Tree-sitter][3].

> This extension is a _BETA_ release.

If you have installed our [C][4] extension, this extension is a complete
superset and you can use this instead.

## ✨ Features ✨

- C
- C++
- Syntax Highlighting
- Indentation (automatic, somewhat limited)
- Symbols (C only, C++ coming soon)
- Code Folding
- Format File (per `.clang-format`), including On Save
- Navigation, Jump to...
  - Definition
  - Declaration
  - Implementation
  - Type Definition
- Hover Tooltips
- Signature Assistance
- Code Quality Hints
- Code Actions
- Rename Symbol

## 📸 Screenshots 📸

![](https://raw.githubusercontent.com/staysail/nova-cdragon/main/screenshot1.png)
![](https://raw.githubusercontent.com/staysail/nova-cdragon/main/screenshot2.png)
![](https://raw.githubusercontent.com/staysail/nova-cdragon/main/screenshot3.png)
![](https://raw.githubusercontent.com/staysail/nova-cdragon/main/screenshot4.png)

## ⚙️ Language Server Integration ⚙️

**C-Dragon** requires a language server, either _clangd_ or _ccls_, for full functionality.
TBD. Add these.

By default, it will offer to download and use a current version of _clangd_
from the official GitHub releases for that project. (The binary it downloads
will be stored in the extension private directory.) It will also check
for a newer version when you first start the editor. Additionally you can
check for a newer version manually by using the **Extensions → C-Dragon → Check for Update**
menu selection.

You may elect instead to use the bundled Apple _clangd_, or an installation of
either _clangd_ or _ccls_ installed elsewhere. See the the Extension Preferences
for details.

Note that some features may not work completely with older releases of _clangd_ or
_ccls_, and that the Apple version of _clangd_ typically trails a bit behind the
LLVM version.

You may also disable the use of a language server entirely. This may be helpful
for some very large projects that are too big for _clangd_ to index quickly.
Of course, this will result in reduced functionality.

Note that use of _ccls_ can be challenging, and we do not recommend it unless
you are already familiar with it.

### Configuration of _clangd_

Configuration of _clangd_ is almost entirely via the `.clangd` file, as it does
not offer the language server protocol methods for configuration (at least as of
version 15.0.3.). Please see the `clangd` site for configuration guidance.

### Format Control

Likewise, formatting is controlled via a `.clang-format` file. The details of this
are available on the clang site. (Formatting on save is disabled by default.)

### Compile Commands

The extension will start when editing a C or C++ source file. In order to provide project-context specific information, your project will need to provide a `compile_commands.json` file.
Tools like CMake, meson-build, and similar can generate one for you. More information can be found at https://clang.llvm.org/docs/JSONCompilationDatabase.html

The directory where your `compile_commands.json` file is stored can be specified in global or project preferences, if it is not in the root of the project directory. (Note that _clangd_ will also search in a top-level directory called `build`, but _ccls_ will not.)

## 🛡️ Security Considerations 🛡️

You may notice that this extension needs entitlements to access
the network and to read and write local files. These are used
solely to support updating the language server. No files outside
of the extension's private area are accessed directly, and the
only requests made are read-only unauthenticated requests to access
the public release information and actually download the binary
needed for _clangd_.

If you are concerned, you may download and configure your own
copy of _clangd_, or use the Apple version, and disable the automatic downloads.
This will prevent both direct access to the network by this extension,
as well as direct filesystem access. Note however that _clangd_
may itself perform those activities.

You can also disable the use of a language server altogether.

## 🔮 Future Directions 🔮

We plan to improve symbolication, including adding it for C++.

Find References will help to find call sites of functions, or uses of variables.

Further integration of Clang-Tidy support might be nice.

We would like to see richer configuration support, but this is contingent upon
`clangd` providing for it.

We are contemplating adding Objective C and Objective C++ support.

We would like to add localizations, but we don't know any other languages confidently enough to provide them ourselves. (See below for more information.)

Tighter integration with build tools (like CMake or Meson) is something we plan to add.

Debugging adapters for lldb or gdb is hoped for as well.

## Other Recommended Extensions

It is recommended to enable support for one of CMake, Meson, or Makefile parsing,
assuming your project uses one of these to build.
Staysail has published extensions for the former two.

## 🐜 Bugs 🐜

- Symbol renames won't work if the selection starts in columns 0 or 1, or is located
  on the first two lines of the file. This is a [defect][6] in Nova.
  It will result in a message similar to:

  > `failed to decode textDocument/prepareRename request: expected integer`

  To workaround this, try just clicking (not selecting) a position within the symbol,
  but in in columns 3 or higher, then rename (the command palette may be easier to use).

- Symbol renames can mess up highlighting. Make a subsequent change to refresh the
  tree-sitter grammar's view of things. This appears to be a Nova defect.
- _clangd_ (and probably _ccls_) has various limitations around symbol renaming. YMMV.

- Some things that should be code actions are not.

## 🌐 Localizations 🌐

If you'd like to help with localizing this extension, please submit an issue or
contact us directly. We have designed the extension to make this a very easy task
for anyone able to perform the actual translations.

## ⚖️ Legal Notices ⚖️

C-Dragon&trade; is a trademark of Staysail Systems, Inc.

This work is based in part upon
[Ben Beshara][1]'s original [C++ ClangD extension][2].

[1]: https://benbeshara.id.au/ "Ben Beshara"
[2]: https://example.com/clangd-nova-extension
[3]: https://tree-sitter.github.io/tree-sitter/ "Tree-sitter web site"
[4]: https://github.com/staysail/nova-c "Tree-sitter grammar for C"
[5]: https://brew.sh "Homebrew package manager"
[6]: https://devforum.nova.app/t/lsp-integers-0-and-1-serialized-to-boolean/1831
