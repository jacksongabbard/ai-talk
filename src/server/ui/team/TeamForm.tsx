import { useCallback, useContext, useEffect, useState } from 'react';

import { AppContext } from 'src/server/state/AppContext';
import TeamNameTextField from './TeamNameTextField';
import {
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import callAPI from 'src/client/lib/callAPI';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';
import ValidNameRegex from 'src/lib/validation/ValidNameRegex';
import type { ClientTeam } from 'src/types/ClientTeam';

type TeamFormProps = {
  onUpdate: (team: ClientTeam) => void;
  onCancel: () => void;
};

const TeamForm: React.FC<TeamFormProps> = ({ onUpdate, onCancel }) => {
  const appContext = useContext(AppContext);
  const team = appContext?.team;
  const setTeam = appContext?.setTeam;
  const user = appContext?.user;
  const setUser = appContext?.setUser;

  if (!setTeam || !user || !setUser) {
    throw new Error('Something is broken. AppContext is missing key things.');
  }

  const [teamName, setTeamName] = useState(team ? team.teamName : '');
  const [teamLocation, setTeamLocation] = useState(team ? team.location : '');
  const [publicTeam, setPublicTeam] = useState(team ? team.public : true);

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!team) {
      return;
    }

    setTeamName(team.teamName);
    setTeamLocation(team.location);
    setPublicTeam(team.public);
  }, [team, setTeamName, setTeamLocation, setPublicTeam]);

  const onTeamNameChange = useCallback(
    (teamName: string) => {
      setTeamName(teamName);
    },
    [setTeamName],
  );

  const onLocationChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTeamLocation(e.target.value.substring(0, 48));
    },
    [setTeamLocation],
  );

  const onPublicChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPublicTeam(true);
    },
    [setPublicTeam],
  );

  const onPrivateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPublicTeam(false);
    },
    [setPublicTeam],
  );

  const save = useCallback(async () => {
    setSuccessMessage('');
    setErrorMessage('');

    const resp = await callAPI(team ? 'update-team' : 'create-team', {
      teamId: team ? team.id : undefined,
      teamName,
      location: teamLocation,
      public: publicTeam,
    });

    if (hasOwnProperty(resp, 'success') && typeof resp.success === 'boolean') {
      setSuccessMessage(
        team ? 'Team updated successfully!' : 'Team created successfully!',
      );
      const t = team || {
        id: '',
        createdAt: new Date(),
        teamName: '',
        location: '',
        public: true,
        active: true,
      };

      if (hasOwnProperty(resp, 'id') && typeof resp.id === 'string') {
        t.id = resp.id;
      }

      if (
        hasOwnProperty(resp, 'teamName') &&
        typeof resp.teamName === 'string'
      ) {
        t.teamName = resp.teamName;
      }
      if (
        hasOwnProperty(resp, 'location') &&
        typeof resp.location === 'string'
      ) {
        t.location = resp.location;
      }

      if (hasOwnProperty(resp, 'public') && typeof resp.public === 'boolean') {
        t.public = resp.public;
      }

      if (
        hasOwnProperty(resp, 'createdAt') &&
        typeof resp.createdAt === 'string'
      ) {
        t.createdAt = new Date(resp.createdAt);
      }

      setTeam(t);
      if (user.teamId !== t.id) {
        setUser({ ...user, teamId: t.id });
      }
      onUpdate(t);
    }

    if (hasOwnProperty(resp, 'error') && typeof resp.error === 'string') {
      setSuccessMessage('Update failed: ' + resp.error);
    }
  }, [
    team,
    setTeam,
    teamName,
    teamLocation,
    publicTeam,
    setSuccessMessage,
    setErrorMessage,
  ]);

  return (
    <>
      {successMessage !== '' && (
        <Paper
          css={{
            background: 'var(--theme-sea)',
            padding: 'var(--spacing-medium)',
            paddingLeft: 'var(--spacing-large)',
            paddingRight: 'var(--spacing-large)',
            marginTop: 'var(--spacing-medium)',
            marginBottom: 'var(--spacing-massive)',
            color: '#fff',
          }}
        >
          {successMessage}
        </Paper>
      )}
      {errorMessage !== '' && (
        <Paper
          css={{
            background: 'var(--theme-orange)',
            padding: 'var(--spacing-medium)',
            paddingLeft: 'var(--spacing-large)',
            paddingRight: 'var(--spacing-large)',
            marginTop: 'var(--spacing-medium)',
            marginBottom: 'var(--spacing-massive)',
            color: '#fff',
          }}
        >
          {errorMessage}
        </Paper>
      )}
      <div
        css={{
          paddingTop: 'var(--spacing-large)',
          paddingBottom: 'var(--spacing-xlarge)',
        }}
      >
        <TeamNameTextField
          actualTeamName={team ? team.teamName : ''}
          value={teamName}
          onTextChange={onTeamNameChange}
          label="Team Name"
          id="teamName"
          fullWidth={true}
        />
        <Typography
          variant="subtitle2"
          css={{
            marginTop: 'var(--spacing-medium)',
            marginBottom: 'var(--spacing-medium)',
          }}
        >
          Your teammates will see this team name when you invite them. It will
          also be used in puzzle competitions and leaderboards, if you choose to
          participate in those. If you enable a 'Public' team profile, this team
          name will be shown as well as any public members of the team.
        </Typography>
      </div>
      <div
        css={{
          paddingBottom: 'var(--spacing-medium)',
          paddingTop: 'var(--spacing-large)',
        }}
      >
        <TextField
          value={teamLocation}
          onChange={onLocationChange}
          label="Location"
          id="location"
          fullWidth={true}
        />
        <Typography
          variant="subtitle2"
          css={{
            marginTop: 'var(--spacing-medium)',
            marginBottom: 'var(--spacing-medium)',
          }}
        >
          This is an anything-goes location description (within the bounds of
          decency). List a city, a town, a kingdom, an imaginary place. Get
          creative.
        </Typography>
      </div>
      <div
        css={{
          paddingBottom: 'var(--spacing-xlarge)',
          paddingTop: 'var(--spacing-large)',
        }}
      >
        <FormControlLabel
          control={<Checkbox checked={publicTeam} onChange={onPublicChange} />}
          label="Public"
        />
        <br />
        <FormControlLabel
          control={
            <Checkbox checked={!publicTeam} onChange={onPrivateChange} />
          }
          label="Private"
        />
        <Typography
          variant="subtitle2"
          css={{ marginBottom: 'var(--spacing-medium)' }}
        >
          Selecting <em>Public</em> allows your team to be seen by people on
          this site. Any members of the team that have enabled public profiles
          will be visible as members of the team.
        </Typography>
        <Typography variant="subtitle2">
          Selecting <em>Private</em> means your team will not be seen by people
          on this site. Private teams cannot win puzzle competitions.
        </Typography>
      </div>
      <div css={{ display: 'flex', justifyContent: 'end' }}>
        <Button
          onClick={save}
          variant="contained"
          disabled={
            !teamName ||
            !teamName.match(ValidNameRegex) ||
            teamName !== 'THIS IS WHERE YOU LEFT OFF' ||
            errorMessage !== ''
          }
        >
          Save
        </Button>
        <Button
          onClick={onCancel}
          css={{ marginLeft: 'var(--spacing-medium)' }}
        >
          Cancel
        </Button>
      </div>
    </>
  );
};

export default TeamForm;
