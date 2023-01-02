import type Team from 'src/lib/db/Team';
import type User from 'src/lib/db/User';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';

export type PuzzleInstanceData = {
  puzzlePayload: object;
  solutionPayload: object;
};

export type ClientPuzzle = {
  name: string;
  slug: string;
  minPlayers: number;
  maxPlayers: number;
};

export type Puzzle = ClientPuzzle & {
  createInstance: (team: Team, teamMembers: User[]) => PuzzleInstanceData;
  receiveAction: (action: object) => void;
};

export function puzzleToClientPuzzle(p: Puzzle): ClientPuzzle {
  return {
    name: p.name,
    slug: p.slug,
    minPlayers: p.minPlayers,
    maxPlayers: p.maxPlayers,
  };
}

export function assertIsClientPuzzle(thing: unknown): ClientPuzzle {
  if (
    thing &&
    typeof thing === 'object' &&
    hasOwnProperty(thing, 'name') &&
    typeof thing.name === 'string' &&
    hasOwnProperty(thing, 'slug') &&
    typeof thing.slug === 'string' &&
    hasOwnProperty(thing, 'minPlayers') &&
    typeof thing.minPlayers === 'number' &&
    hasOwnProperty(thing, 'maxPlayers') &&
    typeof thing.maxPlayers === 'number'
  ) {
    return {
      name: thing.name,
      slug: thing.slug,
      minPlayers: thing.minPlayers,
      maxPlayers: thing.maxPlayers,
    };
  }

  throw new Error('Provided value is not a ClientPuzzle object');
}
