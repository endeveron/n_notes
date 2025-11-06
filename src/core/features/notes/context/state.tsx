'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

// import { useError } from '@/core/hooks/useError';

interface AppContextType {
  fetching: boolean;
  // nextQuote: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  // const { toastError } = useError();

  const [fetching, setFetching] = useState(false);

  return (
    <AppContext.Provider value={{ fetching }}>{children}</AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context)
    throw new Error('useAppContext must be used within QuotesProvider');
  return context;
}
