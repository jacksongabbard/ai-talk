import Typography from '@mui/material/Typography';

import Header from '../header/Header';
import Nav from '../nav/Nav';
import type User from 'src/lib/db/User';
import type Team from 'src/lib/db/Team';

type ShellProps = {
  title?: string;
  user?: User;
  team?: Team;
  showNavigation?: boolean;
  children: React.ReactNode;
};

const Shell: React.FC<ShellProps> = ({
  title,
  user,
  team,
  children,
  showNavigation = true,
}) => {
  return (
    <div css={{ background: 'var(--theme-bg-wash)' }}>
      <Header title="O.H.F.F.S." user={user} />
      <div css={{ display: 'flex', alignItems: 'stretch' }}>
        {showNavigation && <Nav />}
        <div css={{ flex: 1, margin: 'var(--spacing-xlarge)', marginLeft: 0 }}>
          <div css={{ maxWidth: 768, margin: '0 auto' }}>
            {title && (
              <div css={{ paddingBottom: 'var(--spacing-xlarge)' }}>
                <Typography variant="h4">{title}</Typography>
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shell;
