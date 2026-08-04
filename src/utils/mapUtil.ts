export const mapForIn = <T>(map: Record<string, T>, cb: (value: T, key: string) => void): void => {
    for (const key in map) {
        if (Object.hasOwn(map, key)) {
            const value = map[key] as T;
            cb(value, key);
        }
    }
}

export const mapSize = (map: Record<string, unknown>): number => {
    let size = 0;
    mapForIn(map, () => size++);
    return size;
}
