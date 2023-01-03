import type Team from 'src/lib/db/Team';
import type User from 'src/lib/db/User';
import type { Puzzle } from 'src/types/Puzzle';
import AlphaNum from 'src/lib/dict/AlphaNum';
import { getRandomEntry } from 'src/lib/dict/utils';

const PushTheButton: Puzzle = {
  name: 'Push the Button',
  slug: 'push_the_button',
  minPlayers: 1,
  maxPlayers: 6,
  createInstance: (team: Team, members: User[]) => {
    const letterCount = 5 * members.length;
    const alphaNums = [];
    for (let i = 0; i < letterCount; i++) {
      alphaNums.push(getRandomEntry(AlphaNum));
    }

    return {
      puzzlePayload: {
        revealedLetters: [],
      },
      solutionPayload: {
        solution: alphaNums,
      },
    };
  },
  receiveAction: (action) => {},
};

export default PushTheButton;
