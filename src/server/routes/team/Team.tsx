import React, { useContext, useEffect } from 'react';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

import { AppContext } from 'src/server/state/AppContext';
import Page from 'src/server/ui/page/Page';
import useRouterLink from 'src/server/ui/routerLink/useRouterLink';

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

  const CreateTeamRouterLink = useRouterLink('/create-team');
  const JoinTeamRouterLink = useRouterLink('/join-team');
  return (
    <Page title="Team">
      {!team && (
        <>
          <div css={{ marginBottom: 'var(--spacing-medium)' }}>
            <Typography variant="h5">
              😿 You're not currently on a team.
            </Typography>
          </div>
          <div>
            <Typography variant="body2">
              OHFFS is best with a team. You need a team in order to take part
              in puzzle competitions. You also need a team to complete many of
              the best puzzles. You can join an existing team or create a team
              and invite your puzzle pals to join it.
            </Typography>
          </div>
          <Button
            component={CreateTeamRouterLink}
            variant="contained"
            fullWidth
            css={{
              marginTop: 'var(--spacing-large)',
              marginBottom: 'var(--spacing-medium)',
            }}
          >
            <div
              css={{
                textTransform: 'none',

                flex: 1,
              }}
            >
              <Typography variant="h6">Create a team</Typography>
              <Typography variant="subtitle2">
                Start your own team and invite people to join you
              </Typography>
            </div>
          </Button>
          <Button
            component={JoinTeamRouterLink}
            variant="contained"
            fullWidth
            css={{
              marginTop: 'var(--spacing-medium)',
              marginBottom: 'var(--spacing-large)',
            }}
          >
            <div
              css={{
                textTransform: 'none',

                flex: 1,
              }}
            >
              <Typography variant="h6">Join a team</Typography>
              <Typography variant="subtitle2">
                Find and join an existing team
              </Typography>
            </div>
          </Button>
        </>
      )}
      {team && <></>}
    </Page>
  );
};

export default TeamPage;
