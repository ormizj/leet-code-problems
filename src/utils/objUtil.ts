import { vTypeOf } from "./jsUtil.ts";
import type { VType } from "./jsUtil.ts";
import { mapSize } from "./mapUtil.ts";
import { strCompareAs } from "./strUtil.ts";

export const arrObjEqual = (any: unknown, oAny: unknown): boolean => {
    if (any === oAny) return true;
    const type = vTypeOf(any);
    const oType = vTypeOf(oAny);

    if (type !== oType) return false;
    if (type === 'array') return arrEqualHelper(any as unknown[], oAny as unknown[]);
    if (type === 'object') return objEqualHelper(any as Obj, oAny as Obj);

    return strCompareAs(any, oAny);
}

type Obj = Record<string, unknown>;

const arrEqualHelper = (arr: unknown[], oArr: unknown[]): boolean => {
    if (arr.length !== oArr.length) return false;

    for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        const oElement = oArr[index];
        const type = vTypeOf(element);

        if (type !== vTypeOf(oElement)) return false;

        if (type === 'array') {
            if (!arrEqualHelper(element as unknown[], oElement as unknown[])) return false;
            continue;
        }

        if (type === 'object') {
            if (!objEqualHelper(element as Obj, oElement as Obj)) return false;
            continue;
        }

        if (!strCompareAs(element, oElement)) {
            return false
        }
    }

    return true;
}

const objEqualHelper = (obj: Obj, oObj: Obj): boolean => {
    if (mapSize(obj) !== mapSize(oObj)) return false;

    for (const key in obj) {
        if (!Object.hasOwn(obj, key)) continue;
        if (!Object.hasOwn(oObj, key)) return false;

        if (!arrObjEqual(obj[key], oObj[key])) return false;
    }

    return true;
}

export const getProtoAttr = (any: object, attrType?: VType): string[] => {
    const properties = new Set<string>();
    let protoCurr = Object.getPrototypeOf(any);

    while (protoCurr) {
        Object.getOwnPropertyNames(protoCurr)
            .map(attr => properties.add(attr));

        protoCurr = Object.getPrototypeOf(protoCurr);
    }

    const protoList = [...properties.keys()];

    if (attrType === undefined) return protoList;
    return protoList.filter(attr => vTypeOf((any as Obj)[attr]) === attrType);
}
