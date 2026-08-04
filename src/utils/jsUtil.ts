export type VType =
    | 'undefined'
    | 'array'
    | 'nan'
    | 'string'
    | 'number'
    | 'bigint'
    | 'boolean'
    | 'symbol'
    | 'object'
    | 'function';

export const vTypeOf = (any: unknown): VType => {
    if (any === null || any === undefined) return 'undefined';

    if (Array.isArray(any)) return 'array';

    if (any !== any) return 'nan';
    return typeof any;
}
