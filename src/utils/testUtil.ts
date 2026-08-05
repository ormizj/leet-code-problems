import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { arrDeepSortedCopy } from '#utils/arrUtil.ts';

export type Solution = (...args: any[]) => unknown;

export type Compare = 'deep' | 'unordered' | 'approx';

export type Case = {
    args: unknown[];
    expected: unknown;
    compare?: Compare;
    //assert on args[i] after the call instead of the return value, for in-place solutions
    mutates?: number;
    epsilon?: number;
    //normalize the asserted value before comparing, for node graphs — see nodeUtil
    serialize?: (value: unknown) => unknown;
    name?: string;
    only?: boolean;
    skip?: boolean;
};

const defaultEpsilon = 1e-9;
const previewLength = 40;

const preview = (any: unknown): string => {
    const str = JSON.stringify(any) ?? `${any}`;
    return str.length > previewLength ? `${str.slice(0, previewLength - 1)}…` : str;
}

const caseLabel = (aCase: Case, index: number): string => {
    if (aCase.name !== undefined) return aCase.name;
    return `case ${index + 1}: (${aCase.args.map(preview).join(', ')}) → ${preview(aCase.expected)}`;
}

const assertCase = (actual: unknown, { expected, compare = 'deep', epsilon = defaultEpsilon }: Case) => {
    if (compare === 'approx') {
        assert.ok(
            typeof actual === 'number' && typeof expected === 'number',
            `'approx' needs numbers, got ${preview(actual)} and ${preview(expected)}`
        );
        assert.ok(
            Math.abs(actual - expected) <= epsilon,
            `expected ${actual} to be within ${epsilon} of ${expected}`
        );
        return;
    }

    if (compare === 'unordered') {
        assert.ok(Array.isArray(actual), `'unordered' needs an array output, got ${preview(actual)}`);
        assert.ok(Array.isArray(expected), `'unordered' needs an array expected, got ${preview(expected)}`);
        assert.deepStrictEqual(arrDeepSortedCopy(actual), arrDeepSortedCopy(expected));
        return;
    }

    assert.deepStrictEqual(actual, expected);
}

//every solution gets its own copy, since a case is shared across variants and some
//solutions mutate their arguments (findMedianSortedArrays pushes into nums1).
//structuredClone cannot clone functions, which no LeetCode-shaped input needs
const cloneArgs = (args: unknown[]): unknown[] => structuredClone(args);

export const solve = (title: string, solutions: Record<string, Solution>, cases: Case[]) => {
    describe(title, () => {
        for (const [name, solution] of Object.entries(solutions)) {
            describe(name, () => {
                cases.forEach((aCase, index) => {
                    it(caseLabel(aCase, index), { skip: aCase.skip, only: aCase.only }, () => {
                        const args = cloneArgs(aCase.args);
                        const returned = solution(...args);
                        const actual = aCase.mutates === undefined ? returned : args[aCase.mutates];

                        assertCase(aCase.serialize === undefined ? actual : aCase.serialize(actual), aCase);
                    });
                });
            });
        }
    });
}
