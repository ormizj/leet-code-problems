import { solve } from '#utils/testUtil.ts';
import { findMedianSortedArrays, findMedianSortedArrays2 } from './a.ts';

solve('4. Median of Two Sorted Arrays', { findMedianSortedArrays, findMedianSortedArrays2 }, [
    { args: [[1, 3], [2]], expected: 2 },
    { args: [[1, 2], [3, 4]], expected: 2.5 },
    { args: [[3, 4, 5, 6, 7, 8, 9], [1, 2]], expected: 5 },
    { args: [[], [1]], expected: 1 },
]);
