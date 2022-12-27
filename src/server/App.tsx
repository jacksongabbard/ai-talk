import { Routes, Route } from 'react-router-dom';
import Home from './routes/home/Home';
import Profile from './routes/profile/Profile';
import Auth from './routes/auth/Auth';
import Shell from './ui/shell/Shell';
import { useContext } from 'react';
import { AppContext } from './state/AppContext';

type AppProps = {
  showNavigation?: boolean;
};

const App: React.FC<AppProps> = ({ showNavigation }) => {
  const appContext = useContext(AppContext);
  const user = appContext?.user;
  const team = appContext?.team;
  return (
    <Shell user={user} team={team} showNavigation={showNavigation}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </Shell>
  );
};

export default App;
