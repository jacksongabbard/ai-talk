import { shuffle } from 'lodash';

type SolvedSudoku = number[][];

// arr[y][x];

function getRandomNumberArray() {
  return shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
}

function emptyFill() {
  return [0, 0, 0, 0, 0, 0, 0, 0, 0];
}

export function generateSudoku(): SolvedSudoku {
  const grid = [
    getRandomNumberArray(),
    emptyFill(),
    emptyFill(),
    emptyFill(),
    emptyFill(),
    emptyFill(),
    emptyFill(),
    emptyFill(),
    emptyFill(),
  ];
  // Starting from the 2nd row, because the first has random fill
  colLoop: for (let y = 1; y < 9; y++) {
    // Now, step along the x axis for the row we're on
    rowLoop: for (let x = 0; x < 9; x++) {
      const candidates = getRandomNumberArray();

      candidateLoop: while (candidates.length) {
        let maybe = candidates.pop();
        if (!maybe) {
          continue;
        }

        for (let mx = 0; mx < x; mx++) {
          if (grid[y][mx] === maybe) {
            continue candidateLoop;
          }
        }

        for (let my = 0; my < y; my++) {
          // We found a repeat, so we need to step back up and try again
          if (grid[my][x] === maybe) {
            continue candidateLoop;
          }
        }

        grid[y][x] = maybe;
        continue rowLoop;
      }

      y = Math.max(-1, y - 2);
      continue colLoop;
    }
  }
  return grid;
}

export function printGrid(g: SolvedSudoku) {
  console.log('------------------');
  for (let y = 0; y < 9; y++) {
    console.log(g[y].join(' '));
  }
  console.log('------------------');
}
