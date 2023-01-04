import AJV from 'ajv';
import { isEqual } from 'lodash';

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
  toggle: boolean;
};

const instanceActionSchema = {
  type: 'object',
  properties: {
    toggle: { type: 'boolean' },
  },
  required: ['toggle'],
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
  createInstance: (user: User, members: User[], team?: Team) => {
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
    assertIsPushTheButtonAction(action);
    const pp = assertIsPushTheButtonPuzzlePayload(puzzleInstance.puzzlePayload);
    const newState = !pp[user.id];
    const payloadDiffValue = {
      [user.id]: newState,
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
    return false && isEqual(puzzlePayload, solutionPayload);
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
