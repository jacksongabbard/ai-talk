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

  const threadId =
    't:' +
    (appContext?.globalCordContext ? 'global' : appContext?.team?.id) +
    ':' +
    location.pathname;
  console.log({ threadId });

  const innerWidth = 360;
  const margin = 8;
  const padding = 8;
  const fullHeight = appContext.showHeader
    ? `calc(100vh - var(--header-height) - ${margin}px)`
    : `calc(100vh - ${margin}px)`;

  return (
    <div
      css={{
        width: innerWidth + 'px',
        height: appContext.showHeader
          ? `calc(100vh - var(--header-height) - ${margin}px)`
          : '100vh',
      }}
    >
      <div
        css={{
          display: 'flex',
          alignItems: 'stretch',
          background: '#000',
          borderLeft: '1px #252 solid',
          borderRight: '1px #252 solid',
          borderTop: '1px #252 solid',
          boxSizing: 'border-box',
          padding: padding + 'px',
          position: 'fixed',
          top: appContext.showHeader
            ? `calc(var(--header-height) + ${margin}px)`
            : margin + 'px',
          right: 8,
          minHeight: fullHeight,
          maxHeight: fullHeight,
          width: innerWidth + 'px',
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
            <Typography variant="h6">
              {!appContext.globalCordContext &&
                appContext?.team &&
                appContext.team.teamName}
              {appContext.globalCordContext && 'Everyone'}
            </Typography>
            <PagePresence
              location={{ route: location.pathname }}
              durable={true}
              maxUsers={6}
            />
          </div>
          <Thread
            threadId={threadId}
            css={{
              width: innerWidth - padding * 2,
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
      </div>{' '}
    </div>
  );
};

export default TeamChat;
