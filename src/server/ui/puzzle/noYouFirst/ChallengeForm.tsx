import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { PresenceFacepile, PresenceObserver } from '@cord-sdk/react';

type ChallengeFormProps = {
  input: string;
  idx: number;
  correct: boolean;
  onClick: (cipherIdx: number, partIndex: number) => void;
  enabledButtons: number[];
};

const ChallengeForm: React.FC<ChallengeFormProps> = ({
  input,
  idx,
  correct,
  onClick,
  enabledButtons,
}) => {
  const [deciphered, setDeciphered] = useState(input);

  useEffect(() => {
    setDeciphered(input);
  }, [input, setDeciphered]);

  const onCipherButtonPress = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const button = e.target;
      if (!button) {
        throw new Error('No target for React click event?');
      }

      // No idea why this cast seems to be necessary. No interest
      // in chasing it.
      const b = button as HTMLButtonElement;

      onClick(parseInt(b.dataset.cipheridx || '-1', 10), idx);
    },
    [idx, onClick],
  );

  return (
    <PresenceObserver
      location={{ puzzle: 'noYouFirst', section: idx.toString() }}
    >
      <div
        css={{
          display: 'flex',
          flexDirection: 'row',
          marginBottom: 'var(--spacing-xlarge)',
        }}
      >
        <div
          css={{
            flex: 0,
            flexShrink: 0,
            flexGrow: 0,
            marginRight: 'var(--spacing-large)',
          }}
        >
          {enabledButtons.includes(0) && (
            <Button
              data-cipheridx="0"
              css={{ fontSize: 20 }}
              onClick={onCipherButtonPress}
            >
              🆘
            </Button>
          )}
          {enabledButtons.includes(1) && (
            <Button
              data-cipheridx="1"
              css={{ fontSize: 24 }}
              onClick={onCipherButtonPress}
            >
              👄
            </Button>
          )}
          {enabledButtons.includes(2) && (
            <Button
              data-cipheridx="2"
              css={{ fontSize: 24 }}
              onClick={onCipherButtonPress}
            >
              🪖
            </Button>
          )}
          {enabledButtons.includes(3) && (
            <Button
              data-cipheridx="3"
              css={{ fontSize: 24 }}
              onClick={onCipherButtonPress}
            >
              💾
            </Button>
          )}
          {enabledButtons.includes(4) && (
            <Button
              data-cipheridx="4"
              css={{ fontSize: 24 }}
              onClick={onCipherButtonPress}
            >
              🛞
            </Button>
          )}
          {enabledButtons.includes(5) && (
            <Button
              data-cipheridx="5"
              css={{ fontSize: 24 }}
              onClick={onCipherButtonPress}
            >
              ＠
            </Button>
          )}
          {enabledButtons.includes(6) && (
            <Button
              data-cipheridx="6"
              css={{ fontSize: 24 }}
              onClick={onCipherButtonPress}
            >
              ↔️
            </Button>
          )}
          {enabledButtons.includes(7) && (
            <Button
              data-cipheridx="7"
              css={{ fontSize: 24 }}
              onClick={onCipherButtonPress}
            >
              🧨
            </Button>
          )}
        </div>
        <div>
          <textarea
            css={{
              background: '#000',
              color: '#3f3',
              border: correct ? '1px #3f3 solid' : '1px #f33 solid',
              height: 500,
              width: '60vw',
              maxWidth: '60vw',
              overflow: 'auto',
              wordWrap: 'break-word',
              flex: 1,
            }}
            value={input}
            readOnly={true}
          />
          <div css={{ display: 'flex', justifyContent: 'space-between' }}>
            <PresenceFacepile
              location={{ puzzle: 'noYouFirst', section: idx.toString() }}
            />
            <div css={{ textAlign: 'right', color: '#383' }}>
              Character Count {deciphered.length.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </PresenceObserver>
  );
};

export default ChallengeForm;
