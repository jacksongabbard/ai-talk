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
  cordClientAuthToken?: string;
  setCordClientAuthToken: (s: string) => void;
  globalCordContext?: boolean;
  setGlobalCordContext: (b: boolean) => void;
};

export type TAppContextExport = {
  user?: ClientUser | undefined;
  team?: ClientTeam | undefined;
  showNavigation?: boolean | undefined;
  showHeader?: boolean | undefined;
  cordClientAuthToken?: string | undefined;
  globalCordContext: boolean | undefined;
};

export const AppContext = React.createContext<TAppContext>(null);

type AppContextProviderProps = {
  user?: ClientUser;
  team?: ClientTeam;
  showNavigation?: boolean;
  showHeader?: boolean;
  cordClientAuthToken?: string;
  globalCordContext: boolean;
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
  const [cordClientAuthToken, setCordClientAuthToken] = useState<
    string | undefined
  >();
  const [globalCordContext, setGlobalCordContext] = useState(false);
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
        cordClientAuthToken,
        setCordClientAuthToken,
        globalCordContext,
        setGlobalCordContext,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
