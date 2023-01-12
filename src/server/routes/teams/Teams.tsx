import React, { useContext, useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';

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
} from '@mui/material';
import { Link } from 'react-router-dom';

const Teams: React.FC = () => {
  const appContext = useContext(AppContext);
  const user = appContext?.user;
  const team = appContext?.team;
  const teamId = team?.id;
  const [errorMessage, setErrorMessage] = useState('');
  const [teams, setTeams] = useState<ClientTeam[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    appContext?.setShowNavigation(true);
  }, [appContext?.setShowNavigation]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const resp = await callAPI('list-teams', { teamId });
      setLoading(false);
      if (hasOwnProperty(resp, 'error') && typeof resp.error === 'string') {
        setErrorMessage(resp.error);
        return;
      }

      if (hasOwnProperty(resp, 'teams') && Array.isArray(resp.teams)) {
        setTeams(resp.teams.map(hydrateSerializedClientTeam));
      }
    })();
  }, [setLoading, setTeams, setErrorMessage]);

  const cordContext = useContext(CordContext);
  useEffect(() => {
    cordContext.setLocation({ route: '/teams' });
  }, [cordContext.setLocation]);

  return (
    <Page title="Teams">
      {errorMessage !== '' && (
        <MessageBox type="error">{errorMessage}</MessageBox>
      )}
      <div>
        {loading && <MessageBox type="info">Loading</MessageBox>}
        {teams && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Team Name</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Joined On</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teams.map((t) => (
                  <TableRow
                    key={t.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Link to={'/team/' + t.teamName}>{t.teamName}</Link>
                    </TableCell>
                    <TableCell>{t.location}</TableCell>
                    <TableCell>{t.createdAt.toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </Page>
  );
};

export default Teams;
