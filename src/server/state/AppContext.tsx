import React, { useCallback, useState } from 'react';
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
  cordContext?: 'team' | 'global';
  setCordContext: (v: 'team' | 'global') => void;
};

export type TAppContextExport = {
  user?: ClientUser | undefined;
  team?: ClientTeam | undefined;
  showNavigation?: boolean | undefined;
  showHeader?: boolean | undefined;
  cordClientAuthToken?: string | undefined;
  cordContext: 'team' | 'global';
};

export const AppContext = React.createContext<TAppContext>(null);

type AppContextProviderProps = {
  user?: ClientUser;
  team?: ClientTeam;
  showNavigation?: boolean;
  showHeader?: boolean;
  cordClientAuthToken?: string;
  cordContext: boolean;
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

  const [cordContext, _setCordContext] = useState<'team' | 'global'>('global');

  const setCordContext = useCallback(
    (v: 'team' | 'global') => {
      setCordClientAuthToken(undefined);
      _setCordContext(v);
    },
    [_setCordContext, setCordClientAuthToken],
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
        cordClientAuthToken,
        setCordClientAuthToken,
        cordContext,
        setCordContext,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
