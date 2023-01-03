import { Paper } from '@mui/material';

type MessageBoxProps = {
  type: 'success' | 'error' | 'info';
  children: React.ReactNode;
};

const MessageBox: React.FC<MessageBoxProps> = ({ type, children }) => {
  let background: string = 'white';
  let color: string = 'black';

  if (type === 'success') {
    background = 'var(--theme-sea)';
    color = '#fff';
  } else if (type === 'error') {
    background = 'var(--theme-orange)';
    color = '#fff';
  } else if (type === 'info') {
    (background = 'var(--theme-green)'), (color = '#fff');
  }

  return (
    <Paper
      css={{
        background,
        padding: 'var(--spacing-medium)',
        paddingLeft: 'var(--spacing-large)',
        paddingRight: 'var(--spacing-large)',
        marginTop: 'var(--spacing-medium)',
        marginBottom: 'var(--spacing-massive)',
        color,
      }}
    >
      {children}
    </Paper>
  );
};

export default MessageBox;
