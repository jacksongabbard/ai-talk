import { coord, generateMaze, printMaze } from './generateMaze';
import { solveMaze, validateGrid } from './solveMaze';

(() => {
  test('generating a small maze works', () => {
    const size = 7;
    const startTime = performance.now();
    const maze = generateMaze(size, 6);
    const finishTime = performance.now();
    console.log('Generated in: ' + (finishTime - startTime) + 'ms');
    validateGrid(maze);
    printMaze(maze);
    expect(maze.size).toStrictEqual(size);
    expect(maze.grid).toBeTruthy();
    expect(typeof maze.grid).toStrictEqual('object');
    expect(Object.keys(maze.grid).length).toStrictEqual(Math.pow(size, 2));
    solveMaze(maze, { x: 0, y: 0 }, { x: 3, y: 3 });
  });
})();

(() => {
  test('generating and solving many mazes works', () => {
    for (let i = 13; i < 51; i += 2) {
      const size = i;
      const startTime = performance.now();
      const maze = generateMaze(size, 6);
      const finishTime = performance.now();
      let threw = false;
      try {
        validateGrid(maze);
        console.log('Generated in: ' + (finishTime - startTime) + 'ms');
        const path = solveMaze(
          maze,
          { x: 0, y: 0 },
          { x: Math.floor(size / 2), y: Math.floor(size / 2) },
        );
        printMaze(maze, path && path.steps.map((c) => coord(c.x, c.y)));
      } catch (e) {
        console.error(e);
        threw = true;
      }
      expect(threw).toStrictEqual(false);
      if (threw) {
        break;
      }
    }
  });
})();
