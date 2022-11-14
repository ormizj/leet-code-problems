import { strCompareAs } from "./strUtil.mjs";

export const vTypeOf = (any) => {
    if (any === null || any === undefined) return 'undefined';
    if (any !== any) return 'nan';

    if (Array.isArray(any)) return 'array';

    return typeof any;
}

//TODO finish
export const arrObjEqual = (any, oAny) => {
    if (any === oAny) return true;
    const type = vTypeOf(any);
    const oType = vTypeOf(oAny);

    if (type !== oType) return false;
    if (type === 'array') return arrEqualHelper(any, oAny);
    if (type === 'object') return objEqualHelper(any, oAny);

    console.error(`arrObjEqual: Equal type not accounted for!`);
}

//TODO finish
const arrEqualHelper = (arr, oArr) => {
    for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        const oElement = oArr[index];

        if (vTypeOf(element) === 'array') {
            if (vTypeOf(oElement) !== 'array') return false;
            return arrEqualHelper(element, oElement);
        }

        if (vTypeOf(element) === 'object') {
            if (vTypeOf(oElement) !== 'object') return false;
            return arrEqualHelper(element, oElement);
        }


        if (!strCompareAs(element, oElement)) {
            return false
        }
    }

    return true;
}

//TODO finish
const objEqualHelper = (obj, oObj) => {
}

export const getProtoAttr = (any, attrType) => {
    const properties = new Set();
    let protoCurr = Object.getPrototypeOf(any);

    while (protoCurr) {
        Object.getOwnPropertyNames(protoCurr)
            .map(attr => properties.add(attr));

        protoCurr = Object.getPrototypeOf(protoCurr);
    }

    protoList = [...properties.keys()];

    if (type === undefined) return protoList;
    return protoList.filter(attr => vTypeOf(any[attr]) === attrType);
}