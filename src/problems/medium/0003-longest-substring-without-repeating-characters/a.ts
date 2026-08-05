/**
 * @param {string} s
 * @return {number}
 */
export const lengthOfLongestSubstring = function (s: string): number {
    let longest: number = 0;

    let found = new Map<string, true>();
    for (let i = 0; i < s.length; i++) {

        let fast = i;
        while (fast < s.length) {
            const el = s[fast];
            if (found.has(el)) {
                found.clear();
                longest = Math.max(longest, i - fast);
                break;
            }

            found.set(el, true);
            fast++;
        }
    }

    return longest;
};
