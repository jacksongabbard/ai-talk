import Home from '@mui/icons-material/Home';
// import Link from '@mui/material/Link';
import { Link } from 'react-router-dom';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import Person from '@mui/icons-material/Person';

const MonkeyPatchLink = ({ href, ...rest }: { href: string }) => {
  return <Link to={href} {...rest} />;
};

const Nav: React.FC = () => {
  return (
    <Paper
      css={{
        margin: 'var(--spacing-xlarge)',
        width: 240,
      }}
    >
      <MenuList>
        <MenuItem href="/home" component={MonkeyPatchLink}>
          <ListItemIcon>
            <Home fontSize="small" />
          </ListItemIcon>
          <ListItemText>Home</ListItemText>
        </MenuItem>
        <MenuItem href="/profile" component={MonkeyPatchLink}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
      </MenuList>
    </Paper>
  );
};

export default Nav;
