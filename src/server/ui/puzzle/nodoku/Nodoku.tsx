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
      console.log(e.target.value);
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
        console.log('TODO: Call the API to sync the grid');
        setLocalGrid(newGrid);
        return;
      }
    },
    [localGrid, setLocalGrid],
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
                {row.map((val, x) => (
                  <input
                    data-x={x}
                    data-y={y}
                    type="text"
                    value={val}
                    onChange={handleValueChange}
                    key={'y_' + y + '_x_' + x}
                    css={{
                      fontFamily: 'monospace',
                      border: 0,
                      borderTop: '1px #3f3 solid',
                      borderLeft: '1px #3f3 solid',
                      outline: 'none',
                      width: '5vw',
                      height: '5vw',
                      fontSize: '4.8vw',
                      lineHeight: '4.8vw',
                      textAlign: 'center',
                      background: 'black',
                      color: '#3f3',
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nodoku;
