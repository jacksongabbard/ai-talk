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
  const [resolvedRecently, setResolvedRecently] = useState<boolean>(false);
  const onThreadInfoChange = useCallback(
    ({ messageCount }: ThreadInfo) => {
      if (resolvedRecently) {
        return;
      }
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
    [resolvedRecently, sendInstanceAction, threadID],
  );

  const onResolved = useCallback(() => {
    sendInstanceAction({ actionType: 'reset' });
    setResolvedRecently(true);
    setTimeout(() => setResolvedRecently(false), 100);
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
      <ThreadIcon
        extraStyle={{
          transform: [
            props.width > props.height ? 'rotate(90deg)' : '',
            `scaleY(${Math.max(props.width, props.height - 1)})`,
          ].join(' '),
          position: 'absolute',
          inset: 0,
          margin: 'auto',
          color: props.color,
          maxWidth: props.height > props.width ? '90%' : '100%',
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

const ThreadIcon: React.FC<{ extraStyle: React.CSSProperties }> = (props) => {
  const gray = 'rgb(30, 30, 30, 0.6)';
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      version="1.1"
      id="Layer_1"
      xmlSpace="preserve"
      viewBox="132.4 0 335.45 511.99"
      style={props.extraStyle}
      height="100%"
      preserveAspectRatio="false"
    >
      <g>
        <g>
          <path
            style={{ fill: '#CDCDCD' }}
            d="M463.957,29.89l-66.719,58.386H203.031L136.304,29.89c-2.472-2.172-3.893-5.297-3.893-8.589v-9.887    C132.411,5.111,137.522,0,143.825,0h312.611c6.312,0,11.423,5.111,11.423,11.414v9.887    C467.859,24.594,466.438,27.719,463.957,29.89"
          />
          <path
            style={{ fill: '#CDCDCD' }}
            d="M136.307,482.101l66.719-58.386h194.207l66.728,58.386c2.472,2.172,3.893,5.297,3.893,8.589v9.887    c0,6.303-5.111,11.414-11.414,11.414H143.828c-6.312,0-11.423-5.111-11.423-11.414v-9.887    C132.405,487.398,133.827,484.273,136.307,482.101"
          />
        </g>
        <path
          style={{ fill: 'currentColor' }}
          d="M203.029,423.72h194.207V88.271H203.029V423.72z"
        />
        <g>
          <path
            style={{ fill: gray }}
            d="M203.029,154.168v21.222l119.658-79.775l-4.899-7.345h-15.916L203.029,154.168z"
          />
          <path
            style={{ fill: gray }}
            d="M203.029,228.943l194.207-120.541V88.267h-1.042L203.029,208.163V228.943z"
          />
          <path
            style={{ fill: gray }}
            d="M397.236,149.839l-136.907,80.896l8.987,15.21l127.921-75.591V149.839z"
          />
          <path
            style={{ fill: gray }}
            d="M397.236,203.328l-75.167,45.1l9.092,15.139l66.074-39.653V203.328z"
          />
          <path
            style={{ fill: gray }}
            d="M203.029,229.817l194.207,51.791v-18.264l-191.929-51.182l-2.278,8.519V229.817z"
          />
          <path
            style={{ fill: gray }}
            d="M257.318,423.72l139.917-78.707v-20.242L221.32,423.72H257.318z"
          />
          <path
            style={{ fill: gray }}
            d="M203.029,326.571l67.452,25.944l6.338-16.481l-73.79-28.39V326.571z"
          />
          <path
            style={{ fill: gray }}
            d="M203.029,274.823l125.034,44.659l5.932-16.622l-130.966-46.777V274.823z"
          />
          <path
            style={{ fill: gray }}
            d="M203.029,371.448v20.189l194.207-107.891v-10.099l-4.281-7.715L203.029,371.448z"
          />
        </g>
      </g>
    </svg>
  );
};

export default Blocked;
