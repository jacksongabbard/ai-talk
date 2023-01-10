import type { SendInstanceAction } from 'src/client/hooks/useWebSocket';
import type { ClientPuzzleInstance } from 'src/types/ClientPuzzleInstance';
import { assertIsNoYouFirstPuzzlePayload } from 'src/types/puzzles/NoYouFirstTypes';
import ChallengeForm from './ChallengeForm';
import React, { useCallback, useState } from 'react';

type NoYouFirstProps = {
  instance: ClientPuzzleInstance;
  sendInstanceAction: SendInstanceAction;
};

const NoYouFirst: React.FC<NoYouFirstProps> = ({
  instance,
  sendInstanceAction,
}) => {
  const payload = assertIsNoYouFirstPuzzlePayload(instance.puzzlePayload);

  const onSolutionChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      sendInstanceAction({
        actionType: 'solve',
        solution: e.target.value,
      });
    },
    [sendInstanceAction],
  );

  const onClick = useCallback(
    (cipherIndex: number, partIndex: number) => {
      sendInstanceAction({
        actionType: 'decipher',
        cipherIndex,
        partIndex,
      });
    },
    [sendInstanceAction],
  );

  return (
    <div>
      {payload.currentStates.map((s, idx) => (
        <ChallengeForm
          input={s}
          idx={idx}
          key={idx}
          correct={payload.solvedParts[idx]}
          onClick={onClick}
        />
      ))}
      <div css={{ display: 'flex', flexDirection: 'row' }}>
        <div>
          <div
            css={{
              width: 64,
              marginRight: 'var(--spacing-large)',
            }}
          >
            &nbsp;
          </div>
        </div>
        <div>
          <input
            type="string"
            value={payload.solutionAttempt}
            onChange={onSolutionChange}
            placeholder="Enter the solution..."
            css={{
              fontSize: 24,
              color: '#3f3',
              background: '#000',
              border: '1px #3f3 solid',
              width: '60vw',
              maxWidth: '60vw',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default NoYouFirst;
