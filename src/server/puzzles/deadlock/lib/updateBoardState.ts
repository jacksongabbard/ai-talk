import type { thread } from 'src/types/puzzles/DeadlockTypes';

export const updateBoardState = (
  updatedThread: thread,
  threadVertical: boolean,
  currentBoardState: string[][],
  direction: 1 | -1,
): [string[][], boolean] => {
  const updatedBoardState = currentBoardState;

  // starting positions OOB
  if (
    updatedThread.row > 5 ||
    updatedThread.column > 5 ||
    updatedThread.row < 0 ||
    updatedThread.column < 0
  ) {
    return [currentBoardState, false];
  }

  if (threadVertical) {
    if (direction === 1) {
      // check for oob tail end of block
      if (updatedThread.row + updatedThread.height - 1 > 5) {
        return [currentBoardState, false];
      }
      // check for open space vertical down
      if (
        updatedBoardState[updatedThread.row + updatedThread.height - 1][
          updatedThread.column
        ] !== 'o'
      ) {
        return [currentBoardState, false];
      }

      updatedBoardState[updatedThread.row + updatedThread.height - 1][
        updatedThread.column
      ] = 't';

      updatedBoardState[updatedThread.row - 1][updatedThread.column] = 'o';
    }

    if (direction === -1) {
      // check for open space vertical up
      if (updatedBoardState[updatedThread.row][updatedThread.column] !== 'o') {
        return [currentBoardState, false];
      }

      updatedBoardState[updatedThread.row][updatedThread.column] = 't';

      updatedBoardState[updatedThread.row + updatedThread.height][
        updatedThread.column
      ] = 'o';
    }
  } else {
    if (direction === 1) {
      // check for oob tail end of block
      if (updatedThread.column + updatedThread.width - 1 > 5) {
        return [currentBoardState, false];
      }

      // check for open space horizontal right
      if (
        updatedBoardState[updatedThread.row][
          updatedThread.column + updatedThread.width - 1
        ] !== 'o'
      ) {
        return [currentBoardState, false];
      }

      updatedBoardState[updatedThread.row][
        updatedThread.column + updatedThread.width - 1
      ] = 't';

      updatedBoardState[updatedThread.row][updatedThread.column - 1] = 'o';
    }
    if (direction === -1) {
      // check for open space horizontal left
      if (updatedBoardState[updatedThread.row][updatedThread.column] !== 'o') {
        return [currentBoardState, false];
      }

      updatedBoardState[updatedThread.row][updatedThread.column] = 't';

      updatedBoardState[updatedThread.row][
        updatedThread.column + updatedThread.width
      ] = 'o';
    }
  }

  return [updatedBoardState, true];
};
