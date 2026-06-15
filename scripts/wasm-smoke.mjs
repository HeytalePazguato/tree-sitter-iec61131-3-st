// Smoke test for the prebuilt WASM grammar consumed via web-tree-sitter.
//
// Loads tree-sitter-iec61131_3_st.wasm (produced by `tree-sitter build --wasm`)
// through the web-tree-sitter runtime, parses every file under examples/, and
// fails if the grammar cannot load or any example parses with errors. This is
// the same contract downstream consumers (e.g. plc-st-review) rely on, so it
// guards the WASM path the native bindings' tests don't exercise.

import { readFileSync, readdirSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Parser, Language } from "web-tree-sitter";

// Grammar directory to smoke-test. Defaults to the repo root (the standard
// grammar); pass a path (e.g. `grammars/beckhoff`) to test a dialect. The
// built `*.wasm` and the `examples/` dir are both resolved inside it.
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const grammarDir = process.argv[2] ? resolve(process.argv[2]) : repoRoot;
const examplesDir = join(grammarDir, "examples");

const wasmFile = readdirSync(grammarDir).find((f) => f.endsWith(".wasm"));
if (!wasmFile) {
  console.error(`No .wasm found in ${grammarDir}; run 'tree-sitter build --wasm' first.`);
  process.exit(1);
}
const wasmPath = join(grammarDir, wasmFile);

await Parser.init();
const language = await Language.load(wasmPath);
const parser = new Parser();
parser.setLanguage(language);

const files = readdirSync(examplesDir)
  .filter((f) => f.endsWith(".st"))
  .sort();

if (files.length === 0) {
  console.error("No example files found; nothing to smoke-test.");
  process.exit(1);
}

let failures = 0;
for (const file of files) {
  const source = readFileSync(join(examplesDir, file), "utf8");
  const tree = parser.parse(source);
  if (tree.rootNode.hasError) {
    console.error(`FAIL ${file} — parse tree contains an ERROR node`);
    failures++;
  } else {
    console.log(`OK   ${file}`);
  }
}

if (failures > 0) {
  console.error(`\n${failures} example(s) failed to parse via WASM.`);
  process.exit(1);
}
console.log(`\nAll ${files.length} examples parsed cleanly via web-tree-sitter ${Language.version ?? ""}.`.trim());
