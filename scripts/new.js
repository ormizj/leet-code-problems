import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import {
    problemsRoot,
    testFileName,
    answerFileName,
    questionFileName,
    padId,
    listDifficulties,
} from './problems.js';
import { toSlug, canonicalUrl, fetchQuestion, buildProblem } from './leetcode.js';

//with a difficulty the scaffold is empty and offline (the tier comes from the script name,
//new:easy); with a url everything — tier included — comes from leetcode
const [first, ...rest] = process.argv.slice(2);

const known = ['easy', 'medium', 'hard'];
const usage = `Usage: npm run new <leetcode-url>
       npm run new:<${known.join('|')}> <id> <kebab-case-slug>
Example: npm run new https://leetcode.com/problems/two-sum/
         npm run new:medium 2 add-two-numbers`;

const reject = (message) => {
    console.error(`${message}\n\n${usage}`);
    process.exit(1);
}

//best effort and never fatal — a machine with no clipboard tool still scaffolds fine
const copyToClipboard = (text) => {
    const tools = {
        darwin: [['pbcopy', []]],
        win32: [['clip', []]],
    }[process.platform] ?? [['wl-copy', []], ['xclip', ['-selection', 'clipboard']]];

    return tools.some(([tool, args]) => {
        const { error, status } = spawnSync(tool, args, { input: text });
        return error === undefined && status === 0;
    });
}

const camelCase = (kebab) =>
    kebab.replace(/-(.)/g, (_, char) => char.toUpperCase());

const titleCase = (kebab) =>
    kebab.split('-').map((word) => `${word[0].toUpperCase()}${word.slice(1)}`).join(' ');

//refuses to overwrite, including when the same problem already sits under another tier
const create = (difficulty, id, slug, files) => {
    const dir = join(problemsRoot, difficulty, `${padId(id)}-${slug}`);

    if (existsSync(dir)) {
        console.error(`Already exists: ${dir}`);
        process.exit(1);
    }

    for (const tier of listDifficulties()) {
        const other = join(problemsRoot, tier, `${padId(id)}-${slug}`);
        if (existsSync(other)) {
            console.error(`Already exists under a different difficulty: ${other}`);
            process.exit(1);
        }
    }

    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, questionFileName), files.question);
    writeFileSync(join(dir, answerFileName), files.answer);
    writeFileSync(join(dir, testFileName), files.test);

    const command = `npm run solve ${Number(id)}`;

    console.log(`Created ${dir}`);
    console.log(`  ${questionFileName}  ${answerFileName}  ${testFileName}`);
    console.log(`\nRun it with: ${command}${copyToClipboard(command) ? '  (copied to clipboard)' : ''}`);
}

const blank = (id, slug) => {
    const name = camelCase(slug);
    const title = `${Number(id)}. ${titleCase(slug)}`;

    return {
        question: `# ${title}

${canonicalUrl(slug)}

<!-- paste the problem statement here -->
`,
        //an explicit any keeps a fresh scaffold passing `npm run typecheck`;
        //replace it with the real signature from LeetCode's JSDoc
        answer: `/**
 * @param {*} input
 * @return {*}
 */
export const ${name} = function (input: any): any {

};
`,
        test: `import { solve } from '#utils/testUtil.ts';
import { ${name} } from './${answerFileName}';

solve('${title}', { ${name} }, [
    {
        args: [],
        expected: undefined,
        skip: false,
    },
]);
`,
    };
}

const fromUrl = async (input) => {
    const slug = toSlug(input);
    if (slug === null) reject(`Not a LeetCode problem URL: ${input}`);

    let problem;
    try {
        //everything is fetched and parsed before the first write, so a failure leaves no folder
        problem = buildProblem(await fetchQuestion(slug), canonicalUrl(slug));
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }

    create(problem.difficulty, problem.id, problem.slug, problem.files);

    for (const warning of problem.warnings) console.log(`  warning: ${warning}`);
}

if (known.includes(first)) {
    const [id, slug] = rest;

    if (id === undefined) reject('Missing <id>');
    if (slug === undefined) reject('Missing <kebab-case-slug>');

    if (!/^\d+$/.test(id)) {
        reject(`Invalid id: ${id} — expected digits only`);
    }

    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
        reject(`Invalid slug: ${slug} — use kebab-case, e.g. two-sum`);
    }

    create(first, id, slug, blank(id, slug));
} else if (first === undefined) {
    reject('Missing <leetcode-url>');
} else {
    await fromUrl(first);
}
