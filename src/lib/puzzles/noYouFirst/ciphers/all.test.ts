import { reverse, shuffle } from 'lodash';
import { fromAscii, toAscii } from './ascii';
import { fromAtbash, toAtbash } from './atbash';
import { fromMorseCode, toMorseCode } from './morseCode';
import { fromNatoWords, toNatoWords } from './nato';
import { toReverse } from './reverse';
import { fromRot13, toRot13 } from './rot13';
import { fromWords, toWords } from './words';

const ciphers = [
  [toMorseCode, fromMorseCode],
  [toWords, fromWords],
  [toNatoWords, fromNatoWords],
  [toAscii, fromAscii],
  [toRot13, fromRot13],
  [toAtbash, fromAtbash],
  [toReverse, toReverse],
];

(() => {
  test('a randomized list of ciphers is reversible', () => {
    const randomCiphers = shuffle(ciphers);

    let input = 'abc123';
    let output = input;
    console.log('Starting: ' + output);
    for (let c of randomCiphers) {
      output = c[0](output);
      console.log({ output });
    }

    console.log('Beginning the reversal...');
    const reversed = reverse(randomCiphers);
    for (let c of randomCiphers) {
      output = c[1](output);
      console.log({ output });
    }
    expect(output).toStrictEqual(input);
  });
})();
