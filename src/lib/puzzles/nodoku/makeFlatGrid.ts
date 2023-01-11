export function makeFlatGrid<T>(fillValue: T): { [x_y: string]: T } {
  const grid: { [x_y: string]: T } = {};
  for (let x = 0; x < 9; x++) {
    for (let y = 0; y < 9; y++) {
      grid[x + '_' + y] = fillValue;
    }
  }
  return grid;
}
