import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import {
    problemsRoot,
    testFileName,
    answerFileName,
    questionFileName,
    padId,
    listDifficulties,
} from './problems.js';

//difficulty comes from the script name (new:easy), the rest from the caller
const [difficulty, id, slug] = process.argv.slice(2);

const known = ['easy', 'medium', 'hard'];
const usage = `Usage: npm run new:<${known.join('|')}> <id> <kebab-case-slug>
Example: npm run new:medium 2 add-two-numbers`;

const reject = (message) => {
    console.error(`${message}\n\n${usage}`);
    process.exit(1);
}

if (!known.includes(difficulty)) {
    reject(`Missing or unknown difficulty: ${difficulty ?? '(none)'}`);
}

if (id === undefined) reject('Missing <id>');
if (slug === undefined) reject('Missing <kebab-case-slug>');

if (!/^\d+$/.test(id)) {
    reject(`Invalid id: ${id} — expected digits only`);
}

if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    reject(`Invalid slug: ${slug} — use kebab-case, e.g. two-sum`);
}

const camelCase = (kebab) =>
    kebab.replace(/-(.)/g, (_, char) => char.toUpperCase());

const titleCase = (kebab) =>
    kebab.split('-').map((word) => `${word[0].toUpperCase()}${word.slice(1)}`).join(' ');

const dir = join(problemsRoot, difficulty, `${padId(id)}-${slug}`);

if (existsSync(dir)) {
    console.error(`Already exists: ${dir}`);
    process.exit(1);
}

//the same problem may already live under another difficulty
for (const tier of listDifficulties()) {
    const other = join(problemsRoot, tier, `${padId(id)}-${slug}`);
    if (existsSync(other)) {
        console.error(`Already exists under a different difficulty: ${other}`);
        process.exit(1);
    }
}

const name = camelCase(slug);
const title = `${Number(id)}. ${titleCase(slug)}`;

const question = `# ${title}

https://leetcode.com/problems/${slug}/

<!-- paste the problem statement here -->
`;

const answer = `/**
 * @param {*} input
 * @return {*}
 */
export const ${name} = function (input) {

};
`;

const test = `import { solve } from '#utils/testUtil.ts';
import { ${name} } from './${answerFileName}';

solve('${title}', { ${name} }, [
    { args: [], expected: undefined, skip: true },
]);
`;

mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, questionFileName), question);
writeFileSync(join(dir, answerFileName), answer);
writeFileSync(join(dir, testFileName), test);

console.log(`Created ${dir}`);
console.log(`  ${questionFileName}  ${answerFileName}  ${testFileName}`);
console.log(`\nRun it with: npm run solve ${Number(id)}`);
