import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { cloneDeep, merge } from 'lodash';

import { useWebSocket } from 'src/client/hooks/useWebSocket';
import PushTheButton from './pushTheButton/PushTheButton';
import MessageBox from '../messageBox/MessageBox';
import { AppContext } from 'src/server/state/AppContext';
import { PuzzleContext } from 'src/server/state/PuzzleContext';
import {
  PAYLOAD_DIFF,
  PUZZLE_SOLVED,
  PayloadDiff,
  assertIsPayloadDiff,
  assertIsSocketMessage,
} from 'src/types/SocketMessage';
import Nodoku from './nodoku/Nodoku';
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import NoYouFirst from './noYouFirst/NoYouFirst';
import SimpleMaze from './simpleMaze/SimpleMaze';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

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

  const actionResultBuffer = useRef<PayloadDiff[]>([]);
  const onMessage = useCallback(
    (message: object) => {
      const sm = assertIsSocketMessage(message);
      if (sm.type === PAYLOAD_DIFF) {
        const payloadDiff = assertIsPayloadDiff(sm.payload);
        if (!puzzleContext.instance) {
          throw new Error('Cannot merge payload diff with no puzzle instance');
        }
        const { instance } = puzzleContext;
        const newInstance = cloneDeep(instance);
        if (
          instance.sequenceNumber !== payloadDiff.seq - 1 &&
          actionResultBuffer.current.length === 0
        ) {
          actionResultBuffer.current.push(payloadDiff);
          if (actionResultBuffer.current.length > 20) {
            throw new Error(
              'PayloadDiff buffer has gotten too big. This is probably a bug or the server is borked.',
            );
          }

          actionResultBuffer.current.sort((a, b) => {
            return a.seq - b.seq;
          });

          while (
            actionResultBuffer.current.length &&
            actionResultBuffer.current[0].seq === instance.sequenceNumber + 1
          ) {
            const actionResult = actionResultBuffer.current.shift();
            if (!actionResult) {
              throw new Error('actionResultBuffer was unexpectedly empty');
            }
            newInstance.puzzlePayload = merge(
              newInstance.puzzlePayload,
              payloadDiff.value,
            );
            newInstance.sequenceNumber = actionResult.seq;
          }
        } else {
          newInstance.puzzlePayload = merge(
            newInstance.puzzlePayload,
            payloadDiff.value,
          );
          newInstance.sequenceNumber = payloadDiff.seq;
        }
        puzzleContext.setInstance(newInstance);
      } else if (sm.type === PUZZLE_SOLVED) {
        puzzleContext.setSolved(true);
        if (puzzleContext.instance) {
          puzzleContext.setInstance({
            ...puzzleContext.instance,
            solvedAt: new Date(),
          });
        }
      }
    },
    [
      connected,
      puzzleContext.instance,
      puzzleContext.setInstance,
      puzzleContext.setSolved,
    ],
  );

  const [errorMessage, setErrorMessage] = useState('');
  const onError = useCallback(
    (error: string) => {
      console.log('ERROR', error);
      setErrorMessage(error);
    },
    [connected, setErrorMessage],
  );

  const onErrorDialogClose = useCallback(() => {
    setErrorMessage('');
  }, [setErrorMessage]);

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

  const navigate = useNavigate();

  return (
    <div
      css={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
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
      {instance && instance.puzzleId === 'no_you_first' && (
        <NoYouFirst
          instance={instance}
          sendInstanceAction={sendInstanceAction}
        />
      )}
      {instance && instance.puzzleId === 'simple_maze' && (
        <SimpleMaze
          instance={instance}
          sendInstanceAction={sendInstanceAction}
        />
      )}
      {instance && instance.solvedAt && (
        <div
          css={{
            alignItems: 'stretch',
            display: 'flex',
            position: 'absolute',
            top: '5vmin',
            left: '5vmin',
            zIndex: 1000,
          }}
        >
          <Button
            onClick={() => {
              navigate('/puzzles', { replace: true });
            }}
            variant="contained"
            css={{
              borderRadius: 0,
            }}
          >
            <ArrowBack />
          </Button>
          <div
            css={{
              background: '#3f3',
              color: '#000',
              padding: 'var(--spacing-large)',
            }}
          >
            SOLVED!
          </div>
        </div>
      )}
      <Dialog open={errorMessage !== ''} onClose={onErrorDialogClose}>
        <DialogTitle>Everything is ruined</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <strong>The follow error occurred:</strong>
            <br />
            <br />
            {errorMessage}
            <br />
            <br />
            Your best bet is to refresh the page.
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PuzzleShell;
