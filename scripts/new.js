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

const [id, slug, difficulty = 'easy'] = process.argv.slice(2);

const usage = 'Usage: npm run new -- <id> <kebab-case-slug> [easy|medium|hard]';

if (id === undefined || slug === undefined) {
    console.error(usage);
    process.exit(1);
}

if (!/^\d+$/.test(id)) {
    console.error(`Invalid id: ${id}\n${usage}`);
    process.exit(1);
}

if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    console.error(`Invalid slug: ${slug} — use kebab-case, e.g. two-sum\n${usage}`);
    process.exit(1);
}

const known = ['easy', 'medium', 'hard'];
if (!known.includes(difficulty)) {
    console.error(`Invalid difficulty: ${difficulty} — expected ${known.join(', ')}\n${usage}`);
    process.exit(1);
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
console.log(`\nRun it with: npm run t -- ${Number(id)}`);
