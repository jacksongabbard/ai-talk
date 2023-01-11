import AJV from 'ajv';
import { isEqual, merge } from 'lodash';

import type Team from 'src/lib/db/Team';
import type User from 'src/lib/db/User';
import type { Puzzle } from 'src/types/Puzzle';
import type { ActionResult } from 'src/types/Puzzle';
import type PuzzleInstance from 'src/lib/db/PuzzleInstance';
import {
  PushTheButtonPuzzlePayloadType,
  assertIsPushTheButtonPuzzlePayload,
} from 'src/types/puzzles/PuzzleTheButtonTypes';

type PushTheButtonAction = {
  on: boolean;
};

const instanceActionSchema = {
  type: 'object',
  properties: {
    on: { type: 'boolean' },
  },
  required: ['on'],
  additionalProperties: false,
};

const ajv = new AJV();
const validateInstanceAction = ajv.compile(instanceActionSchema);

function assertIsPushTheButtonAction(thing: any): PushTheButtonAction {
  if (validateInstanceAction(thing)) {
    return thing as PushTheButtonAction;
  }
  throw new Error('Bad input');
}

const PushTheButton: Puzzle = {
  name: 'Push the Button',
  slug: 'push_the_button',
  minPlayers: 2,
  maxPlayers: 6,
  createInstance: (user: User, members: User[], team?: Team) => {
    const solutionPayload: PushTheButtonPuzzlePayloadType = {
      pressed: {
        [user.id]: true,
      },
      uuidsToNames: {
        [user.id]: user.userName,
      },
    };
    const puzzlePayload: PushTheButtonPuzzlePayloadType = {
      pressed: {
        [user.id]: false,
      },
      uuidsToNames: {
        [user.id]: user.userName,
      },
    };
    // There may or may not be any team members
    for (const member of members || []) {
      solutionPayload.pressed[member.id] = true;
      solutionPayload.uuidsToNames[member.id] = member.userName;
      puzzlePayload.pressed[member.id] = false;
      puzzlePayload.uuidsToNames[member.id] = member.userName;
    }

    return {
      puzzlePayload,
      solutionPayload,
    };
  },

  filterPuzzlePayloadForUser: (
    user: User,
    puzzlePayload: object,
    solutionPayload: object,
  ) => {
    return puzzlePayload;
  },

  filterPayloadDiffValueForUser: (
    user: User,
    payload: object,
    solutionPayload: object,
  ) => {
    return payload;
  },

  receiveAction: (
    user: User,
    puzzleInstance: PuzzleInstance,
    action: object,
  ): ActionResult => {
    const a = assertIsPushTheButtonAction(action);
    const pp = assertIsPushTheButtonPuzzlePayload(puzzleInstance.puzzlePayload);
    const newState = a.on;
    const payloadDiffValue = {
      pressed: {
        [user.id]: newState,
      },
    };

    const puzzlePayload = merge(puzzleInstance.puzzlePayload, payloadDiffValue);

    return {
      payloadDiff: {
        // seq number comes externally
        value: payloadDiffValue,
      },
      puzzlePayload,
    };
  },

  isSolved: (puzzlePayload, solutionPayload) => {
    let p = assertIsPushTheButtonPuzzlePayload(puzzlePayload);
    let s = assertIsPushTheButtonPuzzlePayload(solutionPayload);
    return isEqual(p.pressed, s.pressed);
  },
};

export default PushTheButton;

/*
// Saving this for the second puzzle -- 
createInstance: (team: Team, members: User[]) => {
    const letterCount = 5 * members.length;
    const alphaNums = [];
    for (let i = 0; i < letterCount; i++) {
      alphaNums.push(getRandomEntry(AlphaNum));
    }

    return {
      puzzlePayload: {
        revealedLetters: [],
      },
      solutionPayload: {
        solution: alphaNums,
      },
    };
  },
  */
