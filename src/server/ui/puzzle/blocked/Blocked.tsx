import { useContext, useEffect, useState } from 'react';
import type { SendInstanceAction } from 'src/client/hooks/useWebSocket';
import { AppContext } from 'src/server/state/AppContext';
import type { ClientPuzzleInstance } from 'src/types/ClientPuzzleInstance';
import {
  assertIsBlockedPuzzledPayload,
  BlockedPuzzlePayload,
} from 'src/types/puzzles/BlockedTypes';

type BlockedProps = {
  instance: ClientPuzzleInstance;
  sendInstanceAction: SendInstanceAction;
};

const Blocked: React.FC<BlockedProps> = ({ instance, sendInstanceAction }) => {
  const [payload, setPayload] = useState<BlockedPuzzlePayload | any>({});
  useEffect(() => {
    if (!instance) {
      throw new Error('No instance of Blocked');
    }

    const pp = assertIsBlockedPuzzledPayload(instance.puzzlePayload);
    setPayload(pp);
  }, [instance, setPayload]);

  const appContext = useContext(AppContext);
  if (!appContext?.user) {
    throw new Error('No user');
  }
  return <GameGrid />;
};

type Block = {
  color: string;
  width: number;
  height: number;
  row: number;
  col: number;
};

const GRID_SIZE = 6;
const GameGrid: React.FC<unknown> = () => {
  const [blocks, setBlocks] = useState<Block[]>([
    {
      color: 'green',
      width: 1,
      height: 2,
      row: 2,
      col: 2,
    },
    {
      color: 'red',
      width: 2,
      height: 1,
      row: 0,
      col: 0,
    },
  ]);

  useEffect(() => {
    const onArrowPress = (e: KeyboardEvent) => {
      let [row_delta, col_delta] = [0, 0];
      switch (e.key) {
        case 'ArrowUp':
          row_delta = -1;
          break;
        case 'ArrowDown':
          row_delta = 1;
          break;
        case 'ArrowLeft':
          col_delta = -1;
          break;
        case 'ArrowRight':
          col_delta = 1;
          break;
      }
      if (row_delta != 0 || col_delta != 0) {
        e.preventDefault();
        setBlocks((blocks) => {
          blocks[0].row += row_delta;
          blocks[0].col += col_delta;
          return [...blocks];
        });
      }
    };
    window.addEventListener('keydown', onArrowPress);
    return () => window.removeEventListener('keydown', onArrowPress);
  }, []);
  return (
    <div
      css={{
        width: '50%',
        paddingTop: '50%', // make it square
        position: 'relative',
        // CSS trick to draw a grid
        backgroundImage: `repeating-linear-gradient(#ccc 0 1px, transparent 1px 100%),
                          repeating-linear-gradient(90deg, #ccc 0 1px, transparent 1px 100%)`,
        backgroundSize: `calc((100% - 1px) / ${GRID_SIZE}) calc((100% - 1px) / ${GRID_SIZE})`,
      }}
    >
      {blocks.map((block, i) => (
        <Block key={i} {...block} />
      ))}
    </div>
  );
};

const Block: React.FC<Block> = (props) => {
  return (
    <div
      css={{
        top: `calc(100% * ${props.row} / ${GRID_SIZE})`,
        left: `calc(100% * ${props.col} / ${GRID_SIZE})`,
        height: `calc(100% * ${props.height} / ${GRID_SIZE})`,
        width: `calc(100% * ${props.width} / ${GRID_SIZE})`,
        transition: '1s',
        position: 'absolute',
        padding: '20px',
      }}
    >
      <div
        css={{
          borderRadius: '10px',
          background: props.color,
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};

export default Blocked;
