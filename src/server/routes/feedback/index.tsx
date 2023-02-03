import React from 'react';
import type { Request, RequestHandler, Response } from 'express';

import { renderPage } from 'src/server/ui/util';
import { bail500 } from 'src/server/routes/api/util';
import FeedbackTable from 'src/server/routes/feedback/Feedback';
import type { Feedback } from 'src/server/routes/feedback/Feedback';
import User from 'src/lib/db/User';
import PuzzleFeedback from 'src/lib/db/PuzzleFeedback';
import { getCordClientToken } from 'src/server/lib/cord';

export const feedback: RequestHandler = async (req: Request, res: Response) => {
  if (!req.context?.user) {
    bail500('nope.', res);
    return;
  }

  const { user } = req.context;
  if (!user.emailAddress.endsWith('@cord.com')) {
    bail500('nope.', res);
    return;
  }

  const users = await User.findAll({ order: [['createdAt', 'DESC']] });
  const rawFeedback = await PuzzleFeedback.findAll({
    order: [['createdAt', 'DESC']],
  });

  const userIdToName: { [uuid: string]: string } = {};
  for (const user of users) {
    userIdToName[user.id] = user.userName;
  }

  const feedback: Feedback = rawFeedback.map((f) => ({
    ...f.dataValues,
    userName: userIdToName[f.userId],
  }));

  const cordToken = getCordClientToken(req.context.user);

  res.send(
    renderPage(
      <>
        <div id="sneaky-feedback-root">
          <FeedbackTable feedback={feedback} cordToken={cordToken} />
        </div>
        <div
          id="hydration-bilge-sneaky"
          data-hydration-state={JSON.stringify({ feedback, cordToken })}
        />
        <script src="/static/hydrateSneakyFeedback.js"></script>
      </>,
    ),
  );
};
