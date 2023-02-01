import { Thread } from '@cord-sdk/react';
import type { ThreadInfo } from '@cord-sdk/types';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
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
  const [payload, setPayload] = useState<BlockedPuzzlePayload | null>(null);
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

  const moveFirstBlock = useCallback(({ change }: { change: number }) => {
    setBlocks((blocks) => {
      blocks[0].row += change;
      blocks[0] = { ...blocks[0] };
      return [...blocks];
    });
  }, []);

  return (
    <>
      <div
        css={{
          display: 'flex',
          justifyContent: 'center',
          height: '55vh',
        }}
      >
        <GameGrid blocks={blocks} />
      </div>
      <div
        css={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'flex-start',
          marginTop: '16px',
          maxHeight: '30vh',
          width: '100%',
        }}
      >
        <GameThread
          color={'green'}
          threadID={'some_threadId_sfsdfsfsafs'}
          sendInstanceAction={moveFirstBlock}
        />
        <GameThread
          color={'blue'}
          threadID={'some_threadId_sfsdfsfsafs_dsfdsfsa'}
          sendInstanceAction={moveFirstBlock}
        />
      </div>
    </>
  );
};

type Block = {
  color: string;
  width: number;
  height: number;
  row: number;
  col: number;
};

const GameThread: React.FC<{
  threadID: string;
  color: string;
  sendInstanceAction: (action: any /*TODO - type this */) => void;
}> = ({ threadID, color, sendInstanceAction }) => {
  const prevCount = useRef<number | null>(null);
  const onThreadInfoChange = useCallback(
    ({ messageCount }: ThreadInfo) => {
      if (prevCount.current === null) {
        prevCount.current = messageCount;
        return;
      }
      if (prevCount.current > messageCount) {
        sendInstanceAction({ threadID, change: 1 });
      } else if (prevCount.current < messageCount) {
        sendInstanceAction({ threadID, change: -1 });
      }
      prevCount.current = messageCount;
    },
    [sendInstanceAction, threadID],
  );

  return (
    <Thread
      style={
        {
          '--cord-color-base': color,
          '--cord-color-base-strong': 'black',
          '--cord-color-base-x-strong': 'white',
          '--cord-color-content-primary': 'white',
          '--cord-color-content-secondary': 'white',
          '--cord-color-content-emphasis': 'white',
          '--cord-color-brand-primary': 'white',
        } as React.CSSProperties
      }
      threadId={threadID}
      onThreadInfoChange={onThreadInfoChange}
    />
  );
};

const GRID_SIZE = 6;
const GameGrid: React.FC<{ blocks: Block[] }> = ({ blocks }) => {
  return (
    <div
      css={{
        position: 'relative',
        height: '100%',
        aspectRatio: '1 / 1',
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
        padding: '10px',
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
