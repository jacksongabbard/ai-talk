import { generateSudoku, printGrid } from './generateSudoku';

(() => {
  test('there are no collisions in a generated sudoku', () => {
    let collision = false;

    for (let i = 0; i < 10; i++) {
      const t = Date.now();
      const grid = generateSudoku();
      console.log(Date.now() - t);
      for (let y = 0; y < grid.length; y++) {
        // check the x axis
        const xs = new Set(grid[y]);
        if (xs.size !== 9) {
          printGrid(grid);
          collision = true;
          break;
        }
      }

      for (let x = 0; x < 9; x++) {
        const ys = [];
        for (let y = 0; y < 9; y++) {
          ys.push(grid[y][x]);
        }
        const ySet = new Set(ys);
        if (ySet.size !== 9) {
          printGrid(grid);
          collision = true;
          break;
        }
      }

      for (let gx = 0; gx <= 6; gx += 3) {
        for (let gy = 0; gy <= 6; gy += 3) {
          const gridSet = new Set<number>();
          for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
              if (gridSet.has(grid[gy + y][gx + x])) {
                console.log('collision at x: ' + (gx + x) + ' y: ' + (gy + y));
                printGrid(grid);
                collision = true;
                break;
              }
              gridSet.add(grid[gy + y][gx + x]);
            }
          }
        }
      }

      expect(collision).toBe(false);
    }
  });
})();
