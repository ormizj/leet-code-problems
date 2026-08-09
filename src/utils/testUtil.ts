import { describe, it } from 'node:test';
import type { TestContext } from 'node:test';
import assert from 'node:assert/strict';
import { format } from 'node:util';
import { arrDeepSortedCopy } from '#utils/arrUtil.ts';

export type Solution = (...args: any[]) => unknown;

export type Design = new (...args: any[]) => Record<string, any>;

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

//node hands a child's raw stdout to the reporter with no idea which test wrote it, so what a
//solution prints is captured here and replayed as diagnostics, which do carry their test.
//the marker is what tells the reporter's own lines apart from node's — scripts/reporter.js
export const logMark = '⟦log⟧';
export const errMark = '⟦err⟧';

const consoleMethods = [
    ['log', logMark],
    ['info', logMark],
    ['debug', logMark],
    ['error', errMark],
    ['warn', errMark],
] as const;

//the marked line is what a solution printed, ready to hand to t.diagnostic
const captureLogs = <T>(run: () => T, onLine: (line: string) => void): T => {
    const original = consoleMethods.map(([method, mark]) => [method, mark, console[method]] as const);

    for (const [method, mark] of original) {
        console[method] = (...args: unknown[]) => onLine(`${mark}${format(...args)}`);
    }

    try {
        return run();
    } finally {
        for (const [method, , fn] of original) console[method] = fn;
    }
}

//a design problem's input is leetcode's own driver: an op list whose first entry names the class
//and whose rest are method calls, against a matching list of argument lists. wrapping that into a
//plain Solution is all `solve` needs — the class becomes `(ops, callArgs) => results`
export const drive = (Design: Design): Solution => (ops: string[], callArgs: unknown[][]) => {
    const instance = new Design(...callArgs[0]);

    return ops.map((op, index) => {
        //the first op constructs, and leetcode prints null for that slot
        if (index === 0) return null;

        assert.ok(typeof instance[op] === 'function', `${Design.name} has no method ${op}`);

        //a void method returns undefined in js, which is the null leetcode prints for it
        return instance[op](...callArgs[index]) ?? null;
    });
}

export const solve = (title: string, solutions: Record<string, Solution>, cases: Case[]) => {
    describe(title, () => {
        for (const [name, solution] of Object.entries(solutions)) {
            describe(name, () => {
                cases.forEach((aCase, index) => {
                    it(caseLabel(aCase, index), { skip: aCase.skip, only: aCase.only }, (t: TestContext) => {
                        const args = cloneArgs(aCase.args);
                        const logged: string[] = [];
                        const returned = captureLogs(() => solution(...args), (line) => logged.push(line));
                        const actual = aCase.mutates === undefined ? returned : args[aCase.mutates];

                        //emitted before the assertion, so a failing case still shows what it printed
                        for (const line of logged) t.diagnostic(line);

                        assertCase(aCase.serialize === undefined ? actual : aCase.serialize(actual), aCase);
                    });
                });
            });
        }
    });
}
