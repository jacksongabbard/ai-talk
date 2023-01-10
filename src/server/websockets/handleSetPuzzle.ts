import type { WebSocket } from 'ws';

import type { SetPuzzleMessage } from 'src/types/SocketMessage';
import {
  getDetailsForSocket,
  updatePuzzleInstanceForWebSocket,
} from './SocketMaps';
import PuzzleInstance from 'src/lib/db/PuzzleInstance';

export async function handleSetPuzzle(ws: WebSocket, sp: SetPuzzleMessage) {
  const { user, team, puzzleInstance } = getDetailsForSocket(ws);
  if (!user) {
    throw new Error('Cannot set puzzle instance with no user');
  }

  if (puzzleInstance && puzzleInstance.puzzleId === sp.puzzleName) {
    return;
  }

  let pi: PuzzleInstance | null;
  if (team) {
    pi = await PuzzleInstance.findOne({
      where: {
        puzzleId: sp.puzzleName,
        teamId: team.id,
      },
    });
  } else {
    pi = await PuzzleInstance.findOne({
      where: {
        puzzleId: sp.puzzleName,
        userId: user.id,
      },
    });
  }

  if (!pi) {
    throw new Error('No such puzzle instance');
  }

  updatePuzzleInstanceForWebSocket(ws, pi);
}
