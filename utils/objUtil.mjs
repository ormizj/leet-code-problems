export const objForIn = (obj, cb) => {
    for (const key in obj) {
        if (Object.hasOwn(obj, key)) {
            const value = obj[key];
            cb(value, key);
        }
    }
}

export const objSize = (obj) => {
    let size = 0
    for (const _ in obj) {
        if (Object.hasOwn(obj, _)) {
            size++;
        }
    }
    return size;
}