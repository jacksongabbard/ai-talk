import React, { useMemo, useState } from 'react';
import type { ClientPuzzleInstance } from 'src/types/ClientPuzzleInstance';
import Solved from '../ui/solved/Solved';

export type TPuzzleContext = {
  instance?: ClientPuzzleInstance;
  setInstance: (instance: ClientPuzzleInstance | undefined) => void;
  solved: boolean;
  setSolved: (s: boolean) => void;
};

export const PuzzleContext = React.createContext<TPuzzleContext>({
  instance: undefined,
  setInstance: () => {
    console.log('If you see this, something is borked');
  },
  solved: false,
  setSolved: () => {
    console.log('If you see this, too, something is borked');
  },
});

type PuzzleContextProviderProps = {
  children: React.ReactNode;
};

export const PuzzleContextProvider: React.FC<PuzzleContextProviderProps> = ({
  children,
}) => {
  const [instance, setInstance] = useState<ClientPuzzleInstance | undefined>();
  const [solved, setSolved] = useState(false);
  const value = useMemo(() => {
    console.log('Updating the PuzzleContext', instance);
    return {
      instance,
      setInstance,
      solved,
      setSolved,
    };
  }, [instance, setInstance, solved, setSolved]);
  return (
    <PuzzleContext.Provider value={value}>
      {children}
      {solved && <Solved />}
    </PuzzleContext.Provider>
  );
};
