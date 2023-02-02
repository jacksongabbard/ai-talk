import type { boardPiece, thread } from 'src/types/puzzles/BlockedTypes';

export const generateBoardState = (
  threads: thread[],
  wall: boardPiece,
): string[][] | undefined => {
  const initialBoardState = [
    ['o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o'],
  ];

  for (const thread of threads) {
    if (initialBoardState[thread.row][thread.column] !== 'o') {
      return;
    }
    initialBoardState[thread.row][thread.column] = 't';

    if (thread.width > 1) {
      for (let i = 1; i < thread.width; i++) {
        if (initialBoardState[thread.row][thread.column + i] !== 'o') {
          return;
        }
        initialBoardState[thread.row][thread.column + i] = 't';
      }
    }

    if (thread.height > 1) {
      for (let i = 1; i < thread.height; i++) {
        if (initialBoardState[thread.row + i][thread.column] !== 'o') {
          return;
        }
        initialBoardState[thread.row + i][thread.column] = 't';
      }
    }
  }

  initialBoardState[wall.row][wall.column] = 'w';

  return initialBoardState;
};
