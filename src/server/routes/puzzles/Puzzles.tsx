import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { AppContext } from 'src/server/state/AppContext';
import callAPI from 'src/client/lib/callAPI';
import Page from 'src/server/ui/page/Page';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';
import MessageBox from 'src/server/ui/messageBox/MessageBox';
import { Typography } from '@mui/material';
import { ClientPuzzle, assertIsClientPuzzle } from 'src/types/Puzzle';
import { CordContext, PagePresence, PresenceFacepile } from '@cord-sdk/react';

type PuzzleMap = {
  [slug: string]: { puzzle: ClientPuzzle; solved: boolean | undefined };
};

const Puzzles: React.FC = () => {
  const appContext = useContext(AppContext);
  const cordContext = useContext(CordContext);
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

      if (
        hasOwnProperty(resp, 'puzzles') &&
        typeof resp.puzzles === 'object' &&
        hasOwnProperty(resp, 'solvedMap') &&
        typeof resp.solvedMap === 'object' &&
        resp.solvedMap !== null
      ) {
        const pmap: PuzzleMap = {};
        for (let slug in resp.puzzles) {
          if (hasOwnProperty(resp.puzzles, slug)) {
            const v = assertIsClientPuzzle(resp.puzzles[slug]);
            let solved: undefined | boolean = undefined;
            if (hasOwnProperty(resp.solvedMap, slug)) {
              solved = !!resp.solvedMap[slug];
            }
            pmap[slug] = {
              puzzle: v,
              solved,
            };
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
        <div css={{ flex: 1, display: 'flex' }}>
          {Object.keys(puzzleMap).map((slug) => {
            const p = puzzleMap[slug].puzzle;
            const solved = puzzleMap[slug].solved;
            return (
              <Link to={'/puzzle/' + slug} key={slug}>
                <div
                  css={{
                    border: '1px #3f3 solid',
                    borderRadius: 2,
                    width: '25vw',
                    height: '200px',
                    flex: 0,
                    flexGrow: 0,
                    flexShrink: 0,
                    padding: 'var(--spacing-medium)',
                    marginBottom: 'var(--spacing-medium)',
                    marginRight: 'var(--spacing-medium)',
                    position: 'relative',
                    textDecoration: 'none',
                    '&:hover': {
                      background: '#3f3',
                      color: '#000',
                      textDecoration: 'none',
                    },
                  }}
                >
                  <Typography variant="h3" css={{ textDecoration: 'none' }}>
                    {p.name}
                  </Typography>
                  <Typography variant="body2" css={{ textDecoration: 'none' }}>
                    {p.minPlayers === 1 &&
                      p.maxPlayers === 1 &&
                      'Single Player'}
                    {p.maxPlayers !== 1 &&
                      p.minPlayers === p.maxPlayers &&
                      p.minPlayers + ' players'}
                    {p.maxPlayers !== 1 &&
                      p.minPlayers !== p.maxPlayers &&
                      p.minPlayers + '-' + p.maxPlayers + ' players'}
                  </Typography>
                  <div
                    css={{
                      marginTop: 'var(--spacing-medium)',
                      marginBottom: 'var(--spacing-medium)',
                    }}
                  >
                    <PresenceFacepile location={{ route: '/puzzle/' + slug }} />
                  </div>
                  {solved === true && (
                    <Typography
                      variant="subtitle2"
                      css={{
                        position: 'absolute',
                        bottom: 0,
                        right: '16px',
                        background: '#3f3',
                        color: '#000',
                        padding: 'var(--spacing-medium)',
                      }}
                    >
                      Solved!
                    </Typography>
                  )}
                  {solved === false && (
                    <Typography
                      variant="subtitle2"
                      css={{
                        position: 'absolute',
                        bottom: 0,
                        right: '16px',
                        background: '#3f3',
                        color: '#000',
                        padding: 'var(--spacing-medium)',
                      }}
                    >
                      Started
                    </Typography>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </Page>
  );
};

export default Puzzles;
