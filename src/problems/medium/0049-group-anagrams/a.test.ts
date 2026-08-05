import { solve } from '#utils/testUtil.ts';
import { groupAnagrams } from './a.ts';

solve('49. Group Anagrams', { groupAnagrams }, [
    //unordered inferred from "in any order" in the statement
    { args: [['eat', 'tea', 'tan', 'ate', 'nat', 'bat']], expected: [['bat'], ['nat', 'tan'], ['ate', 'eat', 'tea']], compare: 'unordered' },
    { args: [['']], expected: [['']], compare: 'unordered' },
    { args: [['a']], expected: [['a']], compare: 'unordered' },
]);
