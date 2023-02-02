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
  const wall = payload?.wall ?? null;

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
          <GameGrid blocks={blocks} wall={wall} />
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
        sendInstanceAction({ threadID, direction: -1, actionType: 'move' });
      } else if (prevCount.current < messageCount) {
        sendInstanceAction({ threadID, direction: 1, actionType: 'move' });
      }
      prevCount.current = messageCount;
    },
    [sendInstanceAction, threadID],
  );

  const onResolved = useCallback(() => {
    sendInstanceAction({ actionType: 'reset' });
  }, [sendInstanceAction]);
  const onClose = useCallback(() => {
    sendInstanceAction({ threadID, direction: -1, actionType: 'move' });
  }, [sendInstanceAction, threadID]);

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
      showHeader={true}
      onResolved={onResolved}
      onClose={onClose}
      threadId={threadID}
      onThreadInfoChange={onThreadInfoChange}
    />
  );
};

const GRID_SIZE = 6;
const GRID_BORDER = '5px';
const ROW_HEIGHT = '20vh';
const GameGrid: React.FC<{ blocks: Block[]; wall: Block | null }> = ({
  blocks,
  wall,
}) => {
  return (
    <div
      css={{
        position: 'relative',
        height: `calc(3*${ROW_HEIGHT})`,
        aspectRatio: '1 / 1',
        // CSS trick to draw a grid
        backgroundImage: `repeating-linear-gradient(#3f3 0 ${GRID_BORDER}, transparent ${GRID_BORDER} 100%),
                          repeating-linear-gradient(90deg, #3f3 0 ${GRID_BORDER}, transparent ${GRID_BORDER} 100%)`,
        backgroundSize: `calc((100% - ${GRID_BORDER}) / ${GRID_SIZE}) calc((100% - ${GRID_BORDER}) / ${GRID_SIZE})`,
      }}
    >
      {blocks.map((block, i) => (
        <Block key={i} {...block} />
      ))}
      {wall && <Wall {...wall} />}
      <div
        css={{
          // this is the little triangle marking exit
          position: 'absolute',

          // draw a triangle in CSS
          borderColor: 'transparent transparent transparent #3f3',
          borderStyle: 'solid',
          borderWidth: '10px', // half of triangle size

          left: 'calc(100% - 1px)',
          // move down by 2.5 rows then offset up by half of the triangle size
          top: `calc((100% - ${GRID_BORDER})/${GRID_SIZE}*2.5 + 0.5*${GRID_BORDER} - 10px)`,
        }}
      />
    </div>
  );
};

const Block: React.FC<Block> = (props) => {
  return (
    <div
      css={{
        ...getBlockPositionCSS(
          props.row,
          props.column,
          props.width,
          props.height,
        ),
        transition: 'top 1s, left 1s',
        position: 'absolute',
        padding: '10px',
      }}
    >
      <div
        css={{
          borderRadius: '5px',
          background: props.color,
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};

const Wall: React.FC<Block> = (props) => {
  return (
    <div
      css={{
        ...getBlockPositionCSS(
          props.row,
          props.column,
          props.width,
          props.height,
        ),
        position: 'absolute',
      }}
    >
      <div
        css={{
          background: 'gray',
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};

function getBlockPositionCSS(
  row: number,
  col: number,
  blockWidth: number,
  blockHeight: number,
) {
  // Beware of css floating point inaccuracies if changing this function
  const oneSquare = `(100% - ${GRID_BORDER})/${GRID_SIZE}`;
  return {
    top: `calc(${row}*${oneSquare} + ${GRID_BORDER})`,
    left: `calc(${col}*${oneSquare} + ${GRID_BORDER})`,
    width: `calc(${blockWidth}*${oneSquare} - ${GRID_BORDER})`,
    height: `calc(${blockHeight}*${oneSquare} - ${GRID_BORDER})`,
  };
}

export default Blocked;
