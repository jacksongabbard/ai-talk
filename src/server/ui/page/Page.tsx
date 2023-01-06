import Helmet from 'react-helmet';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { CordContext, PagePresence, Thread } from '@cord-sdk/react';
import { useContext, useEffect } from 'react';
import { AppContext } from 'src/server/state/AppContext';

type PageProps = {
  title?: string;
  children?: React.ReactNode;
};

const Page: React.FC<PageProps> = ({ title, children }) => {
  const appContext = useContext(AppContext);
  const cordContext = useContext(CordContext);
  useEffect(() => {
    cordContext.setLocation({ route: window.location.pathname });
  }, [cordContext.setLocation]);

  return (
    <div css={{ display: 'flex', flexDirection: 'row' }}>
      <div css={{ flex: 1 }}>
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
              {cordContext.hasProvider && appContext?.team && (
                <div
                  css={{
                    display: 'flex',
                    flexDirection: 'row-reverse',
                    paddingBottom: 'var(--spacing-large)',
                    paddingTop: 'var(--spacing-large)',
                  }}
                >
                  <PagePresence
                    location={{ route: window.location.pathname }}
                  />
                </div>
              )}
            </div>
          </>
        )}

        <Paper>
          <div
            css={{
              padding: 'var(--spacing-xlarge)',
            }}
          >
            {children}
          </div>
        </Paper>
      </div>
      {cordContext.hasProvider && appContext?.team && (
        <div css={{ flex: 0, width: 300, marginLeft: 'var(--spacing-xlarge)' }}>
          <Thread
            threadId={window.location.pathname}
            location={{ route: window.location.pathname }}
          />
        </div>
      )}
    </div>
  );
};

export default Page;
