# C-Dragon&trade; - C, C++, and Objective-C Extension

---

**C-Dragon** provides rich support for C, C++, and Objective-C development in Nova via
a language server like _clangd_, and fast syntactic analysis thanks to [Tree-sitter][3].
(Some limited support for Objective-C++ is also present.)

If you have installed our [C][4] extension, this extension is a complete
superset and you can use this instead.

This extension requires Nova 10.0 or better, and because of at least one fixed bug, we
highly recommend updating to Nova 10.4 or better.

## ✨ Features ✨

- C, C++, and Objective-C
- Syntax Highlighting
- Indentation (automatic, somewhat limited)
- Symbols
- Code Folding
- Format Selection or File (per `.clang-format`), including On Save
- Jump to Definition, Declaration, Implementation, Type Definition
- Find References
- Find Symbol
- Rename Symbol
- Hover Tooltips
- Signature Assistance
- Code Quality Hints
- Code Actions

## 📸 Screenshots 📸

![](https://raw.githubusercontent.com/staysail/nova-cdragon/main/screenshot1.png)
![](https://raw.githubusercontent.com/staysail/nova-cdragon/main/screenshot2.png)
![](https://raw.githubusercontent.com/staysail/nova-cdragon/main/screenshot3.png)
![](https://raw.githubusercontent.com/staysail/nova-cdragon/main/screenshot4.png)

## ⚙️ Language Server Integration ⚙️

**C-Dragon** requires a language server, either _clangd_ or _ccls_, for full functionality.

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
LLVM version. Also, _ccls_ doesn't understand Objective-C at all.

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

The extension will start when editing a C or C++ source file.
In order to provide project-context specific information, your project will need to provide a `compile_commands.json` file.
Tools like CMake, meson-build, and similar can generate one for you.
More information can be found at https://clang.llvm.org/docs/JSONCompilationDatabase.html

The directory where your `compile_commands.json` file is stored can be specified in global or project preferences,
if it is not in the root of the project directory.
(Note that _clangd_ will also search in a top-level directory called `build`, but _ccls_ will not.)

## 🛡️ Security Considerations 🛡️

You may notice that this extension needs entitlements to access
the network and to read and write local files.
These are used solely to support updating the language server.
No files outside of the extension's private area are accessed directly.
The only requests made are read-only unauthenticated requests to access
the public release information and actually download the binary
needed for _clangd_.

If you are concerned, you may download and configure your own
copy of _clangd_, or use the Apple version, and disable the automatic downloads.
This will prevent both direct access to the network by this extension,
as well as direct filesystem access. Note however that _clangd_
may itself perform those activities.

You can also disable the use of a language server altogether.

## 🔮 Future Directions 🔮

Further integration of Clang-Tidy support might be nice.

We would like to see richer configuration support, but this is contingent upon
`clangd` providing for it.

Objective C++ support could probably be improved, but we need a good Tree-sitter grammar for it.

We would like to add localizations, but we don't know any other languages confidently enough to provide them ourselves. (See below for more information.)

Tighter integration with build tools (like CMake or Meson) is something we plan to add.

Debugging adapters for lldb or gdb is hoped for as well.

## Other Recommended Extensions

It is recommended to enable support for one of CMake, Meson, or Makefile parsing,
assuming your project uses one of these to build.
Staysail has published extensions for the former two.

## 🐜 Bugs 🐜

- Symbol renames can mess up highlighting. Make a subsequent change to refresh the
  tree-sitter grammar's view of things. This appears to be a Nova defect.
- _clangd_ (and probably _ccls_) has various limitations around symbol renaming. YMMV.

- Some things that should be code actions are not.

- Objective C++ support is quite primitive, and doesn't understand C++ yet.
  We need a decent Tree-sitter grammar for it.

- Objective C preprocessor statements are not well highlighted, as well as things inside such conditionals.
  This is due to the limitations of the Tree-sitter grammar we have used.
  We'll probably need to fork that grammar to fix it.

- Objective C symbolication is a best-effort.
  It should be close, but since we don't use Objective C we can't be certain.
  We welcome bug reports and PRs from folks who make use of Objective C.

## 🌐 Localizations 🌐

If you'd like to help with localizing this extension, please submit an issue or
contact us directly. We have designed the extension to make this a very easy task
for anyone able to perform the actual translations.

## ⚖️ Legal Notices ⚖️

C-Dragon&trade; is a trademark of Staysail Systems, Inc.

Copyright &copy; 2022 Staysail Systems, Inc.

This extension is made available under the terms of the [MIT License][8].

Some of the code in this extension was adapted from [Cameron Little][6]'s
excellent [TypeScript extension][7] for Nova.
That extension is also licensed under the MIT license and carries the
following copyright notice:

> Copyright (c) 2020 Cameron Little

This work started from [Ben Beshara][1]'s original [C++ ClangD extension][2].
That extension carried the following license declaration in its manifest (which
we have preserved):

> "license": "MIT",

[1]: https://benbeshara.id.au/ "Ben Beshara"
[2]: https://github.com/benbeshara/nova-cplusplus
[3]: https://tree-sitter.github.io/tree-sitter/ "Tree-sitter web site"
[4]: https://github.com/staysail/nova-c "Tree-sitter grammar for C"
[5]: https://brew.sh "Homebrew package manager"
[6]: https://github.com/apexskier "Cameron Little's GitHub page"
[7]: https://github.com/apexskier/nova-typescript "TypeScript Extension for Nova"
[8]: https://github.com/staysail/nova-cdragon/blob/main/LICENSE.md "MIT License"
