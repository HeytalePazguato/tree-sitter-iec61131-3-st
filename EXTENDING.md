# Extending the grammar

`tree-sitter-iec61131` is the **standard** IEC 61131-3 Structured Text grammar. Vendor dialects (Beckhoff TwinCAT, Codesys, B&R Automation Studio, Siemens, Rockwell, …) live in **separate** dialect grammars that import this one and add their vendor-specific constructs through tree-sitter's grammar-extension mechanism.

This document describes:

1. The naming convention for dialect repositories.
2. The extension points the base grammar exposes.
3. A worked example: adding a single TwinCAT-only keyword.
4. Where to find a runnable stub of that example in this repo.

---

## 1. Naming convention

Every dialect repo is named `tree-sitter-iec61131-<vendor>`:

| Vendor                      | Repo name                       | npm/crate name              |
|-----------------------------|---------------------------------|-----------------------------|
| Beckhoff TwinCAT            | `tree-sitter-iec61131-twincat`  | `tree-sitter-iec61131-twincat`  |
| Codesys                     | `tree-sitter-iec61131-codesys`  | `tree-sitter-iec61131-codesys`  |
| B&R Automation Studio       | `tree-sitter-iec61131-br`       | `tree-sitter-iec61131-br`       |
| Siemens TIA Portal SCL      | `tree-sitter-iec61131-siemens`  | `tree-sitter-iec61131-siemens`  |
| Rockwell Studio 5000 ST     | `tree-sitter-iec61131-rockwell` | `tree-sitter-iec61131-rockwell` |

The grammar's internal `name` field is `iec61131_<vendor>` (snake_case), so the C function the parser exports is `tree_sitter_iec61131_twincat`, etc. The grammar `scope` should be `source.iec61131.<vendor>` so editors can match files to the right grammar by file extension or shebang.

---

## 2. Extension points

The base grammar declares the following **named hidden rules** (leading underscore) specifically so dialects can override them via `choice($, original, …)`:

| Hidden rule         | What it covers                                                       |
|---------------------|----------------------------------------------------------------------|
| `_top_level_item`   | Anything that may appear at the file top level.                      |
| `_declaration`      | Any POU declaration (PROGRAM / FUNCTION / FB / TYPE / NAMESPACE / …) |
| `_statement`        | Any executable statement (assignment, IF, FOR, …).                   |
| `_expression`       | Any expression.                                                      |
| `_type_specifier`   | Any type reference in a declaration.                                 |
| `_var_block`        | Any `VAR_*` block kind.                                              |
| `_literal`          | Any literal form (boolean, integer, real, string, time, date, …).    |
| `_access_modifier`  | Method / property visibility (`PUBLIC` / `PRIVATE` / …).             |

The base grammar also exposes these as **supertypes** so editor queries can match `(_statement)` or `(_expression)` without enumerating every variant.

A dialect grammar overrides any of these hidden rules to inject vendor-specific alternatives, while delegating to `original` for everything the standard already covers.

---

## 3. Worked example: adding a TwinCAT-only keyword

TwinCAT exposes a `__SYSTEM` namespace for runtime intrinsics. The call `__SYSTEM.GetCurrentTaskIndex()` is valid in TwinCAT but not in standard IEC 61131-3. We want it to parse as a dedicated `twincat_system_call` node so highlighters and code-search can treat it specially.

### Setup

```sh
mkdir tree-sitter-iec61131-twincat
cd tree-sitter-iec61131-twincat
npm init -y
npm install tree-sitter-iec61131
```

### `grammar.js`

```js
const base = require('tree-sitter-iec61131/grammar');

module.exports = grammar(base, {
  name: 'iec61131_twincat',

  rules: {
    // Add `twincat_system_call` as a new alternative to `_expression`.
    // Crucially we keep `original` so every standard expression form still
    // works — we are *adding*, not replacing.
    _expression: ($, original) =>
      choice(original, $.twincat_system_call),

    twincat_system_call: $ =>
      seq(
        '__SYSTEM',
        '.',
        field('intrinsic', $.identifier),
        field('arguments', $.argument_list),
      ),
  },
});
```

### `tree-sitter.json`

```json
{
  "grammars": [
    {
      "name": "iec61131_twincat",
      "camelcase": "Iec61131Twincat",
      "scope": "source.iec61131.twincat",
      "path": ".",
      "file-types": ["TcPOU", "TcDUT", "TcGVL", "twincat.st"],
      "highlights": ["queries/highlights.scm"],
      "injections": ["queries/injections.scm"],
      "locals": ["queries/locals.scm"],
      "tags": ["queries/tags.scm"]
    }
  ]
}
```

### `queries/highlights.scm`

```scheme
; Inherit everything from the base grammar.
; (tree-sitter resolves inheritance automatically when this query file
; references node types from the base.)
;
; Then add highlights for TwinCAT-only nodes:
(twincat_system_call) @function.builtin
```

### Generate and test

```sh
npm install -g tree-sitter-cli
tree-sitter generate
tree-sitter parse <<< 'PROGRAM P
VAR x : DINT; END_VAR
x := __SYSTEM.GetCurrentTaskIndex();
END_PROGRAM'
```

You should see a `twincat_system_call` node inside the assignment's right-hand side, alongside all the standard nodes from the base grammar.

### Adding a reserved word

If your vendor extension requires a new reserved word that must lex as a keyword (not as an identifier), extend the base's reserved list when the underlying tree-sitter version supports the `reserved` directive. Until then, the dialect can declare its keywords inline using the same `kw(name)` helper pattern this base grammar uses (see `grammar.js` line ~34) — token-level `prec(2, …)` ensures the keyword wins ties against the identifier rule via maximal-munch matching.

---

## 4. Runnable stub in this repo

A minimal end-to-end stub is checked in at:

```
examples/dialect-extension/
├── grammar.js          # Adds one TwinCAT-only construct
├── README.md           # How to build and parse a sample file
└── sample.st           # Test input that exercises the extension
```

Copy that directory to a new repo, run `npm install tree-sitter-iec61131` (or point at this checkout via `npm link`), then `tree-sitter generate && tree-sitter parse sample.st`. If the parse succeeds and the tree contains a `twincat_system_call` node, the extension architecture is wired up correctly in your environment.

---

## 5. Reporting issues with extension points

If a feature you need to model in your dialect cannot be cleanly added through the existing extension points, open an issue against this repo describing:

- The dialect-specific syntax you want to model.
- Which hidden rule you tried to extend, and what conflict / error you hit.
- A minimal failing grammar.js excerpt and a one-line ST input.

We can either expose an additional extension point or refactor an existing rule to make the override possible without forking.
