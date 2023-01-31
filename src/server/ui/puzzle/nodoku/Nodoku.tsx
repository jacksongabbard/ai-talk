import React, { useCallback, useContext, useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';

import type { SendInstanceAction } from 'src/client/hooks/useWebSocket';
import {
  NodokuPuzzlePayloadType,
  assertIsNodokuPuzzlePayload,
} from 'src/types/puzzles/NodokuTypes';
import { AppContext } from 'src/server/state/AppContext';
import type { ClientPuzzleInstance } from 'src/types/ClientPuzzleInstance';
import { makeFlatGrid } from 'src/lib/puzzles/nodoku/makeFlatGrid';
import { grid } from '@mui/system';
import { PresenceFacepile, PresenceObserver } from '@cord-sdk/react';

type NodokuProps = {
  instance: ClientPuzzleInstance;
  sendInstanceAction: SendInstanceAction;
};

const Nodoku: React.FC<NodokuProps> = ({ instance, sendInstanceAction }) => {
  const [payload, setPayload] = useState<NodokuPuzzlePayloadType>({
    grid: makeFlatGrid(0),
    correct: makeFlatGrid(false),
    metavalues: {},
    solutionAttempt: '',
  });

  const [localGrid, setLocalGrid] = useState<{
    [x_y: string]: number | string;
  }>(payload.grid);

  useEffect(() => {
    if (!instance) {
      throw new Error('No instance of Nodoku');
    }

    const pp = assertIsNodokuPuzzlePayload(instance.puzzlePayload);
    setPayload(pp);
    setLocalGrid(pp.grid);
  }, [instance, setPayload, setLocalGrid]);

  const appContext = useContext(AppContext);
  if (!appContext?.user) {
    throw new Error('No user');
  }

  const handleValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const x = parseInt(e.target.dataset['x'] || '');
      const y = parseInt(e.target.dataset['y'] || '');
      if (x === undefined || y === undefined) {
        throw new Error('Input missing data-x or data-y attributes');
      }

      const intValue = e.target.value !== '' ? parseInt(e.target.value, 10) : 0;
      if (intValue !== undefined && intValue >= 0 && intValue <= 9) {
        const newGrid = cloneDeep(localGrid);
        newGrid[x + '_' + y] = intValue;
        setLocalGrid(newGrid);
        sendInstanceAction({
          actionType: 'entry',
          value: intValue,
          coord: x + '_' + y,
        });
        return;
      }
    },
    [localGrid, setLocalGrid, sendInstanceAction],
  );

  const onSolutionChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      sendInstanceAction({
        actionType: 'solve',
        solution: e.target.value,
      });
    },
    [sendInstanceAction],
  );

  const grid: React.ReactNode[] = [];
  for (let y = 0; y < 9; y++) {
    const row: React.ReactNode[] = [];
    for (let x = 0; x < 9; x++) {
      const coord = x + '_' + y;
      const val = localGrid[coord] !== 0 ? localGrid[coord] : '';
      const valid = payload.correct[coord] === true;
      let color = '#030';
      let bg = '#000';
      if (payload.metavalues[coord]) {
        bg = '#7f7';
        color = '#000';
      } else if (valid) {
        bg = '#3e3';
        color = '#000';
      } else if (val !== '') {
        bg = '#f33';
        color = '#000';
      }

      const location = { x, y, puzzle: 'nodoku' };
      row.push(
        <div
          key={coord}
          css={{
            height: '5vw',
            width: '5vw',
            position: 'relative',
          }}
        >
          <PresenceObserver location={location}>
            <input
              data-x={x}
              data-y={y}
              type="text"
              disabled={valid}
              value={val}
              placeholder="0"
              onChange={handleValueChange}
              css={{
                background: bg,
                border: 0,
                borderLeft: '1px #3f3 solid',
                borderTop: '1px #3f3 solid',
                boxSizing: 'border-box',
                color,
                fontFamily: 'monospace',
                fontSize: '4.8vw',
                height: '5vw',
                lineHeight: '4.8vw',
                outline: 'none',
                textAlign: 'center',
                width: '5vw',
              }}
            />
            <div css={{ position: 'absolute', bottom: 2, right: 2 }}>
              <PresenceFacepile location={location} maxUsers={1} />
            </div>
          </PresenceObserver>
        </div>,
      );
    }

    grid.push(
      <div key={'row_' + y} css={{ display: 'flex', flexDirection: 'row' }}>
        {row}
      </div>,
    );
  }

  return (
    <div
      css={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <div
        css={{
          flex: 1,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <div
          css={{
            padding: 'var(--spacing-xlarge)',
          }}
        >
          <div
            css={{
              borderBottom: '1px #3f3 solid',
              borderRight: '1px #3f3 solid',
            }}
          >
            {grid}
          </div>
        </div>
        <div css={{ position: 'relative' }}>
          <PresenceObserver location={{ puzzle: 'nodoku', solutionBox: 1 }}>
            <input
              type="string"
              value={payload.solutionAttempt}
              onChange={onSolutionChange}
              placeholder="Enter the solution..."
              css={{
                boxSizing: 'border-box',
                fontSize: 24,
                color: '#3f3',
                background: '#000',
                border: '1px #3f3 solid',
                width: '45vw',
                maxWidth: '45vw',
                textAlign: 'center',
              }}
            />
            <div css={{ position: 'absolute', bottom: 4, right: 4 }}>
              <PresenceFacepile
                location={{ puzzle: 'nodoku', solutionBox: 1 }}
              />
            </div>
          </PresenceObserver>
        </div>
      </div>
    </div>
  );
};

export default Nodoku;
