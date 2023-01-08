import { isEqual, merge } from 'lodash';

import type Team from 'src/lib/db/Team';
import type User from 'src/lib/db/User';
import type { Puzzle } from 'src/types/Puzzle';
import type { ActionResult } from 'src/types/Puzzle';
import type PuzzleInstance from 'src/lib/db/PuzzleInstance';
import { createOnionGrinderPayloads } from './lib/createOnionGrinderPayloads';

const RaceToTheBottom: Puzzle = {
  name: 'Onion Grinder',
  slug: 'onion_grinder',
  minPlayers: 1,
  maxPlayers: 6,
  createInstance: (user: User, members: User[], team?: Team) => {
    const { puzzlePayload, solutionPayload } = createOnionGrinderPayloads();

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

export default RaceToTheBottom;
