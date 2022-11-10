/**
 * @param {string} s
 * @return {string}
 */
const makeGood = function (s) {
    for (let i = 0; i < s.length - 1; i++) {
        if (isSameLetter(s[i], s[i + 1]) && s[i] !== s[i + 1]) {
            s = removeByIndex(s, i, 2);
            i = -1;
        }
    }

    return s;
};

const isSameLetter = (char, oChar) => char.toLowerCase() === oChar.toLowerCase();

const removeByIndex = (str, index, count) => str.slice(0, index) + str.slice(index + count);

import { printResult } from "../../../utils/answerUtil.mjs";
printResult(makeGood, ['leetcode'], { s: 'leEeetcode' });
printResult(makeGood, [''], { s: 'abBAcC' });
printResult(makeGood, ['s'], { s: 's' });
