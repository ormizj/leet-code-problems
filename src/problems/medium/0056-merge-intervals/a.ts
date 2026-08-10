/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
export const merge = function (intervals: number[][]): number[][] {
    intervals.sort((a, b) => a[0] - b[0]);
    const res: number[][] = [intervals[0]];

    for (let i = 0; i < intervals.length; i++) {
        const newMin: number = intervals[i][0];
        const newMax: number = intervals[i][1]

        const resMin = res[res.length - 1][0];
        const resMax = res[res.length - 1][1];
        if (resMax >= newMin) {
            res[res.length - 1] = [resMin, Math.max(resMax, newMax)];
        } else {
            res.push([newMin, newMax]);
        }
    }

    return res;
};


/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
export const merge2 = function (intervals: number[][]): number[][] {
    const res: number[][] = [];
    const existingNumberSet: Set<number> = new Set<number>;

    const saveInterval = (interval: [number, number]) => {
        const numberStart = interval[0];
        const numberEnd = interval[1];

        let i = numberStart;
        while (i <= numberEnd) {
            existingNumberSet.add(i);
            i++;
        }
    }

    for (let i = 0; i < intervals.length; i++) {
        const row = intervals[i];
        for (let j = 0; j < row.length; j++) {
            const interval: [number, number] = row[j] as unknown as [number, number];
            saveInterval(interval);
        }
    }

    return res;
};

