import type { WebSocket } from 'ws';

import type { SetPuzzleMessage } from 'src/types/SocketMessage';
import {
  getDetailsForSocket,
  updatePuzzleInstanceForWebSocket,
} from './SocketMaps';
import PuzzleInstance from 'src/lib/db/PuzzleInstance';

export async function handleSetPuzzle(ws: WebSocket, sp: SetPuzzleMessage) {
  const { user, puzzleInstance } = getDetailsForSocket(ws);
  if (!user) {
    throw new Error('Cannot set puzzle instance with no user');
  }

  if (puzzleInstance && puzzleInstance.puzzleId === sp.puzzleName) {
    return;
  }

  const pi = await PuzzleInstance.findOne({
    where: {
      puzzleId: sp.puzzleName,
    },
  });

  if (!pi) {
    throw new Error('No such puzzle instance');
  }

  updatePuzzleInstanceForWebSocket(ws, pi);
}
