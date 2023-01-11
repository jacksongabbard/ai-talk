import { shuffle } from 'lodash';

export type SolvedSudoku = number[][];

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

        // look to see if the maybe number appears
        // in the row already. If it does, skip it.
        for (let mx = 0; mx < x; mx++) {
          if (grid[y][mx] === maybe) {
            continue candidateLoop;
          }
        }

        // If we're here, we've got a number that hasn't yet appeared
        // in the row, so we're good there. Now we need to check if it
        // appears yet in the column.
        for (let my = 0; my < y; my++) {
          // Darn. The maybe number would be a repeat, so we need to
          // step back up and try again
          if (grid[my][x] === maybe) {
            continue candidateLoop;
          }
        }

        // Now I need to check the 3x3 grid that the maybe number will
        // join. If the number already exists in the 3x3, I'm really
        // hosed and need to backtrack.
        const gridXStart = Math.floor(x / 3) * 3;
        const gridYStart = Math.floor(y / 3) * 3;
        for (let gy = gridYStart; gy < gridYStart + 3 && gy <= y; gy++) {
          for (let gx = gridXStart; gx < gridXStart + 3; gx++) {
            if (grid[gy][gx] === maybe) {
              continue candidateLoop;
            }
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
  const output = ['------------------'];

  for (let y = 0; y < 9; y++) {
    output.push(g[y].join(' '));
  }
  output.push('------------------');
  console.log(output.join('\n'));
}
