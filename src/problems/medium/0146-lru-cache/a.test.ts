import { solve, drive } from '#utils/testUtil.ts';
import { LRUCache } from './a.ts';

solve('146. LRU Cache', { LRUCache: drive(LRUCache) }, [
    { args: [['LRUCache', 'put', 'put', 'get', 'put', 'get', 'put', 'get', 'get', 'get'], [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]], expected: [null, null, null, 1, null, -1, null, -1, 3, 4], name: 'example 1' },
]);
