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
        display: 'flex',
      }}
    >
      <ThreadIcon
        extraStyle={{
          flexGrow: '1',
          color: props.color,
        }}
        rotate={props.width > props.height}
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

const ThreadIcon: React.FC<{
  extraStyle: React.CSSProperties;
  rotate: boolean;
}> = (props) => {
  const gray = 'rgb(30, 30, 30, 0.6)';
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      version="1.1"
      id="Layer_1"
      xmlSpace="preserve"
      viewBox={props.rotate ? '123.58 0 512 264.83' : '123.58 0 264.83 512'}
      style={props.extraStyle}
      preserveAspectRatio="none"
    >
      <g transform={props.rotate ? 'rotate(90,379.5815,255.9985)' : undefined}>
        <path
          style={{ fill: 'currentColor' }}
          d="M367.816,441.379H144.187c-11.379,0-20.604-9.225-20.604-20.595V91.215   c0-11.37,9.225-20.595,20.604-20.595h223.629c11.379,0,20.595,9.225,20.595,20.595v329.569   C388.411,432.155,379.195,441.379,367.816,441.379"
        ></path>
        <g>
          <path
            style={{ fill: '#E6E6E6' }}
            d="M297.196,512h-82.388c-11.379,0-20.604-9.225-20.604-20.595v-50.026H317.79v50.026    C317.79,502.775,308.574,512,297.196,512"
          ></path>
          <path
            style={{ fill: '#E6E6E6' }}
            d="M317.793,70.621H194.207V20.595C194.207,9.225,203.432,0,214.802,0h82.397    c11.37,0,20.595,9.225,20.595,20.595V70.621z"
          ></path>
        </g>
        <g> </g>
        <g>
          <path
            style={{ fill: gray }}
            d="M123.586,148.8v10.099l4.281,7.715L291.31,70.623h-8.828h-18.176L123.586,148.8z"
          ></path>
          <path
            style={{ fill: gray }}
            d="M123.586,220.69l4.467,7.618L383.806,78.38c-3.778-4.696-9.498-7.759-15.987-7.759h-5.694    L123.586,210.458V220.69z"
          ></path>
          <path
            style={{ fill: gray }}
            d="M388.414,123.586l-4.493-7.601L189.714,230.744l8.986,15.201l189.714-112.11V123.586z"
          ></path>
          <path
            style={{ fill: gray }}
            d="M388.414,176.552l-4.546-7.565l-132.414,79.448l9.092,15.13l127.868-76.721V176.552z"
          ></path>
          <path
            style={{ fill: gray }}
            d="M388.414,229.517v-8.828l-75.299,45.48l9.357,14.972l65.942-41.207V229.517z"
          ></path>
          <path
            style={{ fill: gray }}
            d="M128.147,424.823l8.298,15.025c0.212,0.079,0.441,0.124,0.653,0.203L388.41,301.396v-10.09    l-4.264-7.724L128.147,424.823z"
          ></path>
          <path
            style={{ fill: gray }}
            d="M123.586,220.69v9.137l262.55,70.012l2.277-8.527v-9.137l-262.55-70.012L123.586,220.69z"
          ></path>
          <path
            style={{ fill: gray }}
            d="M388.414,363.343v-10.24l-4.476-7.609L220.69,441.379h17.655h17.408L388.414,363.343z"
          ></path>
          <path
            style={{ fill: gray }}
            d="M123.586,273.655v9.163l196.255,54.51l4.732-17.002l-198.621-55.172L123.586,273.655z"
          ></path>
          <path
            style={{ fill: gray }}
            d="M123.586,326.621v9.137l135.433,36.114l4.546-17.055l-137.702-36.723L123.586,326.621z"
          ></path>
          <path
            style={{ fill: gray }}
            d="M123.586,370.759v9.304l76.659,25.556l5.579-16.755l-79.448-26.483L123.586,370.759z"
          ></path>
        </g>
      </g>
    </svg>
  );
};

export default Blocked;
