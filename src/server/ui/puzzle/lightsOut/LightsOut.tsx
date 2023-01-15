import { Button } from '@mui/material';
import { useCallback, useContext, useEffect, useState } from 'react';
import type { SendInstanceAction } from 'src/client/hooks/useWebSocket';
import { generateMaze } from 'src/server/puzzles/lightsOut/lib/generateMaze';
import { AppContext } from 'src/server/state/AppContext';
import type { ClientPuzzleInstance } from 'src/types/ClientPuzzleInstance';
import {
  PushTheButtonPuzzlePayloadType,
  assertIsPushTheButtonPuzzlePayload,
} from 'src/types/puzzles/PuzzleTheButtonTypes';

type LightsOutProps = {
  instance: ClientPuzzleInstance;
  sendInstanceAction: SendInstanceAction;
};

const LightsOut: React.FC<LightsOutProps> = ({
  instance,
  sendInstanceAction,
}) => {
  const appContext = useContext(AppContext);
  const team = appContext?.team;

  if (!team) {
    throw new Error('This puzzle requires a team!');
  }

  const maze = generateMaze();

  return (
    <div
      css={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      {JSON.stringify(maze, null, 4)}
    </div>
  );
};

export default LightsOut;
