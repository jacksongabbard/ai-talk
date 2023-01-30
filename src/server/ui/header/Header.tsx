import React, { useContext, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LogoutIcon from '@mui/icons-material/Logout';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { beta } from '@cord-sdk/react';

import { AppContext } from 'src/server/state/AppContext';

type HeaderProps = {
  title?: string;
};

const Header: React.FC<HeaderProps> = ({ title }) => {
  const appContext = useContext(AppContext);
  const user = appContext?.user;
  const team = appContext?.team;
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] =
    useState<null | HTMLElement>(null);

  const showNotificationsMenu = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const showMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setMenuAnchorEl(null);
    setNotificationAnchorEl(null);
  };

  return (
    <AppBar position="static" css={{ height: 64, overflow: 'visible' }}>
      <Toolbar>
        {title && (
          <Link
            href="/"
            css={{ color: '#fff', textDecoration: 'none', display: 'block' }}
          >
            <Typography variant="h6">O.H.F.F.S.</Typography>
          </Link>
        )}
        {user && (
          <div
            css={{
              display: 'flex',
              justifyContent: 'flex-end',
              flexGrow: 1,
              gap: '8px',
            }}
          >
            <IconButton
              sx={{ width: '64px' }}
              color="inherit"
              aria-label="menu"
              edge="end"
              onClick={showNotificationsMenu}
            >
              <NotificationsNoneIcon />
            </IconButton>
            <Menu
              id="notifications"
              anchorEl={notificationAnchorEl}
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
            >
              {/* TODO(am):
                1. Unread notification's background isn't different from read. 
                2. Add a counter to the bell icon. Wish Cord would do that for me!
                3. If you open notifications before page loads, they're rendered outside the viewport.
              */}
              <beta.NotificationList
                style={{
                  height: '50vh',
                  width: '350px',
                  // Because of `keepMounted`, MUI renders this component invisible
                  // on the page. Users can still click on it though. :clown_emoji:
                  pointerEvents: Boolean(notificationAnchorEl)
                    ? undefined
                    : 'none',
                }}
              />
            </Menu>

            <IconButton
              size="large"
              color="inherit"
              aria-label="menu"
              edge={'end'}
              onClick={showMenu}
            >
              {user.profilePic ? (
                <Avatar src={user.profilePic} />
              ) : (
                <Avatar>{user.userName[0]}</Avatar>
              )}
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={menuAnchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(menuAnchorEl)}
              onClose={handleClose}
            >
              <MenuItem href="/logout" component={Link}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Menu>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
