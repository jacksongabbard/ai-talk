import { generateSudoku, printGrid } from './generateSudoku';

(() => {
  test('there are no collisions in a generated sudoku', () => {
    let collision = false;
    const grid = generateSudoku();
    for (let i = 0; i < 10; i++) {
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
        let ys = [];
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

      expect(collision).toBe(false);
    }
  });
})();
