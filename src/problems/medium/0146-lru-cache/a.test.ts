import { solve, drive } from '#utils/testUtil.ts';
import { LRUCache } from './a.ts';

solve('146. LRU Cache', { LRUCache: drive(LRUCache) }, [
    { args: [['LRUCache', 'put', 'put', 'get', 'put', 'get', 'put', 'get', 'get', 'get'], [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]], expected: [null, null, null, 1, null, -1, null, -1, 3, 4], name: 'example 1' },
    { args: [['LRUCache', 'put', 'put', 'put', 'get', 'get'], [[2], [1, 1], [2, 2], [2, 20], [1], [2]]], expected: [null, null, null, null, 1, 20], name: 'put on an existing key evicts nothing' },
    { args: [['LRUCache', 'put', 'put', 'put', 'put', 'put', 'get', 'get'], [[3], [1, 1], [2, 2], [1, 10], [3, 3], [4, 4], [1], [2]]], expected: [null, null, null, null, null, null, 10, -1], name: 'put counts as a use' },
    { args: [['LRUCache', 'put', 'get'], [[2], [1, 0], [1]]], expected: [null, null, 0], name: 'a stored 0 is not a miss' },
]);
