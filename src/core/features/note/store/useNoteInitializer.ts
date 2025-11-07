'use client';

import { useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useSessionClient } from '@/core/features/auth/hooks/useSessionClient';
import { useNoteStore } from '@/core/features/note/store';

export function useNoteInitializer() {
  const { session } = useSessionClient();
  const pathname = usePathname();

  const userId = session?.user.id;

  const { folderId, isFolderRoute, isRootRoute, noteId } = useMemo(() => {
    const pathArr = pathname.split('/');
    return {
      isFolderRoute: pathArr.includes('folder'),
      isRootRoute: pathname === '/',
      folderId: pathArr.includes('folder') ? pathArr[2] : null,
      noteId: pathArr.includes('note') ? pathArr[2] : null,
    };
  }, [pathname]);

  const fetchFolders = useNoteStore((s) => s.fetchFolders);

  // Fetch folders on mount
  useEffect(() => {
    if (userId) {
      fetchFolders({ userId });
    }
  }, [userId, fetchFolders]);

  return { folderId, isFolderRoute, isRootRoute, noteId, userId };
}
