'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';

const SessionContext = createContext<Session | null>(null);

export function SessionProvider({
  children,
  initialSession,
}: {
  children: React.ReactNode;
  initialSession: Session | null;
}) {
  const [session, setSession] = useState(initialSession);

  // // Optional: keep in sync after mount
  // useEffect(() => {
  //   if (!initialSession) {
  //     getSession().then(setSession);
  //   }
  // }, [initialSession]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      setTimeout(async () => {
        const newSession = await getSession();
        // console.log('SessionProvider newSession', newSession);

        if (mounted && newSession) setSession(newSession);
      }, 1000);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => useContext(SessionContext);
