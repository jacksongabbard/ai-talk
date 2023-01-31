import Helmet from 'react-helmet';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { CordContext, PagePresence } from '@cord-sdk/react';
import { useContext, useEffect } from 'react';
import { AppContext } from 'src/server/state/AppContext';
import { useLocation } from 'react-router-dom';

type PageProps = {
  title?: string;
  children?: React.ReactNode;
};

const Page: React.FC<PageProps> = ({ title, children }) => {
  const appContext = useContext(AppContext);
  const cordContext = useContext(CordContext);
  const location = useLocation();
  useEffect(() => {
    cordContext.setLocation({ route: location.pathname });
  }, [cordContext, cordContext.setLocation, location]);

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'stretch',
      }}
    >
      {title && (
        <>
          <Helmet>
            <title>{title}</title>
          </Helmet>
          <div css={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography
              variant="h4"
              css={{ marginBottom: 'var(--spacing-medium)' }}
            >
              {title}
            </Typography>
          </div>
        </>
      )}

      <Paper
        css={{
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'center',
          padding: 'var(--spacing-xlarge)',
        }}
      >
        {children}
      </Paper>
    </div>
  );
};

export default Page;
