import { useCallback, useContext, useEffect, useState } from 'react';
import { merge } from 'lodash';

import { useWebSocket } from 'src/client/hooks/useWebSocket';
import PushTheButton from './pushTheButton/PushTheButton';
import MessageBox from '../messageBox/MessageBox';
import { AppContext } from 'src/server/state/AppContext';
import { PuzzleContext } from 'src/server/state/PuzzleContext';
import {
  PAYLOAD_DIFF,
  PUZZLE_SOLVED,
  assertIsPayloadDiff,
  assertIsSocketMessage,
} from 'src/types/SocketMessage';
import Nodoku from './nodoku/Nodoku';

const PuzzleShell: React.FC = () => {
  const appContext = useContext(AppContext);
  const puzzleContext = useContext(PuzzleContext);
  const { instance } = puzzleContext;

  useEffect(() => {
    appContext?.setShowHeader(false);
    return () => {
      appContext?.setShowHeader(true);
    };
  }, [appContext?.setShowHeader]);

  const [connected, setConnected] = useState(false);
  const onConnected = useCallback(() => {
    setConnected(true);
  }, [setConnected]);

  const onClose = useCallback(() => {
    setConnected(false);
  }, [setConnected]);

  const onMessage = useCallback(
    (message: object) => {
      const sm = assertIsSocketMessage(message);
      if (sm.type === PAYLOAD_DIFF) {
        const payloadDiff = assertIsPayloadDiff(sm.payload);
        if (!puzzleContext.instance) {
          throw new Error('Cannot merge payload diff with no puzzle instance');
        }
        const { instance } = puzzleContext;
        console.log({ instance, payloadDiff });
        if (instance.sequenceNumber !== payloadDiff.seq - 1) {
          throw new Error(
            'Received out-of-order payload diffs. Everything is ruined.',
          );
        }

        // TODO: Add some guarantee here that the payload diff is correct
        // for the puzzle

        const newPuzzlePayload = merge(
          instance.puzzlePayload,
          payloadDiff.value,
        );

        puzzleContext.setInstance({
          ...instance,
          sequenceNumber: payloadDiff.seq,
          puzzlePayload: newPuzzlePayload,
        });
      } else if (sm.type === PUZZLE_SOLVED) {
        puzzleContext.setSolved(true);
      }
    },
    [
      connected,
      puzzleContext.instance,
      puzzleContext.setInstance,
      puzzleContext.setSolved,
    ],
  );

  const onError = useCallback(
    (error: string) => {
      console.log('ERROR', error);
    },
    [connected],
  );

  const { sendInstanceAction, setPuzzle } = useWebSocket(
    onConnected,
    onClose,
    onMessage,
    onError,
  );

  useEffect(() => {
    if (!connected) {
      return;
    }
    if (instance) {
      setPuzzle(instance.puzzleId);
    }
  }, [setPuzzle, instance?.puzzleId, connected]);

  return (
    <div
      css={{
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {!connected && <MessageBox type="info">Connecting...</MessageBox>}
      {instance && instance.puzzleId === 'push_the_button' && (
        <PushTheButton
          instance={instance}
          sendInstanceAction={sendInstanceAction}
        />
      )}
      {instance && instance.puzzleId === 'nodoku' && (
        <Nodoku instance={instance} sendInstanceAction={sendInstanceAction} />
      )}
      {instance && instance.solvedAt && (
        <div
          css={{
            position: 'absolute',
            top: '5vmin',
            left: '5vmin',
            background: 'black',
            border: '1px #3f3 solid',
            color: 'white',
            padding: 'var(--spacing-large)',
          }}
        >
          SOLVED!
        </div>
      )}
    </div>
  );
};

export default PuzzleShell;
