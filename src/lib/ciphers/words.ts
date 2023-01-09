import { hasOwnProperty } from '../hasOwnProperty';

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
  A: 'EH',
  B: 'BEE',
  C: 'CEE',
  D: 'DEE',
  E: 'EEEE',
  F: 'EFF',
  G: 'GEE',
  H: 'AITCH',
  I: 'AYE',
  J: 'JAY',
  K: 'KAY',
  L: 'ELLE',
  M: 'EM',
  N: 'EN',
  O: 'OH',
  P: 'PEA',
  Q: 'CUE',
  R: 'ARE',
  S: 'ESS',
  T: 'TEA',
  U: 'YOU',
  V: 'VEE',
  W: 'YOUYOU',
  X: 'EX',
  Y: 'WHY',
  Z: 'ZEE',
  '.': 'dot',
  '-': 'dash',
  ' ': 'space',
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
  EH: 'A',
  BEE: 'B',
  CEE: 'C',
  DEE: 'D',
  EEEE: 'E',
  EFF: 'F',
  GEE: 'G',
  AITCH: 'H',
  AYE: 'I',
  JAY: 'J',
  KAY: 'K',
  ELLE: 'L',
  EM: 'M',
  EN: 'N',
  OH: 'O',
  PEA: 'P',
  CUE: 'Q',
  ARE: 'R',
  ESS: 'S',
  TEA: 'T',
  YOU: 'U',
  VEE: 'V',
  YOUYOU: 'W',
  EX: 'X',
  WHY: 'Y',
  ZEE: 'Z',
  dot: '.',
  dash: '-',
  space: ' ',
};

export function toChars(input: string): string {
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
