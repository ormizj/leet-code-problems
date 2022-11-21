export const mapForIn = (map, cb) => {
    for (const key in map) {
        if (Object.hasOwn(map, key)) {
            const value = map[key];
            cb(value, key);
        }
    }
}

export const mapSize = (map) => {
    let size = 0;
    mapForIn(map, () => size++);
    return size;
}