import { solve } from '#utils/testUtil.ts';
import { merge } from './a.ts';

solve('56. Merge Intervals', { merge }, [
    { args: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]] },
    { args: [[[1, 4], [4, 5]]], expected: [[1, 5]] },
    { args: [[[4, 7], [1, 4]]], expected: [[1, 7]] },
    { args: [[[1, 10], [2, 3], [4, 5]]], expected: [[1, 10]] },
    { args: [[[1, 4], [2, 3]]], expected: [[1, 4]] },
    { args: [[[1, 4], [0, 4]]], expected: [[0, 4]] },
    { args: [[[1, 4], [5, 6]]], expected: [[1, 4], [5, 6]] },
    { args: [[[1, 3], [3, 5], [5, 7]]], expected: [[1, 7]] },
    { args: [[[5, 5], [5, 5]]], expected: [[5, 5]] },
    { args: [[[1, 1]]], expected: [[1, 1]] },
]);
