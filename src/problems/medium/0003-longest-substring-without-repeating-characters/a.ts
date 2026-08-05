/**
 * @param {string} s
 * @return {number}
 */
export const lengthOfLongestSubstring = function (s: string): number {
    let longest: number = 0;

    let found = new Map<string, true>();
    for (let i = 0; i < s.length; i++) {

        let fast = i;
        found.clear();
        while (fast < s.length) {
            const el = s[fast];
            if (found.has(el)) break;

            found.set(el, true);
            fast++;
        }

        longest = Math.max(longest, fast - i);
    }

    return longest;
};
