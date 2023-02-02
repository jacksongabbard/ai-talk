import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { AppContext } from 'src/server/state/AppContext';
import callAPI from 'src/client/lib/callAPI';
import Page from 'src/server/ui/page/Page';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';
import MessageBox from 'src/server/ui/messageBox/MessageBox';
import { IconButton, Tooltip, Typography } from '@mui/material';
import FeedbackIcon from '@mui/icons-material/RateReview';
import { ClientPuzzle, assertIsClientPuzzle } from 'src/types/Puzzle';
import { CordContext, PresenceFacepile } from '@cord-sdk/react';
import useDialog from 'src/server/ui/dialogs/useDialog';
import PuzzleFeedbackDialog, {
  AverageFeedbackByPuzzleId,
  PuzzleFeedback,
  PuzzleScoringViewOnly,
} from 'src/server/ui/dialogs/PuzzleFeedbackDialog';
import { Box } from '@mui/system';

type PuzzleMap = {
  [slug: string]: { puzzle: ClientPuzzle; solved: boolean | undefined };
};

type FeedbackByPuzzleId = {
  [puzzleId: string]: PuzzleFeedback;
};

const Puzzles: React.FC = () => {
  const appContext = useContext(AppContext);
  const cordContext = useContext(CordContext);
  const user = appContext?.user;
  const team = appContext?.team;
  const [puzzleMap, setPuzzleMap] = useState<PuzzleMap>();
  const [feedbackByPuzzleId, setFeedbackByPuzzleId] =
    useState<FeedbackByPuzzleId | null>();
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  useEffect(() => {
    appContext?.setShowNavigation(true);
    appContext?.setCordContext('team');
  }, [appContext?.setShowNavigation, appContext?.setCordContext]);

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
        for (const slug in resp.puzzles) {
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

  useEffect(() => {
    (async () => {
      setLoading(true);
      const resp = await callAPI('get-puzzles-feedback');
      if (hasOwnProperty(resp, 'error') && typeof resp.error === 'string') {
        setErrorMessage(resp.error);
        return;
      }

      if (
        !hasOwnProperty(resp, 'feedback') ||
        typeof resp.feedback !== 'object' ||
        !resp.feedback
      ) {
        return;
      }

      setFeedbackByPuzzleId(resp.feedback as FeedbackByPuzzleId);
    })();
  }, [setErrorMessage]);

  const [globalAverageFeedbackByPuzzleId, setGlobalAverageFeedbackByPuzzleId] =
    useState<AverageFeedbackByPuzzleId | null>(null);

  const updateGlobalAverageFeedback = useCallback(() => {
    (async () => {
      const resp = await callAPI('get-global-puzzles-feedback');
      if (hasOwnProperty(resp, 'error') && typeof resp.error === 'string') {
        // Intentionally not showing errors in the UI; we can live without ratings.
        return;
      }

      if (
        !hasOwnProperty(resp, 'globalFeedback') ||
        typeof resp.globalFeedback !== 'object' ||
        !resp.globalFeedback
      ) {
        return;
      }

      setGlobalAverageFeedbackByPuzzleId(
        resp.globalFeedback as AverageFeedbackByPuzzleId,
      );
    })();
  }, []);
  useEffect(() => {
    updateGlobalAverageFeedback();
  }, [updateGlobalAverageFeedback]);

  const [puzzleFeedbackDialog, openPuzzleFeedbackDialog] =
    useDialog(PuzzleFeedbackDialog);
  const handleShareFeedback = useCallback(
    (puzzleId: string, existingFeedback: PuzzleFeedback | undefined) => {
      (async () => {
        const feedback = await openPuzzleFeedbackDialog({
          puzzleId,
          existingFeedback,
        });
        if (!feedback) {
          return;
        }

        const resp = await callAPI('save-puzzle-feedback', {
          ...feedback,
          puzzleId,
        });
        if (hasOwnProperty(resp, 'error') && typeof resp.error === 'string') {
          setErrorMessage(resp.error);
          return;
        }

        updateGlobalAverageFeedback();
      })();
    },
    [openPuzzleFeedbackDialog, updateGlobalAverageFeedback],
  );

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
        <div
          css={{
            flex: 1,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--spacing-medium)',
          }}
        >
          {Object.keys(puzzleMap).map((slug) => {
            const p = puzzleMap[slug].puzzle;
            if (p.published === false) {
              return <React.Fragment key={slug}></React.Fragment>;
            }
            const solved = puzzleMap[slug].solved;
            const feedback = feedbackByPuzzleId?.[slug];
            const globalFeedback = globalAverageFeedbackByPuzzleId?.[slug];
            return (
              <div key={slug} css={{ position: 'relative' }}>
                {(solved === true || feedback) && (
                  <>
                    {puzzleFeedbackDialog}
                    <IconButton
                      css={{
                        position: 'absolute',
                        top: 'calc(-1 * var(--spacing-medium))',
                        right: 0,
                        zIndex: 10,
                        background: '#3f3',
                        ':hover': {
                          background: '#33ff3388',
                        },
                        color: '#000',
                        padding: 'var(--spacing-medium)',
                      }}
                      onClick={() => handleShareFeedback(slug, feedback)}
                    >
                      <FeedbackIcon fontSize="small" />
                    </IconButton>
                  </>
                )}
                <Link to={'/puzzle/' + slug}>
                  <div
                    css={{
                      border: '1px #3f3 solid',
                      borderRadius: 2,
                      width: '25vw',
                      minHeight: '280px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--spacing-medium)',
                      flex: 0,
                      flexGrow: 0,
                      flexShrink: 0,
                      padding: 'var(--spacing-large)',
                      marginBottom: 'var(--spacing-medium)',
                      marginRight: 'var(--spacing-medium)',
                      position: 'relative',
                      textDecoration: 'none',
                      '&:hover': {
                        boxShadow: '#3f3 1px 1px 26px;',
                      },
                    }}
                  >
                    <Typography variant="h3" css={{ textDecoration: 'none' }}>
                      {p.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      css={{ textDecoration: 'none' }}
                    >
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
                    <Tooltip
                      title={`How good (★) and difficult (🧩) people think this puzzle is`}
                      componentsProps={{
                        tooltip: {
                          sx: { backgroundColor: '#3f3', color: '#000' },
                        },
                      }}
                    >
                      <Box
                        css={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignSelf: 'flex-start',
                        }}
                      >
                        <PuzzleScoringViewOnly
                          score={globalFeedback?.avgRating ?? null}
                          type="rating"
                        />
                        <PuzzleScoringViewOnly
                          score={globalFeedback?.avgDifficulty ?? null}
                          type="difficulty"
                        />
                      </Box>
                    </Tooltip>
                    <div
                      css={{
                        marginTop: 'var(--spacing-medium)',
                        marginBottom: 'var(--spacing-medium)',
                      }}
                    >
                      <PresenceFacepile
                        location={{ route: '/puzzle/' + slug }}
                      />
                    </div>
                    {solved !== undefined && (
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
                        {solved ? 'SOLVED!' : 'STARTED'}
                      </Typography>
                    )}
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </Page>
  );
};

export default Puzzles;
