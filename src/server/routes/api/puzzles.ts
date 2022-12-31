import type { Request, RequestHandler, Response } from 'express';

import { PuzzleList } from 'src/server/puzzles';
import { bail400 } from './util';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';
import type { Puzzle } from 'src/types/Puzzle';

function puzzleMapFromList(pl: Puzzle[]): { [slug: string]: Puzzle } {
  const slugToName: { [slug: string]: Puzzle } = {};
  for (let ii = 0; ii < PuzzleList.length; ii++) {
    slugToName[PuzzleList[ii].slug] = PuzzleList[ii];
  }
  return slugToName;
}

export const listPuzzles: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const slugToName = puzzleMapFromList(PuzzleList);
    res.status(200);
    res.send(JSON.stringify({ success: true, puzzles: slugToName }));
  } catch (e) {
    console.log('Failed to fetch puzzle list: ', e);
    bail400('Unexpected error: ' + (e as Error).message, res);
    return;
  }
};
export const getPuzzleInfo: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    if (
      req.body &&
      hasOwnProperty(req.body, 'data') &&
      typeof req.body.data === 'object'
    ) {
      if (
        hasOwnProperty(req.body.data, 'slug') &&
        typeof req.body.data.slug === 'string'
      ) {
        const { slug } = req.body.data;
        const pmap = puzzleMapFromList(PuzzleList);
        if (pmap[slug]) {
          res.status(200);
          res.send(
            JSON.stringify({ success: true, puzzleName: pmap[slug].name }),
          );
        } else {
          throw new Error('No such puzzle');
        }
      } else {
        bail400('Bad request', res);
        return;
      }
    } else {
      bail400('Bad request', res);
      return;
    }
  } catch (e) {
    console.log('Failed to fetch puzzle list: ', e);
    bail400('Unexpected error: ' + (e as Error).message, res);
    return;
  }
};
