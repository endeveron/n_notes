'use client';

// import { useState } from 'react';

import { NavBack } from '@/core/components/ui/NavBack';
import { cn } from '@/core/utils';
import Taskbar from '@/core/features/note/components/Taskbar';
import FolderList from '@/core/features/note/components/FolderList';
import { useNoteInitializer } from '@/core/features/note/store/useNoteInitializer';
import { useNoteStore } from '@/core/features/note/store';
import { useEffect, useState } from 'react';
import { NoteItem } from '@/core/features/note/types';

export default function NotePage() {
  const { noteId } = useNoteInitializer();
  const folderNotes = useNoteStore((s) => s.folderNotes);

  const [showContent, setShowContent] = useState(false);
  const [note, setNote] = useState<NoteItem | null>(null);

  useEffect(() => {
    if (!folderNotes.length) return;

    (async () => {
      const index = folderNotes.findIndex((n) => n.id === noteId);

      if (index === -1 && note) {
        setNote(null);
        return;
      }

      setNote(folderNotes[index]);
      setShowContent(true);
    })();
  }, [folderNotes, note, noteId]);

  if (!note) return null;

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

          <div className="text-xl font-bold cursor-default">{note.title}</div>
        </div>

        <Taskbar />
      </div>

      <div className="flex-1">{note.content}</div>
      <div className="flex-center">
        <FolderList small />
      </div>
    </div>
  );
}
