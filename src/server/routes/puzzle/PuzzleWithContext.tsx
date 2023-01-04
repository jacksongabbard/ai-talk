import { PuzzleContextProvider } from 'src/server/state/PuzzleContext';
import Puzzle from './Puzzle';

const PuzzleWithContext = () => {
  return (
    <PuzzleContextProvider>
      <Puzzle />
    </PuzzleContextProvider>
  );
};

export default PuzzleWithContext;
