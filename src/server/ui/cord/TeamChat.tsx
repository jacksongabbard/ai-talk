import { CordContext, PagePresence, Thread } from '@cord-sdk/react';
import { Typography } from '@mui/material';
import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { AppContext } from 'src/server/state/AppContext';

const TeamChat = () => {
  const appContext = useContext(AppContext);
  const cordContext = useContext(CordContext);
  const location = useLocation();

  if (!cordContext.hasProvider || !appContext?.team) {
    return null;
  }

  return (
    <div
      css={{
        flex: 0,
        marginLeft: 'var(--spacing-xlarge)',
        marginRight: 'var(--spacing-xlarge)',
      }}
    >
      <div
        css={{
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'space-between',
          paddingBottom: 'var(--spacing-large)',
          paddingTop: 'var(--spacing-large)',
        }}
      >
        <Typography variant="h6" css={{ marginBottom: 'var(--spacing-large)' }}>
          Team Chat
        </Typography>
        <PagePresence location={{ route: location.pathname }} />
      </div>
      <div
        css={{
          width: '100%',
          maxHeight: '100vh',
          overflow: 'auto',
        }}
      >
        <Thread
          threadId={appContext.team.id}
          location={{ route: location.pathname }}
        />
      </div>
    </div>
  );
};

export default TeamChat;
