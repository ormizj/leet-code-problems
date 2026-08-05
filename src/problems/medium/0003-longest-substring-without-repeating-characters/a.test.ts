import { solve } from '#utils/testUtil.ts';
import { lengthOfLongestSubstring } from './a.ts';

solve('3. Longest Substring Without Repeating Characters', { lengthOfLongestSubstring }, [
    { args: ['abcabcbb'], expected: 3 },
    { args: ['bbbbb'], expected: 1 },
    { args: ['pwwkew'], expected: 3 },
]);
