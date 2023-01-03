import type { ClientPuzzleInstance } from 'src/types/ClientPuzzleInstance';

type PushTheButtonProps = {
  instance: ClientPuzzleInstance;
};

const PushTheButton: React.FC<PushTheButtonProps> = ({ instance }) => {
  return (
    <div
      css={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <button>Oooh... push it.</button>
    </div>
  );
};

export default PushTheButton;
