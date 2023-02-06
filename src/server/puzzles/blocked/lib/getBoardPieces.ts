import { blockedThreadPuzzles } from 'src/server/puzzles/blocked/lib/puzzledb';
import {
  boardPiece,
  SOLUTION_BLOCK_COLOR,
  THREAD_COLORS,
  WALL_COLOR,
} from 'src/types/puzzles/BlockedTypes';

export const getBoardPieces = () => {
  const randomPuzzle =
    blockedThreadPuzzles[
      Math.floor(Math.random() * blockedThreadPuzzles.length)
    ];

  const rawPuzzleData: Record<string, Omit<boardPiece, 'color'>> = {};
  console.log({ randomPuzzle });
  randomPuzzle.puzzleString.split('').forEach((char, i) => {
    // console.log(char);
    if (char === 'x') {
      if (!rawPuzzleData[char + 1]) {
        rawPuzzleData[char + 1] = {
          width: 1,
          height: 1,
          row: Math.floor(i / 6),
          column: i % 6,
        };
      } else {
        rawPuzzleData[char + 2] = {
          width: 1,
          height: 1,
          row: Math.floor(i / 6),
          column: i % 6,
        };
      }
    } else if (char !== 'o') {
      if (!rawPuzzleData[char]) {
        rawPuzzleData[char] = {
          width: 1,
          height: 1,
          row: Math.floor(i / 6),
          column: i % 6,
        };
      } else {
        rawPuzzleData[char] = {
          ...rawPuzzleData[char],
          height:
            Math.floor(i / 6) > rawPuzzleData[char].row
              ? rawPuzzleData[char].height + 1
              : rawPuzzleData[char].height,
          width:
            i % 6 > rawPuzzleData[char].column
              ? rawPuzzleData[char].width + 1
              : rawPuzzleData[char].width,
        };
      }
    }
  });
  console.log({ rawPuzzleData });

  const boardPieces: boardPiece[] = [];
  let counter = 0;

  for (const [key, value] of Object.entries(rawPuzzleData)) {
    if (key === 'A') {
      boardPieces.push({
        ...value,
        color: SOLUTION_BLOCK_COLOR,
      });
    } else if (key.includes('x')) {
      boardPieces.push({
        ...value,
        color: WALL_COLOR,
      });
    } else {
      boardPieces.push({ ...value, color: THREAD_COLORS[counter] });
      counter++;
    }
  }
  // TODO maybe return number of moves and cluster size and
  // save into solution payload as difficulty gauge?
  return {
    boardPieces,
    moves: randomPuzzle.moves,
    clusterSize: randomPuzzle.clusterSize,
  };
};
