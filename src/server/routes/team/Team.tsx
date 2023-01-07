import React, { useCallback, useContext, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { AppContext } from 'src/server/state/AppContext';
import Page from 'src/server/ui/page/Page';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Input,
} from '@mui/material';
import NoTeam from './NoTeam';
import TeamForm from 'src/server/ui/team/TeamForm';
import { ClientUser, hydrateSerializedClientUser } from 'src/types/ClientUser';
import callAPI from 'src/client/lib/callAPI';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';
import MessageBox from 'src/server/ui/messageBox/MessageBox';
import { errorThingToString } from 'src/lib/error/errorThingToString';
import {
  CordContext,
  PagePresence,
  PresenceFacepile,
  Thread,
} from '@cord-sdk/react';

// For some godforsaken reason, if I call this component 'Team', I get
// hydration errors. Specifically, the error:
//   Warning: Prop `className` did not match. Server: "css-2jddn0-Team2" Client: "css-tzd8vf-Team"
//
// I did some digging, but couldn't find anything to explain why only this
// component has this problem. Got no where. Finally, on a hunch, I tried
// renaming the component to "Team2" just to see what would happen. The errors
// disappear. I have no idea why. I also don't have the emotional bandwidth or
// time to go spelunking through emotion's SSR vs. client-side code paths.
// Certainly seems like some sort of component name cache issue. But as far as I
// can tell, I don't have two "Team" components. Ugh. Whatever.
//
// Future me (or someone else) may get some eudaimonic joy from figuring out the
// problem. Right now me wants to move the ball forward on the project without
// any side quests.
const TeamPage: React.FC = () => {
  const appContext = useContext(AppContext);
  const user = appContext?.user;
  const team = appContext?.team;
  const teamId = team?.id;
  const [errorMessage, setErrorMessage] = useState('');
  const [members, setMembers] = useState<ClientUser[]>([]);
  const [omittedMembers, setOmittedMembers] = useState(false);
  useEffect(() => {
    appContext?.setShowNavigation(true);
  }, [appContext?.setShowNavigation]);

  const [editing, setEditing] = useState(false);
  const startEditingTeam = useCallback(() => {
    setEditing(true);
  }, [setEditing]);

  const stopEditingTeam = useCallback(() => {
    setEditing(false);
  }, [setEditing]);

  useEffect(() => {
    (async () => {
      if (teamId) {
        const resp = await callAPI('list-team-members', { teamId });
        console.log(resp);
        if (hasOwnProperty(resp, 'error') && typeof resp.error === 'string') {
          setErrorMessage(resp.error);
          return;
        }
        if (hasOwnProperty(resp, 'members') && Array.isArray(resp.members)) {
          try {
            const mems = resp.members.map(hydrateSerializedClientUser);
            setMembers(mems);
          } catch (e) {
            setErrorMessage(errorThingToString(e));
          }
        }
        if (
          hasOwnProperty(resp, 'privateUsersOmitted') &&
          typeof resp.privateUsersOmitted === 'boolean'
        ) {
          setOmittedMembers(resp.privateUsersOmitted);
        }
      }
    })();
  }, [teamId, setMembers, setOmittedMembers, setErrorMessage]);

  const [joinCode, setJoinCode] = useState('');
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const closeDialog = useCallback(() => {
    setInviteDialogOpen(false);
    setJoinCode('');
  }, [setInviteDialogOpen, setJoinCode]);

  const inviteMembers = useCallback(() => {
    setInviteDialogOpen(true);
  }, [setInviteDialogOpen]);

  const generateJoinCode = useCallback(() => {
    (async () => {
      try {
        const resp = await callAPI('generate-join-code', {});
        if (
          hasOwnProperty(resp, 'joinCode') &&
          typeof resp.joinCode === 'string'
        ) {
          setJoinCode(resp.joinCode);
        } else {
          setErrorMessage(
            "Server didn't return a join code. That's not supposed to happen.",
          );
        }
      } catch (e) {
        setErrorMessage(errorThingToString(e));
      }
    })();
  }, [setJoinCode, setErrorMessage]);

  const cordContext = useContext(CordContext);
  useEffect(() => {
    cordContext.setLocation({ route: '/team' });
  }, [cordContext.setLocation]);

  console.log(cordContext);

  return (
    <Page title="Team">
      {errorMessage !== '' && (
        <MessageBox type="error">{errorMessage}</MessageBox>
      )}
      {!team && <NoTeam />}
      {team && !editing && (
        <div css={{ flex: 1 }}>
          <div css={{ marginBottom: 'var(--spacing-large)' }}>
            <Typography variant="overline">Team</Typography>
            <Typography variant="h5">{team.teamName}</Typography>
          </div>
          {team.location && (
            <div css={{ marginBottom: 'var(--spacing-large)' }}>
              <Typography variant="overline">Location</Typography>
              <Typography variant="body1">{team.location}</Typography>
            </div>
          )}
          {members.length > 0 && (
            <>
              <Typography variant="overline">Members</Typography>
              {members.length === 0 && omittedMembers && (
                <div css={{ marginBottom: 'var(--spacing-large)' }}>
                  <Typography variant="body1">
                    All users on this team are non-public
                  </Typography>
                </div>
              )}
              {members.length > 0 && (
                <>
                  <ul css={{ marginBottom: 'var(--spacing-large)' }}>
                    {members.map((m) => (
                      <li
                        css={{ marginBottom: 'var(--spacing-large)' }}
                        key={m.id}
                      >
                        <Typography variant="body1">{m.userName}</Typography>
                      </li>
                    ))}
                  </ul>
                  {omittedMembers && (
                    <Typography variant="subtitle2">
                      Some non-public members have been omitted from this list.
                    </Typography>
                  )}
                </>
              )}
            </>
          )}
          {user?.teamId === team.id && (
            <div
              css={{
                marginTop: 'var(--spacing-xlarge)',
              }}
            >
              <Divider />
              <div
                css={{
                  display: 'flex',
                  justifyContent: 'end',
                  marginTop: 'var(--spacing-large)',
                }}
              >
                {members && members.length < 6 && (
                  <Button
                    variant="text"
                    onClick={inviteMembers}
                    css={{ marginLeft: 'var(--spacing-large)' }}
                  >
                    Invite members
                  </Button>
                )}
                <Button
                  variant="text"
                  onClick={startEditingTeam}
                  css={{ marginLeft: 'var(--spacing-large)' }}
                >
                  Edit team
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      {team && editing && (
        <TeamForm onUpdate={stopEditingTeam} onCancel={stopEditingTeam} />
      )}
      <Dialog onClose={closeDialog} open={inviteDialogOpen}>
        <DialogTitle>Create a join code</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Use the join code below to invite a member to your team. They can
            use the join code to add themselves.
          </DialogContentText>
        </DialogContent>
        <DialogContent>
          {!joinCode && (
            <Button variant="contained" onClick={generateJoinCode}>
              Generate join code
            </Button>
          )}
          {joinCode && (
            <Input css={{ fontSize: '5vw' }} value={joinCode} fullWidth />
          )}
          <DialogActions>
            <Button
              onClick={closeDialog}
              css={{ marginLeft: 'var(--spacing-large)' }}
            >
              Close
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </Page>
  );
};

export default TeamPage;
