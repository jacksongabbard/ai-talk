import React, { useCallback, useContext } from 'react';

import type { SendInstanceAction } from 'src/client/hooks/useWebSocket';
import type { ClientPuzzleInstance } from 'src/types/ClientPuzzleInstance';
import { assertIsNoYouFirstPuzzlePayload } from 'src/types/puzzles/NoYouFirstTypes';
import ChallengeForm from './ChallengeForm';
import { AppContext } from 'src/server/state/AppContext';

type NoYouFirstProps = {
  instance: ClientPuzzleInstance;
  sendInstanceAction: SendInstanceAction;
};

const NoYouFirst: React.FC<NoYouFirstProps> = ({
  instance,
  sendInstanceAction,
}) => {
  const appContext = useContext(AppContext);
  if (!appContext?.user) {
    throw new Error('No user!? Sacre bleu!');
  }

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

  if (!payload.enabledButtonsPerUser[appContext.user.id]) {
    throw new Error('No enabled buttons for user?!');
  }

  const enabledButtons = payload.enabledButtonsPerUser[appContext.user.id];

  return (
    <div>
      {payload.currentStates.map((s, idx) => (
        <ChallengeForm
          input={s}
          idx={idx}
          key={idx}
          correct={payload.solvedParts[idx]}
          enabledButtons={enabledButtons}
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
