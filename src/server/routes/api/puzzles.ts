import type { Request, RequestHandler, Response } from 'express';

import { PuzzleList } from 'src/server/puzzles';
import { bail400 } from './util';

export const listPuzzles: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const slugToName: { [slug: string]: string } = {};
    for (let ii = 0; ii < PuzzleList.length; ii++) {
      slugToName[PuzzleList[ii].slug] = PuzzleList[ii].name;
    }
    res.status(200);
    res.send(JSON.stringify(slugToName));
  } catch (e) {
    console.log('Failed to fetch puzzle list: ', e);
    bail400('Unexpected error: ' + (e as Error).message, res);
    return;
  }
};
