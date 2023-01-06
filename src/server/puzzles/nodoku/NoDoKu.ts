import { isEqual, merge } from 'lodash';

import type Team from 'src/lib/db/Team';
import type User from 'src/lib/db/User';
import type { Puzzle } from 'src/types/Puzzle';
import type { ActionResult } from 'src/types/Puzzle';
import type PuzzleInstance from 'src/lib/db/PuzzleInstance';

const Nodoku: Puzzle = {
  name: 'Nodoku',
  slug: 'nodoku',
  minPlayers: 2,
  maxPlayers: 6,
  createInstance: (user: User, members: User[], team?: Team) => {
    const solutionPayload: object = {};
    const puzzlePayload: object = {};

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
    const payloadDiffValue = {};

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
    return isEqual(puzzlePayload, solutionPayload);
  },
};

export default Nodoku;
