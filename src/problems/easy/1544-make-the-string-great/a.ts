/**
 * @param {string} s
 * @return {string}
 */
export const makeGood = function (s: string): string {
    for (let i = 0; i < s.length - 1; i++) {
        if (isSameLetter(s[i], s[i + 1]) && s[i] !== s[i + 1]) {
            s = removeByIndex(s, i, 2);
            i = -1;
        }
    }

    return s;
};

const isSameLetter = (char: string, oChar: string) => char.toLowerCase() === oChar.toLowerCase();

const removeByIndex = (str: string, index: number, count: number) => str.slice(0, index) + str.slice(index + count);
