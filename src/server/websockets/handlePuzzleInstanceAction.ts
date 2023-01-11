import type { WebSocket } from 'ws';
import { v4 as uuid } from 'uuid';

import { puzzleMapFromList } from 'src/server/puzzles/index';
import { getDetailsForSocket, getSocketsForPuzzleInstance } from './SocketMaps';
import PuzzleInstanceAction from 'src/lib/db/PuzzleInstanceAction';
import SequelizeInstance from 'src/lib/db/SequelizeInstance';
import { PAYLOAD_DIFF, PUZZLE_SOLVED } from 'src/types/SocketMessage';
import PuzzleInstance from 'src/lib/db/PuzzleInstance';

const PuzzleMap = puzzleMapFromList();

export async function handlePuzzleInstanceAction(
  ws: WebSocket,
  action: object,
) {
  const { user, puzzleInstance: oldPI } = getDetailsForSocket(ws);
  if (!user) {
    throw new Error('Puzzle instance action received with no user');
  }

  if (!oldPI) {
    throw new Error('No oldPI?1');
  }

  const puzzleInstance = await PuzzleInstance.findOne({
    where: { id: oldPI.id },
  });

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

  let puzzleInstanceActionID = uuid();
  let pia: PuzzleInstanceAction | null;
  try {
    // Maybe there's a better way to do this. Or maybe
    // there's not. Idk. Definitely a race condition
    // here if teammates move quickly enough.
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
    pia = await PuzzleInstanceAction.findOne({
      where: { id: puzzleInstanceActionID },
    });

    if (!pia) {
      throw new Error('Failed to record puzzle instance action');
    }

    const updatedFields: {
      puzzlePayload: object;
      sequenceNumber: number;
      solvedAt?: Date;
    } = {
      puzzlePayload,
      sequenceNumber: pia.sequenceNumber,
    };
    if (isSolved) {
      updatedFields.solvedAt = new Date();
    }
    await PuzzleInstance.update(updatedFields, {
      where: {
        id: puzzleInstance.id,
      },
    });
  } catch (e) {
    console.log('puzzle-instance-action-failure', e);
  }

  const sockets = getSocketsForPuzzleInstance(puzzleInstance.id);
  sockets.forEach((s) => {
    const { user } = getDetailsForSocket(s);
    if (!user) {
      console.log('Socket found with no related user');
      return;
    }

    const value = puzzle.filterPayloadDiffValueForUser(
      user,
      payloadDiff.value,
      puzzleInstance.solutionPayload,
    );
    s.send(
      JSON.stringify({
        type: PAYLOAD_DIFF,
        payload: { value, seq: pia?.sequenceNumber },
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
