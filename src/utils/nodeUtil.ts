//LeetCode writes linked lists and trees as arrays and deserializes them before calling the
//solution, so a case built from a statement needs the same conversion in both directions

export class ListNode {
    val: number;
    next: ListNode | null;

    constructor(val?: number, next?: ListNode | null) {
        this.val = val ?? 0;
        this.next = next ?? null;
    }
}

export class TreeNode {
    val: number;
    left: TreeNode | null;
    right: TreeNode | null;

    constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
        this.val = val ?? 0;
        this.left = left ?? null;
        this.right = right ?? null;
    }
}

//structuredClone strips the prototype off a cloned argument, and a solution that splices its
//input returns those plain objects — so every reader below walks fields, never instanceof
type ListLike = { val: number; next: ListLike | null } | null;
type TreeLike = { val: number; left: TreeLike | null; right: TreeLike | null } | null;

export const toList = (values: readonly number[]): ListNode | null => {
    let head: ListNode | null = null;

    for (let i = values.length - 1; i >= 0; i--) {
        head = new ListNode(values[i], head);
    }

    return head;
}

export const fromList = (any: unknown): number[] => {
    const values: number[] = [];

    let node = any as ListLike;
    while (node !== null && node !== undefined) {
        values.push(node.val);
        node = node.next;
    }

    return values;
}

//level order, `null` for a missing child, as LeetCode prints it
export const toTree = (values: readonly (number | null)[]): TreeNode | null => {
    if (values.length === 0 || values[0] === null) return null;

    const root = new TreeNode(values[0]);
    const queue: TreeNode[] = [root];
    let index = 1;

    while (queue.length > 0 && index < values.length) {
        const node = queue.shift()!;

        const left = values[index++];
        if (left !== null && left !== undefined) {
            node.left = new TreeNode(left);
            queue.push(node.left);
        }

        const right = values[index++];
        if (right !== null && right !== undefined) {
            node.right = new TreeNode(right);
            queue.push(node.right);
        }
    }

    return root;
}

export const fromTree = (any: unknown): (number | null)[] => {
    const root = any as TreeLike;
    if (root === null || root === undefined) return [];

    const values: (number | null)[] = [];
    const queue: TreeLike[] = [root];

    while (queue.length > 0) {
        const node = queue.shift()!;

        if (node === null || node === undefined) {
            values.push(null);
            continue;
        }

        values.push(node.val);
        queue.push(node.left, node.right);
    }

    //LeetCode omits the trailing nulls under the last row of leaves
    while (values.length > 0 && values[values.length - 1] === null) values.pop();

    return values;
}
