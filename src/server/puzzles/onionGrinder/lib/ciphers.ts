import { hasOwnProperty } from 'src/lib/hasOwnProperty';

const wordsForNatoLettersMap = {
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
};

export function toNatoWords(input: string): string {
  const output = [];
  for (let i = 0; i < input.length; i++) {
    if (hasOwnProperty(wordsForNatoLettersMap, input[i])) {
      output.push(wordsForNatoLettersMap[input[i]] + ' ');
    } else {
      output.push(input[i]);
    }
  }
  return output.join('');
}

const rot13Map = {
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
};

export function toRot13(input: string): string {
  const output = [];
  for (let i = 0; i < input.length; i++) {
    if (hasOwnProperty(rot13Map, input[i])) {
      output.push(rot13Map[input[i]]);
    } else {
      output.push(input[i]);
    }
  }
  return output.join('');
}
