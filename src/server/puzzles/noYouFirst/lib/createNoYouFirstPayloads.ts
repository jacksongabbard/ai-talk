import { shuffle } from 'lodash';

import { toMorseCode } from 'src/lib/puzzles/noYouFirst/ciphers/morseCode';
import { toWords } from 'src/lib/puzzles/noYouFirst/ciphers/words';
import { toNatoWords } from 'src/lib/puzzles/noYouFirst/ciphers/nato';
import { toAscii } from 'src/lib/puzzles/noYouFirst/ciphers/ascii';
import { toRot13 } from 'src/lib/puzzles/noYouFirst/ciphers/rot13';
import { toAtbash } from 'src/lib/puzzles/noYouFirst/ciphers/atbash';
import { toReverse } from 'src/lib/puzzles/noYouFirst/ciphers/reverse';
import type User from 'src/lib/db/User';
import type {
  NoYouFirstPuzzlePayload,
  NoYouFirstSolutionPayload,
} from 'src/types/puzzles/NoYouFirstTypes';

const ciphers = [
  toMorseCode,
  toWords,
  toNatoWords,
  toAscii,
  toRot13,
  toAtbash,
  toReverse,
];

export const createNoYouFirstPayloads = (users: User[]) => {
  let total = 5000 + Math.round(Math.random() * 10000);
  const parts: number[] = [];
  const encipheredParts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const num = 10000 + Math.round(Math.random() * 90000);
    parts.push(num);

    const randomCiphers = shuffle(ciphers);

    let msg = num.toString(10);
    if (i === 0) {
      msg = 'solve: ' + num;
    } else if (i === 5) {
      msg = num + ' =';
    } else {
      msg = num + ' plus';
    }
    let enciphered = toWords(msg);
    for (let cipher of randomCiphers) {
      enciphered = cipher(enciphered);
    }
    encipheredParts.push(enciphered);
    total += num;
  }

  const enabledButtonsPerUser: { [uuid: string]: number[] } = {};
  const uuids = shuffle(users.map((u) => u.id));
  for (let i = 0; i < ciphers.length + 1; i++) {
    // The +1 here is for the reset button
    if (!enabledButtonsPerUser[uuids[i % uuids.length]]) {
      enabledButtonsPerUser[uuids[i % uuids.length]] = [];
    }
    enabledButtonsPerUser[uuids[i % uuids.length]].push(i);
  }

  const puzzlePayload: NoYouFirstPuzzlePayload = {
    enabledButtonsPerUser,
    currentStates: encipheredParts,
    solvedParts: [false, false, false, false, false, false],
    encipheredParts,
  };

  const solutionPayload: NoYouFirstSolutionPayload = {
    parts,
    total,
  };
  return {
    puzzlePayload,
    solutionPayload,
  };
};
