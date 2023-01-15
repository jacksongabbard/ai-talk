import { generateMaze, printMaze } from './generateMaze';

(() => {
  test('generate a maze works', () => {
    const startTime = performance.now();
    const size = 21;
    const maze = generateMaze(size, 6);
    const finishTime = performance.now();
    console.log('Generated in: ' + (finishTime - startTime) + 'ms');
    printMaze(maze);
    expect(maze.size).toStrictEqual(size);
    expect(maze.grid).toBeTruthy();
    expect(typeof maze.grid).toStrictEqual('object');
    expect(Object.keys(maze.grid).length).toStrictEqual(Math.pow(size, 2));
  });
})();
