import { useContext, useEffect, useState } from 'react';
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
  const [payload, setPayload] = useState<BlockedPuzzlePayload | any>({});
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
  return (
    <div
      css={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      Future is coming!
    </div>
  );
};

export default Blocked;
