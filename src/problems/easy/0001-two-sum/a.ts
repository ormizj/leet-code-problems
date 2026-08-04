/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
export const twoSum = function (nums: number[], target: number): number[] | undefined {
    const foundNums: Record<number, number> = {};

    for (let i = 0; i < nums.length; i++) {
        const numTarget = target - nums[i];

        if (foundNums[numTarget] !== undefined) {
            return [foundNums[numTarget], i];
        }

        foundNums[nums[i]] = i;
    }
};
