import type { Request, RequestHandler, Response } from 'express';
import { Sequelize } from 'sequelize';
import PuzzleFeedback from 'src/lib/db/PuzzleFeedback';

import { hasOwnProperty } from 'src/lib/hasOwnProperty';
import { PuzzleList } from 'src/server/puzzles';
import { bail400, bail500, error200 } from 'src/server/routes/api/util';

export const savePuzzleFeedback: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  (async () => {
    try {
      const requesterUserId = req.context?.user?.id;
      if (!requesterUserId) {
        error200(`No user, no party`, res);
        return;
      }

      if (
        hasOwnProperty(req.body, 'data') &&
        typeof req.body.data === 'object' &&
        hasOwnProperty(req.body.data, 'puzzleId') &&
        typeof req.body.data.puzzleId === 'string' &&
        hasOwnProperty(req.body.data, 'difficulty') &&
        typeof req.body.data.difficulty === 'number' &&
        hasOwnProperty(req.body.data, 'rating') &&
        typeof req.body.data.rating === 'number'
      ) {
        const { puzzleId, rating, difficulty } = req.body.data;

        await PuzzleFeedback.upsert(
          {
            puzzleId,
            userId: requesterUserId,
            rating,
            difficulty,
            feedbackText: req.body.data?.feedbackText ?? null,
          },
          { conflictFields: ['puzzle_id', 'user_id'] },
        );

        res.status(200);
        res.send(
          JSON.stringify({
            success: true,
          }),
        );
        return;
      }

      bail400('Bad request', res);
      return;
    } catch (e) {
      console.log('Failed to save feedback: ', e);
      bail500('Unexpected error: ' + (e as Error).message, res);
      return;
    }
  })();
};

export const getPuzzlesFeedbackForUser: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  (async () => {
    try {
      const requesterUserId = req.context?.user?.id;
      if (!requesterUserId) {
        error200(`No user, no party`, res);
        return;
      }

      const pfs = await PuzzleFeedback.findAll({
        where: { userId: requesterUserId },
      });

      const feedbackByPuzzleId: {
        [puzzleId: string]: {
          rating: number;
          difficulty: number;
          feedbackText: string;
        };
      } = {};
      for (const pf of pfs) {
        const { puzzleId, difficulty, rating, feedbackText } = pf;
        feedbackByPuzzleId[puzzleId] = { difficulty, rating, feedbackText };
      }

      res.status(200);
      res.send(
        JSON.stringify({
          success: true,
          feedback: feedbackByPuzzleId,
        }),
      );
    } catch (e) {
      console.log("Failed to get puzzles' feedback: ", e);
      bail500('Unexpected error: ' + (e as Error).message, res);
      return;
    }
  })();
};

export const getGlobalAveragePuzzlesFeedback: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  (async () => {
    try {
      const pfs = await PuzzleFeedback.findAll({
        attributes: [
          'puzzle_id',
          [
            Sequelize.fn(
              'AVG',
              Sequelize.cast(Sequelize.col('difficulty'), 'smallint'),
            ),
            'avgDifficulty',
          ],
          [
            Sequelize.fn(
              'AVG',
              Sequelize.cast(Sequelize.col('rating'), 'smallint'),
            ),
            'avgRating',
          ],
        ],
        group: 'puzzle_id',
      });

      const globalFeedback: {
        [slug: string]: { avgDifficulty: number; avgRating: number };
      } = PuzzleList.reduce((prev, curr) => ({ ...prev, [curr.slug]: {} }), {});
      for (const pf of pfs) {
        const {
          dataValues: { puzzle_id, avgDifficulty, avgRating },
        } = pf;
        globalFeedback[puzzle_id] = {
          avgDifficulty: parseFloat(avgDifficulty),
          avgRating: parseFloat(avgRating),
        };
      }

      res.status(200);
      res.send(
        JSON.stringify({
          success: true,
          globalFeedback,
        }),
      );
    } catch (e) {
      console.log("Failed to get puzzles' feedback: ", e);
      bail500('Unexpected error: ' + (e as Error).message, res);
      return;
    }
  })();
};
