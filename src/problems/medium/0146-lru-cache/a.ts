export class LRUCache {
    #cache: Map<number, number> = new Map();
    readonly #capacity: number;

    constructor(capacity: number) {
        this.#capacity = capacity;
    }

    get(key: number): number {
        const value = this.#cache.get(key);
        if (value === undefined) return -1;
        this.#touch(key, value);
        return value;
    }

    put(key: number, value: number): void {
        if (!this.#cache.has(key) && this.#cache.size >= this.#capacity) {
            const firstKey = this.#cache.keys().next().value;
            this.#cache.delete(firstKey!);
        }
        this.#touch(key, value);
    }

    #touch(key: number, value: number) {
        this.#cache.delete(key);
        this.#cache.set(key, value);
    }
}

/**
 * Your LRUCache object will be instantiated and called as such:
 * var obj = new LRUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */
