import { useCallback, useState } from 'react';
import { useWebSocket } from 'src/client/hooks/useWebSocket';
import type { ClientPuzzleInstance } from 'src/types/ClientPuzzleInstance';

type PuzzleShellProps = {
  instance: ClientPuzzleInstance;
};

const PuzzleShell: React.FC<PuzzleShellProps> = ({ instance }) => {
  const [connected, setConnected] = useState(false);
  const onConnected = useCallback(() => {
    setConnected(true);
  }, [setConnected]);

  const onClose = useCallback(() => {
    setConnected(false);
  }, [setConnected]);

  const onMessage = useCallback(
    (message: object) => {
      console.log(message);
    },
    [connected],
  );

  const onError = useCallback(
    (error: string) => {
      console.log(error);
    },
    [connected],
  );

  const sendInstanceAction = useWebSocket(
    onConnected,
    onClose,
    onMessage,
    onError,
  );

  return (
    <div>
      <p>Puzzle Shell</p>
      <pre>{JSON.stringify({ connected }, null, 4)}</pre>
    </div>
  );
};

export default PuzzleShell;
