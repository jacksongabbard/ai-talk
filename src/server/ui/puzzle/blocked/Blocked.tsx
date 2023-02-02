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

  // keep blocks in the same order
  const blocks: Block[] = (payload?.threads ?? []).sort((a, b) =>
    a.threadID < b.threadID ? -1 : a.threadID > b.threadID ? 1 : 0,
  );

  return (
    <>
      <div
        css={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gridTemplateRows: `repeat(4, ${ROW_HEIGHT})`,
          gap: '12px',
          alignItems: 'start',
        }}
      >
        <div css={{ gridColumn: '2 / 5', gridRow: '1 / 4', margin: 'auto' }}>
          <GameGrid blocks={blocks} />
        </div>
        {payload?.ownedThreadIDs.map((threadID) => {
          return (
            <GameThread
              key={threadID}
              color={
                payload?.threads.find((thread) => thread.threadID === threadID)
                  ?.color ?? 'pink'
              }
              threadID={threadID}
              sendInstanceAction={sendInstanceAction}
            />
          );
        }) ?? []}
      </div>
    </>
  );
};

type Block = {
  color: string;
  width: number;
  height: number;
  row: number;
  column: number;
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
        console.log('send move -1');
        sendInstanceAction({ threadID, direction: -1, actionType: 'move' });
      } else if (prevCount.current < messageCount) {
        console.log('send move 1');

        sendInstanceAction({ threadID, direction: 1, actionType: 'move' });
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
          maxHeight: ROW_HEIGHT,
        } as React.CSSProperties
      }
      threadId={threadID}
      onThreadInfoChange={onThreadInfoChange}
    />
  );
};

const GRID_SIZE = 6;
const ROW_HEIGHT = '20vh';
const GameGrid: React.FC<{ blocks: Block[] }> = ({ blocks }) => {
  return (
    <div
      css={{
        position: 'relative',
        height: `calc(3*${ROW_HEIGHT})`,
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
        // TODO: remove -1 from top and left
        top: `calc(100% * ${props.row} / ${GRID_SIZE})`,
        left: `calc(100% * ${props.column} / ${GRID_SIZE})`,
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
