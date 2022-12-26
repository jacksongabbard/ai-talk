import { Routes, Route } from 'react-router-dom';
import Home from './routes/home/Home';
import Profile from './routes/profile/Profile';
import Auth from './routes/auth/Auth';
import Shell from './ui/shell/Shell';

const App: React.FC = () => {
  return (
    <Shell>
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
