import { hasOwnProperty } from '../../../hasOwnProperty';

const charToNatoMap = {
  a: 'alpha',
  b: 'bravo',
  c: 'charlie',
  d: 'delta',
  e: 'echo',
  f: 'foxtrot',
  g: 'golf',
  h: 'hotel',
  i: 'india',
  j: 'juliet',
  k: 'kilo',
  l: 'lima',
  m: 'mike',
  n: 'november',
  o: 'oscar',
  p: 'papa',
  q: 'quebec',
  r: 'romeo',
  s: 'sierra',
  t: 'tango',
  u: 'uniform',
  v: 'victor',
  w: 'whisky',
  x: 'xylophone',
  y: 'yankee',
  z: 'zulu',
  '1': 'wun',
  '2': 'too',
  '3': 'tree',
  '4': 'fower',
  '5': 'fife',
  '6': 'six',
  '7': 'seven',
  '8': 'ait',
  '9': 'niner',
  '0': 'ziro',
  '.': 'stop',
  '-': 'hyphen',
  '\n': 'return',
  ' ': 'space',
};

export function toNatoWords(input: string): string {
  const output = [];
  for (let i = 0; i < input.length; i++) {
    if (hasOwnProperty(charToNatoMap, input[i])) {
      output.push(charToNatoMap[input[i]]);
    } else {
      output.push(input[i]);
    }
  }
  return output.join(' ');
}

const natoToCharMap = {
  alpha: 'a',
  bravo: 'b',
  charlie: 'c',
  delta: 'd',
  echo: 'e',
  foxtrot: 'f',
  golf: 'g',
  hotel: 'h',
  india: 'i',
  juliet: 'j',
  kilo: 'k',
  lima: 'l',
  mike: 'm',
  november: 'n',
  oscar: 'o',
  papa: 'p',
  quebec: 'q',
  romeo: 'r',
  sierra: 's',
  tango: 't',
  uniform: 'u',
  victor: 'v',
  whisky: 'w',
  xylophone: 'x',
  yankee: 'y',
  zulu: 'z',
  wun: '1',
  too: '2',
  tree: '3',
  fower: '4',
  fife: '5',
  six: '6',
  seven: '7',
  ait: '8',
  niner: '9',
  ziro: '0',
  stop: '.',
  hyphen: '-',
  return: ' \n',
  space: ' ',
};

export function fromNatoWords(input: string): string {
  const output = [];
  const parts = input.split(' ');
  for (const part of parts) {
    if (hasOwnProperty(natoToCharMap, part)) {
      output.push(natoToCharMap[part]);
    } else {
      output.push(part);
    }
  }
  return output.join('');
}
