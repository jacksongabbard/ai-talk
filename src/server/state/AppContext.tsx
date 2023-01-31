import React, { useCallback, useRef, useState } from 'react';
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

  // Don't want to explicitly depend on cordContext because changing it will
  // cause re-renders and re-execution of useEffect() functions in many pages.
  // Many pages explicitly set the cordContext to some value that makes sense on
  // that page (i.e. leaderboard -> global by default). If I recreate the
  // setCordContext function every time cordContext changes and then those pages
  // depend on setCordContext in their useEffect, we end up in a state where you
  // can't switch chat tabs because switching chat tabs causes the page to
  // switch the tab back. Hence the ref.
  const cordContextRef = useRef(cordContext);
  cordContextRef.current = cordContext;
  const setCordContext = useCallback(
    (v: 'team' | 'global') => {
      let value = v;
      if (!_team) {
        value = 'global';
      }

      if (cordContextRef.current !== value) {
        setCordClientAuthToken(undefined);
        setTimeout(() => {
          _setCordContext(value);
        }, 100);
      }
    },
    [_setCordContext, setCordClientAuthToken, _team],
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
