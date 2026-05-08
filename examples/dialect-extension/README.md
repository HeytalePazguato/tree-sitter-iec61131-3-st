# Worked dialect-extension example

This directory shows how to extend `tree-sitter-iec61131` with vendor-specific constructs without forking the base grammar.

It is **not** a published parser — it lives inside the base repo as a runnable proof that the extension architecture is sound. A real dialect grammar would live in its own GitHub repo (e.g. `tree-sitter-iec61131-twincat`) and add many more constructs.

## What it adds

Two TwinCAT-style constructs that are NOT in standard IEC 61131-3:

1. **`__SYSTEM.X(args)`** — runtime intrinsic call. Parses as a dedicated `twincat_system_call` node, distinct from a regular `call_expression`, so highlighters and code-search can treat it specially.

2. **`AND_THEN` / `OR_ELSE`** — short-circuit logical operators. Inserted at lower precedence than standard `AND` / `OR`.

See [`grammar.js`](grammar.js) for the implementation. It is ~80 lines including comments.

## How it works

```js
const base = require('tree-sitter-iec61131/grammar');

module.exports = grammar(base, {
  name: 'iec61131_twincat',

  rules: {
    _expression: ($, original) =>
      choice(original, $.twincat_system_call, $.short_circuit_expression),

    twincat_system_call: $ =>
      seq('__SYSTEM', '.', field('intrinsic', $.identifier),
          field('arguments', $.argument_list)),

    // ...
  },
});
```

The key trick is the `($, original)` parameter that tree-sitter's
`grammar(base, …)` form passes to each overridden rule: `original` is the
base grammar's version of that rule. We use `choice(original, …new)` to
**add** alternatives without dropping any existing ones.

## Running it

This stub is not pre-built. To verify it works:

```sh
cd examples/dialect-extension

# Resolve the base grammar via the parent directory.
# In a real dialect repo, run instead: `npm install tree-sitter-iec61131`
# (and remove the `../../grammar` require path in grammar.js).

tree-sitter generate           # writes src/parser.c for the dialect
tree-sitter parse sample.st    # should succeed and contain
                                #   - a twincat_system_call node
                                #   - a short_circuit_expression node
```

If the parse succeeds and the tree contains both extension node types, the extension architecture is wired up correctly in your environment.

## Where to go next

To create your own dialect:

1. `mkdir tree-sitter-iec61131-<vendor> && cd $_`
2. `npm init -y && npm install tree-sitter-iec61131`
3. Copy this directory's `grammar.js` and adapt the rule overrides to your dialect's syntax.
4. Set up `tree-sitter.json`, `package.json`, and bindings the same way as this base repo.
5. Push to a separate GitHub repo named `tree-sitter-iec61131-<vendor>`.

See [../../EXTENDING.md](../../EXTENDING.md) for the full guide, including the list of all extension points and the rationale for each.
