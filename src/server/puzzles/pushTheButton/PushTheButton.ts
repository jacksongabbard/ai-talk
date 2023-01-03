import AJV from 'ajv';

import type Team from 'src/lib/db/Team';
import type User from 'src/lib/db/User';
import type { Puzzle } from 'src/types/Puzzle';
import AlphaNum from 'src/lib/dict/AlphaNum';
import { getRandomEntry } from 'src/lib/dict/utils';
import type { ActionResult } from 'src/types/Puzzle';
import type PuzzleInstance from 'src/lib/db/PuzzleInstance';

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
    const solution: { [uuid: string]: boolean } = {};

    for (const member of members) {
      solution[member.id] = true;
    }

    return {
      puzzlePayload: {
        revealedLetters: [],
      },
      solutionPayload: {
        solution,
      },
    };
  },

  receiveAction: (
    user: User,
    puzzleInstance: PuzzleInstance,
    action: object,
  ): ActionResult => {
    const a = assertIsPushTheButtonAction(action);
    console.log(a);
    return {
      payloadDiff: {
        value: { foo: 'bar' },
      },
      puzzlePayload: {
        foo: 'bar',
      },
    };
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
