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
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { AppContext } from 'src/server/state/AppContext';

type HeaderProps = {
  title?: string;
};

const Header: React.FC<HeaderProps> = ({ title }) => {
  const appContext = useContext(AppContext);
  const user = appContext?.user;
  const team = appContext?.team;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const showMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {title && (
          <div css={{ flexGrow: 1 }}>
            <Link
              href="/"
              css={{ color: '#fff', textDecoration: 'none', display: 'block' }}
            >
              <Typography variant="h6">O.H.F.F.S.</Typography>
            </Link>
          </div>
        )}
        {user && (
          <>
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
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem href="/logout" component={Link}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;