import { Button } from '@mui/material';
import { useCallback, useContext, useEffect, useState } from 'react';
import type { SendInstanceAction } from 'src/client/hooks/useWebSocket';
import { AppContext } from 'src/server/state/AppContext';
import type { ClientPuzzleInstance } from 'src/types/ClientPuzzleInstance';
import {
  PushTheButtonPuzzlePayloadType,
  assertIsPushTheButtonPuzzlePayload,
} from 'src/types/puzzles/PuzzleTheButtonTypes';

type PushTheButtonProps = {
  instance: ClientPuzzleInstance;
  sendInstanceAction: SendInstanceAction;
};

const PushTheButton: React.FC<PushTheButtonProps> = ({
  instance,
  sendInstanceAction,
}) => {
  const [payload, setPayload] = useState<PushTheButtonPuzzlePayloadType>({
    pressed: {},
    uuidsToNames: {},
  });

  useEffect(() => {
    if (!instance) {
      throw new Error('No instance of PushTheButton');
    }

    const pp = assertIsPushTheButtonPuzzlePayload(instance.puzzlePayload);
    setPayload(pp);
  }, [instance, setPayload]);

  const appContext = useContext(AppContext);
  if (!appContext?.user) {
    throw new Error('No user');
  }
  const onPointerDown = useCallback(() => {
    sendInstanceAction({
      on: true,
    });
  }, [sendInstanceAction]);

  const onPointerUp = useCallback(() => {
    sendInstanceAction({
      on: false,
    });
  }, [sendInstanceAction]);

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
        {Object.keys(payload.uuidsToNames).map((uuid) => {
          return (
            <div
              key={uuid}
              css={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div
                css={{
                  fontSize: '3vmin',
                  paddingRight: 'var(--spacing-medium)',
                }}
              >
                {payload.pressed[uuid] === true ? <>❤️</> : <>💔</>}
              </div>
              <div>{payload.uuidsToNames[uuid]}</div>
            </div>
          );
        })}
      </div>
      <div css={{ flex: 1 }}>
        <Button
          variant="contained"
          css={{
            width: '25vmin',
            height: '25vmin',
            borderRadius: '25vmin',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          <span css={{ fontSize: '10vmin', lineHeight: '10vmin' }}>❤️</span>
        </Button>
      </div>
    </div>
  );
};

export default PushTheButton;
