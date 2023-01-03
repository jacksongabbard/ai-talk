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
  showHeader: boolean;
  setShowHeader: (b: boolean) => void;
};

export type TAppContextExport = {
  user?: ClientUser | undefined;
  team?: ClientTeam | undefined;
  showNavigation?: boolean | undefined;
  showHeader?: boolean | undefined;
};

export const AppContext = React.createContext<TAppContext>(null);

type AppContextProviderProps = {
  user?: ClientUser;
  team?: ClientTeam;
  showNavigation?: boolean;
  showHeader?: boolean;
  children: React.ReactNode;
};

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
  user,
  team,
  children,
  showNavigation,
  showHeader,
}) => {
  const [_user, setUser] = useState<ClientUser | undefined>(user);
  const [_team, setTeam] = useState<ClientTeam | undefined>(team);
  const [_showNavigation, setShowNavigation] = useState(
    showNavigation !== undefined ? showNavigation : true,
  );
  const [_showHeader, setShowHeader] = useState(
    showHeader !== undefined ? showHeader : true,
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
        showHeader: _showHeader,
        setShowHeader,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
