import React, { useState } from 'react';
import type Team from 'src/lib/db/Team';
import type User from 'src/lib/db/User';

export type TAppContext = null | {
  user?: User;
  setUser: (u: User) => void;
  team?: Team;
  setTeam: (t: Team) => void;
  showNavigation: boolean;
  setShowNavigation: (b: boolean) => void;
};

export type TAppContextExport = {
  user?: User | undefined;
  team?: Team | undefined;
  showNavigation?: boolean | undefined;
};

export const AppContext = React.createContext<TAppContext>(null);

type AppContextProviderProps = {
  user?: User;
  team?: Team;
  showNavigation?: boolean;
  children: React.ReactNode;
};

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
  user,
  team,
  children,
  showNavigation,
}) => {
  const [_user, setUser] = useState<User | undefined>(user);
  const [_team, setTeam] = useState<Team | undefined>(team);
  const [_showNavigation, setShowNavigation] = useState(
    showNavigation !== undefined ? showNavigation : true,
  );
  return (
    <AppContext.Provider
      value={{
        user: _user,
        setUser,
        team: _team,
        setTeam,
        showNavigation: _showNavigation,
        setShowNavigation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
