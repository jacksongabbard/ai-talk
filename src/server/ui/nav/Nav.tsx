import { useCallback, useState } from 'react';

import Home from '@mui/icons-material/Home';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Link from '@mui/material/Link';
import MenuList from '@mui/material/MenuList';
import Extension from '@mui/icons-material/Extension';
import Group from '@mui/icons-material/Group';
import Paper from '@mui/material/Paper';
import Person from '@mui/icons-material/Person';
import { Leaderboard } from '@mui/icons-material';
import type { OverridableComponent } from '@mui/material/OverridableComponent';
import type { SvgIconTypeMap } from '@mui/material/SvgIcon';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import NavMenuItem from '../navMenuItem/NavMenuItem';

const MARGIN = 'var(--spacing-xlarge)';
const PAGES: {
  name: string;
  linkTo: string;
  Icon: OverridableComponent<SvgIconTypeMap<object, 'svg'>>;
}[] = [
  { name: 'Home', linkTo: 'home', Icon: Home },
  { name: 'Puzzles', linkTo: 'puzzles', Icon: Extension },
  { name: 'Profile', linkTo: 'profile', Icon: Person },
  { name: 'Team', linkTo: 'team', Icon: Group },
  { name: 'All Teams', linkTo: 'teams', Icon: Group },
  { name: 'Leaderboard', linkTo: 'leaderboard', Icon: Leaderboard },
];

/**
 * Renders a full height, vertical list. Used for wider screens.
 */
export const NavSidebar: React.FC = () => {
  return (
    <Paper
      sx={{
        display: { md: 'block', sm: 'none', xs: 'none' },
        margin: MARGIN,
        width: 240,
        minHeight: `calc(100vh - var(--header-height) - calc(${MARGIN} * 2))`,
      }}
    >
      <MenuList>
        {PAGES.map(({ name, linkTo, Icon }) => (
          <NavMenuItem to={`/${linkTo}`} key={name}>
            <ListItemIcon>
              <Icon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{name}</ListItemText>
          </NavMenuItem>
        ))}
      </MenuList>
    </Paper>
  );
};

/**
 * Renders a button, which on click opens a floating menu.
 * Used for smaller screens where the nav sidebar is hidden.
 */
export const NavFloatingMenu = () => {
  const [navigationAnchorEl, setNavigationAnchorEl] =
    useState<null | HTMLElement>(null);

  const showNavMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setNavigationAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setNavigationAnchorEl(null);
  }, []);

  return (
    <Box
      sx={{
        display: { md: 'none', sm: 'flex' },
        marginRight: 'var(--spacing-large)',
      }}
    >
      <IconButton
        color="inherit"
        aria-label="menu"
        edge="end"
        onClick={showNavMenu}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="nav"
        anchorEl={navigationAnchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(navigationAnchorEl)}
        onClose={handleClose}
      >
        {PAGES.map(({ linkTo, Icon, name }) => (
          <MenuItem href={`/${linkTo}`} component={Link} key={name}>
            <ListItemIcon>
              <Icon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{name}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};
