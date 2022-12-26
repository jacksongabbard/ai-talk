import Header from '../header/Header';
import Nav from '../nav/Nav';

type ShellProps = {
  title: string;
  children: React.ReactNode;
};

const Shell: React.FC<ShellProps> = ({ title, children }) => {
  return (
    <div css={{ background: 'var(--theme-bg-wash)' }}>
      <Header title={title} />
      <div css={{ display: 'flex', alignItems: 'stretch' }}>
        <Nav />
        <div css={{ flex: 1, margin: 'var(--spacing-xlarge)' }}>{children}</div>
      </div>
    </div>
  );
};

export default Shell;
