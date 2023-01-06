import { CordProvider } from '@cord-sdk/react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

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

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const App: React.FC = () => {
  const appContext = useContext(AppContext);
  const cordToken = appContext?.cordClientAuthToken;
  useEffect(() => {
    (async () => {
      if (appContext?.team && appContext?.setCordClientAuthToken) {
        const resp = await callAPI('get-cord-client-auth-token');
        if (
          hasOwnProperty(resp, 'clientAuthToken') &&
          typeof resp.clientAuthToken === 'string'
        ) {
          appContext.setCordClientAuthToken(resp.clientAuthToken);
        }
      }
    })();
  }, [appContext?.team, appContext?.setCordClientAuthToken]);

  const shell = (
    <ThemeProvider theme={darkTheme}>
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
    </ThemeProvider>
  );

  if (cordToken) {
    return <CordProvider clientAuthToken={cordToken}>{shell}</CordProvider>;
  }
  return shell;
};

export default App;
