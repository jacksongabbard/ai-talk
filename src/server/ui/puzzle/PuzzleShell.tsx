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
import Blocked from 'src/server/ui/puzzle/blocked/Blocked';
import ConfirmationDialog from 'src/server/ui/dialogs/ConfirmationDialog';
import useDialog from 'src/server/ui/dialogs/useDialog';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';
import callAPI from 'src/client/lib/callAPI';

const PuzzleShell: React.FC = () => {
  const appContext = useContext(AppContext);
  const puzzleContext = useContext(PuzzleContext);
  const { instance, setInstance, setSolved } = puzzleContext;

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
    [setErrorMessage],
  );

  const onErrorDialogClose = useCallback(() => {
    setErrorMessage('');
  }, [setErrorMessage]);

  const [confirmationDialog, openConfirmationDialog] =
    useDialog(ConfirmationDialog);
  const handlePlayAgain = useCallback(() => {
    (async () => {
      if (!instance) {
        return;
      }

      const isConfirmed = await openConfirmationDialog({
        action: 'reset',
        isActionDestructive: true,
        object: 'puzzle',
        additionalMessage: `No puzzles will be harmed during the process, except for this one.`,
      });
      if (!isConfirmed) {
        return;
      }

      const resp = await callAPI('destroy-puzzle-instance', {
        instanceId: instance.id,
      });
      if (hasOwnProperty(resp, 'error') && typeof resp.error === 'string') {
        setErrorMessage(resp.error);
        return;
      }

      setSolved(false);
      setInstance(undefined);
    })();
  }, [instance, openConfirmationDialog, setInstance, setSolved]);

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
      {instance && instance.solvedAt && (
        <div
          css={{
            display: 'flex',
            alignSelf: 'flex-start',
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
          <Button
            onClick={handlePlayAgain}
            css={{
              borderRadius: 0,
              marginLeft: 'var(--spacing-large)',
            }}
          >
            Play again?
          </Button>
        </div>
      )}
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
      {instance && instance.puzzleId === 'blocked' && (
        <Blocked instance={instance} sendInstanceAction={sendInstanceAction} />
      )}
      {confirmationDialog}
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
