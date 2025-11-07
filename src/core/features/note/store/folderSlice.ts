import { StateCreator } from 'zustand';

import { getFolders, postFolder } from '@/core/features/note/actions';
import { NoteSlice } from '@/core/features/note/store/noteSlice';
import { RouteSlice } from '@/core/features/note/store/routeSlice';
import { FolderItem } from '@/core/features/note/types';
import { ServerActionResult } from '@/core/types';

export interface FolderSlice {
  creatingFolder: boolean;
  fetchingFolders: boolean;
  folders: FolderItem[];

  createFolder: (args: {
    userId: string;
  }) => Promise<ServerActionResult<{ id: string }>>;
  fetchFolders: (args: { userId: string }) => Promise<void>;
}

export const createFolderSlice: StateCreator<
  FolderSlice & NoteSlice & RouteSlice,
  [],
  [],
  FolderSlice
> = (set, get) => ({
  creatingFolder: false,
  fetchingFolders: false,
  folders: [],

  createFolder: async ({ userId }) => {
    if (!userId) {
      return { success: false, error: { message: 'Unauthorized' } };
    }

    set({ creatingFolder: true });
    const res = await postFolder({ userId });
    if (res.success && res.data?.id) {
      get().fetchFolders({ userId }); // Refresh folders
    }
    set({ creatingFolder: false });
    return res;
  },

  fetchFolders: async ({ userId }) => {
    if (!userId) return;

    set({ fetchingFolders: true });
    const res = await getFolders({ userId });
    if (res.success && res.data) {
      set({ folders: res.data });
    }
    set({ fetchingFolders: false });
  },
});
