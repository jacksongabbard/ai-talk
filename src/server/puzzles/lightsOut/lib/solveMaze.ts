import type { Maze } from './generateMaze';

type Coord = {
  x: number;
  y: number;
};

type Path = {
  start: Coord;
  end: Coord | null;
  length: number;
  steps: Coord[];
  visited: Set<string>;
};
export function solveMaze(m: Maze, start: Coord, end: Coord): string[][] {
  const visited = new Set<string>();
  const current = { x: start.x, y: start.y };
  const p: Path = {
    start,
    end: null,
    length,
    steps: [start],
    visited: new Set(),
  };
  const allPaths: Path[] = [p];
  while (visited.size < Math.pow(m.size, 2)) {
    for (let path of allPaths) {
      if (path.end) {
        continue;
      }
      const current = path.steps[path.steps.length - 1];
      if (current) {
        // YOU LEFT OFF HERE. YOU WERE ABOUT TO BRUTE
        // FORCE ALL THE PATHS. MAYBE THAT'S DUMB. YOU
        // WERE VERY TIRED.
      }
    }
  }

  return [];
}
