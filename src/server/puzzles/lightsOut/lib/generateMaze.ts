// import type Team from 'src/lib/db/Team';
import { shuffle } from 'lodash';

type Maze = {
  size: number;
  grid: {
    [x_y: string]: {
      up?: boolean;
      right?: boolean;
      down?: boolean;
      left?: boolean;
    };
  };
  entryPoints: string[];
  exit: string;
};

function coord(x: number, y: number) {
  return x + '_' + y;
}

function populateMaze(m: Maze, visited: Set<string>) {
  /*
  Copypasta'd from Wikipedia:
  The Aldous-Broder algorithm also produces uniform spanning trees.

  Pick a random cell as the current cell and mark it as visited.
    While there are unvisited cells:
    Pick a random neighbour.
      If the chosen neighbour has not been visited:
        Remove the wall between the current cell and the chosen neighbour.
        Mark the chosen neighbour as visited.
      Make the chosen neighbour the current cell.
  */

  let current = { x: 0, y: 0 };
  outer: while (visited.size < Math.pow(m.size, 2)) {
    const eligibleNeighbors = [];
    const canGoLeft = current.x > 0;
    const canGoRight = current.x < m.size - 1;
    const canGoUp = current.y > 0;
    const canGoDown = current.y < m.size - 1;

    if (canGoUp && !visited.has(coord(current.x, current.y - 1))) {
      eligibleNeighbors.push({ x: current.x, y: current.y - 1 });
    }

    if (canGoRight && !visited.has(coord(current.x + 1, current.y))) {
      eligibleNeighbors.push({ x: current.x + 1, y: current.y });
    }

    if (canGoDown && !visited.has(coord(current.x, current.y + 1))) {
      eligibleNeighbors.push({ x: current.x, y: current.y + 1 });
    }

    if (canGoLeft && !visited.has(coord(current.x - 1, current.y))) {
      eligibleNeighbors.push({ x: current.x - 1, y: current.y });
    }

    // If we're here, we've wound up surrounded on all sides with cells we've
    // already visited. In that case, we'll go back through our visited list and
    // find somewhere new to expand from.
    if (!eligibleNeighbors.length) {
      const visitedArray = shuffle(Array.from(visited));
      for (let v of visitedArray) {
        const [x, y] = v.split('_').map((s) => parseInt(s, 10));
        if (
          // Up
          !visited.has(coord(x, y - 1)) ||
          // Right
          !visited.has(coord(x + 1, y)) ||
          // Down
          !visited.has(coord(x, y + 1)) ||
          // Left
          !visited.has(coord(x - 1, y))
        ) {
          visited.add(coord(x, y));
          current.x = x;
          current.y = y;
          continue outer;
        }
      }
      throw new Error(
        "Couldn'd find anywhere to go from: " + current.x + ' x ' + current.y,
      );
    }

    const randomNeighbor =
      eligibleNeighbors[
        Math.round(Math.random() * (eligibleNeighbors.length - 1))
      ];

    // Down neighbour
    if (randomNeighbor.x === current.x && randomNeighbor.y > current.y) {
      m.grid[coord(current.x, current.y)].down = true;
      m.grid[coord(randomNeighbor.x, randomNeighbor.y)].up = true;

      // Up case
    } else if (randomNeighbor.x === current.x && randomNeighbor.y < current.y) {
      m.grid[coord(current.x, current.y)].up = true;
      m.grid[coord(randomNeighbor.x, randomNeighbor.y)].down = true;
      // Right case
    } else if (randomNeighbor.x > current.x && randomNeighbor.y === current.y) {
      m.grid[coord(current.x, current.y)].right = true;
      m.grid[coord(randomNeighbor.x, randomNeighbor.y)].left = true;
      // Left case
    } else if (randomNeighbor.x < current.x && randomNeighbor.y === current.y) {
      m.grid[coord(current.x, current.y)].left = true;
      m.grid[coord(randomNeighbor.x, randomNeighbor.y)].right = true;
    }

    visited.add(coord(randomNeighbor.x, randomNeighbor.y));
    current.x = randomNeighbor.x;
    current.y = randomNeighbor.y;
  }
}

export function generateMaze(size: number, entryPoints: number) {
  /*
  if (size < 11) {
    throw new Error('What is the point of a tiny maze?');
  }
  */

  if (size % 2 === 0) {
    throw new Error(
      'The maze exits in the center -- size must be an odd number',
    );
  }
  const maze: Maze = {
    size,
    grid: {},
    entryPoints: [],
    exit: coord(Math.floor(size / 2), Math.floor(size / 2)),
  };
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      maze.grid[coord(x, y)] = {};
    }
  }

  const visited = new Set<string>();
  // Top Left
  if (entryPoints >= 1) {
    maze.grid[coord(0, 0)].down = true;
    maze.grid[coord(0, 1)].up = true;
    visited.add(coord(0, 0));
    visited.add(coord(0, 1));
    maze.entryPoints.push(coord(0, 0));
  }

  /*
  // Bottom Right
  if (entryPoints >= 2) {
    maze.grid[coord(size - 1, size - 1)].up = true;
    maze.grid[coord(size - 1, size - 2)].down = true;
    visited.add(coord(size - 1, size - 1));
    visited.add(coord(size - 1, size - 2));
    maze.entryPoints.push(coord(size - 1, size - 1));
  }

  // Top Right
  if (entryPoints >= 3) {
    maze.grid[coord(size - 1, 0)].down = true;
    maze.grid[coord(size - 1, 1)].up = true;
    visited.add(coord(size - 1, 0));
    visited.add(coord(size - 1, 1));
    maze.entryPoints.push(coord(size - 1, 0));
  }

  // Bottom left
  if (entryPoints >= 4) {
    maze.grid[coord(0, size - 1)].up = true;
    maze.grid[coord(0, size - 2)].down = true;
    visited.add(coord(0, size - 1));
    visited.add(coord(0, size - 2));
    maze.entryPoints.push(coord(0, size - 1));
  }

  // Left Center
  if (entryPoints >= 5) {
    maze.grid[coord(0, Math.floor(size / 2))].right = true;
    maze.grid[coord(1, Math.floor(size / 2))].left = true;
    visited.add(coord(0, Math.floor(size / 2)));
    visited.add(coord(1, Math.floor(size / 2)));
    maze.entryPoints.push(coord(0, Math.floor(size / 2)));
  }

  // Right Center
  if (entryPoints >= 6) {
    maze.grid[coord(size - 1, Math.floor(size / 2))].left = true;
    maze.grid[coord(size - 2, Math.floor(size / 2))].right = true;
    visited.add(coord(size - 1, Math.floor(size / 2)));
    visited.add(coord(size - 2, Math.floor(size / 2)));
    maze.entryPoints.push(coord(size - 1, Math.floor(size / 2)));
  }
  */

  populateMaze(maze, visited);

  return maze;
}

/*
// This was fancy and compact, but practically way too hard to even see.
// Each direction avaiable from the current space,
// as a text label, sorted, and joined with '_'
const stringToMazeChar: { [dirString: string]: string } = {
  '': '▓',

  UP: '╹',
  RIGHT: '╺',
  DOWN: '╻',
  LEFT: '╸',

  LEFT_RIGHT: '━',
  DOWN_UP: '┃',

  DOWN_RIGHT_UP: '┣',
  DOWN_LEFT_RIGHT: '┳',
  DOWN_LEFT_UP: '┫',
  LEFT_RIGHT_UP: '┻',

  RIGHT_UP: '┗',
  DOWN_RIGHT: '┏',
  DOWN_LEFT: '┓',
  LEFT_UP: '┛',

  DOWN_LEFT_RIGHT_UP: '╋',
};
*/

export function printMaze(m: Maze) {
  const output: string[][] = [];
  for (let y = 0; y < m.size * 3; y += 3) {
    for (let yInner = 0; yInner < 3; yInner++) {
      output.push([]);
      for (let x = 0; x < m.size * 3; x += 3) {
        output[y + yInner][x] = '█';
        output[y + yInner][x + 1] = '█';
        output[y + yInner][x + 2] = '█';
      }
    }
  }

  for (let y = 0; y < m.size; y++) {
    for (let x = 0; x < m.size; x++) {
      const exits = m.grid[coord(x, y)];

      // Mark the center
      const adjustedX = x * 3 + 1;
      const adjustedY = y * 3 + 1;
      output[adjustedY][adjustedX] = ' ';

      if (exits.up) {
        output[adjustedY - 1][adjustedX] = ' ';
      }

      if (exits.right) {
        output[adjustedY][adjustedX + 1] = ' ';
      }

      if (exits.down) {
        output[adjustedY + 1][adjustedX] = ' ';
      }

      if (exits.left) {
        output[adjustedY][adjustedX - 1] = ' ';
      }

      if (coord(x, y) === m.exit) {
        output[adjustedY][adjustedX] = '★';
      }

      if (m.entryPoints.includes(coord(x, y))) {
        output[adjustedY][adjustedX] = 'X';
      }
    }
  }
  console.log(output.map((row) => row.join('')).join('\n'));
  // console.log(JSON.stringify(m.grid, null, 4));
}
