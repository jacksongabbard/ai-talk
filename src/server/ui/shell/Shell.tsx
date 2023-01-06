import Typography from '@mui/material/Typography';

import Header from '../header/Header';
import Nav from '../nav/Nav';
import { useContext } from 'react';
import { AppContext } from 'src/server/state/AppContext';

type ShellProps = {
  title?: string;
  children: React.ReactNode;
};

const Shell: React.FC<ShellProps> = ({ title, children }) => {
  const appContext = useContext(AppContext);
  const showNavigation = appContext?.showNavigation;

  return (
    <div css={{ background: 'var(--theme-bg-wash)' }}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          body {
          --cord-page-presence-avatar-size: 32px;
          --cord-color-base: #000;
          --cord-color-base-strong: #696A6C;
          --cord-color-base-x-strong: #97979F;
          --cord-color-content-primary: #3f3;
          --cord-color-content-emphasis: #3f3;
          --cord-color-brand-primary: #3f3;
        }
      `,
        }}
      ></style>
      {!appContext ||
        appContext.showHeader === undefined ||
        (appContext.showHeader && <Header title="O.H.F.F.S." />)}
      <div css={{ display: 'flex', alignItems: 'stretch' }}>
        {(showNavigation === undefined || showNavigation) && <Nav />}
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
