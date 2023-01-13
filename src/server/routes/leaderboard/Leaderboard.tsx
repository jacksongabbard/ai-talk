import React, { useContext, useEffect, useState } from 'react';

import { AppContext } from 'src/server/state/AppContext';
import Page from 'src/server/ui/page/Page';
import callAPI from 'src/client/lib/callAPI';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';
import MessageBox from 'src/server/ui/messageBox/MessageBox';
import { CordContext } from '@cord-sdk/react';
import { ClientTeam, hydrateSerializedClientTeam } from 'src/types/ClientTeam';
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { errorThingToString } from 'src/lib/error/errorThingToString';
import {
  LeaderboardData,
  assertIsLeaderBoardData,
} from 'src/types/leaderboard/Leaderboard';
import { convertSecondsToTime } from 'src/lib/time/util';

const LeaderboardPage: React.FC = () => {
  const appContext = useContext(AppContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<
    LeaderboardData | undefined
  >();
  useEffect(() => {
    appContext?.setShowNavigation(true);
  }, [appContext?.setShowNavigation]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const resp = await callAPI('fetch-leaderboard', {});
        setLoading(false);
        if (hasOwnProperty(resp, 'error') && typeof resp.error === 'string') {
          setErrorMessage(resp.error);
          return;
        }

        const leaderboardData = assertIsLeaderBoardData(resp);
        setLeaderboardData(leaderboardData);
      } catch (e) {
        setErrorMessage(errorThingToString(e));
      }
    })();
  }, [setLoading, setLeaderboardData, setErrorMessage]);

  const cordContext = useContext(CordContext);
  useEffect(() => {
    cordContext.setLocation({ route: '/teams' });
  }, [cordContext.setLocation]);

  return (
    <Page title="Leaderboard">
      <div css={{ flex: 1 }}>
        {errorMessage !== '' && (
          <MessageBox type="error">{errorMessage}</MessageBox>
        )}
        <div>
          {loading && <MessageBox type="info">Loading</MessageBox>}
          {leaderboardData &&
            Object.keys(leaderboardData).map((slug) => {
              const p = leaderboardData[slug];
              return (
                <div css={{ marginBottom: 'var(--spacing-xlarge)' }} key={slug}>
                  <Typography variant="h4">{p.puzzleName}</Typography>
                  <TableContainer component={Paper}>
                    <Table css={{ width: '100%' }}>
                      <TableHead>
                        <TableRow>
                          <TableCell css={{ width: '50%' }}>
                            Team Name
                          </TableCell>
                          <TableCell css={{ width: '50%' }}>
                            Solve Time
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {!p.leaders.length && (
                          <TableRow>
                            <TableCell colSpan={2}>
                              This puzzle has never been solved!
                            </TableCell>
                          </TableRow>
                        )}
                        {p.leaders.map((l) => (
                          <TableRow
                            key={l.teamName}
                            sx={{
                              '&:last-child td, &:last-child th': { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              <Link to={'/team/' + l.teamName}>
                                {l.teamName}
                              </Link>
                            </TableCell>
                            <TableCell>
                              {convertSecondsToTime(l.solveTime / 1000, '.', 2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              );
            })}
        </div>
      </div>
    </Page>
  );
};

export default LeaderboardPage;
