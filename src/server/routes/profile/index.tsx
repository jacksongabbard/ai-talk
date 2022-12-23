import React from 'react';

import type { Request, RequestHandler, Response } from 'express';

import { renderPage } from 'src/server/ui/util';

import Profile from './Profile';
import Chrome from 'src/server/ui/Chrome';
import { makeProfilePropsFromRequest } from './ProfileProps';

export const profile: RequestHandler = (req: Request, res: Response) => {
  const props = makeProfilePropsFromRequest(req);
  res.send(
    renderPage(
      <Chrome title="Profile">
        <div id="react-root">
          <Profile {...props} />
        </div>
        <div
          id="hydration-bilge"
          data-hydration-state={JSON.stringify(props)}
        />
        <script src="/profile/hydrate.js"></script>
      </Chrome>,
    ),
  );
};
