/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
const twoSum = function (nums, target) {
    const foundNums = {};

    for (let i = 0; i < nums.length; i++) {
        const numTarget = target - nums[i];

        if (foundNums[numTarget] !== undefined) {
            return [foundNums[numTarget], i];
        }

        foundNums[nums[i]] = i;
    }
};



/*----------------------------------------------------------------------------------------------------*/
import { printResult } from "../../../utils/answerUtil.mjs";
printResult(twoSum, [0, 1], { nums: [2, 7, 11, 15], target: 9 });
printResult(twoSum, [1, 2], { nums: [3, 2, 4], target: 6 });
printResult(twoSum, [0, 1], { nums: [3, 3], target: 6 });
