import chalk from 'chalk';
import { arrEqual } from './arrUtil.mjs';
import { vTypeOf } from './jsUtil.mjs';
import { objForIn, objSize } from './objUtil.mjs';
import { strCompareAs } from './strUtil.mjs';

const space = `    `;
const dash = `----------`;
const start = chalk.green(`START`);

console.log(`\n${space}${dash}${start}${dash}`);

export const printResult = ({ answerCb, expected, input = {}, isOrder = false } = {}) => {
    const inputPrint = beautifyJson(input);
    const actual = runAnswer(input, answerCb);

    let answer;
    if (calculateAnswer({ expected, actual, isOrder })) {
        answer = chalk.blue(`Accepted`);
    }
    else {
        answer = chalk.red(`Wrong Answer`);
    }

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

//TODO add order
const calculateAnswer = ({ expected, actual, isOrder = false } = {}) => {
    const type = vTypeOf(expected);

    if (type === 'array') {
        return arrEqual(expected, actual);
    }

    return strCompareAs(expected, actual);
}