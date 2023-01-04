import type { WebSocket } from 'ws';
import { v4 as uuid } from 'uuid';

import { puzzleMapFromList } from 'src/server/puzzles/index';
import { getDetailsForSocket, getSocketsForPuzzleInstance } from './SocketMaps';
import PuzzleInstanceAction from 'src/lib/db/PuzzleInstanceAction';
import SequelizeInstance from 'src/lib/db/SequelizeInstance';
import { PAYLOAD_DIFF, PUZZLE_SOLVED } from 'src/types/SocketMessage';

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

  // Allow no further updates once a puzzle has been solved
  if (puzzleInstance.solvedAt) {
    return;
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

  puzzleInstance.puzzlePayload = puzzlePayload;
  if (isSolved) {
    puzzleInstance.solvedAt = new Date();
  }
  let puzzleInstanceActionID = uuid();
  let pia: PuzzleInstanceAction | null;
  try {
    // Maybe there's a better way to do this. Or maybe
    // there's not. Idk.
    const res = await SequelizeInstance.query({
      query: `
        INSERT INTO puzzle_instance_actions (
          id,
          puzzle_instance_id,
          user_id,
          sequence_number, 
          payload
        ) VALUES (
          ?,
          ?,
          ?,
          (SELECT COUNT(*) + 1 FROM puzzle_instance_actions WHERE puzzle_instance_id = ?),
          ?
        );`,
      values: [
        puzzleInstanceActionID,
        puzzleInstance.id,
        user.id,
        puzzleInstance.id,
        JSON.stringify(puzzlePayload),
      ],
    });
    console.log(res);
    pia = await PuzzleInstanceAction.findOne({
      where: { id: puzzleInstanceActionID },
    });

    console.log(puzzleInstanceActionID, pia);

    if (!pia) {
      throw new Error('Failed to record puzzle instance action');
    }
    puzzleInstance.sequenceNumber = pia.sequenceNumber;
    await puzzleInstance.save();
  } catch (e) {
    console.log('puzzle-instance-action-failure', e);
  }

  console.log({ payloadDiff, puzzlePayload, isSolved });

  const sockets = getSocketsForPuzzleInstance(puzzleInstance.id);
  sockets.forEach((s) => {
    s.send(
      JSON.stringify({
        type: PAYLOAD_DIFF,
        payload: { ...payloadDiff, seq: pia?.sequenceNumber },
      }),
    );
    if (isSolved) {
      s.send(
        JSON.stringify({
          type: PUZZLE_SOLVED,
          payload: { hooray: true },
        }),
      );
    }
  });
}
