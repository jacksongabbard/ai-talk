import { hasOwnProperty } from '../../../hasOwnProperty';

const charToAtbashMap = {
  a: 'z',
  b: 'y',
  c: 'x',
  d: 'w',
  e: 'v',
  f: 'u',
  g: 't',
  h: 's',
  i: 'r',
  j: 'q',
  k: 'p',
  l: 'o',
  m: 'n',
  n: 'm',
  o: 'l',
  p: 'k',
  q: 'j',
  r: 'i',
  s: 'h',
  t: 'g',
  u: 'f',
  v: 'e',
  w: 'd',
  x: 'c',
  y: 'b',
  z: 'a',
  '0': '9',
  '1': '8',
  '2': '7',
  '3': '6',
  '4': '5',
  '5': '4',
  '6': '3',
  '7': '2',
  '8': '1',
  '9': '0',
  '.': '.',
  '-': '-',
  '\n': '\n',
  ' ': ' ',
  ':': ':',
  ';': ';',
};

export function toAtbash(input: string): string {
  const output = [];
  for (let i = 0; i < input.length; i++) {
    if (hasOwnProperty(charToAtbashMap, input[i])) {
      output.push(charToAtbashMap[input[i]]);
    } else {
      output.push(input[i]);
    }
  }
  return output.join('');
}
const atbashToCharMap = {
  z: 'a',
  y: 'b',
  x: 'c',
  w: 'd',
  v: 'e',
  u: 'f',
  t: 'g',
  s: 'h',
  r: 'i',
  q: 'j',
  p: 'k',
  o: 'l',
  n: 'm',
  m: 'n',
  l: 'o',
  k: 'p',
  j: 'q',
  i: 'r',
  h: 's',
  g: 't',
  f: 'u',
  e: 'v',
  d: 'w',
  c: 'x',
  b: 'y',
  a: 'z',
  '9': '0',
  '8': '1',
  '7': '2',
  '6': '3',
  '5': '4',
  '4': '5',
  '3': '6',
  '2': '7',
  '1': '8',
  '0': '9',
  '.': '.',
  '-': '-',
  '\n': '\n',
  ' ': ' ',
  ':': ':',
  ';': ';',
};

export function fromAtbash(input: string): string {
  const output = [];
  for (let i = 0; i < input.length; i++) {
    if (hasOwnProperty(atbashToCharMap, input[i])) {
      output.push(atbashToCharMap[input[i]]);
    } else {
      output.push(input[i]);
    }
  }
  return output.join('');
}
