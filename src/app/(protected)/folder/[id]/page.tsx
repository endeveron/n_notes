'use client';

import { useEffect, useState } from 'react';

import Loading from '@/core/components/ui/Loading';
import { NavBack } from '@/core/components/ui/NavBack';
import FolderList from '@/core/features/note/components/FolderList';
import NoteList from '@/core/features/note/components/NoteList';
import Taskbar from '@/core/features/note/components/Taskbar';
import { useNoteStore } from '@/core/features/note/store';
import { cn } from '@/core/utils';
import { useNoteInitializer } from '@/core/features/note/store/useNoteInitializer';
import { FolderItem } from '@/core/features/note/types';
import { FileIcon } from '@/core/components/icons/FileIcon';

export default function FolderPage() {
  const { folderId, userId } = useNoteInitializer();

  const creatingNote = useNoteStore((s) => s.creatingNote);
  const folders = useNoteStore((s) => s.folders);
  const folderNotes = useNoteStore((s) => s.folderNotes);
  const fetchingFolderNotes = useNoteStore((s) => s.fetchingFolderNotes);

  const createNote = useNoteStore((s) => s.createNote);
  const fetchFolderNotes = useNoteStore((s) => s.fetchFolderNotes);

  const [folderData, setFolderData] = useState<FolderItem | null>(null);
  const [showContent, setShowContent] = useState(false);

  const handleCreateNote = async () => {
    if (!folderId || !userId) return;

    const res = await createNote({ folderId, userId });
    console.log('handleCreateNote res', res);
  };

  useEffect(() => {
    if (!folderId || !userId) return;

    (async () => {
      // Retrieve folder data from the folders array
      const index = folders.findIndex((f) => f.id === folderId);
      if (index === -1) return;
      setFolderData(folders[index]);

      // Fetch folder notes
      const success = await fetchFolderNotes({ folderId, userId });

      if (success) {
        setShowContent(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folderId, userId, fetchFolderNotes]);

  if (fetchingFolderNotes) {
    return (
      <div className="size-full flex-center">
        <Loading delay={2000} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'fade size-full flex flex-col opacity-0 px-4 trans-o',
        showContent && 'opacity-100'
      )}
    >
      <div className="h-20 flex items-center gap-4">
        <div className="flex flex-1 items-center gap-4">
          <NavBack />

          {folderData ? (
            <div className="text-xl font-bold cursor-default">
              {folderData.title}
            </div>
          ) : null}
        </div>

        <Taskbar loading={creatingNote}>
          <FileIcon onClick={handleCreateNote} className="ml-1 icon--action" />
        </Taskbar>
      </div>

      <div className="flex-1">
        <NoteList notes={folderNotes} />
      </div>
      <div className="flex-center">
        <FolderList small />
      </div>
    </div>
  );
}
