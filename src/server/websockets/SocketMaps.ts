import type { WebSocket } from 'ws';

import type PuzzleInstance from 'src/lib/db/PuzzleInstance';
import type Team from 'src/lib/db/Team';
import type User from 'src/lib/db/User';

const socketToUser = new WeakMap<WebSocket, User>();
const socketToTeam = new WeakMap<WebSocket, Team>();
const socketToPuzzleInstance = new WeakMap<WebSocket, PuzzleInstance>();
const puzzleInstanceIdToSockets: { [uuid: string]: WeakSet<WebSocket> } = {};

export function addWebSocketToMaps(
  ws: WebSocket,
  user: User,
  team?: Team,
  puzzleInstance?: PuzzleInstance,
) {
  socketToUser.set(ws, user);
  if (!puzzleInstance) {
    socketToPuzzleInstance.delete(ws);
  } else {
    socketToPuzzleInstance.set(ws, puzzleInstance);
  }
  if (!team) {
    if (socketToTeam.get(ws)) {
      socketToTeam.delete(ws);
    }
  } else {
    socketToTeam.set(ws, team);
  }

  if (puzzleInstance) {
    if (!puzzleInstanceIdToSockets[puzzleInstance.id]) {
      puzzleInstanceIdToSockets[puzzleInstance.id] = new WeakSet<WebSocket>();
    }

    puzzleInstanceIdToSockets[puzzleInstance.id].add(ws);
  }
}

export function updatePuzzleInstanceForWebSocket(
  ws: WebSocket,
  puzzleInstance: PuzzleInstance,
) {
  const oldInstance = socketToPuzzleInstance.get(ws);
  if (oldInstance && puzzleInstanceIdToSockets[oldInstance.id]) {
    puzzleInstanceIdToSockets[puzzleInstance.id].delete(ws);
  }

  if (!puzzleInstanceIdToSockets[puzzleInstance.id]) {
    puzzleInstanceIdToSockets[puzzleInstance.id] = new WeakSet<WebSocket>();
  }
  puzzleInstanceIdToSockets[puzzleInstance.id].add(ws);
  socketToPuzzleInstance.set(ws, puzzleInstance);
}

export function getDetailsForSocket(ws: WebSocket): {
  user?: User;
  team?: Team;
  puzzleInstance?: PuzzleInstance;
} {
  return {
    user: socketToUser.get(ws),
    team: socketToTeam.get(ws),
    puzzleInstance: socketToPuzzleInstance.get(ws),
  };
}

export function getSocketsForPuzzleInstance(
  puzzleInstanceId: string,
): WeakSet<WebSocket> {
  return puzzleInstanceIdToSockets[puzzleInstanceId];
}
