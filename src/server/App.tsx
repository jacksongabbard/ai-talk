import { Routes, Route } from 'react-router-dom';

import Home from './routes/home/Home';
import Profile from './routes/profile/Profile';
import Auth from './routes/auth/Auth';
import Shell from './ui/shell/Shell';
import Team from './routes/team/Team';
import CreateTeam from './routes/createTeam/CreateTeam';
import JoinTeam from './routes/joinTeam/JoinTeam';
import Puzzles from './routes/puzzles/Puzzles';
import PuzzleWithContext from './routes/puzzle/PuzzleWithContext';

const App: React.FC = () => {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/team" element={<Team />} />
        <Route path="/create-team" element={<CreateTeam />} />
        <Route path="/join-team" element={<JoinTeam />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/puzzles" element={<Puzzles />} />
        <Route path="/puzzle/:slug" element={<PuzzleWithContext />} />
      </Routes>
    </Shell>
  );
};

export default App;
