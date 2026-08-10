/**
 * @param {character[][]} grid
 * @return {number}
 */
export const numIslands = function (grid: string[][]): number {
    let islandCount: number = 0;

    const sink = (i: number, j: number): void => {
        if (grid[i]?.[j] !== '1') return;

        grid[i][j] = '0';
        sink(i + 1, j);
        sink(i - 1, j);
        sink(i, j + 1);
        sink(i, j - 1);
    };

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === '1') {
                islandCount++;
                sink(i, j);
            }
        }
    }

    return islandCount;
};

/**
 * @param {character[][]} grid
 * @return {number}
 */
export const numIslands2 = function (grid: string[][]): number {
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

/**
 * @param {character[][]} grid
 * @return {number}
 */
export const numIslands3 = function (grid: string[][]): number {
    const rows: number = grid.length;
    const cols: number = grid[0].length;
    const directions: number[][] = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    let islandCount: number = 0;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (grid[row][col] !== '1') continue;

            islandCount++;
            grid[row][col] = '0';
            const queue: number[][] = [[row, col]];

            for (let head = 0; head < queue.length; head++) {
                const [r, c] = queue[head];
                for (const [dr, dc] of directions) {
                    const nr = r + dr;
                    const nc = c + dc;
                    if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
                    if (grid[nr][nc] !== '1') continue;

                    grid[nr][nc] = '0';
                    queue.push([nr, nc]);
                }
            }
        }
    }

    return islandCount;
};