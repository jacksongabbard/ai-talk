import Home from '@mui/icons-material/Home';
import Link from '@mui/material/Link';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import Logout from '@mui/icons-material/Logout';
import Person from '@mui/icons-material/Person';

const Nav: React.FC = () => {
  return (
    <Paper
      css={{
        margin: 'var(--spacing-xlarge)',
        width: 256,
      }}
    >
      <MenuList>
        <MenuItem href="/home" component={Link}>
          <ListItemIcon>
            <Home fontSize="small" />
          </ListItemIcon>
          <ListItemText>Home</ListItemText>
        </MenuItem>
        <MenuItem href="/profile" component={Link}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        <MenuItem href="/logout" component={Link}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </MenuList>
    </Paper>
  );
};

export default Nav;
