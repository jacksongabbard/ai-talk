import type { SendInstanceAction } from 'src/client/hooks/useWebSocket';
import type { ClientPuzzleInstance } from 'src/types/ClientPuzzleInstance';

type PushTheButtonProps = {
  instance: ClientPuzzleInstance;
  sendInstanceAction: SendInstanceAction;
};

const NoYouFirst: React.FC<PushTheButtonProps> = ({
  instance,
  sendInstanceAction,
}) => {
  return (
    <div>
      <pre>{JSON.stringify(instance.puzzlePayload, null, 4)}</pre>
    </div>
  );
};

export default NoYouFirst;
