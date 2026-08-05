import { readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export const problemsRoot = 'src/problems';
export const testFileName = 'a.test.ts';
export const answerFileName = 'a.ts';
export const questionFileName = 'q.md';
export const idWidth = 4;

//not a problem, but worth being able to run the same way
export const harness = {
    aliases: ['harness', 'testutil'],
    testFile: join('src', 'utils', 'testUtil.test.ts'),
};

export const padId = (id) => `${Number(id)}`.padStart(idWidth, '0');

const dirsIn = (path) =>
    existsSync(path)
        ? readdirSync(path, { withFileTypes: true })
            .filter((entry) => entry.isDirectory())
            .map((entry) => entry.name)
        : [];

export const listDifficulties = () => dirsIn(problemsRoot);

export const listProblems = () => {
    const problems = [];

    for (const difficulty of listDifficulties()) {
        for (const name of dirsIn(join(problemsRoot, difficulty))) {
            const match = /^(\d+)-(.+)$/.exec(name);
            if (match === null) continue;

            const dir = join(problemsRoot, difficulty, name);
            problems.push({
                id: Number(match[1]),
                slug: match[2],
                difficulty,
                dir,
                testFile: join(dir, testFileName),
            });
        }
    }

    return problems.sort((problem, oProblem) => problem.id - oProblem.id);
}

//matches on the leetcode id first (so "1" and "0001" both hit), then on a slug substring
export const findProblems = (query) => {
    const problems = listProblems();

    if (/^\d+$/.test(query)) {
        const byId = problems.filter((problem) => problem.id === Number(query));
        if (byId.length > 0) return byId;
    }

    const needle = query.toLowerCase();
    return problems.filter((problem) => problem.slug.toLowerCase().includes(needle));
}

export const formatProblem = (problem) =>
    `${padId(problem.id)}-${problem.slug} (${problem.difficulty})`;

export const printProblems = (log = console.log) => {
    const problems = listProblems();

    if (problems.length === 0) {
        log('  no problems yet — run: npm run new <leetcode-url>');
        return;
    }

    for (const difficulty of listDifficulties()) {
        const inTier = problems.filter((problem) => problem.difficulty === difficulty);
        if (inTier.length === 0) continue;

        log(`  ${difficulty} (${inTier.length})`);
        for (const problem of inTier) {
            log(`    ${padId(problem.id)}  ${problem.slug}`);
        }
    }
}
