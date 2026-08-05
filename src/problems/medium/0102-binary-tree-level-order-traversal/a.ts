import {TreeNode} from '#utils/nodeUtil.ts';

/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     val: number
 *     left: TreeNode | null
 *     right: TreeNode | null
 *     constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.left = (left===undefined ? null : left)
 *         this.right = (right===undefined ? null : right)
 *     }
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
export const levelOrder = function (root: TreeNode | null): number[][] {
    if (!root) return [];

    const res: number[][] = [];
    const searchTree = (root: TreeNode | null, index: number) => {
        if (!root) return;
        if (!res[index]) res[index] = [];
        res[index].push(root.val);
        searchTree(root.left, index + 1)
        searchTree(root.right, index + 1)
    }
    searchTree(root, 0);

    return res;
};
