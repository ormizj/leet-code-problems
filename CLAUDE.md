# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Status

Personal LeetCode solutions in plain ESM JavaScript. Per `README.md`, this repo is superseded by
https://github.com/spiderpig60/algorithm-s — treat it as archived. `TODO` at the root lists the known
open gaps in the answer-checking harness.

## Commands

- `npm install` — required first. `node_modules` is not checked in and `chalk` is a hard runtime
  dependency of `src/utils/answerUtil.ts`; without it every problem file throws `ERR_MODULE_NOT_FOUND`.
- `node src/problems/<difficulty>/<id>-<slug>/a.mjs` — run a single problem. Each `a.mjs` is
  self-executing and prints its own pass/fail table; this is the closest thing to a test.
- `npm run typecheck` — `tsc --noEmit` over `src/utils`. The only check that reads the type
  annotations; running a problem file never type-checks anything.
- `npx nodemon src/problems/<difficulty>/<id>-<slug>/a.mjs` — re-run on save while iterating.
  `nodemonConfig.ext` in `package.json` widens the watch list to `mjs,ts,json`; without it nodemon
  ignores util edits.
- There is no test framework, linter, or **build step**. `npm test` is the npm placeholder and
  intentionally exits 1 — it is not the test command.

## Layout

- `src/problems/{easy,medium,hard}/<leetcode-id>-<kebab-case-title>/` with two files: `a.mjs` (answer)
  and `q.md` (problem statement pasted from LeetCode, inline HTML tags left intact).
- `src/utils/*.ts` — one helper file per value type (`arrUtil`, `strUtil`, `numUtil`, `mapUtil`,
  `objUtil`, `jsUtil`) plus `answerUtil` (the harness). `arrUtil.ts` is still an empty placeholder
  (`export {}`); prefer filling it over adding new util files. Array/object deep equality lives in
  `objUtil.ts`, not `arrUtil.ts` — moving it would make the two modules import each other.
- `assets/snippets.md` — copy-paste boilerplate for the harness block; keep it in sync if the
  `printResult` signature changes.

## `a.mjs` convention

1. LeetCode's JSDoc block, then the solution as `const <camelCaseName> = function (...) {...}`
   (the shape LeetCode hands you).
2. Alternative solutions below it as `<name>2`, `<name>3`; local helpers as arrow consts.
3. A separator line (`/*---…---*/`, 100 dashes), then
   `import { printEnd, printResult } from '#utils/answerUtil.ts';` and one `printResult(...)`
   per LeetCode example. The bottom-of-file import is deliberate and works because ESM imports hoist —
   keep it there. Utils are always reached through the root-relative `#utils/` subpath alias, never
   `../../../utils/`; the extension is `.ts` (problem files stay `.mjs`; only the utils they import
   are TypeScript).
4. `printEnd()` last.

## `answerUtil` semantics

- `printResult({ answerCb, expected, input = {}, isOrder = false })` calls
  `answerCb.apply(null, Object.values(input))`, so **key order in `input` must match the solution's
  parameter order**; the keys themselves only label the printed output.
- Comparison (`calculateAnswer`): if `expected` is an array → `arrObjEqual` (`src/utils/objUtil.ts`);
  otherwise `strCompareAs` (`src/utils/strUtil.ts`), a stringified `===`, so `2`, `2.00000` and `"2"`
  all match. `isOrder` is accepted but not yet implemented.
- `expected` must therefore be the **same shape the solution returns**. Wrapping a scalar return in an
  array makes `arrObjEqual` compare an array against a string and report "Wrong Answer".
- `arrObjEqual` is a real deep-equal now: length-checked, recurses through nested arrays and objects
  (`objEqualHelper` compares own-enumerable keys), and falls back to `strCompareAs` for same-typed
  scalars. Values of differing `vTypeOf` are never equal.
- `isOrder` is accepted by `printResult`/`calculateAnswer` but still unimplemented — a known `TODO`.
- Importing `answerUtil.ts` prints the green `START` banner as an import side effect; `printEnd()`
  defers the `END` banner via `setTimeout` so it lands after all synchronous output.

## TypeScript in `src/utils`

The utils are `.ts` and run with **no build step** — Node ≥22.18 strips types natively
(`process.features.typescript === 'strip'`). `package.json` sets `"type": "module"`, so `.ts` files are
ESM. Three rules keep this working; breaking them fails at `node` runtime, not just in the editor:

- **Erasable syntax only.** No `enum`, no `namespace`, no constructor parameter properties — types must
  vanish without code generation. `erasableSyntaxOnly` in `tsconfig.json` enforces it.
- **Internal imports carry the `.ts` extension** (`#utils/jsUtil.ts`). Node does not resolve
  extensionless specifiers here; `allowImportingTsExtensions` lets `tsc` accept them.
- **Internal imports go through `#utils/`**, mapped by the `imports` field in `package.json`
  (`"#utils/*": "./src/utils/*"`) — this holds inside `src/utils` too, not just in problem files.
- **Type-only imports use `import type`** (`verbatimModuleSyntax`), so nothing dangles after stripping.

`tsconfig.json` is `noEmit` and scoped to `src/utils` — the `.mjs` problem files are never type-checked.

## Style

4-space indent, semicolons, single quotes or backticks, `const` arrow functions for helpers.
Problem files stay plain JavaScript. No comments beyond LeetCode's JSDoc and short `//` notes.
