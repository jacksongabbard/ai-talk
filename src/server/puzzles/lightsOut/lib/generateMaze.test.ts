import { generateMaze, printMaze } from './generateMaze';

(() => {
  test('generate a maze works', () => {
    const maze = generateMaze(11, 6);
    printMaze(maze);
    expect(maze.size).toStrictEqual(11);
    expect(maze.grid).toBeTruthy();
    expect(typeof maze.grid).toStrictEqual('object');
    expect(Object.keys(maze.grid).length).toStrictEqual(121);
  });
})();
