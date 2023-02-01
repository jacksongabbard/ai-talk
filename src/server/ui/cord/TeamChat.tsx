import {
  beta,
  CordContext,
  PagePresence,
  Sidebar,
  Thread,
} from '@cord-sdk/react';
import { Badge, IconButton, Typography } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

import Menu from '@mui/material/Menu';

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

  const [notificationAnchorEl, setNotificationAnchorEl] =
    useState<null | HTMLElement>(null);

  const showNotificationsMenu = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  // Cord Notifications API doesn't expose a way of knowing when
  // there are new notifications, so we just hook into the DOM and get
  // that info ourselves. "_Hacker voice_: I'm in"
  const [newNotificationsCount, setNewNotificationsCount] = useState(0);
  // NotificationList doesn't expose a `ref` prop, hence why attaching to the container.
  const notificationsContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const listenForNewNotifications = setInterval(() => {
      if (!notificationsContainerRef.current) {
        return;
      }

      const notificationListComponent =
        notificationsContainerRef.current.querySelector(
          'cord-notification-list',
        );
      if (!notificationListComponent || !notificationListComponent.shadowRoot) {
        return;
      }

      const unreadBadgeClassname = `badge-`; // Final dash to avoid clashes with `badgeContainer`
      const unreadBadgesCount =
        notificationListComponent.shadowRoot.querySelectorAll(
          `[class*="${unreadBadgeClassname}"`,
        ).length;
      setNewNotificationsCount(unreadBadgesCount);
    }, 100); // Cheap operation, can do often.

    return () => clearInterval(listenForNewNotifications);
  }, []);

  const handleClose = () => {
    setNotificationAnchorEl(null);
  };

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
  const margin = 24;
  const padding = 8;
  const fullHeight = appContext.showHeader
    ? `calc(100vh - var(--header-height) - ${margin}px)`
    : `calc(100vh - ${margin}px)`;

  return (
    <div
      css={{
        width: innerWidth + margin + 'px',
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
          borderRadius: 2,
          borderLeft: '1px #252 solid',
          borderRight: '1px #252 solid',
          borderTop: '1px #252 solid',
          boxSizing: 'border-box',
          padding: padding + 'px',
          position: 'fixed',
          top: appContext.showHeader
            ? `calc(var(--header-height) + ${margin}px)`
            : margin + 'px',
          right: margin + 'px',
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
                alignItems: 'center',
                marginRight: '8px',
              }}
            >
              <div
                css={{
                  display: 'flex',
                  flexDirection: 'row',
                  border: '1px #252 solid',
                  borderRadius: 2,
                  marginRight: '8px',
                  maxWidth: innerWidth + 'px',
                  height: '32px',
                }}
              >
                <div
                  onClick={setTeamChatActive}
                  css={{
                    display: 'flex',
                    alignItems: 'center',
                    flexShrink: 0,
                    flexGrow: 0,
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
                    width: 134,
                    maxWidth: 134,
                    boxSizing: 'border-box',
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    css={{
                      flex: 1,
                      overflow: 'hidden',
                      minWidth: 0,
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {appContext.team?.teamName || 'Team'}
                  </Typography>
                </div>
                <div
                  onClick={setGlobalChatActive}
                  css={{
                    display: 'flex',
                    alignItems: 'center',
                    flexShrink: 0,
                    flexGrow: 0,
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
                    width: 134,
                    maxWidth: 134,
                    boxSizing: 'border-box',
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    css={{
                      flex: 1,
                      minWidth: 0,
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    Everyone
                  </Typography>
                </div>
              </div>
              <IconButton
                sx={{ width: '64px', height: '64px' }}
                color="inherit"
                aria-label="menu"
                edge="end"
                onClick={showNotificationsMenu}
              >
                <Badge badgeContent={newNotificationsCount}>
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Menu
                id="notifications"
                anchorEl={notificationAnchorEl}
                MenuListProps={{ sx: { py: 0 } }}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(notificationAnchorEl)}
                onClose={handleClose}
                ref={notificationsContainerRef}
              >
                {/* TODO(am):
                1. If you open notifications before page loads, they're rendered outside the viewport.
              */}
                <beta.NotificationList
                  style={{
                    height: '50vh',
                    width: '350px',
                    // Because of `keepMounted`, MUI renders this component invisible
                    // on the page. Users can still click on it though. :clown_emoji:
                    pointerEvents: notificationAnchorEl ? undefined : 'none',
                  }}
                />
              </Menu>
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
