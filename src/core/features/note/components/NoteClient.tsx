'use client';

import { FolderPlusIcon } from '@/core/components/icons/FolderPlusIcon';
import { useSessionClient } from '@/core/features/auth/hooks/useSessionClient';
import FolderList from '@/core/features/note/components/FolderList';
import Taskbar from '@/core/components/ui/Taskbar';
import { useNoteStore } from '@/core/features/note/store';

const NoteClient = () => {
  const { session } = useSessionClient();
  const userId = session?.user.id;

  const creatingFolder = useNoteStore((s) => s.creatingFolder);
  const createFolder = useNoteStore((s) => s.createFolder);

  const handleCreateFolder = async () => {
    if (!userId) return;
    await createFolder({ userId });
  };

  return (
    <div className="fade size-full px-4">
      <div className="h-20 flex items-center gap-4">
        <div className="flex flex-1 items-center gap-4">
          <div className="text-2xl font-bold cursor-default">Notes</div>
        </div>

        <Taskbar loading={creatingFolder}>
          <div
            onClick={handleCreateFolder}
            className="ml-1 icon--action"
            title="Create a folder"
          >
            <FolderPlusIcon />
          </div>
        </Taskbar>
      </div>

      <FolderList />
    </div>
  );
};

export default NoteClient;
