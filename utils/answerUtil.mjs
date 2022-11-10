import chalk from 'chalk';
import { objForIn, objSize } from './objUtil.mjs';

const space = `    `;
const dash = `----------`;
const start = chalk.green(`START`);

console.log(`\n${space}${dash}${start}${dash}`);

export const printResult = ({ answerCb, expected, input = {} } = {}) => {
    const inputPrint = beautifyJson(input);
    const actual = runAnswer(input, answerCb);

    let answer;
    if (`${expected}` === `${actual}`) answer = chalk.blue(`Accepted`);
    else answer = chalk.red(`Wrong Answer`);

    console.log(`${space}${answer}
    Input:    ${inputPrint}
    Output:   ${actual}
    Expected: ${expected}
    `);
}

const runAnswer = (input = {}, answerCb) => {
    const inputValues = Object.values(input);
    return answerCb.apply(null, inputValues);
}

const beautifyJson = (json) => {
    let beautifiedJson = ``;
    const jsonLength = objSize(json);

    let index = 1;
    objForIn(json, (value, key) => {
        beautifiedJson += `[${key}: ${value}]`;

        if (index < jsonLength) {
            beautifiedJson += ` ${chalk.yellow('|')} `;
            index++;
        }
    });

    return beautifiedJson;
}