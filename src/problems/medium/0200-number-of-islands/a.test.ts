import { solve } from '#utils/testUtil.ts';
import { numIslands } from './a.ts';

solve('200. Number of Islands', { numIslands }, [
    { args: [[['1', '1', '1', '1', '0'], ['1', '1', '0', '1', '0'], ['1', '1', '0', '0', '0'], ['0', '0', '0', '0', '0']]], expected: 1 },
    { args: [[['1', '1', '0', '0', '0'], ['1', '1', '0', '0', '0'], ['0', '0', '1', '0', '0'], ['0', '0', '0', '1', '1']]], expected: 3 },
    { args: [[['1', '1', '1'], ['0', '0', '1'], ['1', '1', '1']]], expected: 1, name: 'c shape, connected only by bending back left' },
    { args: [[['1', '0', '1'], ['0', '1', '0'], ['1', '0', '1']]], expected: 5, name: 'diagonals are not adjacent' },
    { args: [[['1', '1', '1', '1', '1']]], expected: 1, name: 'single row' },
    { args: [[['1'], ['0'], ['1']]], expected: 2, name: 'single column' },
    { args: [[['1']]], expected: 1, name: 'single land cell' },
    { args: [[['0']]], expected: 0, name: 'single water cell' },
]);
