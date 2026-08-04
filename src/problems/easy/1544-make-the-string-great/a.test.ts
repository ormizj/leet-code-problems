import { solve } from '#utils/testUtil.ts';
import { makeGood } from './a.ts';

solve('1544. Make The String Great', { makeGood }, [
    { args: ['leEeetcode'], expected: 'leetcode' },
    { args: ['abBAcC'], expected: '' },
    { args: ['s'], expected: 's' },
]);
