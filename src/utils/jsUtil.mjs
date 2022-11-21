import { strCompareAs } from "./strUtil.mjs";

export const vTypeOf = (any) => {
    if (any === null || any === undefined) return 'undefined';
    if (any !== any) return 'nan';

    if (Array.isArray(any)) return 'array';

    return typeof any;
}