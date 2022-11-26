# C-Dragon - C/C++ Extension

---

_C-Dragon_ provides rich support for C and C++ development in Nova.

> This extension is a _BETA_ release.

> _NOTE_: An earlier version of this was named _ClangD_, but as the
> capabilities we have provided go beyond _clangd_ and as we also now support _ccls_,
> we have changed the name of this extension to avoid possible confusion.

It is forked from, and originally based upon
[Ben Beshara][1]'s original [C++ ClangD extension][2],
but has been extended significantly beyond Ben's original work.

## Feature Status

| Status | Feature                         | Notes                                                     |
| ------ | ------------------------------- | --------------------------------------------------------- |
| ✅     | C Support                       |                                                           |
| ✅     | C++ Support                     |                                                           |
| ✅     | Highlighting                    | Uses Tree-sitter (fast!)                                  |
| ✅     | Code Folding                    | Collapse functions, classes, structs, blocks, etc.        |
| ✅     | Jump to Definition              |                                                           |
| ✅     | Jump to Declaration             |                                                           |
| ✅     | Jump to Implementation          |                                                           |
| ✅     | Jump to Type Definition         | (Requires current _clangd_ or _ccls_.)                    |
| ✅     | Hover                           | Relevant documentation when you hover over a symbol.      |
| ✅     | Signature Assistance            | Get parameter hints as you type.                          |
| ✅     | Diagnostic Assistance           | Report issues, and in some cases suggestsions, with code. |
| ✅     | Formatting                      | Respects `.clang-format`                                  |
| ✅     | Format on Save                  |                                                           |
| ⛔️    | Format Selection                | Coming soon. (Really we need a Nova fix though.)          |
| ⛔️    | Format Configuration            | (Supported via `.clang-format`)                           |
| ☑️     | Code Actions                    | Suggested fix. Limited at present.                        |
| ☑️     | Rename Symbol                   | Various caveats.                                          |
| ⛔️    | Find References                 | Coming soon.                                              |
| ⛔️    | Inlay Hints                     | Nova does not support.                                    |
| ✅     | Language Server Restart         | Via extension menu.                                       |
| ⛔️    | Language Server Diagnostic Info | Coming soon.                                              |
| ⛔️    | Clang-Tidy Support              | Richer advice, only via _clangd_                          |
| ☑️     | Internationalization            | Support for multiple languages (needs localizations)      |
| ⛔️    | → French                        |                                                           |
| ⛔️    | → German                        |                                                           |
| ⛔️    | → Chinese                       |                                                           |
| ⛔️    | → Japanese                      |                                                           |
| ✅     | `clangd` Support                |                                                           |
| ✅     | `ccls` Support                  |                                                           |
| ✅     | Update `clangd`                 | Checks for latest version and downloads from github.      |

_Legend:_
✅ Implemented, and works well.
☑️ Partial implementation.
⛔️ Not implemented

## Details

Syntax support is provided via the official [Tree-sitter][3] grammars for C and C++, along
with queries we have supplied for this extension. These provide for syntax highlighting
and folding. This highlighting should be both richer, and faster, than previous alternatives.
It does require Nova version 10 or newer though.

Some limited assistance for automatic indentation of blocks is provided
for as well.

Formatting will respect the `.clang-format` in your
project directory if it is present.

If you have installed our [C][4] extension, you can uninstall it, as this module
provides a superset of that functionality.

You can also uninstall any other C or C++ language server or syntax plugins,
as this should be a functional superset of all of them.

## Permissions

This extension requires read/write access to the filesystem and to access the networks.
This facility is used to optionally download a local copy of _clangd_ for use by the
extension. This extension does not directly modify any files outside of it's own
directory. Changes to the file made by formatting are done within the editor, and
do not directly touch the filesystem (and also won't be written to disk until you
save those files.) If you are concerned about security, you are welcome to review
the source code, and build the extension for yourself.

## Requirements

> **TIP**: Apple supplies _clangd_ with the Xcode developer tools. That's all you need.
> For that use case, this should Just Work<sup>&trade;</sup>, with no extra configuration
> required.

### Xcode (Apple) ClangD

This extension works well with the out of the box Apple version of _clangd_.
You should install a Xcode via the App Store, as that also includes headers
and other features useful for software development on a mac.

Note that Apple's edition of _clangd_ tends to lag upstream somewhat, and so
some features may not work or may not work as well as with a more current version.

### LLVM ClangD

To use the newest version of _clangd_, you can use this extension's support
for downloading and updating the newest version from GitHub.

This can be done from the **Extensions → C-Dragon → Check for Newer ClangD** menu item.
**C-Dragon** will check to see if a newer version than what is present is available
from the official _clangd_ releases page.

The downloaded _clangd_ is kept in the extension private directory, and will not
affect any other installation of it, including the default one supplied by Apple.

### Custom ClangD

If you have another installation of _clangd_, you can use it by choosing this
option and setting the path to in the extension preferences.
No automatic checks or downloads will be performed in that case.

### CCLS

If you have a working installation of _ccls_ you can select it here.
Installation and configuration of _ccls_ is an advanced topic,
and it may require extra effort to get it to work.

## Usage

The extension will start when editing a C or C++ source file. In order to provide project-context specific information, your project will need to provide a `compile_commands.json` file.
Tools like CMake, meson-build, and similar can generate one for you. More information can be found at https://clang.llvm.org/docs/JSONCompilationDatabase.html

The directory where your `compile_commands.json` file is stored can be specified in global or project preferences, if it is not in the root of the project directory. (Note that _clangd_ will also search in a top-level directory called `build`, but _ccls_ will not.)

## Configuration

To configure global preferences, open **Extensions → Extension Library...** then select C-Dragon's **Preferences** tab.

You can configure preferences on a per-project basis in **Project → Project Settings...**

For convenience, access to configuration is also available via the **C-Dragon** menu item in the
editor's right click menu (when working on a C or C++ file).

## Other Recommended Extensions

It is recommended to enable support for one of CMake, Meson, or Makefile parsing,
assuming your project uses one of these to drive it's build.
Staysail has published extensions for the former two.

## Bugs

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

## Localizations

If you'd like to help with localizing this extension, please submit an issue or
contact us directly.

[1]: https://benbeshara.id.au/ "Ben Beshara"
[2]: https://example.com/clangd-nova-extension
[3]: https://tree-sitter.github.io/tree-sitter/ "Tree-sitter web site"
[4]: https://github.com/staysail/nova-c "Tree-sitter grammar for C"
[5]: https://brew.sh "Homebrew package manager"
[6]: https://devforum.nova.app/t/lsp-integers-0-and-1-serialized-to-boolean/1831
