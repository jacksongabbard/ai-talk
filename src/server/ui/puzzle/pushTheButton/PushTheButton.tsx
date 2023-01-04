import { Button } from '@mui/material';
import { useCallback, useContext, useState } from 'react';
import type { SendInstanceAction } from 'src/client/hooks/useWebSocket';
import { AppContext } from 'src/server/state/AppContext';
import type { ClientPuzzleInstance } from 'src/types/ClientPuzzleInstance';

type PushTheButtonProps = {
  instance: ClientPuzzleInstance;
  sendInstanceAction: SendInstanceAction;
};

const PushTheButton: React.FC<PushTheButtonProps> = ({
  instance,
  sendInstanceAction,
}) => {
  const appContext = useContext(AppContext);
  if (!appContext?.user) {
    throw new Error('No user');
  }
  const [pressed, setPressed] = useState(false);

  const onClick = useCallback(() => {
    sendInstanceAction({
      toggle: true,
    });
  }, [setPressed, sendInstanceAction]);

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
        }}
      >
        {pressed ? 'Pressed' : 'Not pressed'}
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
          onClick={onClick}
        >
          Press and Hold
        </Button>
      </div>
    </div>
  );
};

export default PushTheButton;
