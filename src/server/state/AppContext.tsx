import React, { useState } from 'react';
import type { ClientUser } from 'src/types/ClientUser';
import type { ClientTeam } from 'src/types/ClientTeam';

export type TAppContext = null | {
  user?: ClientUser;
  setUser: (u: ClientUser) => void;
  team?: ClientTeam;
  setTeam: (t: ClientTeam) => void;
  showNavigation: boolean;
  setShowNavigation: (b: boolean) => void;
};

export type TAppContextExport = {
  user?: ClientUser | undefined;
  team?: ClientTeam | undefined;
  showNavigation?: boolean | undefined;
};

export const AppContext = React.createContext<TAppContext>(null);

type AppContextProviderProps = {
  user?: ClientUser;
  team?: ClientTeam;
  showNavigation?: boolean;
  children: React.ReactNode;
};

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
  user,
  team,
  children,
  showNavigation,
}) => {
  const [_user, setUser] = useState<ClientUser | undefined>(user);
  const [_team, setTeam] = useState<ClientTeam | undefined>(team);
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
