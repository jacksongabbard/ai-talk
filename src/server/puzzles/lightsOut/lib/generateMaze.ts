// import type Team from 'src/lib/db/Team';
import cookieParser from 'cookie-parser';
import { hasOwnProperty } from '../../../../lib/hasOwnProperty';

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
};

function coord(x: number, y: number) {
  return x + '_' + y;
}
export function generateMaze(size: number, entryPoints: number) {
  if (size < 11) {
    throw new Error('What is the point of a tiny maze?');
  }

  if (size % 2 === 0) {
    throw new Error(
      'The maze exits in the center -- size must be an odd number',
    );
  }
  const maze: Maze = {
    size,
    grid: {},
    entryPoints: [],
  };
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      maze.grid[coord(x, y)] = {};
    }
  }

  // Top Left
  if (entryPoints >= 1) {
    maze.grid[coord(0, 0)].down = true;
    maze.grid[coord(0, 1)].up = true;
    maze.entryPoints.push(coord(0, 0));
  }

  // Bottom Right
  if (entryPoints >= 2) {
    maze.grid[coord(size - 1, size - 1)].up = true;
    maze.grid[coord(size - 1, size - 2)].down = true;
    maze.entryPoints.push(coord(size - 1, size - 1));
  }

  // Top Right
  if (entryPoints >= 3) {
    maze.grid[coord(size - 1, 0)].down = true;
    maze.grid[coord(size - 1, 1)].up = true;
    maze.entryPoints.push(coord(size - 1, 0));
  }

  // Bottom left
  if (entryPoints >= 4) {
    maze.grid[coord(0, size - 1)].up = true;
    maze.grid[coord(0, size - 2)].down = true;
    maze.entryPoints.push(coord(0, size - 1));
  }

  // Left Center
  if (entryPoints >= 5) {
    maze.grid[coord(0, Math.floor(size / 2))].right = true;
    maze.grid[coord(1, Math.floor(size / 2))].left = true;
    maze.entryPoints.push(coord(0, Math.floor(size / 2)));
  }

  // Right Center
  if (entryPoints >= 6) {
    maze.grid[coord(size - 1, Math.floor(size / 2))].left = true;
    maze.grid[coord(size - 1, Math.floor(size / 2))].right = true;
    maze.entryPoints.push(coord(size - 1, Math.floor(size / 2)));
  }

  return maze;
}

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
  LEFT_RIGHT_DOWN: '┳',
  DOWN_LEFT_UP: '┫',
  LEFT_RIGHT_UP: '┻',

  DOWN_LEFT_RIGHT_UP: '╋',
};
export function printMaze(m: Maze) {
  const output = [];
  output.push('╔' + '═'.repeat(m.size) + '╗');
  for (let y = 0; y < m.size; y++) {
    const row = ['║'];
    for (let x = 0; x < m.size; x++) {
      const dirs = Object.keys(m.grid[coord(x, y)]).map((n) => n.toUpperCase());
      dirs.sort();
      const dirString = dirs.join('_');
      if (hasOwnProperty(stringToMazeChar, dirString)) {
        row.push(stringToMazeChar[dirs.join('_')]);
      } else {
        throw new Error(
          'Unexpected cell in maze: ' + JSON.stringify(m.grid[coord(x, y)]),
        );
      }
    }
    row.push('║');
    output.push(row.join(''));
  }
  output.push('╚' + '═'.repeat(m.size) + '╝');
  console.log(output.join('\n'));
}
