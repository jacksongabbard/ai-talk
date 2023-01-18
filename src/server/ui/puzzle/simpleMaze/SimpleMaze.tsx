import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { Button, iconButtonClasses } from '@mui/material';

import type { SendInstanceAction } from 'src/client/hooks/useWebSocket';
import { AppContext } from 'src/server/state/AppContext';
import type { ClientPuzzleInstance } from 'src/types/ClientPuzzleInstance';
import Paths from './Paths';
import { assertIsSimpleMazePuzzlePayload } from 'src/types/puzzles/SimpleMaze';
import { PresenceFacepile, PresenceObserver } from '@cord-sdk/react';

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

  if (!appContext.user) {
    throw new Error('No user in SimpleMaze. Wat!?');
  }
  const revealedLetters = payload.revealedLetterGrids[appContext.user.id];
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
            {
              <div
                key={'letter-' + c}
                css={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 30,
                  fontFamily: 'monospace',
                  lineHeight: 30,
                  color:
                    revealedLetters &&
                    revealedLetters[c] &&
                    revealedLetters[c].toLowerCase() === revealedLetters[c]
                      ? '#3c3'
                      : '#2a2',
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  opacity: revealedLetters && revealedLetters[c] ? 1 : 0,
                  top: 0,
                  left: 0,
                  zIndex: 3,
                  transition: 'opacity .5s',
                }}
              >
                {revealedLetters && revealedLetters[c]}
              </div>
            }
          </div>,
        );
      }
    }
    return <>{grid}</>;
  }, [payload.maze.grid, revealedLetters]);

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
    // Typescript is unhappy about this. I don't know why. I'm too
    // tired to figure out why.
    if (playerRefs[uuid]!.current) {
      playerRefs[uuid].current.style.top =
        payload.playerPositions[uuid].y * 100 + 33.33 + 'px';
      playerRefs[uuid].current.style.left =
        payload.playerPositions[uuid].x * 100 + 33.33 + 'px';
    }
  });

  const scrolledOnce = useRef(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (
      scrolledOnce.current ||
      !appContext.user ||
      !scrollContainerRef.current
    ) {
      return;
    }

    if (!payload.playerPositions[appContext.user.id]) {
      throw new Error(
        "PlayerPositions doesn't have the current user?! Unpossible!",
      );
    }

    const w = window.innerWidth;
    const h = window.innerHeight;

    const x = payload.playerPositions[appContext.user.id].x * 100 - w / 2;
    const y = payload.playerPositions[appContext.user.id].y * 100 - h / 2;

    scrollContainerRef.current.scrollTo(x, y);
    scrolledOnce.current = true;
  }, [payload, appContext.user]);

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
        actionType: 'move',
        direction,
      });
    };

    window.addEventListener('keydown', onKey, true);
    return () => {
      window.removeEventListener('keydown', onKey, true);
    };
  }, [sendInstanceAction]);

  const onSolutionChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      sendInstanceAction({
        actionType: 'solve',
        solution: e.target.value,
      });
    },
    [sendInstanceAction],
  );

  return (
    <div
      ref={scrollContainerRef}
      css={{
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'auto',
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
      {payload.showInput && (
        <div
          css={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          <div
            css={{ background: 'black', padding: 50, border: '1px #3f3 solid' }}
          >
            <PresenceObserver
              location={{ puzzle: 'noYouFirst', solutionBox: 1 }}
            >
              <input
                type="string"
                value={payload.solutionAttempt}
                onChange={onSolutionChange}
                placeholder="Enter the solution..."
                css={{
                  fontSize: 24,
                  color: '#3f3',
                  background: '#000',
                  border: '1px #3f3 solid',
                  width: '60vw',
                  maxWidth: '60vw',
                  textAlign: 'center',
                }}
              />

              <div css={{ position: 'absolute', bottom: 4, right: 4 }}>
                <PresenceFacepile
                  location={{ puzzle: 'noYouFirst', solutionBox: 1 }}
                />
              </div>
            </PresenceObserver>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleMaze;
