'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { EditIcon } from '@/core/components/icons/EditIcon';
import { FileIcon } from '@/core/components/icons/FileIcon';
import { LockIcon } from '@/core/components/icons/LockIcon';
import { MenuIcon } from '@/core/components/icons/MenuIcon';
import { TrashIcon } from '@/core/components/icons/TrashIcon';
import TaskbarPrompt from '@/core/components/ui/TaskbarPrompt';
import { useNoteStore } from '@/core/features/note/store';
import { useNoteInitializer } from '@/core/features/note/store/useNoteInitializer';
import { NoteItem as TNoteItem } from '@/core/features/note/types';
import { cn, markdownToPlainText } from '@/core/utils';

const NoteItem = ({
  id,
  content,
  // tags,
  // timestamp,
  folderId,
  encrypted,
  title,
}: TNoteItem) => {
  const router = useRouter();
  const { userId } = useNoteInitializer();

  const removeNote = useNoteStore((s) => s.removeNote);
  const removingNote = useNoteStore((s) => s.removingNote);

  const [showTaskbar, setShowTaskbar] = useState(false);
  const [removeNotePrompt, setRemoveNotePrompt] = useState(false);

  const handleToggleTaskbar = () => {
    setShowTaskbar((prev) => !prev);
  };

  const handleNoteClick = () => {
    router.push(`/note/${id}`);
  };

  const handleEditNote = () => {
    router.push(`/note/${id}?mode=edit`);
  };

  const handleRemoveNote = () => {
    setRemoveNotePrompt(true);
  };

  const handleRemoveNoteAccept = async () => {
    if (!folderId || !userId) return;

    setRemoveNotePrompt(true);
    const res = await removeNote({ folderId, noteId: id, userId });

    if (!res.success) {
      toast(res.error.message ?? 'Unable to delete note');
      setRemoveNotePrompt(false);
      return;
    }

    setRemoveNotePrompt(false);
    router.replace(`/folder/${folderId}`);
  };

  const handleRemoveNoteDecline = () => {
    setRemoveNotePrompt(false);
  };

  const plainContent = markdownToPlainText(content);

  const taskbar = (
    <div className="ml-2 mr-1 h-6 flex gap-4">
      {removeNotePrompt ? (
        <div className="">
          <TaskbarPrompt
            onAccept={handleRemoveNoteAccept}
            onDecline={handleRemoveNoteDecline}
            loading={removingNote}
          />
        </div>
      ) : (
        <>
          <EditIcon className="icon--action mr-0.5" onClick={handleEditNote} />
          <TrashIcon className="icon--action" onClick={handleRemoveNote} />
        </>
      )}
    </div>
  );

  return (
    <div className="card max-w-full flex p-2 cursor-pointer">
      <div
        onClick={handleNoteClick}
        className="flex flex-1 w-full items-center min-w-0"
      >
        <div className="w-6 min-w-6 h-6 ml-1 text-icon -translate-x-1.5">
          {encrypted ? <LockIcon /> : <FileIcon />}
        </div>

        <div className="min-w-fit truncate">{title}</div>
        <div className={cn('ml-3 text-muted/80 truncate', encrypted ? '' : '')}>
          {encrypted ? '3N0RYP73D' : plainContent}
        </div>
      </div>

      {showTaskbar ? taskbar : null}

      <div
        onClick={handleToggleTaskbar}
        className="w-6 min-w-6 h-6 ml-2 icon--action"
      >
        <MenuIcon />
      </div>
    </div>
  );
};

export default NoteItem;
