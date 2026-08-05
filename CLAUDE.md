# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Status

Personal LeetCode solutions in TypeScript, run with Node's built-in test runner. Actively used —
the "superseded by algorithm-s" note is gone from `README.md`.

## Commands

`npm run help` prints all of these plus the current problem list; it derives both from
`package.json` and the filesystem, so prefer it over trusting any hardcoded list.

- **No `npm install` needed to run tests.** There are zero runtime dependencies. `npm install` only
  fetches `typescript` and `@types/node`, which `npm run typecheck` needs.
- `npm run solve <id|slug>` — run one problem, e.g. `npm run solve 1`, `npm run solve two-sum`.
  Matches the LeetCode id first (`1` and `0001` both work), then a slug substring. The difficulty
  tier is never part of the query. Real exit code: 0 green, 1 on any failure.
- `npm run solve:watch <id|slug>` — the same, re-running on save.
- `npm run solve harness` — the checks for `solve()` itself (`src/utils/testUtil.test.ts`).
- `npm run new <leetcode-url>` — scaffold a problem folder **from LeetCode**, statement and cases
  included. Takes the problem URL (any suffix or query string, `leetcode.cn` too) or a bare slug;
  the id, title and difficulty tier all come from the API, so none of them can be typed wrong.
  Needs network access. See "Scaffolding from a URL" below for what it can and cannot extract.
- `npm run new:easy|new:medium|new:hard <id> <slug>` — scaffold an **empty** problem folder, offline.
  The difficulty is the script name, so it can never be omitted; `<id>` and `<slug>` are both
  mandatory.
- Both refuse to overwrite, including when the same problem already exists under another difficulty.
- `npm run typecheck` — `tsc --noEmit` over `src` and `scripts`.
- No linter and no build step.

**There is deliberately no run-everything command.** You work one problem at a time; a suite-wide
run was removed as noise. Nothing verifies every problem at once — if you need that after a
refactor of `src/utils`, run `node --test` manually.

`--` is not needed to pass arguments (`npm run solve 1` works). It *is* needed for raw flags —
npm swallows a bare `--watch`, which is why `solve:watch` exists as its own script.

`node --test <dir>` does **not** work on Node 24 — a positional argument is resolved as a module
path and a directory fails with `Cannot find module`. Pass explicit files or a quoted glob. This is
why `scripts/run.js` resolves problems to file paths rather than handing `node` a directory.

## Layout

- `src/problems/{easy,medium,hard}/<4-digit-id>-<kebab-case-title>/` with three files:
  - `q.md` — problem statement pasted from LeetCode, inline HTML tags left intact.
  - `a.ts` — the solution(s). **Exports only, no side effects** — importing it must run nothing.
  - `a.test.ts` — the cases, nothing else.
- Ids are zero-padded to 4 digits so directories sort numerically. The tier folders are for
  browsing only; nothing at runtime depends on which one a problem is in.
- `src/utils/*.ts` — one helper file per value type (`arrUtil`, `strUtil`, `numUtil`, `mapUtil`,
  `jsUtil`, `nodeUtil`) plus `testUtil` (the harness) and its own `testUtil.test.ts`.
- `scripts/*.js` — plain JS (not type-stripped TS, since they are the tooling). `problems.js` is the
  shared filesystem scanner behind `help.js`, `run.js` and `new.js`; add problem-discovery logic
  there rather than duplicating a scan.
- `scripts/leetcode.js` — everything that talks to leetcode.com: URL parsing, the GraphQL fetch, and
  turning a question into the three file bodies. It never touches the filesystem, so `new.js` can
  fetch and parse in full before it writes anything.
- `scripts/reporter.js` — a custom `node:test` reporter that `run.js` passes via `--test-reporter`.

## Test output

The reporter exists because the built-in `spec` reporter prints a full stack trace and a dumped
error object for every failed assertion, which buries the actual information. It:

- Shows **`expected` / `actual` and no stack** for a failed assertion — a wrong answer is not a
  crash. A thrown error still gets a stack, trimmed to frames in this repo's own `src/`.
- Lists **passes first and failures last** within each solution, so the failures sit next to the
  summary line instead of scattered through the output.
- Prints **what a solution logged under the case that logged it**, as `› <line>` above that case's
  `expected`/`actual` (`console.error`/`warn` in red). See "Printing from a solution" below.
- Buffers results and prints on the run-level `test:summary` event (the one with no `file`), which
  is what makes the reordering possible. Watch mode reuses one reporter instance across runs, so
  the buffers are reset after each summary — a leak there shows up as duplicated output.

Pass your own `--test-reporter` to opt out, e.g. `npm run solve 1 --test-reporter=spec` (that one
needs `--`, since npm eats leading flags).

### Printing from a solution

`console.log` inside a solution works and needs nothing special. How it gets there matters if you
touch either file:

- `node --test` runs each test file in a child process and hands the child's raw output to the
  reporter as `test:stdout` / `test:stderr` events. **Those events carry no test name, and they all
  arrive before the first `test:start`** — the pipe is separate from the structured event channel.
  Attribution is impossible from the reporter alone.
- So `solve()` swaps `console.log`/`info`/`debug`/`error`/`warn` for the duration of each
  `solution(...args)` call, formats the arguments with `util.format` exactly as `console` would, and
  replays each line through `t.diagnostic()`. Those events *do* arrive in order, right after their
  own test's `test:pass`/`test:fail`. The console is restored in a `finally`.
- Each replayed line is tagged with `logMark` / `errMark` (`⟦log⟧` / `⟦err⟧`, exported from
  `testUtil.ts` and **duplicated as a literal in `reporter.js`** — keep the two in step). The mark is
  what separates a solution's output from node's own diagnostics (`tests 3`, `duration_ms`), which
  are dropped.
- Anything the swap cannot catch — a top-level log in `a.ts`, a bare `process.stdout.write`, a log
  from a `setTimeout` that fires after the case ended — still arrives as `test:stdout` and is printed
  in a `── stdout ──` block after the tree, above the summary. When more than one file logged, the
  rule names the problem.

## `a.ts` convention

1. LeetCode's JSDoc block, kept as-is, then the solution as
   `export const <camelCaseName> = function (...) {...}` (the shape LeetCode hands you) with TS
   parameter and return types added.
2. Alternative solutions below it as `<name>2`, `<name>3` — also exported, so the harness can run
   them. Local helpers stay unexported arrow consts.
3. Nothing else. No separator line, no printing. The one allowed import is `#utils/nodeUtil.ts`,
   for the problems whose parameters are a `ListNode` or `TreeNode` — it is side-effect free, so
   "importing `a.ts` runs nothing" still holds.

If a solution can fall through without returning (`twoSum` does), type the return as
`T | undefined` rather than adding a `return` LeetCode never asked for.

A **freshly scaffolded** `a.ts` keeps LeetCode's own return type verbatim and never widens it —
whether a solution falls through is the solver's call, not something the scaffold can know. Its
body is a placeholder `throw new Error('TODO');`, which satisfies every return type (`tsc` rejects
an *empty* body for anything but `void`/`any`/`undefined`, TS2355). Replace it with the solution.

## `a.test.ts` convention

```ts
import { solve } from '#utils/testUtil.ts';
import { twoSum, twoSum2 } from './a.ts';

solve('1. Two Sum', { twoSum, twoSum2 }, [
    { args: [[2, 7, 11, 15], 9], expected: [0, 1] },
]);
```

`solve(title, solutions, cases)` runs **every case against every solution variant** — never
duplicate a case list per variant. Adding `<name>2` to the `solutions` object is the whole cost of
testing a second approach.

`args` is positional and maps directly onto the parameters. Each solution gets a `structuredClone`
of `args`, so a solution that mutates its input (`findMedianSortedArrays` pushes into `nums1`)
cannot corrupt the next variant. `structuredClone` cannot clone functions.

`Case` options, all optional:

- `compare: 'deep'` (default) — `assert.deepStrictEqual`. Strict: `'2'` no longer matches `2`.
  LeetCode's `2.00000` is just `2` in JS, so it needs nothing special.
- `compare: 'unordered'` — sorts both sides (nested arrays inside-out) before comparing.
- `compare: 'approx'` — numeric, `epsilon` defaults to `1e-9`. For float accumulation.
- `mutates: <index>` — assert on `args[index]` after the call instead of the return value, for
  in-place/void solutions.
- `serialize: <fn>` — normalize the asserted value before comparing. For `ListNode`/`TreeNode`
  returns: write `expected` as the array LeetCode prints and pass `fromList`/`fromTree`. This is not
  cosmetic — `structuredClone` strips the prototype off the cloned args, so a solution that splices
  nodes out of its input returns plain objects, and `deepStrictEqual` compares prototypes.
- `name` — replaces the auto-generated `case N: (args) → expected` label.
- `skip` / `only`.

## Scaffolding from a URL

`npm run new <url>` reads LeetCode's public GraphQL endpoint (no auth). `metaData` is what drives
the generated `a.test.ts` — it carries the parameter names and types, the return type, and
`output.paramindex`, which maps straight onto `mutates`.

What it produces per problem shape:

- plain params and return → a direct case.
- `return.type: 'void'` + `output.paramindex: N` → `mutates: N` (48 Rotate Image, 88 Merge Sorted
  Array).
- a return value **and** a partial array view (`Output: 2, nums = [1,2,_]`, 26) → two cases. One
  `Case` asserts on the return **or** `args[mutates]`, never both, and `_` means "unspecified", which
  `deepStrictEqual` has no wildcard for — so the second case is emitted with a `//TODO` saying it
  fails as written.
- `ListNode`/`TreeNode` → `toList`/`toTree` args plus `serialize: fromList`/`fromTree`.
- `systemdesign: true` (146 LRU Cache) → refuses. The input is a sequence of calls against a class,
  which `solve(title, {fn}, cases)` has no shape for.

It also infers `compare`, noting why on the first case it applies to: `"in any order"` in the
statement → `'unordered'`; a `double` return type → `'approx'`. Both are guesses — delete the option
if it is wrong for the problem.

Anything it cannot parse becomes a warning on stdout rather than a silently wrong case. Statements
come in two HTML shapes (an older `<pre>` block and a newer `<div class="example-block">`); both are
normalized to the `<pre>` form the existing `q.md` files use.

## TypeScript

Everything under `src` is `.ts` and runs with **no build step** — Node ≥22.18 strips types natively.
`package.json` sets `"type": "module"`. Three rules keep this working; breaking them fails at `node`
runtime, not just in the editor:

- **Erasable syntax only.** No `enum`, no `namespace`, no constructor parameter properties.
  `erasableSyntaxOnly` in `tsconfig.json` enforces it.
- **Imports carry the `.ts` extension.** Node does not resolve extensionless specifiers here;
  `allowImportingTsExtensions` lets `tsc` accept them.
- **Utils are reached through `#utils/`**, mapped by the `imports` field in `package.json`
  (`"#utils/*": "./src/utils/*"`), never `../../../utils/`. A problem's own `a.ts` is imported
  relatively (`./a.ts`).
- **Type-only imports use `import type`** (`verbatimModuleSyntax`).

## Style

4-space indent, semicolons, single quotes or backticks, `const` arrow functions for helpers.
No comments beyond LeetCode's JSDoc and short `//` notes.
