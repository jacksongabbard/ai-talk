import React from 'react';
import Home from '@mui/icons-material/Home';
import { Link, LinkProps } from 'react-router-dom';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import Person from '@mui/icons-material/Person';
import NavMenuItem from '../navMenuItem/NavMenuItem';

const Nav: React.FC = () => {
  return (
    <Paper
      css={{
        margin: 'var(--spacing-xlarge)',
        width: 240,
      }}
    >
      <MenuList>
        <NavMenuItem to="/home">
          <ListItemIcon>
            <Home fontSize="small" />
          </ListItemIcon>
          <ListItemText>Home</ListItemText>
        </NavMenuItem>
        <NavMenuItem to="/profile">
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </NavMenuItem>
      </MenuList>
    </Paper>
  );
};

export default Nav;
