import Home from '@mui/icons-material/Home';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuList from '@mui/material/MenuList';
import Extension from '@mui/icons-material/Extension';
import Group from '@mui/icons-material/Group';
import Paper from '@mui/material/Paper';
import Person from '@mui/icons-material/Person';
import NavMenuItem from '../navMenuItem/NavMenuItem';
import { Leaderboard } from '@mui/icons-material';

const Nav: React.FC = () => {
  const margin = 'var(--spacing-xlarge)';
  return (
    <Paper
      css={{
        margin,
        width: 240,
        minHeight: `calc(100vh - var(--header-height) - calc(${margin} * 2))`,
      }}
    >
      <MenuList>
        <NavMenuItem to="/home">
          <ListItemIcon>
            <Home fontSize="small" />
          </ListItemIcon>
          <ListItemText>Home</ListItemText>
        </NavMenuItem>
        <NavMenuItem to="/puzzles">
          <ListItemIcon>
            <Extension fontSize="small" />
          </ListItemIcon>
          <ListItemText>Puzzles</ListItemText>
        </NavMenuItem>
        <NavMenuItem to="/profile">
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </NavMenuItem>
        <NavMenuItem to="/team">
          <ListItemIcon>
            <Group fontSize="small" />
          </ListItemIcon>
          <ListItemText>Team</ListItemText>
        </NavMenuItem>
        <NavMenuItem to="/teams">
          <ListItemIcon>
            <Group fontSize="small" />
          </ListItemIcon>
          <ListItemText>All Teams</ListItemText>
        </NavMenuItem>
        <NavMenuItem to="/leaderboard">
          <ListItemIcon>
            <Leaderboard fontSize="small" />
          </ListItemIcon>
          <ListItemText>Leaderboard</ListItemText>
        </NavMenuItem>
      </MenuList>
    </Paper>
  );
};

export default Nav;
