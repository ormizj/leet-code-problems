---
name: leet-review
description: Review a solved LeetCode problem in this repo against the top community answers — complexity vs optimal, TypeScript/repo conventions, interview readability. Blunt and factual, no praise padding. Takes a problem id or slug, e.g. /leet-review 3.
allowed-tools: Read, Glob, Grep, Bash, WebSearch, WebFetch
---

# leet-review

Judge one solved problem in this repo. The argument is `$ARGUMENTS` — a LeetCode id or a slug
substring, never a difficulty tier.

This is a review, not a rewrite. Read, look things up, report. Do not touch `a.ts` or `a.test.ts`.

## 1. Resolve the problem

Run from the repo root — every path in `scripts/problems.js` is relative.

```bash
node --input-type=module -e "import('./scripts/problems.js').then(m => console.log(JSON.stringify(m.findProblems(process.argv[1]), null, 2)))" "$ARGUMENTS"
```

`findProblems` matches the LeetCode id first (`1` and `0001` both hit), then a slug substring, and
returns `{ id, slug, difficulty, dir, testFile }`.

- No argument → ask which problem. Do not guess.
- No match → list what exists and stop:
  `node --input-type=module -e "import('./scripts/problems.js').then(m => m.printProblems())"`
- More than one match → ask which one.

## 2. Read the local state

- `<dir>/q.md` — the statement and, crucially, the **constraints**. Input bounds decide whether an
  O(n²) is actually fine or actually a TLE. Line 3 is the canonical LeetCode URL; take the slug from
  there rather than rebuilding it.
- `<dir>/a.ts` — every exported variant (`name`, `name2`, `name3`). Review each one on its own.
- `<dir>/a.test.ts` — only to see which variants are registered in `solve()`. Do not judge the case
  list; coverage is not your job here.

## 3. Look up what the top answers actually do

In order, stopping once you have enough:

1. `WebSearch` — e.g. `leetcode <slug> optimal solution time complexity approach`.
2. `WebFetch` the most promising results for the real technique and its complexity.
3. `WebFetch` `https://leetcode.com/problems/<slug>/solutions/` as a bonus. That page renders
   client-side and usually returns little useful text — do not stall on it, and do not retry it.

State which sources you actually retrieved. If a claim rests on your own knowledge rather than a
fetched page, label it as such. **Never invent a "top answer."** "Couldn't retrieve community
solutions; this is my own complexity analysis" is an acceptable report. A fabricated consensus is not.

## 4. Report, in this order

**Verdict** — one blunt line.
`Suboptimal — O(n²) where the accepted answer is O(n).` /
`Optimal. Nothing to fix on complexity.`

**Complexity** — per variant: the actual time and space with the reasoning that gets you there, then
the best known complexity, then the *name* of the optimal approach (sliding window, monotonic stack,
prefix sums, binary search on the answer, …). Check it against the constraints in `q.md` — say
outright whether it passes or TLEs at the stated bounds. If one variant in the file is strictly
dominated by another, say which one to delete.

**What the top answers do differently** — the concrete technique, not vibes. If the solution already
matches the accepted approach, one line and move on.

**TypeScript & repo conventions** — against `CLAUDE.md`:

- `a.ts` is exports-only, no side effects. The one permitted import is `#utils/nodeUtil.ts`.
- LeetCode's JSDoc block kept verbatim above each export; `export const <name> = function (...)` with
  TS parameter and return types added.
- Local helpers are unexported `const` arrows.
- Erasable syntax only — no `enum`, no `namespace`, no constructor parameter properties. Imports carry
  the `.ts` extension, utils go through `#utils/`, type-only imports use `import type`.
- The return type is widened to `| undefined` only when the solution genuinely falls through.
- 4-space indent, semicolons, single quotes or backticks, no comments beyond the JSDoc.
- **A variant exported from `a.ts` but missing from the `solutions` object in `a.test.ts`.** The whole
  point of the `<name>2` convention is that the harness runs it; an unregistered variant is dead code.
- Hand-rolled logic that duplicates something already in `src/utils/*Util.ts`.
- Run `npm run typecheck` and report anything it flags in this problem's files. It is repo-wide —
  ignore hits in other problems.

**Interview readability** — naming, unnecessary cleverness, whether the approach can be explained out
loud in thirty seconds. `left`/`right` beat `i`/`j` in a two-pointer; a one-liner nobody can trace is
worse than three clear lines.

**Fixes** — concrete, with code. Ordered by impact.

**Grade** — a letter, or one line. No hedging.

**TL;DR** — always last. Three to five bullets, one line each, readable on their own without the rest
of the report. Complexity verdict, the single biggest fix, and any convention break worth acting on.
No new information here — it is a compression of what is already above, not an appendix. Cut it to
two bullets when the solution is clean; there is nothing to summarize at length.

## 5. Tone

- No opening compliment. No "great job." No softening qualifier before a criticism.
- Every criticism names the specific line or construct and why the alternative is better.
- Never invent a problem to look rigorous. If the solution is optimal and clean, the report is short
  and says so. "Don't go easy" means don't flatter — it does not mean manufacture faults.
- Out of scope: hunting edge cases, judging test coverage, running `npm run solve`. LeetCode's judge
  owns correctness.
- End by offering to apply the fixes. Do not apply them unasked.
