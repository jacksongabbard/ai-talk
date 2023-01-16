import type { Puzzle } from 'src/types/Puzzle';
import PushTheButton from './pushTheButton/PushTheButton';
import Nodoku from './nodoku/Nodoku';
import NoYouFirst from './noYouFirst/NoYouFirst';
import SimpleMaze from './simpleMaze/SimpleMaze';

export const PuzzleList = [PushTheButton, Nodoku, NoYouFirst, SimpleMaze];

export function puzzleMapFromList(): { [slug: string]: Puzzle } {
  const slugToName: { [slug: string]: Puzzle } = {};
  for (let ii = 0; ii < PuzzleList.length; ii++) {
    slugToName[PuzzleList[ii].slug] = PuzzleList[ii];
  }
  return slugToName;
}
