import type { Puzzle } from 'src/types/Puzzle';
import PushTheButton from './pushTheButton/PushTheButton';
import Nodoku from './nodoku/Nodoku';

export const PuzzleList = [PushTheButton, Nodoku];

export function puzzleMapFromList(): { [slug: string]: Puzzle } {
  const slugToName: { [slug: string]: Puzzle } = {};
  for (let ii = 0; ii < PuzzleList.length; ii++) {
    slugToName[PuzzleList[ii].slug] = PuzzleList[ii];
  }
  return slugToName;
}
