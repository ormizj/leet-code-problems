import { solve } from '#utils/testUtil.ts';
import { validParentheses } from './a.ts';

solve('20. Valid Parentheses', { validParentheses }, [
    { args: ["()"], expected: true, skip: false },
    { args: ["()[]{}"], expected: true, skip: false },
    { args: ["(]"], expected: false, skip: false },
    { args: ["([])"], expected: true, skip: false },
    { args: ["([)]"], expected: false, skip: false },
]);
