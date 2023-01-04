import AJV from 'ajv';
import { isEqual } from 'lodash';

import type Team from 'src/lib/db/Team';
import type User from 'src/lib/db/User';
import type { Puzzle } from 'src/types/Puzzle';
import type { ActionResult } from 'src/types/Puzzle';
import type PuzzleInstance from 'src/lib/db/PuzzleInstance';
import type { PushTheButtonPuzzlePayloadType } from 'src/types/puzzles/PuzzleTheButtonTypes';

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
  console.log({ thing });
  if (validateInstanceAction(thing)) {
    return thing as PushTheButtonAction;
  }
  throw new Error('Bad input');
}

const PushTheButton: Puzzle = {
  name: 'Push the Button',
  slug: 'push_the_button',
  minPlayers: 1,
  maxPlayers: 6,
  createInstance: (user: User, team: Team, members: User[]) => {
    const solutionPayload: PushTheButtonPuzzlePayloadType = {};
    solutionPayload[user.id] = true;
    // There may or may not be any team members
    for (const member of members || []) {
      solutionPayload[member.id] = true;
    }

    return {
      puzzlePayload: {},
      solutionPayload,
    };
  },

  receiveAction: (
    user: User,
    puzzleInstance: PuzzleInstance,
    action: object,
  ): ActionResult => {
    const a = assertIsPushTheButtonAction(action);
    console.log(a);

    const payloadDiffValue = {
      [user.id]: a.on,
    };

    const puzzlePayload = {
      ...puzzleInstance.puzzlePayload,
      ...payloadDiffValue,
    };

    return {
      payloadDiff: {
        // seq comes externally
        value: payloadDiffValue,
      },
      puzzlePayload,
    };
  },

  isSolved: (puzzlePayload, solutionPayload) => {
    console.log(puzzlePayload, solutionPayload);
    return isEqual(puzzlePayload, solutionPayload);
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
