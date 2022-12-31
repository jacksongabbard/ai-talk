import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { AppContext } from 'src/server/state/AppContext';
import callAPI from 'src/client/lib/callAPI';
import Page from 'src/server/ui/page/Page';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';
import MessageBox from 'src/server/ui/messageBox/MessageBox';
import { Typography } from '@mui/material';

type PuzzleMap = {
  [slug: string]: string;
};

const Puzzles: React.FC = () => {
  const appContext = useContext(AppContext);
  const user = appContext?.user;
  const team = appContext?.team;
  const [puzzleMap, setPuzzleMap] = useState<PuzzleMap>();
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  useEffect(() => {
    appContext?.setShowNavigation(true);
  }, [appContext?.setShowNavigation]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const resp = await callAPI('list-puzzles');
      if (hasOwnProperty(resp, 'error') && typeof resp.error === 'string') {
        setErrorMessage(resp.error);
        setLoading(false);
        return;
      }

      if (hasOwnProperty(resp, 'puzzles') && typeof resp.puzzles === 'object') {
        const pmap: PuzzleMap = {};
        for (let slug in resp.puzzles) {
          if (hasOwnProperty(resp.puzzles, slug)) {
            const v = resp.puzzles[slug];
            if (typeof v !== 'string') {
              throw new Error('Bad puzzle list data from server');
            }
            pmap[slug] = v;
          }
        }
        setPuzzleMap(pmap);
        setLoading(false);
      }
    })();
  }, [setPuzzleMap, setErrorMessage, setLoading]);

  return (
    <Page title="Puzzles">
      {errorMessage && <MessageBox type="error">{errorMessage}</MessageBox>}
      {loading && (
        <Typography
          variant="subtitle2"
          css={{ display: 'block', textAlign: 'center' }}
        >
          Loading...
        </Typography>
      )}
      {puzzleMap && (
        <ul>
          {Object.keys(puzzleMap).map((slug) => {
            const puzzleName = puzzleMap[slug];
            return (
              <li key={slug}>
                <Link to={'/puzzle/' + slug}>{puzzleName}</Link>
              </li>
            );
          })}
        </ul>
      )}
    </Page>
  );
};

export default Puzzles;
