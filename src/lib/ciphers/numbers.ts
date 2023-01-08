import { hasOwnProperty } from '../hasOwnProperty';

const numberWordsMap = {
  '0': 'zero',
  '1': 'one',
  '2': 'two',
  '3': 'three',
  '4': 'four',
  '5': 'five',
  '6': 'six',
  '7': 'seven',
  '8': 'eight',
  '9': 'nine',
  '+': 'plus',
};

export function toNumberWords(input: string): string {
  const output = [];
  for (let i = 0; i < input.length; i++) {
    if (hasOwnProperty(numberWordsMap, input[i])) {
      output.push(numberWordsMap[input[i]] + ' ');
    } else {
      output.push(input[i]);
    }
  }

  return output.join('');
}

const wordsToNumbersMap = {
  zero: '0',
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
  plus: '+',
};

export function toNumberFromNumberWords(input: string): string {
  const output = [];
  const parts = input.split(' ');
  for (const part of parts) {
    if (hasOwnProperty(wordsToNumbersMap, part)) {
      output.push(wordsToNumbersMap[part] + ' ');
    } else {
      output.push(part);
    }
  }
  return output.join('');
}
