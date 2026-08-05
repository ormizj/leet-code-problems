/**
 * @param {string} s
 * @return {number}
 *
 * can improve by using a map with the last index of a found letter
 */
export const lengthOfLongestSubstring = function (s: string): number {
    let longest: number = 0;

    const found = new Set<string>();
    let left = 0;
    let right = 0;
    while (right < s.length) {

        const el = s[right];
        if (found.has(el)) {
            while (s[left] !== el) {
                found.delete(s[left]);
                left++;
            }
            // left now reached the copy, so skip it
            left++;

        } else {
            found.add(el);
            longest = Math.max(longest, right + 1 - left);
        }

        right++;
    }

    return longest;
};


/**
 * @param {string} s
 * @return {number}
 */
export const lengthOfLongestSubstring2 = function (s: string): number {
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
