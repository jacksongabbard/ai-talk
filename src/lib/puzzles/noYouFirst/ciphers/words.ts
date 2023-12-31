import { hasOwnProperty } from '../../../hasOwnProperty';

const charToWordMap = {
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
  a: 'eh',
  b: 'bee',
  c: 'cee',
  d: 'dee',
  e: 'eeee',
  f: 'eff',
  g: 'gee',
  h: 'aitch',
  i: 'aye',
  j: 'jay',
  k: 'kay',
  l: 'elle',
  m: 'em',
  n: 'en',
  o: 'oh',
  p: 'pea',
  q: 'cue',
  r: 'are',
  s: 'ess',
  t: 'tea',
  u: 'you',
  v: 'vee',
  w: 'youyou',
  x: 'ex',
  y: 'why',
  z: 'zee',
  '.': 'period',
  '-': 'hyphen',
  ':': 'colon',
  ';': 'semicolon',
  ' ': 'space',
  '\n': 'return',
};

export function toWords(input: string): string {
  const output = [];
  for (let i = 0; i < input.length; i++) {
    if (hasOwnProperty(charToWordMap, input[i])) {
      output.push(charToWordMap[input[i]]);
    } else {
      output.push(input[i]);
    }
  }

  return output.join(' ');
}

const wordToCharMap = {
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
  eh: 'a',
  bee: 'b',
  cee: 'c',
  dee: 'd',
  eeee: 'e',
  eff: 'f',
  gee: 'g',
  aitch: 'h',
  aye: 'i',
  jay: 'j',
  kay: 'k',
  elle: 'l',
  em: 'm',
  en: 'n',
  oh: 'o',
  pea: 'p',
  cue: 'q',
  are: 'r',
  ess: 's',
  tea: 't',
  you: 'u',
  vee: 'v',
  youyou: 'w',
  ex: 'x',
  why: 'y',
  zee: 'z',
  colon: ':',
  semicolon: ';',
  period: '.',
  hyphen: '-',
  space: ' ',
  return: '\n',
};

export function fromWords(input: string): string {
  const output = [];
  const parts = input.split(' ');
  for (const part of parts) {
    if (hasOwnProperty(wordToCharMap, part)) {
      output.push(wordToCharMap[part]);
    } else {
      output.push(part);
    }
  }

  return output.join('');
}
