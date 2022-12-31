import type { Puzzle } from 'src/types/Puzzle';

const PushTheButton: Puzzle = {
  name: 'Push the Button',
  slug: 'push_the_button',
  createInstance: () => {
    return {
      puzzlePayload: {
        revealedLetters: [],
      },
      solutionPayload: {
        solution: 'Coming Soon!',
      },
    };
  },
  receiveAction: (action) => {},
};

export default PushTheButton;
