import { useCallback, useContext, useEffect, useState } from 'react';
import { useWebSocket } from 'src/client/hooks/useWebSocket';
import type { ClientPuzzleInstance } from 'src/types/ClientPuzzleInstance';
import PushTheButton from './pushTheButton/PushTheButton';
import MessageBox from '../messageBox/MessageBox';
import { AppContext } from 'src/server/state/AppContext';

type PuzzleShellProps = {
  instance: ClientPuzzleInstance;
};

const PuzzleShell: React.FC<PuzzleShellProps> = ({ instance }) => {
  const appContext = useContext(AppContext);

  useEffect(() => {
    appContext?.setShowHeader(false);
    return () => {
      appContext?.setShowHeader(true);
    };
  }, [appContext?.setShowHeader]);

  const [connected, setConnected] = useState(false);
  const onConnected = useCallback(() => {
    console.log('CONNECTED');
    setConnected(true);
  }, [setConnected]);

  const onClose = useCallback(() => {
    console.log('DISCONNECTED');
    setConnected(false);
  }, [setConnected]);

  const onMessage = useCallback(
    (message: object) => {
      console.log('MESSAGE: ', message);
    },
    [connected],
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
    console.log('Setting the puzzle...');
    setPuzzle(instance.puzzleId);
  }, [setPuzzle, instance, connected]);

  return (
    <div
      css={{
        background: '#000',
        height: '100vh',
        width: '100vw',
        position: 'absolute',
        top: 0,
        left: 0,
      }}
    >
      {!connected && <MessageBox type="info">Connecting...</MessageBox>}
      {instance.puzzleId === 'push_the_button' && (
        <PushTheButton
          instance={instance}
          sendInstanceAction={sendInstanceAction}
        />
      )}
    </div>
  );
};

export default PuzzleShell;
