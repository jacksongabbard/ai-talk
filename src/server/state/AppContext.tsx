import React, { useState } from 'react';
import type Team from 'src/lib/db/Team';
import type User from 'src/lib/db/User';

type TAppContext = null | {
  user?: User;
  setUser: (u: User) => void;
  team?: Team;
  setTeam: (t: Team) => void;
};

export const AppContext = React.createContext<TAppContext>(null);

type AppContextProviderProps = {
  user?: User;
  team?: Team;
  children: React.ReactNode;
};

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
  user,
  team,
  children,
}) => {
  const [_user, setUser] = useState<User | undefined>(user);
  const [_team, setTeam] = useState<Team | undefined>(team);
  return (
    <AppContext.Provider
      value={{
        user: _user,
        setUser,
        team: _team,
        setTeam,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
