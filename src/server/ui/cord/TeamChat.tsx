import { CordContext, PagePresence, Sidebar, Thread } from '@cord-sdk/react';
import { Typography } from '@mui/material';
import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { AppContext } from 'src/server/state/AppContext';

const TeamChat = () => {
  const appContext = useContext(AppContext);
  const cordContext = useContext(CordContext);
  const location = useLocation();

  if (
    !cordContext.hasProvider ||
    (!appContext?.team && !appContext?.globalCordContext)
  ) {
    return null;
  }

  console.log(
    'thread-' +
      (appContext?.globalCordContext ? 'global' : appContext?.team?.id) +
      '-' +
      location.pathname,
  );

  return (
    <div
      css={{
        display: 'flex',
        alignItems: 'stretch',
        background: '#000',
        borderLeft: '1px #252 solid',
        boxSizing: 'border-box',
        padding: '16px',
        position: 'relative',
        maxHeight: appContext.showHeader ? 'calc(100vh - 64px)' : '100vh',
        width: '300px',
        zIndex: 100,
      }}
    >
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div
          css={{
            alignItems: 'center',
            display: 'flex',
            flexGrow: 0,
            flex: 0,
            flexDirection: 'row',
            height: '40px',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant="h6"
            css={{ marginBottom: 'var(--spacing-large)' }}
          >
            {appContext?.team ? appContext.team.teamName : 'Chat'}
          </Typography>
          <PagePresence
            location={{ route: location.pathname }}
            durable={true}
          />
        </div>
        <Thread
          threadId={
            'thread:' +
            (appContext?.globalCordContext ? 'global' : appContext?.team?.id) +
            ':' +
            location.pathname
          }
          css={{
            width: 268,
            maxHeight: 'none',
          }}
        />
      </div>
      {/*
      <Sidebar
        location={{ route: location.pathname }}
        onOpen={(info) => {
          document.body.style.paddingRight = info.width + 'px';
        }}
        onClose={() => {
          document.body.style.paddingRight = '0';
        }}
      />
      */}
    </div>
  );
};

export default TeamChat;
