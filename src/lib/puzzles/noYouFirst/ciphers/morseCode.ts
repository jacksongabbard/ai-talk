import { hasOwnProperty } from '../../../hasOwnProperty';

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
  ' ': '..--.-',
  '.': '.-.-.-',
  '-': '-....-',
  ':': '---...',
  ';': '-.-.-.',
  '\n': '\n',
};

export function toMorseCode(input: string): string {
  const output = [];
  for (let i = 0; i < input.length; i++) {
    if (hasOwnProperty(morseCodeMap, input[i])) {
      output.push(morseCodeMap[input[i]]);
    } else {
      output.push(input[i]);
    }
  }
  return output.join(' ');
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
  '..--.-': ' ',
  '.-.-.-': '.',
  '-....-': '-',
  '---...': ':',
  '-.-.-.': ';',
  '\n': '\n',
};

export function fromMorseCode(input: string): string {
  const output = [];
  const parts = input.split(' ');
  for (const part of parts) {
    const w: string[] = [];
    const chars = part.split(' ');
    for (const subseq of chars) {
      if (hasOwnProperty(reverseMorseCodeMap, subseq)) {
        w.push(reverseMorseCodeMap[subseq]);
      } else {
        w.push(subseq);
      }
    }
    output.push(w.join(''));
  }
  return output.join('');
}
