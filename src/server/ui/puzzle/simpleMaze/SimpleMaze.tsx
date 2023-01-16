import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { Button } from '@mui/material';

import type { SendInstanceAction } from 'src/client/hooks/useWebSocket';
import { AppContext } from 'src/server/state/AppContext';
import type { ClientPuzzleInstance } from 'src/types/ClientPuzzleInstance';
import { assertIsSimpleMazePuzzlePayload } from 'src/types/puzzles/SimpleMaze';
import Paths from './Paths';

export function coord(x: number, y: number) {
  return x + '_' + y;
}

type SimpleMazeProps = {
  instance: ClientPuzzleInstance;
  sendInstanceAction: SendInstanceAction;
};

const SimpleMaze: React.FC<SimpleMazeProps> = ({
  instance,
  sendInstanceAction,
}) => {
  const appContext = useContext(AppContext);
  const team = appContext?.team;

  if (!team) {
    throw new Error('This puzzle requires a team!');
  }

  const payload = assertIsSimpleMazePuzzlePayload(instance.puzzlePayload);

  const grid = useMemo(() => {
    const grid: React.ReactNode[] = [];
    for (let y = 0; y < payload.maze.size; y++) {
      for (let x = 0; x < payload.maze.size; x++) {
        const c = coord(x, y);
        grid.push(
          <div
            key={'cell-' + coord(x, y)}
            css={{
              top: y * 100,
              left: x * 100,
              width: 100,
              height: 100,
              position: 'absolute',
              boxSizing: 'border-box',
              borderLeft: '1px #020 solid',
              borderTop: '1px #020 solid',
            }}
          >
            {payload.maze.exit === c && (
              <div
                css={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 30,
                  lineHeight: 30,
                  background: '#3f3',
                  width: '33%', // intentionally a smidge small
                  height: '33%', // intentionally a smidge small
                  position: 'absolute',
                  top: '33.33%',
                  left: '33.33%',
                  borderRadius: '100%',
                  zIndex: 1,
                }}
              ></div>
            )}
            <Paths cell={payload.maze.grid[c]} />
            {payload.maze.exit === c && (
              <div
                css={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 30,
                  lineHeight: 30,
                  color: '#000',
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  zIndex: 3,
                }}
              >
                ★
              </div>
            )}
          </div>,
        );
      }
    }
    return <>{grid}</>;
  }, [payload.maze.grid]);

  const { playerRefs, playerElements } = useMemo(() => {
    if (!appContext.user) {
      throw new Error('No user in AppContext');
    }
    const playerRefs: { [uuid: string]: React.Ref<HTMLDivElement> } = {};
    const playerElements: React.ReactNode[] = [];

    for (let uuid in payload.playerPositions) {
      const coordinate = payload.playerPositions[uuid];
      const ref = React.createRef<HTMLDivElement>();
      playerRefs[uuid] = ref;
      playerElements.push(
        <div
          key={uuid}
          ref={ref}
          style={{
            width: 33.33,
            height: 33.33,
            background: uuid === appContext.user.id ? '#3f3' : '#1d1',
            position: 'absolute',
            transition: 'top 0.2s, left 0.2s',
          }}
        ></div>,
      );
    }
    return {
      playerRefs,
      playerElements,
    };
  }, [appContext.user]);

  Object.keys(playerRefs).forEach((uuid) => {
    if (!playerRefs[uuid]) {
      throw new Error("The puzzle is broken. I'm really sorry. 😔");
    }
    console.log(playerRefs[uuid]);
    if (playerRefs[uuid]!.current) {
      playerRefs[uuid].current.style.top =
        payload.playerPositions[uuid].y * 100 + 33.33 + 'px';
      playerRefs[uuid].current.style.left =
        payload.playerPositions[uuid].x * 100 + 33.33 + 'px';
    }
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.key === 'ArrowUp' ||
        e.key === 'ArrowDown' ||
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight'
      ) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }

      let direction: 'up' | 'right' | 'down' | 'left' | undefined = undefined;

      switch (e.key) {
        case 'ArrowUp':
          direction = 'up';
          break;
        case 'ArrowRight':
          direction = 'right';
          break;
        case 'ArrowDown':
          direction = 'down';
          break;
        case 'ArrowLeft':
          direction = 'left';
          break;
      }

      if (!direction) {
        return;
      }

      sendInstanceAction({
        direction,
      });
    };

    window.addEventListener('keydown', onKey, true);
    return () => {
      window.removeEventListener('keydown', onKey, true);
    };
  }, [sendInstanceAction]);

  return (
    <div
      css={{
        flex: 1,
      }}
    >
      <div
        css={{
          position: 'relative',
          flex: 0,
          flexGrow: 0,
          flexShrink: 0,
          boxSizing: 'content-box',
          borderTop: '5px #383 solid',
          borderLeft: '5px #383 solid',
          borderRight: '6px #383 solid',
          borderBottom: '6px #383 solid',
          height: payload.maze.size * 100,
          width: payload.maze.size * 100,
        }}
      >
        {grid}
        {playerElements}
      </div>
    </div>
  );
};

export default SimpleMaze;
