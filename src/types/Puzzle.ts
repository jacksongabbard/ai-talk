import type PuzzleInstance from 'src/lib/db/PuzzleInstance';
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
  published: boolean;
};

export type DiffObject = {
  value: object;
};

export type NumeberedDiffObject = DiffObject & {
  seq: number;
};

export type ActionResult = {
  payloadDiff: DiffObject;
  puzzlePayload: object;
};

export type Puzzle = ClientPuzzle & {
  createInstance: (
    user: User,
    teamMembers: User[],
    team?: Team,
  ) => PuzzleInstanceData;

  // This function filters an entire puzzle payload
  // for the given user.
  filterPuzzlePayloadForUser: (
    user: User,
    puzzlePayload: object,
    solutionPayload: object,
  ) => object;

  // This function filters just the payload diff value
  // for a particular puzzle instance for a particular
  // user. This will usually be a fragment of the full
  // puzzlePayload.
  filterPayloadDiffValueForUser: (
    user: User,
    payloadDiffValue: object,
    solutionPayload: object,
  ) => object;

  receiveAction: (
    user: User,
    puzzleInstance: PuzzleInstance,
    action: object,
  ) => ActionResult;
  isSolved: (puzzlePayload: object, solutionPayload: object) => boolean;
};

export function puzzleToClientPuzzle(p: Puzzle): ClientPuzzle {
  return {
    name: p.name,
    slug: p.slug,
    minPlayers: p.minPlayers,
    maxPlayers: p.maxPlayers,
    published: p.published,
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
    typeof thing.maxPlayers === 'number' &&
    hasOwnProperty(thing, 'published') &&
    typeof thing.published === 'boolean'
  ) {
    return {
      name: thing.name,
      slug: thing.slug,
      minPlayers: thing.minPlayers,
      maxPlayers: thing.maxPlayers,
      published: thing.published,
    };
  }

  throw new Error('Provided value is not a ClientPuzzle object');
}
