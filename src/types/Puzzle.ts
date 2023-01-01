import type Team from 'src/lib/db/Team';
import type User from 'src/lib/db/User';

export type PuzzleInstanceData = {
  puzzlePayload: object;
  solutionPayload: object;
};

export type Puzzle = {
  name: string;
  slug: string;
  minPlayers: number;
  maxPlayers: number;
  createInstance: (team: Team, teamMembers: User[]) => PuzzleInstanceData;
  receiveAction: (action: object) => void;
};
