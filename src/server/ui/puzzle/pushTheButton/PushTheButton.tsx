import { Button, ButtonBase, Card } from '@mui/material';
import { useCallback, useState } from 'react';
import type { ClientPuzzleInstance } from 'src/types/ClientPuzzleInstance';

type PushTheButtonProps = {
  instance: ClientPuzzleInstance;
};

const PushTheButton: React.FC<PushTheButtonProps> = ({ instance }) => {
  const [pressed, setPressed] = useState(false);
  const onDown = useCallback(() => {
    setPressed(true);
  }, [setPressed]);

  const onUp = useCallback(() => {
    setPressed(false);
  }, [setPressed]);

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
          onPointerDown={onDown}
          onPointerUp={onUp}
        >
          Press and Hold
        </Button>
      </div>
    </div>
  );
};

export default PushTheButton;
