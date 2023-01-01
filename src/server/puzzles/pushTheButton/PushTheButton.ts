import type Team from 'src/lib/db/Team';
import type User from 'src/lib/db/User';
import type { Puzzle } from 'src/types/Puzzle';

const PushTheButton: Puzzle = {
  name: 'Push the Button',
  slug: 'push_the_button',
  minPlayers: 1,
  maxPlayers: 6,
  createInstance: (team: Team, members: User[]) => {
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
