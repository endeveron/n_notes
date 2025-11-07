'use client';

import { useNoteInitializer } from '@/core/features/note/store/useNoteInitializer';

const ProtectedClient = ({ children }: { children: React.ReactNode }) => {
  useNoteInitializer();

  return (
    <div className="fade size-full min-w-xs max-w-7xl mx-auto">{children}</div>
  );
};

export default ProtectedClient;
