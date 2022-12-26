import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import type Team from 'src/lib/db/Team';
import type User from 'src/lib/db/User';

type HeaderProps = {
  title?: string;
  user?: User;
  team?: Team;
};

const Header: React.FC<HeaderProps> = ({ title, user, team }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        {title && (
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            O.H.F.F.S.
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
