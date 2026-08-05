import { readFileSync } from 'node:fs';
import { printProblems, listProblems, harness } from './problems.js';

const { scripts = {} } = JSON.parse(readFileSync('package.json', 'utf8'));

//only the blurb lives here — the command list itself comes from package.json,
//so a script added there shows up even without a matching entry
const blurbs = {
    help: ['show this message', 'npm run help'],
    solve: ['run one problem, by id or slug', 'npm run solve 1'],
    'solve:watch': ['same, re-running on save', 'npm run solve:watch 1'],
    new: ['scaffold from a LeetCode url, cases included', 'npm run new <url>'],
    'new:easy': ['scaffold an empty problem folder', 'npm run new:easy 1 two-sum'],
    'new:medium': ['same, under medium/', 'npm run new:medium 2 add-two-numbers'],
    'new:hard': ['same, under hard/', 'npm run new:hard 4 median-of-two-sorted-arrays'],
    typecheck: ['type-check src and scripts', 'npm run typecheck'],
};

const names = Object.keys(scripts);
const width = Math.max(...names.map((name) => (blurbs[name]?.[1] ?? `npm run ${name}`).length));

console.log('\nleet-code — LeetCode solutions, one folder per problem\n');
console.log('Commands:');

for (const name of names) {
    const [blurb, example] = blurbs[name] ?? ['', `npm run ${name}`];
    console.log(`  ${example.padEnd(width)}  ${blurb}`);
}

console.log('');
console.log(`  ${`npm run solve ${harness.aliases[0]}`.padEnd(width)}  the checks for solve() itself`);

console.log('\nEach problem folder holds q.md (statement), a.ts (solutions) and a.test.ts (cases).');
console.log('a.ts exports every solution variant; solve() in a.test.ts runs all cases against all of them.\n');

console.log(`Problems (${listProblems().length}):`);
printProblems();
console.log('');
