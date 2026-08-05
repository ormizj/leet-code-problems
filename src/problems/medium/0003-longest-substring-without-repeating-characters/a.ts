/**
 * @param {string} s
 * @return {number}
 */
export const lengthOfLongestSubstring = function (s: string): number {
    let longest: number = 0;

    let found = new Map<string, true>();
    let slow: number = 0;
    let fast: number = 0;
    for (let i = 0; i < s.length; i++) {
        const el = s[i];

        while (!found.has(el)) {

        }
    }

    return longest;
};
