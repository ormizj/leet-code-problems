/**
 * @param {character[][]} grid
 * @return {number}
 */
export const numIslands = function (grid: string[][]): number {
    let islandCount: number = 0;
    const visited: Set<string> = new Set();

    const traverse = (i: number, j: number): void => {
        const value: string | undefined = grid[i]?.[j];
        if (value === undefined) return;

        if (visited.has(`${i}-${j}`)) {
            return;
        }
        visited.add(`${i}-${j}`);

        if (value === '1') {
            traverse(i + 1, j)
            traverse(i - 1, j)
            traverse(i, j + 1)
            traverse(i, j - 1)
        }
    }

    for (let i = 0; i < grid.length; i++) {
        const xAxis = grid[i];
        for (let j = 0; j < xAxis.length; j++) {
            if (visited.has(`${i}-${j}`)) {
                continue;
            }

            const value: string = grid[i][j];
            if (value === "1") {
                islandCount++;
                traverse(i, j);
            }
        }
    }

    return islandCount;
};

