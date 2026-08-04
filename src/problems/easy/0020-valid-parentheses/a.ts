/**
 * @param {string} s
 * @return {boolean}
 */
export const validParentheses = function (s: string): boolean {
    s = s as '[' | '{' | '(';
    const queue = [];
    const openParentheses = {
        '(': true,
        '{': true,
        '[': true,
    };
    const parenthesesMap = {
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
