---
name: leet-hint
description: Nudge the solver toward the next idea on a LeetCode problem without revealing the solution
argument-hint: <id|slug> [level 1-3, default 1]
allowed-tools: [Read, Glob, Bash]
---

# leet-hint

The user is solving a LeetCode problem in this repo and is stuck. Point them at **what to think
about next**. Never hand them the answer.

The user invoked this with: `$ARGUMENTS`

## 1. Parse the arguments

First token is the problem query. Optional second token is the hint level.

- `1`, `2`, `3` → that level.
- `more` / `next` → level 2.
- Missing or unrecognized → level **1**.
- A number outside 1-3 → clamp into 1-3.

## 2. Resolve the problem folder

Same matching rules as `findProblems()` in `scripts/problems.js` — the difficulty tier is never part
of the query:

- Query is all digits → zero-pad it to 4 (`3` → `0003`) and Glob `src/problems/*/0003-*/q.md`.
- Otherwise → treat it as a case-insensitive slug substring, Glob `src/problems/*/*<query>*/q.md`.

No match → say so, list what exists (`Glob src/problems/*/*/q.md`), and stop. More than one match →
ask which one; do not guess.

## 3. Read the current state

- Read `q.md` — always.
- Read `a.ts` — always, and classify it:
  - **Not started** — the exported function has an empty body, or the body is
    `throw new Error('TODO');`. Both scaffold shapes exist; treat either as untouched.
  - **In progress / done** — anything else.
- If in progress, run `npm run solve <id>` and read the output. A non-zero exit is expected here and
  is information, not a failure to report. Note the **first failing case**, its `expected` and its
  `actual`.
- Never open a different problem's `a.ts` to crib from.

## 4. Pick the hint

| state | level 1 | level 2 | level 3 |
| --- | --- | --- | --- |
| not started | what to *notice* in the statement — the constraint, or the work brute force repeats | the shape of the answer: what to carry between steps, what to trade space for — without naming the algorithm | the key insight, one sentence, no step list |
| failing cases | point at the first failing case, ask what their code does on that input | narrow to the region of their code that misbehaves on it | the category of bug (off-by-one, unhandled empty input, stale state) — not the fix |
| all passing | ask what complexity they landed on | what makes it slower or heavier than it needs to be | the property of the input a better approach exploits |

Even level 3 stops at the *idea*, never the implementation.

## 5. Hard rules

- **Never write or edit `a.ts`, `a.test.ts`, or any other file.** This skill reads and reports only.
- No code, no pseudocode, no numbered steps — not even inside a "for example" aside.
- Never paste their code back with a fix spliced in, and never show a corrected version of it.
- Prefer questions to statements. "What do you recompute for every starting index?" beats "you're
  recomputing for every starting index."
- At levels 1 and 2, do not name the canonical technique (sliding window, two pointers, memoization,
  monotonic stack, binary search). At level 3 it may be named once, without elaboration.
- Keep it to 2-5 sentences. A wall of text is a walkthrough.
- If they already have the right idea and are stuck on a detail, hint at the detail — don't restart
  the problem from the top.

## 6. Output

A header line naming the problem and level, the hint prose, then the pointer to the next level
(omit the pointer at level 3). No headings, no bullet lists, no code fences.

```
3. Longest Substring Without Repeating Characters — hint 1/3

<2-5 sentences>

Still stuck? /leet-hint 3 2
```
