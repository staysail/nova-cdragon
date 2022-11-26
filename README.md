# C-Dragon Extension for [Nova][nova]

More information about the extension can be found in the
`C-Dragon.novaextension` directory.

This work builds on the an language server written by
Ben Beshara. Details are in the README for the extension.

The work is now sufficiently distant from Ben's original work
that we have started a new project that isn't a proper fork
(in the Git sense).  Ben's work was an important starting point,
but that work is now a minority of the code (and functionality)
in this extension.

## TODO:

- Automate installation of `xcode-select --install` (or make it a manual option).
- Provide ways to provide compile_flags.json
  - Perhaps offer typical cases - cmake, meson, bear, xcode?
- Add a sponsor button
- Consider Objective-C and Objective-C++ support.

[nova]: https://nova.app "Nova website"
