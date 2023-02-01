import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Header from '../header/Header';
import { NavSidebar } from '../nav/Nav';
import { useContext } from 'react';
import { AppContext } from 'src/server/state/AppContext';
import TeamChat from '../cord/TeamChat';
import { useLocation } from 'react-router-dom';

type ShellProps = {
  title?: string;
  children: React.ReactNode;
};

const Shell: React.FC<ShellProps> = ({ title, children }) => {
  const appContext = useContext(AppContext);
  const showNavigation = appContext?.showNavigation;
  const location = useLocation();
  return (
    <div css={{ background: 'var(--theme-bg-wash)' }}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          body {
          --cord-color-launcher: #353;
          --cord-page-presence-avatar-size: 32px;
          --cord-color-base: #000;
          --cord-color-base-strong: #696A6C;
          --cord-color-base-x-strong: #97979F;
          --cord-color-content-primary: #3f3;
          --cord-color-content-emphasis: #3f3;
          --cord-color-brand-primary: #3f3;
          --cord-color-notification: #3f3;
        }
      `,
        }}
      ></style>
      {!appContext ||
        appContext.showHeader === undefined ||
        (appContext.showHeader && <Header title="O.H.F.F.S." />)}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'stretch',
          marginLeft: {
            xs: 'var(--spacing-large)',
            sm: 'var(--spacing-large)',
            md: 0,
          },
        }}
      >
        {(showNavigation === undefined || showNavigation) && <NavSidebar />}
        <div
          css={{
            flex: 1,
            margin: 'var(--spacing-xlarge)',
            marginLeft: 0,
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'center',
          }}
        >
          {title && (
            <div css={{ paddingBottom: 'var(--spacing-xlarge)' }}>
              <Typography variant="h4">{title}</Typography>
            </div>
          )}
          {children}
        </div>
        {location.pathname !== '/auth' && <TeamChat />}
      </Box>
    </div>
  );
};

export default Shell;
