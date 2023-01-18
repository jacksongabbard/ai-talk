import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Link, useParams } from 'react-router-dom';

import { AppContext } from 'src/server/state/AppContext';
import callAPI from 'src/client/lib/callAPI';
import Page from 'src/server/ui/page/Page';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';
import MessageBox from 'src/server/ui/messageBox/MessageBox';
import { Button, Typography } from '@mui/material';
import { assertIsSerializedPuzzleInstance } from 'src/types/ClientPuzzleInstance';
import PuzzleShell from 'src/server/ui/puzzle/PuzzleShell';
import { PuzzleContext } from 'src/server/state/PuzzleContext';

const Puzzle: React.FC = () => {
  const params = useParams();

  let slug = '';
  if (hasOwnProperty(params, 'slug') && typeof params.slug === 'string') {
    slug = params.slug;
  } else {
    throw new Error('No puzzle identifier specified');
  }

  const appContext = useContext(AppContext);

  const user = appContext?.user;
  const team = appContext?.team;
  const [loading, setLoading] = useState<boolean>(false);
  const [generatingPuzzle, setGeneratingPuzzle] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [puzzleName, setPuzzleName] = useState<string | undefined>();
  const [tick, setTick] = useState(0);
  const tickTimeoutRef = useRef<NodeJS.Timeout>();
  const puzzleContext = useContext(PuzzleContext);
  const { instance, setInstance } = puzzleContext;

  useEffect(() => {
    appContext?.setShowNavigation(false);
    appContext?.setGlobalCordContext(false);
  }, [appContext?.setShowNavigation, appContext?.setGlobalCordContext]);

  useEffect(() => {
    (async () => {
      tickTimeoutRef.current && clearTimeout(tickTimeoutRef.current);
      setLoading(true);
      const resp = await callAPI('puzzle-info', { slug });
      setLoading(false);
      if (hasOwnProperty(resp, 'error') && typeof resp.error === 'string') {
        setErrorMessage(resp.error);
        return;
      }

      if (
        !hasOwnProperty(resp, 'puzzleName') ||
        typeof resp.puzzleName !== 'string'
      ) {
        setErrorMessage('No puzzle name was returned');
        return;
      }

      if (!hasOwnProperty(resp, 'instance')) {
        setErrorMessage('No puzzle instance information was returned');
        return;
      }

      setPuzzleName(resp.puzzleName);

      setInstance(
        resp.instance
          ? assertIsSerializedPuzzleInstance(resp.instance)
          : undefined,
      );

      if (!resp.instance) {
        tickTimeoutRef.current = setTimeout(() => {
          setTick(tick + 1);
        }, 1000);
      }
    })();
  }, [
    setErrorMessage,
    setLoading,
    setPuzzleName,
    setInstance,
    slug,
    tick,
    setTick,
  ]);

  const createInstance = useCallback(() => {
    if (!!instance) {
      throw new Error('Cannot start a puzzle that has already been started');
    }
    tickTimeoutRef.current && clearTimeout(tickTimeoutRef.current);
    setGeneratingPuzzle(true);
    (async () => {
      const resp = await callAPI('generate-puzzle-instance', { slug });
      setGeneratingPuzzle(false);
      if (hasOwnProperty(resp, 'error') && typeof resp.error === 'string') {
        setErrorMessage(resp.error);
        return;
      }

      if (
        !hasOwnProperty(resp, 'instance') ||
        !resp.instance ||
        typeof resp.instance !== 'object'
      ) {
        setErrorMessage(
          'Received invalid puzzle instance details from the server',
        );
        return;
      }

      const instance = assertIsSerializedPuzzleInstance(resp.instance);
      setInstance(instance);
    })();
  }, [slug, instance, setGeneratingPuzzle, setErrorMessage, setInstance]);

  return (
    <Page>
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {errorMessage && <MessageBox type="error">{errorMessage}</MessageBox>}
        {puzzleName && !instance && (
          <div
            css={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography
              variant="h6"
              css={{ marginBottom: 'var(--spacing-large)' }}
            >
              {puzzleName}
            </Typography>
            {!generatingPuzzle && (
              <Button
                disabled={loading}
                variant="contained"
                onClick={createInstance}
              >
                Start
              </Button>
            )}
            {generatingPuzzle && (
              <Typography
                variant="body2"
                css={{ marginBottom: 'var(--spacing-large)' }}
              >
                Generating puzzle...
              </Typography>
            )}
            <div>
              <Typography
                variant="subtitle2"
                css={{
                  opacity: loading ? 1 : 0,
                  transition: 'opacity 1s',
                }}
              >
                Loading...
              </Typography>
            </div>
          </div>
        )}
      </div>
      {!loading && instance && <PuzzleShell />}
    </Page>
  );
};

export default Puzzle;
