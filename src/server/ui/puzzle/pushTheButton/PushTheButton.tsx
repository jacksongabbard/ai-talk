import type { ClientPuzzleInstance } from 'src/types/ClientPuzzleInstance';

type PushTheButtonProps = {
  instance: ClientPuzzleInstance;
};

const PushTheButton: React.FC<PushTheButtonProps> = ({ instance }) => {
  return <button>Oooh... push it.</button>;
};
