import React, { useMemo, useState } from 'react';
import type { ClientPuzzleInstance } from 'src/types/ClientPuzzleInstance';

export type TPuzzleContext = {
  instance?: ClientPuzzleInstance;
  setInstance: (instance: ClientPuzzleInstance | undefined) => void;
};

export const PuzzleContext = React.createContext<TPuzzleContext>({
  instance: undefined,
  setInstance: () => {},
});

type PuzzleContextProviderProps = {
  children: React.ReactNode;
};

export const PuzzleContextProvider: React.FC<PuzzleContextProviderProps> = ({
  children,
}) => {
  const [instance, setInstance] = useState<ClientPuzzleInstance | undefined>();
  const value = useMemo(() => {
    return {
      instance,
      setInstance,
    };
  }, [instance, setInstance]);
  return (
    <PuzzleContext.Provider value={value}>{children}</PuzzleContext.Provider>
  );
};
