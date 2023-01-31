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
  let total = 0;
  const parts: number[] = [];
  const encipheredParts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const num = 10000 + Math.round(Math.random() * 90000);
    parts.push(num);

    const randomCiphers = shuffle(ciphers);

    let msg = num.toString(10);
    if (i === 0) {
      msg = 'solve: ' + num + ' plus ';
    } else if (i === 5) {
      msg = num + ' =';
    } else {
      msg = num + ' plus';
    }
    let enciphered = toWords(msg);
    for (const cipher of randomCiphers) {
      enciphered = cipher(enciphered);
    }
    encipheredParts.push(enciphered);
    total += num;
  }

  const enabledButtonsPerUser: { [uuid: string]: number[] } = {};
  const uuids = shuffle(users.map((u) => u.id));
  for (let i = 0; i < ciphers.length; i++) {
    if (!enabledButtonsPerUser[uuids[i % uuids.length]]) {
      enabledButtonsPerUser[uuids[i % uuids.length]] = [];
    }
    enabledButtonsPerUser[uuids[i % uuids.length]].push(i);
  }

  for (const uuid of uuids) {
    enabledButtonsPerUser[uuid].push(7);
  }

  const puzzlePayload: NoYouFirstPuzzlePayload = {
    enabledButtonsPerUser,
    currentStates: encipheredParts,
    solvedParts: [false, false, false, false, false, false],
    solutionAttempt: '',
  };

  const solutionPayload: NoYouFirstSolutionPayload = {
    parts,
    encipheredParts,
    total,
  };
  return {
    puzzlePayload,
    solutionPayload,
  };
};
