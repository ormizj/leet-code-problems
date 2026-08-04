import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { findProblems, formatProblem, printProblems, testFileName } from './problems.js';

const argv = process.argv.slice(2);
const flags = argv.filter((arg) => arg.startsWith('-'));
const queries = argv.filter((arg) => !arg.startsWith('-'));

const fail = (message) => {
    console.error(message);
    console.error('\nAvailable problems:');
    printProblems(console.error);
    process.exit(1);
}

if (queries.length === 0) {
    fail('Usage: npm run t -- <id|slug> [--watch]');
}

//dedupe by directory, so "npm run t -- 1 two-sum" runs the problem once
const matched = [
    ...new Map(
        queries
            .flatMap(findProblems)
            .map((problem) => [problem.dir, problem])
    ).values(),
];

if (matched.length === 0) {
    fail(`No problem matched: ${queries.join(', ')}`);
}

const runnable = matched.filter((problem) => existsSync(problem.testFile));

for (const problem of matched) {
    if (!runnable.includes(problem)) {
        console.error(`skipping ${formatProblem(problem)} — no ${testFileName}`);
    }
}

if (runnable.length === 0) {
    console.error(`\nNothing to run: no ${testFileName} in any matched problem.`);
    process.exit(1);
}

if (runnable.length > 1) {
    console.log(`Matched ${runnable.length} problems:`);
    for (const problem of runnable) console.log(`  ${formatProblem(problem)}`);
    console.log('');
}

const { status } = spawnSync(
    process.execPath,
    ['--test', ...flags, ...runnable.map((problem) => problem.testFile)],
    { stdio: 'inherit' }
);

process.exit(status ?? 1);
