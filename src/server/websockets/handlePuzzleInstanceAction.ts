import type { WebSocket } from 'ws';

import { puzzleMapFromList } from 'src/server/puzzles/index';
import { getDetailsForSocket } from './SocketMaps';

const PuzzleMap = puzzleMapFromList();

export async function handlePuzzleInstanceAction(
  ws: WebSocket,
  action: object,
) {
  const { user, puzzleInstance } = getDetailsForSocket(ws);
  if (!user) {
    throw new Error('Puzzle instance action received with no user');
  }

  if (!puzzleInstance) {
    throw new Error('Puzzle instance action received with no puzzle instance');
  }

  if (!PuzzleMap[puzzleInstance.puzzleId]) {
    throw new Error('Puzzle instance with no puzzle?! Unpossible.');
  }

  const puzzle = PuzzleMap[puzzleInstance.puzzleId];

  const { payloadDiff, puzzlePayload } = puzzle.receiveAction(
    user,
    puzzleInstance,
    action,
  );

  const isSolved = puzzle.isSolved(
    puzzlePayload,
    puzzleInstance.solutionPayload,
  );

  console.log({ payloadDiff, puzzlePayload, isSolved });
}
