import type { ClientPuzzleInstance } from 'src/types/ClientPuzzleInstance';

type PuzzleShellProps = {
  instance: ClientPuzzleInstance;
};

const PuzzleShell: React.FC<PuzzleShellProps> = ({ instance }) => {
  return <div>Puzzle Shell</div>;
};

export default PuzzleShell;
