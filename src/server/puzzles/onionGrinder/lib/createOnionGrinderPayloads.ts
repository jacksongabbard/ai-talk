import { toMorseCode } from 'src/lib/ciphers/morseCode';
import { toNatoWords, toRot13 } from './ciphers';
import { toNumberWords } from 'src/lib/ciphers/words';

export const createOnionGrinderPayloads = () => {
  let total = 5000 + Math.round(Math.random() * 10000);
  const parts: number[] = [];
  for (let i = 0; i < 6; i++) {
    const num = 10000 + Math.round(Math.random() * 90000);
    parts.push(num);
    total += num;
  }

  console.log(parts);
  console.log(total);

  for (let part of parts) {
    console.log(
      part,
      // toMorseCodeWords(
      toMorseCode(
        toNatoWords(
          toRot13(toNumberWords(part.toString().split('').join(' '))),
        ),
      ),
      // ),
    );
  }

  const puzzlePayload = {};
  const solutionPayload = {
    parts,
    total,
  };
  return {
    puzzlePayload,
    solutionPayload,
  };
};
