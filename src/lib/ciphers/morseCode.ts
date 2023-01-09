import { hasOwnProperty } from '../hasOwnProperty';

const morseCodeMap: { [k: string]: string } = {
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
  const parts = input.split(' ');
  for (const part of parts) {
    const w: string[] = [];
    for (let i = 0; i < part.length; i++) {
      if (hasOwnProperty(morseCodeMap, part[i])) {
        w.push(morseCodeMap[part[i]] + ' ');
      } else {
        w.push(part[i]);
      }
    }
    output.push(w.join(' '));
  }
  return output.join('\n');
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

export function toMorseCodeFromMorseCodeWords(input: string): string {
  const output = [];
  const parts = input.split('\n');
  for (const part of parts) {
    if (part === 'dot') {
      output.push('.');
    } else if (part === 'dash') {
      output.push('-');
    } else {
      output.push(part);
    }
  }
  return output.join('');
}

const reverseMorseCodeMap: { [k: string]: string } = {
  '.-': 'a',
  '-...': 'b',
  '-.-.': 'c',
  '-..': 'd',
  '.': 'e',
  '..-.': 'f',
  '--.': 'g',
  '....': 'h',
  '..': 'i',
  '.---': 'j',
  '-.-': 'k',
  '.-..': 'l',
  '--': 'm',
  '-.': 'n',
  '---': 'o',
  '.--.': 'p',
  '--.-': 'q',
  '.-.': 'r',
  '...': 's',
  '-': 't',
  '..-': 'u',
  '...-': 'v',
  '.--': 'w',
  '-..-': 'x',
  '-.--': 'y',
  '--..': 'z',
  '-----': '0',
  '.----': '1',
  '..---': '2',
  '...--': '3',
  '....-': '4',
  '.....': '5',
  '-....': '6',
  '--...': '7',
  '---..': '8',
  '----.': '9',
};

export function toTextFromMorseCode(input: string): string {
  const output = [];
  const parts = input.split('\n');
  for (const part of parts) {
    const w: string[] = [];
    const chars = part.split(' ');
    for (let subseq of chars) {
      if (hasOwnProperty(reverseMorseCodeMap, subseq)) {
        w.push(reverseMorseCodeMap[subseq]);
      } else {
        w.push(subseq);
      }
    }
    output.push(w.join(' '));
  }
  return output.join('\n');
}
