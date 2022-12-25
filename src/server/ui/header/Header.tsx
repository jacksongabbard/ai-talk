import Avatar from '@mui/material/Avatar';

import type Team from 'src/lib/db/Team';
import type User from 'src/lib/db/User';

type HeaderProps = {
  title?: string;
  user?: User;
  team?: Team;
};

const Header: React.FC<HeaderProps> = ({ title, user, team }) => {
  return (
    <div
      css={{
        alignItems: 'center',
        backgroundColor: 'var(--theme-charcoal)',
        color: 'white',
        display: 'flex',
        height: '40px',
        justifyContent: 'space-between',
        padding: 'var(--spacing-large)',
      }}
    >
      {title ? <h1>{title}</h1> : <span />}
      <span>{user && <Avatar>IDK</Avatar>}</span>
    </div>
  );
};

export default Header;
