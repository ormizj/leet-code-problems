import chalk from 'chalk';
import { arrObjEqual } from '#utils/objUtil.ts';
import { vTypeOf } from '#utils/jsUtil.ts';
import { mapForIn, mapSize } from '#utils/mapUtil.ts';
import { strCompareAs } from '#utils/strUtil.ts';

export type AnswerCb = (...args: any[]) => unknown;

export type PrintResultOptions = {
    answerCb: AnswerCb;
    expected: unknown;
    input?: Record<string, unknown>;
    isOrder?: boolean;
};

const space = `    `;
const dash = `----------`;
const start = chalk.green(`START`);
const end = chalk.green(`END`);

//prints, printing start on import
console.log(`\n${space}${dash}${start}${dash}\n`);
export const printEnd = () => setTimeout(() => console.log(`${space}${dash}-${end}-${dash}\n`));

export const printResult = ({ answerCb, expected, input = {}, isOrder = false }: PrintResultOptions) => {
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

const runAnswer = (input: Record<string, unknown> = {}, answerCb: AnswerCb): unknown => {
    const inputValues = Object.values(input);
    return answerCb.apply(null, inputValues);
}

const beautifyJson = (json: Record<string, unknown>): string => {
    let beautifiedJson = ``;
    const jsonLength = mapSize(json);

    let index = 1;
    mapForIn(json, (value, key) => {
        beautifiedJson += `[${key}: ${value}]`;

        if (index < jsonLength) {
            beautifiedJson += ` ${chalk.yellow('|')} `;
            index++;
        }
    });

    return beautifiedJson;
}

type CalculateAnswerOptions = {
    expected: unknown;
    actual: unknown;
    isOrder?: boolean;
};

//TODO add order
const calculateAnswer = ({ expected, actual, isOrder = false }: CalculateAnswerOptions): boolean => {
    const type = vTypeOf(expected);

    if (type === 'array') {
        return arrObjEqual(expected, actual);
    }

    return strCompareAs(expected, actual);
}
