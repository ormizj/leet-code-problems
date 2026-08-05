import { solve } from '#utils/testUtil.ts';
import { toList, fromList, toTree, fromTree, ListNode } from '#utils/nodeUtil.ts';

//guards the harness itself — each case exercises one option of `solve`

const identity = (any: unknown) => any;
const sum = (num: number, oNum: number) => num + oNum;
const sortInPlace = (nums: number[]) => { nums.sort((num, oNum) => num - oNum); };
const pairs = (nums: number[]) => nums.map((num) => [num, num]);

//returns nodes spliced out of its argument, which structuredClone left prototype-less —
//exactly the shape `serialize` exists for
const tail = (node: ListNode | null) => node?.next ?? null;

solve('testUtil: deep', { identity }, [
    { args: [[[1, 2], [3]]], expected: [[1, 2], [3]] },
    { args: [{ a: 1 }], expected: { a: 1 } },
]);

solve('testUtil: unordered', { identity }, [
    { args: [[3, 1, 2]], expected: [1, 2, 3], compare: 'unordered' },
]);

//nested arrays are sorted inside-out, so neither the outer nor the inner order matters
solve('testUtil: unordered nested', { pairs }, [
    { args: [[2, 1]], expected: [[2, 2], [1, 1]], compare: 'unordered' },
]);

solve('testUtil: approx', { sum }, [
    { args: [0.1, 0.2], expected: 0.3, compare: 'approx' },
    { args: [1, 2], expected: 3.4, compare: 'approx', epsilon: 0.5 },
]);

//sortInPlace returns undefined, so the assertion targets args[0] instead
solve('testUtil: mutates', { sortInPlace }, [
    { args: [[3, 1, 2]], expected: [1, 2, 3], mutates: 0 },
]);

//node graphs are compared in their array form, so a prototype-less return still matches
solve('testUtil: serialize list', { tail }, [
    { args: [toList([1, 2, 3])], expected: [2, 3], serialize: fromList },
    { args: [toList([1])], expected: [], serialize: fromList },
]);

solve('testUtil: serialize tree', { identity }, [
    { args: [toTree([1, null, 2, 3])], expected: [1, null, 2, 3], serialize: fromTree },
]);

solve('testUtil: name and skip', { identity }, [
    { args: [1], expected: 1, name: 'a custom label' },
    { args: ['unreachable'], expected: 'never asserted', skip: true },
]);
