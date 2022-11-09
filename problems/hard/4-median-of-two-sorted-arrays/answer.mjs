// const printResult = require('../../../utils/answerUtil.mjs')
import { printResult } from "../../../utils/answerUtil.mjs";

/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function (nums1, nums2) {
    nums1.push(...nums2);
    nums1.sort((num1, num2) => num1 - num2);

    const halfLength = nums1.length / 2;

    if (nums1.length % 2 === 1) {
        return nums1[Math.floor(halfLength)];
    }
    return (nums1[halfLength - 1] + nums1[halfLength]) / 2;
};

printResult(findMedianSortedArrays, 2.00000, { nums1: [1, 3], nums2: [2] });
printResult(findMedianSortedArrays, 2.50000, { nums1: [1, 2], nums2: [3, 4] });