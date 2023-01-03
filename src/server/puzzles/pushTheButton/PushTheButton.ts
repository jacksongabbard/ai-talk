import AJV from 'ajv';

import type Team from 'src/lib/db/Team';
import type User from 'src/lib/db/User';
import type { Puzzle } from 'src/types/Puzzle';
import AlphaNum from 'src/lib/dict/AlphaNum';
import { getRandomEntry } from 'src/lib/dict/utils';
import type { ActionResult } from 'src/types/ActionResult';

type PushTheButtonAction = {
  on: boolean;
};

const schema = {
  type: 'object',
  properties: {
    on: { type: 'boolean' },
  },
  required: ['foo'],
  additionalProperties: false,
};

const ajv = new AJV();
const validate = ajv.compile(schema);

function assertIsPushTheButtonAction(thing: any): PushTheButtonAction {
  if (validate(thing)) {
    return thing as PushTheButtonAction;
  }
  throw new Error('Bad input');
}

const PushTheButton: Puzzle = {
  name: 'Push the Button',
  slug: 'push_the_button',
  minPlayers: 1,
  maxPlayers: 6,
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

  receiveAction: (action: object): ActionResult => {
    const a = assertIsPushTheButtonAction(action);
    console.log(a);
    return {
      diff: {
        seq: 0,
        value: { foo: 'bar' },
      },
      state: {
        foo: 'bar',
      },
    };
  },
};

export default PushTheButton;
