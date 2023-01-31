import { CordContext, PagePresence, Sidebar, Thread } from '@cord-sdk/react';
import { Typography } from '@mui/material';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AppContext } from 'src/server/state/AppContext';

const TeamChat = () => {
  const appContext = useContext(AppContext);
  const cordContext = useContext(CordContext);
  const location = useLocation();

  const setTeamChatActive = useCallback(() => {
    appContext?.setCordContext('team');
  }, [appContext?.setCordContext]);

  const setGlobalChatActive = useCallback(() => {
    appContext?.setCordContext('global');
  }, [appContext?.setCordContext]);

  if (!appContext || !cordContext.hasProvider) {
    return null;
  }

  // This is an insane and evil hack that I'm using to get around the fact that
  // I can't know when the CordProvider will have re-initialised the SDK.  So,
  // I'm just waiting a second and hoping for the best.
  const [sleep, setSleep] = useState(false);
  let isSleeping = sleep;
  const prevTokenRef = useRef<string | undefined>(undefined);
  const currTokenRef = useRef<string | undefined>(
    appContext.cordClientAuthToken,
  );
  currTokenRef.current = appContext.cordClientAuthToken;
  if (currTokenRef.current !== prevTokenRef.current) {
    prevTokenRef.current = currTokenRef.current;
    setSleep(true);
    setTimeout(() => {
      setSleep(false);
    }, 1000);
    isSleeping = true;
  }

  let threadId =
    'n:' +
    (appContext.cordContext === 'global' ? 'global' : appContext?.team?.id) +
    ':' +
    location.pathname;

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
            flex: 1,
            flexDirection: 'column',
            alignItems: 'stretch',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div
              css={{
                display: 'flex',
                flexDirection: 'row',
                marginBottom: 8,
                border: '1px #252 solid',
                borderRadius: 2,
              }}
            >
              <Typography
                onClick={setTeamChatActive}
                variant="h6"
                css={{
                  flex: 1,
                  ...(appContext.cordContext === 'team'
                    ? {
                        background: '#3f3',
                        color: '#000',
                      }
                    : {}),
                  padding: '0 8px',
                  cursor: 'pointer',
                  '&:hover': {
                    background: '#3f3',
                    color: '#000',
                  },
                }}
              >
                {appContext.team?.teamName || 'Team'}
              </Typography>
              <Typography
                onClick={setGlobalChatActive}
                variant="h6"
                css={{
                  flex: 1,
                  ...(appContext.cordContext === 'global'
                    ? {
                        background: '#3f3',
                        color: '#000',
                      }
                    : {}),
                  borderLeft: '1px #252 solid',
                  padding: '0 8px',
                  cursor: 'pointer',
                  '&:hover': {
                    background: '#3f3',
                    color: '#000',
                  },
                }}
              >
                Everyone
              </Typography>
            </div>
            {appContext.cordClientAuthToken && !isSleeping && (
              <PagePresence
                location={{ route: location.pathname }}
                durable={true}
                maxUsers={6}
              />
            )}
          </div>

          {appContext.cordClientAuthToken && !isSleeping && (
            <Thread
              threadId={threadId}
              css={{
                width: innerWidth - padding * 2,
                maxHeight: 'none',
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamChat;
