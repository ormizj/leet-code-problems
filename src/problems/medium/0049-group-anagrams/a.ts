/**
 * @param {string[]} strs
 * @return {string[][]}
 *
 * possible improvement hash map keyed by a 26-slot character
 * (no need to sort, only nested loop over the string)
 */
export const groupAnagrams = function (strs: string[]): string[][] {
    const anagrams: string[][] = [];
    const anagramMap = new Map<string, number>();

    for (let str of strs) {
        const sorted = str.split('').sort().join();
        if (!anagramMap.has(sorted)) {
            anagrams.push([str]);
            anagramMap.set(sorted, anagrams.length - 1);
        } else {
            const index = anagramMap.get(sorted)!;
            anagrams[index].push(str);
        }
    }

    return anagrams;
};
