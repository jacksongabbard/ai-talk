import { Button, Typography } from '@mui/material';

import useRouterLink from 'src/server/ui/routerLink/useRouterLink';

const NoTeam = () => {
  const CreateTeamRouterLink = useRouterLink('/create-team');
  const JoinTeamRouterLink = useRouterLink('/join-team');
  return (
    <>
      <div css={{ marginBottom: 'var(--spacing-medium)' }}>
        <Typography variant="h5">😿 You're not currently on a team.</Typography>
      </div>
      <div>
        <Typography variant="body2">
          OHFFS is best with a team. You need a team in order to take part in
          puzzle competitions. You also need a team to complete many of the best
          puzzles. You can join an existing team or create a team and invite
          your puzzle pals to join it.
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
  );
};

export default NoTeam;
