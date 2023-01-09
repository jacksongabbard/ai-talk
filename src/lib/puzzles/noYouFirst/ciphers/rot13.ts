import { hasOwnProperty } from '../../../hasOwnProperty';

// This is a kinda hacky rot13 -- I'm rotating by 1/2 of the radix which means
// for numbers, it's a smaller rot. Meh.  Also, for punctuation, I'm doing rot13
// based on the ascii table

const charToRot13Map = {
  a: 'n',
  b: 'o',
  c: 'p',
  d: 'q',
  e: 'r',
  f: 's',
  g: 't',
  h: 'u',
  i: 'v',
  j: 'w',
  k: 'x',
  l: 'y',
  m: 'z',
  n: 'a',
  o: 'b',
  p: 'c',
  q: 'd',
  r: 'e',
  s: 'f',
  t: 'g',
  u: 'h',
  v: 'i',
  w: 'j',
  x: 'k',
  y: 'l',
  z: 'm',
  '0': '5',
  '1': '6',
  '2': '7',
  '3': '8',
  '4': '9',
  '5': '0',
  '6': '1',
  '7': '2',
  '8': '3',
  '9': '4',
  '.': ';',
  '-': ':',
  '\n': '\n',
  ' ': '-',
};

export function toRot13(input: string): string {
  const output = [];
  for (let i = 0; i < input.length; i++) {
    if (hasOwnProperty(charToRot13Map, input[i])) {
      output.push(charToRot13Map[input[i]]);
    } else {
      output.push(input[i]);
    }
  }
  return output.join('');
}
const rot13ToCharMap = {
  n: 'a',
  o: 'b',
  p: 'c',
  q: 'd',
  r: 'e',
  s: 'f',
  t: 'g',
  u: 'h',
  v: 'i',
  w: 'j',
  x: 'k',
  y: 'l',
  z: 'm',
  a: 'n',
  b: 'o',
  c: 'p',
  d: 'q',
  e: 'r',
  f: 's',
  g: 't',
  h: 'u',
  i: 'v',
  j: 'w',
  k: 'x',
  l: 'y',
  m: 'z',
  '5': '0',
  '6': '1',
  '7': '2',
  '8': '3',
  '9': '4',
  '0': '5',
  '1': '6',
  '2': '7',
  '3': '8',
  '4': '9',
  ';': '.',
  ':': '-',
  '\n': '\n',
  '-': ' ',
};

export function fromRot13(input: string): string {
  const output = [];
  for (let i = 0; i < input.length; i++) {
    if (hasOwnProperty(rot13ToCharMap, input[i])) {
      output.push(rot13ToCharMap[input[i]]);
    } else {
      output.push(input[i]);
    }
  }
  return output.join('');
}
