import { makeValidator } from 'src/lib/ajv/makeValidator';

export type LeaderboardData = {
  [puzzleId: string]: {
    puzzleName: string;
    leaders: Array<{
      teamName: string;
      solveTime: number;
    }>;
  };
};

export const validateIsLeaderboardData = makeValidator({
  type: 'object',
  patternProperties: {
    // Puzzle slugs are lowercase, snake-case
    ['^[a-z][_a-z]+[a-z]$']: {
      type: 'object',
      properties: {
        puzzleName: { type: 'string' },
        leader: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              teamName: { type: 'string' },
              solveTime: { type: 'number' },
            },
          },
        },
      },
    },
  },

  additionalProperties: false,
});

export function assertIsLeaderBoardData(thing: any): LeaderboardData {
  if (validateIsLeaderboardData(thing)) {
    return thing as LeaderboardData;
  }

  throw new Error(
    'Provided object is not valid LeaderboardData: ' + JSON.stringify(thing),
  );
}
