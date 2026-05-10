# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] — next: 0.0.3

## [0.0.2] - 2026-05-11

### Changed

- Contributions now require a `Signed-off-by` trailer on every commit
  (`git commit -s`) per the
  [Developer Certificate of Origin](https://developercertificate.org).
  See [CONTRIBUTING.md](CONTRIBUTING.md#sign-your-work-dco) for details.
  No CLA — DCO is purely an attestation of contribution rights.
- C# bindings via `TreeSitter.DotNet`: `Language.Create()` returns a typed
  `TreeSitter.Language` object; `Language.HighlightsQuery`,
  `InjectionsQuery`, `LocalsQuery`, and `TagsQuery` expose the bundled
  `.scm` files as embedded-resource strings. Targets `net8.0`.
- CI matrix job for C# (Linux / macOS / Windows) that builds the native
  parser library and runs `dotnet test`.
- Native library build artifacts and C# `bin/` / `obj/` directories added
  to `.gitignore`.

### Fixed

- PyPI package now renders a non-empty `Author` field. Worked around a
  PEP 621 + setuptools quirk where `authors = [{ name, email }]` writes
  only `Author-email` to core metadata, leaving `Author` null on PyPI,
  by splitting the entry into `authors = [{ name }]` and a separate
  `maintainers = [{ name, email }]` in `pyproject.toml`.

## [0.0.1] - 2026-05-09

### Changed

- Renamed the project to `tree-sitter-iec61131-3-st` so the name encodes
  both the IEC 61131 part number (Part 3 — programming languages) **and**
  the specific language (ST), distinguishing it from future grammars for
  the other Part-3 languages (FBD, LD, IL, SFC). The `-3-st-` carries
  through to all future vendor-dialect repos
  (e.g. `tree-sitter-iec61131-3-st-twincat`). Internal grammar name is
  `iec61131_3_st`; C function symbol is `tree_sitter_iec61131_3_st`;
  TextMate scope is `source.iec61131-3.st`. Distribution names align
  across npm, crates.io, and PyPI. No published artifacts existed under
  any prior name, so this is purely a pre-release rename.

### Added

- Initial tree-sitter grammar for IEC 61131-3 (3rd edition, 2013) Structured
  Text. Standard-compliant; vendor dialects deferred to separate dialect
  repos that extend this base.
- All POU declarations: `PROGRAM`, `FUNCTION` (with return type),
  `FUNCTION_BLOCK`, `INTERFACE`, `TYPE`, `NAMESPACE`, `CONFIGURATION`,
  `RESOURCE`, `TASK`.
- All `VAR_*` block kinds with `CONSTANT` / `RETAIN` / `NON_RETAIN`
  qualifiers, `AT %{I,Q,M}{X,B,W,D,L}<addr>` direct addresses, and initial
  values.
- All elementary types, generic `ANY_*` types, sized `STRING(N)` /
  `WSTRING(N)`, multi-dimensional `ARRAY [a..b, …] OF`, structures,
  enumerations, subranges, `POINTER TO`, `REF_TO`.
- All literals: integers (plain, `2#…`, `8#…`, `16#…`, with `_`
  separators), reals with exponent, single- and double-quoted strings with
  `$`-escape sequences, time/date/TOD/DT prefixed forms, typed-prefix
  (`INT#42`, `REAL#3.14`, `BOOL#TRUE`, `WORD#16#FF`).
- All operators with IEC 61131-3 §6.6.5 precedence, right-associative `**`.
- All statements: `:=`, `REF=`, function/method calls with positional and
  named (`:=` / `=>`) arguments, `IF`/`ELSIF`/`ELSE`, `CASE` with single,
  list, range values, `FOR … TO … BY … DO`, `WHILE`, `REPEAT`, `EXIT`,
  `CONTINUE`, `RETURN`.
- OOP (3rd edition): `METHOD` / `END_METHOD`, `PROPERTY` with `GET` / `SET`
  accessor bodies, `EXTENDS`, `IMPLEMENTS`, `INTERFACE`, `ABSTRACT` /
  `FINAL` / `OVERRIDE`, `PUBLIC` / `PRIVATE` / `PROTECTED` / `INTERNAL`,
  `THIS` / `SUPER`.
- Comments (`(* … *)`, `//`) and pragmas (`{ … }`, opaque body).
- Case-insensitive keyword matching at the lexer level via per-letter
  regex character classes; identifier maximal-munch resolves
  keyword-vs-identifier conflicts.
- Editor query files: `highlights.scm`, `locals.scm`, `tags.scm`,
  `folds.scm`, `indents.scm`, `injections.scm` — all using the standard
  tree-sitter highlight capture vocabulary.
- Bindings scaffolded for Node, Rust, Python, Go.
- Test corpus split by feature area (literals, expressions, statements,
  pou-declarations, var-blocks, data-types, oop, comments-and-pragmas).
- 13 real-world ST examples in `examples/` covering blink, traffic
  light, PID, debouncer, ramp generator, state machine, OOP shapes,
  conveyor with jam detection, temperature monitor with hysteresis,
  moving average, edge detectors, lookup table with linear interpolation,
  and a top-level `CONFIGURATION`.
- CI workflows (`ci.yml`, `prerelease.yml`, `release.yml`) per
  `BLUEPRINT.md` conventions, with grammar tests, examples parse-check,
  10 000-line benchmark gate (200 ms budget), and per-binding builds on
  Ubuntu / macOS / Windows.
- `EXTENDING.md` with worked TwinCAT dialect-extension example.
- `SPEC-COMPLIANCE.md` mapping every IEC 61131-3 §6.x and §7 section to
  its grammar rule(s) and listing deliberate deviations.

<!--
  Add entries here while working on `develop` or `release/*`. The heading
  carries the next target version (`next: X.Y.Z`) so it's obvious what
  these entries will ship as. On release, rename to `[X.Y.Z] - YYYY-MM-DD`
  and start a new `[Unreleased] — next: X.Y.Z+1` block.

  Use these subsections, omitting any that don't apply:
    ### Added       — new features
    ### Changed     — changes in existing functionality
    ### Deprecated  — soon-to-be removed features
    ### Removed     — removed features
    ### Fixed       — bug fixes
    ### Security    — vulnerability fixes
-->
