import { isEqual, merge } from 'lodash';

import type Team from 'src/lib/db/Team';
import type User from 'src/lib/db/User';
import type { Puzzle } from 'src/types/Puzzle';
import type { ActionResult } from 'src/types/Puzzle';
import type PuzzleInstance from 'src/lib/db/PuzzleInstance';
import { createNoYouFirstPayloads } from './lib/createNoYouFirstPayloads';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';
import {
  NoYouFirstCipherInstanceAction,
  NoYouFirstSolutionInstanceAction,
  assertIsNoYouFirstCipherInstanceAction,
  assertIsNoYouFirstPuzzlePayload,
  assertIsNoYouFirstSolutionInstanceAction,
  assertIsNoYouFirstSolutionPayload,
} from 'src/types/puzzles/NoYouFirstTypes';
import { fromMorseCode } from 'src/lib/puzzles/noYouFirst/ciphers/morseCode';
import { fromWords } from 'src/lib/puzzles/noYouFirst/ciphers/words';
import { fromNatoWords } from 'src/lib/puzzles/noYouFirst/ciphers/nato';
import { fromAscii } from 'src/lib/puzzles/noYouFirst/ciphers/ascii';
import { fromRot13 } from 'src/lib/puzzles/noYouFirst/ciphers/rot13';
import { fromAtbash } from 'src/lib/puzzles/noYouFirst/ciphers/atbash';
import { toReverse } from 'src/lib/puzzles/noYouFirst/ciphers/reverse';

const deciphers = [
  fromMorseCode,
  fromWords,
  fromNatoWords,
  fromAscii,
  fromRot13,
  fromAtbash,
  toReverse,
];

const handleDecipher = (
  userId: string,
  action: NoYouFirstCipherInstanceAction,
  instance: PuzzleInstance,
): ActionResult => {
  if (action.cipherIndex < 0 || action.cipherIndex > 7) {
    throw new Error('No such option, my dear');
  }
  if (action.partIndex < 0 || action.partIndex > 5) {
    throw new Error('No such part, my lovely');
  }

  const payload = assertIsNoYouFirstPuzzlePayload(instance.puzzlePayload);

  if (
    !hasOwnProperty(payload.enabledButtonsPerUser, userId) ||
    !payload.enabledButtonsPerUser[userId].includes(action.cipherIndex)
  ) {
    throw new Error('You are not allowed to do that.');
  }

  const solution = assertIsNoYouFirstSolutionPayload(instance.solutionPayload);
  let payloadDiffValue = {
    currentStates: [...payload.currentStates],
    solvedParts: [...payload.solvedParts],
  };

  // Reset case
  if (action.cipherIndex === 7) {
    payloadDiffValue.currentStates[action.partIndex] =
      solution.encipheredParts[action.partIndex];
  } else {
    const oldPart = payload.currentStates[action.partIndex];
    let newPart = deciphers[action.cipherIndex](oldPart);
    payloadDiffValue.currentStates[action.partIndex] = newPart;

    const numbersOnly = newPart.replace(/[^0-9]/g, '');
    if (parseInt(numbersOnly, 10) === solution.parts[action.partIndex]) {
      payloadDiffValue.solvedParts[action.partIndex] = true;
    } else {
      payloadDiffValue.solvedParts[action.partIndex] = false;
    }
  }

  const puzzlePayload = merge(instance.puzzlePayload, payloadDiffValue);
  return {
    payloadDiff: {
      // seq number comes externally
      value: payloadDiffValue,
    },
    puzzlePayload,
  };
};

const handleSolve = (
  action: NoYouFirstSolutionInstanceAction,
  instance: PuzzleInstance,
): ActionResult => {
  const a = assertIsNoYouFirstSolutionInstanceAction(action);
  const payloadDiffValue = {
    solutionAttempt: a.solution,
  };
  const puzzlePayload = merge(instance.puzzlePayload, payloadDiffValue);
  return {
    payloadDiff: {
      // seq number comes externally
      value: payloadDiffValue,
    },
    puzzlePayload,
  };
};

const RaceToTheBottom: Puzzle = {
  name: 'No, You First',
  slug: 'no_you_first',
  minPlayers: 2,
  maxPlayers: 6,
  createInstance: (user: User, members: User[], team?: Team) => {
    const { puzzlePayload, solutionPayload } =
      createNoYouFirstPayloads(members);

    return {
      puzzlePayload,
      solutionPayload,
    };
  },

  filterPayloadForUser: (user: User, payload: object) => {
    return payload;
  },

  receiveAction: (
    user: User,
    puzzleInstance: PuzzleInstance,
    action: object,
  ): ActionResult => {
    if (
      !hasOwnProperty(action, 'actionType') ||
      (action.actionType !== 'decipher' && action.actionType !== 'solve')
    ) {
      throw new Error('Invalid NoYouFirst instance action');
    }

    if (action.actionType === 'solve') {
      const a = assertIsNoYouFirstSolutionInstanceAction(action);
      return handleSolve(a, puzzleInstance);
    } else if (action.actionType === 'decipher') {
      const a = assertIsNoYouFirstCipherInstanceAction(action);
      return handleDecipher(user.id, a, puzzleInstance);
    }
    throw new Error(
      'Unexpected case in NoYouFirst instance action processing. Whoopsie!',
    );
  },

  isSolved: (puzzlePayload, solutionPayload) => {
    const p = assertIsNoYouFirstPuzzlePayload(puzzlePayload);
    const s = assertIsNoYouFirstSolutionPayload(solutionPayload);
    return parseInt(p.solutionAttempt, 10) === s.total;
  },
};

export default RaceToTheBottom;
