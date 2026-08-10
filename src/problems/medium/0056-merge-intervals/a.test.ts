import { solve } from '#utils/testUtil.ts';
import { merge } from './a.ts';

solve('56. Merge Intervals', { merge }, [
    { args: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]] },
    { args: [[[1, 4], [4, 5]]], expected: [[1, 5]] },
    { args: [[[4, 7], [1, 4]]], expected: [[1, 7]] },
]);
