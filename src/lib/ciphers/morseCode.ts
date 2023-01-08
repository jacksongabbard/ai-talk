import { hasOwnProperty } from '../hasOwnProperty';

const morseCodeMap = {
  a: '.-',
  b: '-...',
  c: '-.-.',
  d: '-..',
  e: '.',
  f: '..-.',
  g: '--.',
  h: '....',
  i: '..',
  j: '.---',
  k: '-.-',
  l: '.-..',
  m: '--',
  n: '-.',
  o: '---',
  p: '.--.',
  q: '--.-',
  r: '.-.',
  s: '...',
  t: '-',
  u: '..-',
  v: '...-',
  w: '.--',
  x: '-..-',
  y: '-.--',
  z: '--..',
  '0': '-----',
  '1': '.----',
  '2': '..---',
  '3': '...--',
  '4': '....-',
  '5': '.....',
  '6': '-....',
  '7': '--...',
  '8': '---..',
  '9': '----.',
};

export function toMorseCode(input: string): string {
  const output = [];
  for (let i = 0; i < input.length; i++) {
    if (hasOwnProperty(morseCodeMap, input[i])) {
      output.push(morseCodeMap[input[i]] + ' ');
    } else {
      output.push(input[i]);
    }
  }
  return output.join('');
}

export function toMorseCodeWords(input: string): string {
  const output = [];
  for (let i = 0; i < input.length; i++) {
    if (input[i] === '.') {
      output.push('dot ');
    } else if (input[i] === '-') {
      output.push('dash ');
    } else {
      output.push(input[i]);
    }
  }
  return output.join('');
}
