import React, { useCallback, useContext, useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';

import type { SendInstanceAction } from 'src/client/hooks/useWebSocket';
import {
  NodokuPuzzlePayloadType,
  assertIsNodokuPuzzlePayload,
} from 'src/types/puzzles/NodokuTypes';
import { AppContext } from 'src/server/state/AppContext';
import type { ClientPuzzleInstance } from 'src/types/ClientPuzzleInstance';

type NodokuProps = {
  instance: ClientPuzzleInstance;
  sendInstanceAction: SendInstanceAction;
};

const Nodoku: React.FC<NodokuProps> = ({ instance, sendInstanceAction }) => {
  const [payload, setPayload] = useState<NodokuPuzzlePayloadType>({
    grid: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
    correct: [
      [false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false],
    ],
  });

  const [localGrid, setLocalGrid] = useState<(number | string)[][]>(
    payload.grid,
  );

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

      if (e.target.value === '') {
        const newGrid = cloneDeep(localGrid);
        newGrid[y][x] = '';
        setLocalGrid(newGrid);
        return;
      }

      const intValue = parseInt(e.target.value, 10);
      if (intValue !== undefined && intValue >= 0 && intValue <= 9) {
        const newGrid = cloneDeep(localGrid);
        newGrid[y][x] = intValue;
        setLocalGrid(newGrid);
        sendInstanceAction({
          value: intValue,
          x,
          y,
        });
        return;
      }
    },
    [localGrid, setLocalGrid, sendInstanceAction],
  );

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
            {localGrid.map((row, y) => (
              <div key={'row_' + y}>
                {row.map((val, x) => {
                  const valid = payload.correct[y][x] === true;
                  let color = '#030';
                  let bg = '#000';
                  if (valid) {
                    bg = '#3f3';
                    color = '#000';
                  } else if (val !== 0) {
                    bg = '#f33';
                    color = '#000';
                  }
                  return (
                    <input
                      data-x={x}
                      data-y={y}
                      type="text"
                      disabled={valid}
                      value={val}
                      onChange={handleValueChange}
                      key={'y_' + y + '_x_' + x}
                      css={{
                        background: bg,
                        border: 0,
                        borderLeft: '1px #3f3 solid',
                        borderTop: '1px #3f3 solid',
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
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nodoku;
