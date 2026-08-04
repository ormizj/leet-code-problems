const arrCompare = (any: unknown, oAny: unknown): number => {
    if (typeof any === 'number' && typeof oAny === 'number') return any - oAny;

    const str = `${any}`;
    const oStr = `${oAny}`;
    if (str < oStr) return -1;
    if (str > oStr) return 1;
    return 0;
}

export const arrSortedCopy = <T>(arr: readonly T[]): T[] => [...arr].sort(arrCompare);

//sorts nested arrays before the outer one, so [[3,1],[2]] and [[2],[1,3]] normalize alike
export const arrDeepSortedCopy = <T>(arr: readonly T[]): T[] =>
    arrSortedCopy(arr.map((item) => (Array.isArray(item) ? arrDeepSortedCopy(item) : item)) as T[]);
