# leet-code-problems

LeetCode solutions in TypeScript, one folder per problem, run with Node's built-in test runner.

Needs Node ≥ 22.18 (native TypeScript type stripping). There are **no runtime dependencies** — you
can clone and run the tests without `npm install`.

```sh
npm run help                    # every command, plus the current problem list
npm run solve 1                 # run one problem, by id...
npm run solve two-sum           # ...or by slug
npm run solve:watch 1           # re-run on save
npm run new:medium 2 add-two-numbers    # scaffold (also new:easy, new:hard)
```

There is no run-everything command — you work on one problem at a time.

## Layout

```
src/problems/easy/0001-two-sum/
    q.md         problem statement from LeetCode
    a.ts         the solution(s), exported, no side effects
    a.test.ts    the cases
```

## Writing a problem

`a.ts` exports every approach you tried:

```ts
export const twoSum = function (nums: number[], target: number): number[] | undefined { ... };
export const twoSum2 = function (nums: number[], target: number): number[] | undefined { ... };
```

`a.test.ts` lists the cases once — they run against **every** exported variant:

```ts
import { solve } from '#utils/testUtil.ts';
import { twoSum, twoSum2 } from './a.ts';

solve('1. Two Sum', { twoSum, twoSum2 }, [
    { args: [[2, 7, 11, 15], 9], expected: [0, 1] },
    { args: [[3, 2, 4], 6], expected: [1, 2] },
]);
```

`args` is positional. Comparison is `assert.deepStrictEqual` by default; per case you can opt into
`compare: 'unordered'`, `compare: 'approx'` (with `epsilon`), or `mutates: <argIndex>` for in-place
solutions that return nothing. `src/utils/testUtil.test.ts` has one worked example of each and runs
with `npm run solve harness`.
