import {
  coord,
  generateMaze,
  printMaze,
} from './src/server/puzzles/simpleMaze/lib/generateMaze';
import {
  solveMaze,
  validateGrid,
} from './src/server/puzzles/simpleMaze/lib/solveMaze';

for (let i = 13; i < 51; i += 2) {
  const startTime = performance.now();
  const size = i;
  const maze = generateMaze(size, 6);
  validateGrid(maze);
  const finishTime = performance.now();
  console.log('Generated in: ' + (finishTime - startTime) + 'ms');
  const path = solveMaze(
    maze,
    { x: 0, y: 0 },
    { x: Math.floor(size / 2), y: Math.floor(size / 2) },
  );
  printMaze(maze, path && path.steps.map((c) => coord(c.x, c.y)));
}
