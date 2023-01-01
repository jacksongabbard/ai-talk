import type PuzzleInstance from 'src/lib/db/PuzzleInstance';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';

export type ClientPuzzleInstance = {
  id: string;
  puzzleId: string;
  createdAt: Date;
  updatedAt: Date;
  startedAt: Date;
  solvedAt: Date | null;
  puzzlePayload: object;
};

export function puzzleInstanceToClientPuzzleInstance(
  p: PuzzleInstance,
): ClientPuzzleInstance {
  return {
    id: p.id,
    puzzleId: p.puzzleId,
    createdAt: p.createdAt,
    updatedAt: p.createdAt,
    startedAt: p.startedAt,
    solvedAt: p.solvedAt,
    puzzlePayload: p.puzzlePayload,
  };
}

export function assertIsSerializedPuzzleInstance(
  thing: unknown,
): ClientPuzzleInstance {
  if (
    !!thing &&
    typeof thing === 'object' &&
    hasOwnProperty(thing, 'id') &&
    typeof thing.id === 'string' &&
    hasOwnProperty(thing, 'puzzleId') &&
    typeof thing.puzzleId === 'string' &&
    hasOwnProperty(thing, 'createdAt') &&
    typeof thing.createdAt === 'string' &&
    hasOwnProperty(thing, 'updatedAt') &&
    typeof thing.updatedAt === 'string' &&
    hasOwnProperty(thing, 'startedAt') &&
    typeof thing.startedAt === 'string' &&
    hasOwnProperty(thing, 'solvedAt') &&
    (typeof thing.solvedAt === 'string' || thing.solvedAt === null) &&
    hasOwnProperty(thing, 'puzzlePayload') &&
    typeof thing.puzzlePayload === 'object' &&
    !!thing.puzzlePayload
  ) {
    return {
      id: thing.id,
      puzzleId: thing.puzzleId,
      createdAt: new Date(thing.createdAt),
      updatedAt: new Date(thing.updatedAt),
      startedAt: new Date(thing.startedAt),
      solvedAt: thing.solvedAt ? new Date(thing.solvedAt) : null,
      puzzlePayload: thing.puzzlePayload,
    };
  }
  throw new Error('Input value is not a ClientPuzzleInstance');
}
