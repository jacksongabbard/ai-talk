import Helmet from 'react-helmet';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

type PageProps = {
  title?: string;
  children?: React.ReactNode;
};

const Page: React.FC<PageProps> = ({ title, children }) => {
  return (
    <>
      {title && (
        <>
          <Helmet>
            <title>{title}</title>
          </Helmet>
          <Typography
            variant="h4"
            css={{ marginBottom: 'var(--spacing-medium)' }}
          >
            {title}
          </Typography>
        </>
      )}

      <div
        css={{
          maxWidth: '768px',
        }}
      >
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
    </>
  );
};

export default Page;
