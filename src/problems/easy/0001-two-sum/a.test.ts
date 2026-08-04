import { solve } from '#utils/testUtil.ts';
import { twoSum } from './a.ts';

solve('1. Two Sum', { twoSum }, [
    { args: [[2, 7, 11, 15], 9], expected: [0, 1] },
    { args: [[3, 2, 4], 6], expected: [1, 2] },
    { args: [[3, 3], 6], expected: [0, 1] },
]);
