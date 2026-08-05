import { solve } from '#utils/testUtil.ts';
import { toTree } from '#utils/nodeUtil.ts';
import { levelOrder } from './a.ts';

solve('102. Binary Tree Level Order Traversal', { levelOrder }, [
    { args: [toTree([3, 9, 20, null, null, 15, 7])], expected: [[3], [9, 20], [15, 7]] },
    { args: [toTree([1])], expected: [[1]] },
    { args: [toTree([])], expected: [] },
]);
