import { CordProvider } from '@cord-sdk/react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import Home from './routes/home/Home';
import Profile from './routes/profile/Profile';
import Auth from './routes/auth/Auth';
import Shell from './ui/shell/Shell';
import Team from './routes/team/Team';
import CreateTeam from './routes/createTeam/CreateTeam';
import JoinTeam from './routes/joinTeam/JoinTeam';
import Puzzles from './routes/puzzles/Puzzles';
import PuzzleWithContext from './routes/puzzle/PuzzleWithContext';
import { useContext, useEffect } from 'react';
import { AppContext } from './state/AppContext';
import callAPI from 'src/client/lib/callAPI';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';
import Teams from './routes/teams/Teams';
import Leaderboard from './routes/leaderboard/Leaderboard';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#119911',
      light: '#55cc55',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#33ff33',
    },
    background: {
      default: '#111',
      paper: '#000',
    },
    text: {
      primary: '#ccffcc',
      secondary: 'rgba(255,255,255,0.7)',
    },
  },
});

const App: React.FC = () => {
  const appContext = useContext(AppContext);
  useEffect(() => {
    appContext?.setCordClientAuthToken('');
    (async () => {
      if (
        (appContext?.cordContext || appContext?.team) &&
        appContext?.setCordClientAuthToken
      ) {
        const resp = await callAPI('get-cord-client-auth-token', {
          global: appContext.cordContext === 'global',
        });
        if (
          hasOwnProperty(resp, 'clientAuthToken') &&
          typeof resp.clientAuthToken === 'string'
        ) {
          appContext.setCordClientAuthToken(resp.clientAuthToken);
        }
      }
    })();
  }, [
    appContext?.team,
    appContext?.setCordClientAuthToken,
    appContext?.cordContext,
  ]);

  const shell = (
    <ThemeProvider theme={darkTheme}>
      <Shell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:userName" element={<Profile />} />
          <Route path="/team" element={<Team />} />
          <Route path="/team/:teamName" element={<Team />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/create-team" element={<CreateTeam />} />
          <Route path="/join-team" element={<JoinTeam />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/puzzles" element={<Puzzles />} />
          <Route path="/puzzle/:slug" element={<PuzzleWithContext />} />
        </Routes>
      </Shell>
    </ThemeProvider>
  );

  const cordToken = appContext?.cordClientAuthToken;
  return <CordProvider clientAuthToken={cordToken}>{shell}</CordProvider>;
};

export default App;
