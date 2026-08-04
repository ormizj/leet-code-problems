export const numToDigits = (num: number = 0): number[] => {
    let digits: number[] = [];

    do {
        digits.push(num % 10);
        num = Math.trunc(num / 10);
    } while (num > 0)

    return digits;
}
