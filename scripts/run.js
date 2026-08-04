import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { findProblems, formatProblem, printProblems, harness, testFileName } from './problems.js';

const argv = process.argv.slice(2);
const flags = argv.filter((arg) => arg.startsWith('-'));
const queries = argv.filter((arg) => !arg.startsWith('-'));

const usage = 'Usage: npm run solve <id|slug>   (or npm run solve:watch <id|slug>)';

const fail = (message) => {
    console.error(message);
    console.error('\nAvailable problems:');
    printProblems(console.error);
    console.error(`\n  ${harness.aliases[0].padEnd(4)}  the checks for solve() itself`);
    process.exit(1);
}

if (queries.length === 0) {
    fail(usage);
}

const resolve = (query) =>
    harness.aliases.includes(query.toLowerCase())
        ? [{ name: 'harness', testFile: harness.testFile }]
        : findProblems(query).map((problem) => ({ name: formatProblem(problem), testFile: problem.testFile }));

//dedupe by test file, so "npm run solve 1 two-sum" runs the problem once
const matched = [
    ...new Map(
        queries
            .flatMap(resolve)
            .map((target) => [target.testFile, target])
    ).values(),
];

if (matched.length === 0) {
    fail(`No problem matched: ${queries.join(', ')}`);
}

const runnable = matched.filter((target) => existsSync(target.testFile));

for (const target of matched) {
    if (!runnable.includes(target)) {
        console.error(`skipping ${target.name} — no ${testFileName}`);
    }
}

if (runnable.length === 0) {
    console.error(`\nNothing to run: no ${testFileName} in any match.`);
    process.exit(1);
}

if (runnable.length > 1) {
    console.log(`Matched ${runnable.length}:`);
    for (const target of runnable) console.log(`  ${target.name}`);
    console.log('');
}

const { status } = spawnSync(
    process.execPath,
    ['--test', ...flags, ...runnable.map((target) => target.testFile)],
    { stdio: 'inherit' }
);

process.exit(status ?? 1);
