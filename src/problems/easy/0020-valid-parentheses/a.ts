/**
 * @param {string} s
 * @return {boolean}
 */
export const validParentheses = function (s: string): boolean {
    const queue: string[] = [];
    const openParentheses: Record<string, boolean> = {
        '(': true,
        '{': true,
        '[': true,
    };
    const parenthesesMap: Record<string, string> = {
        ')': '(',
        ']': '[',
        '}': '{'
    };

    for (const el of s) {
        if (openParentheses[el]) {
            queue.push(el);
            continue;
        }
        const lastEl = queue.pop();
        if (parenthesesMap[el] !== lastEl) return false;
    }
    return queue.length === 0;
};
