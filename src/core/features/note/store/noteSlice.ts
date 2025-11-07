import { StateCreator } from 'zustand';

import { getFolderNotes, postNote } from '@/core/features/note/actions';
import { FolderSlice } from '@/core/features/note/store/folderSlice';
import { RouteSlice } from '@/core/features/note/store/routeSlice';
import { NoteItem } from '@/core/features/note/types';
import { ServerActionResult } from '@/core/types';

export interface NoteSlice {
  creatingNote: boolean;
  fetchingFolderNotes: boolean;
  folderNotes: NoteItem[];
  notes: NoteItem[];
  fetchFolderNotes: (args: {
    folderId: string;
    userId: string;
  }) => Promise<boolean>;
  createNote: (args: {
    folderId: string;
    userId: string;
  }) => Promise<ServerActionResult<{ id: string }>>;
}

export const createNoteSlice: StateCreator<
  FolderSlice & NoteSlice & RouteSlice,
  [],
  [],
  NoteSlice
> = (set, get) => ({
  creatingNote: false,
  fetchingFolderNotes: false,
  folderNotes: [],
  notes: [],

  createNote: async ({ folderId, userId }) => {
    if (!userId) {
      return { success: false, error: { message: 'Unauthorized' } };
    }
    if (!folderId) {
      return { success: false, error: { message: 'Invalid folder id' } };
    }

    set({ creatingNote: true });
    const res = await postNote({ folderId, userId });
    if (res.success && res.data?.id) {
      await get().fetchFolderNotes({ folderId, userId }); // Refresh notes
    }
    set({ creatingNote: false });
    return res;
  },

  fetchFolderNotes: async ({ folderId, userId }) => {
    if (!folderId || !userId) return false;

    set({ fetchingFolderNotes: true });
    const res = await getFolderNotes({ folderId, userId });
    if (res.success && res.data) {
      set({
        folderNotes: res.data,
        fetchingFolderNotes: false,
      });
      return true;
    }
    set({ fetchingFolderNotes: false });
    return false;
  },
});
