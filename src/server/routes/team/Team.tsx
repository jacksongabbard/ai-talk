import React, { useCallback, useContext, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { AppContext } from 'src/server/state/AppContext';
import Page from 'src/server/ui/page/Page';
import { Divider } from '@mui/material';
import NoTeam from './NoTeam';

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
  useEffect(() => {
    appContext?.setShowNavigation(true);
  }, [appContext?.setShowNavigation]);

  const [editing, setEditing] = useState(false);
  const startEditingTeam = useCallback(() => {}, []);

  return (
    <Page title="Team">
      {!team && <NoTeam />}
      {team && (
        <>
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
          {user?.teamId === team.id && (
            <>
              <Divider />
              <div
                css={{
                  marginBottom: 'var(--spacing-large)',
                  display: 'flex',
                  justifyContent: 'end',
                }}
              >
                <Button variant="text" onClick={startEditingTeam}>
                  Edit team
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </Page>
  );
};

export default TeamPage;
