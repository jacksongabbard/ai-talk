import { cloneDeep } from 'lodash';
import { coord } from 'src/server/ui/puzzle/lightsOut/LightsOut';
import type { Maze, Coord, Path } from 'src/types/puzzles/LightsOut';

export function validateGrid(m: Maze) {
  for (let y = 0; y < m.size; y++) {
    for (let x = 0; x < m.size; x++) {
      const c = coord(x, y);
      // Check out-of-bounds errors
      if (x === 0 && m.grid[c].left) {
        throw new Error(`Left out of bounds error: (${x}, ${y})`);
      } else if (x === m.size - 1 && m.grid[c].right) {
        throw new Error(`Right out of bounds error: (${x}, ${y})`);
      }

      if (y === 0 && m.grid[c].up) {
        throw new Error(`Up out of bounds error: (${x}, ${y})`);
      } else if (y === m.size - 1 && m.grid[c].down) {
        throw new Error(`Down out of bounds error: (${x}, ${y})`);
      }

      // Check for exits that aren't reciprocal
      if (m.grid[c].up && !m.grid[coord(x, y - 1)].down) {
        throw new Error(`Broken up/down route: (${x}, ${y})`);
      }

      if (m.grid[c].right && !m.grid[coord(x + 1, y)].left) {
        throw new Error(`Broken right/left route: (${x}, ${y})`);
      }

      if (m.grid[c].down && !m.grid[coord(x, y + 1)].up) {
        throw new Error(`Broken down/up route: (${x}, ${y})`);
      }

      if (m.grid[c].left && !m.grid[coord(x - 1, y)].right) {
        throw new Error(`Broken left/right route: (${x}, ${y})`);
      }
    }
  }
}

function findAllPathsFromCoord(m: Maze, start: Coord): Path[] {
  const current = { x: start.x, y: start.y };
  const completedPaths: Path[] = [];
  const p: Path = {
    start,
    end: null,
    steps: [start],
    visited: new Set<string>([coord(start.x, start.y)]),
  };
  const pathsToCheck: Path[] = [p];
  while (pathsToCheck.length) {
    const p = pathsToCheck.pop();
    if (!p) {
      break;
    }

    if (p.visited.size > Math.pow(m.size, 2)) {
      throw new Error(
        'Visited set includes more than every possible location... . This is probably a bug: ' +
          JSON.stringify(Array.from(p.visited), null, 4),
      );
    }

    if (p.steps.length > Math.pow(m.size, 2)) {
      throw new Error(
        'Paths includes more than every possible location... . This is probably a bug: ' +
          JSON.stringify(p.steps, null, 4),
      );
    }

    const currentStep = p.steps[p.steps.length - 1];

    const currentCoord = coord(currentStep.x, currentStep.y);
    // Up case
    if (
      m.grid[currentCoord].up &&
      !p.visited.has(coord(currentStep.x, currentStep.y - 1))
    ) {
      p.visited.add(coord(currentStep.x, currentStep.y - 1));
      pathsToCheck.push({
        ...cloneDeep(p),
        steps: [...p.steps, { x: currentStep.x, y: currentStep.y - 1 }],
      });
    }

    // Right case
    if (
      m.grid[currentCoord].right &&
      !p.visited.has(coord(currentStep.x + 1, currentStep.y))
    ) {
      p.visited.add(coord(currentStep.x + 1, currentStep.y));
      pathsToCheck.push({
        ...cloneDeep(p),
        steps: [...p.steps, { x: currentStep.x + 1, y: currentStep.y }],
      });
    }

    // Down Case
    if (
      m.grid[currentCoord].down &&
      !p.visited.has(coord(currentStep.x, currentStep.y + 1))
    ) {
      p.visited.add(coord(currentStep.x, currentStep.y + 1));
      pathsToCheck.push({
        ...cloneDeep(p),
        steps: [...p.steps, { x: currentStep.x, y: currentStep.y + 1 }],
      });
    }

    // Left case
    if (
      m.grid[currentCoord].left &&
      !p.visited.has(coord(currentStep.x - 1, currentStep.y))
    ) {
      p.visited.add(coord(currentStep.x - 1, currentStep.y));
      pathsToCheck.push({
        ...cloneDeep(p),
        steps: [...p.steps, { x: currentStep.x - 1, y: currentStep.y }],
      });
    }

    p.end = currentStep;
    completedPaths.push(p);
  }

  return completedPaths;
}

export function solveMaze(m: Maze, start: Coord, end: Coord): Path {
  const allPaths = findAllPathsFromCoord(m, start);
  let shortestPath = null;
  for (let p of allPaths) {
    if (p.end && p.end.x === end.x && p.end.y === end.y) {
      if (!shortestPath || p.steps.length < shortestPath.steps.length) {
        shortestPath = p;
      }
    }
  }

  if (!shortestPath) {
    throw new Error('Maze is unsolvable');
  }
  return shortestPath;
}
