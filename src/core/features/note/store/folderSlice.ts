import { StateCreator } from 'zustand';

import {
  deleteFolder,
  getFolders,
  patchFolder,
  postFolder,
} from '@/core/features/note/actions';
import { NoteSlice } from '@/core/features/note/store/noteSlice';
import { FolderItem } from '@/core/features/note/types';
import { ServerActionResult } from '@/core/types';
import { FolderColorKey } from '@/core/features/note/maps';

export interface FolderSlice {
  creatingFolder: boolean;
  fetchingFolders: boolean;
  folders: FolderItem[];
  removingFolder: boolean;
  updatingFolder: boolean;

  createFolder: (args: {
    userId: string;
  }) => Promise<ServerActionResult<{ id: string }>>;
  updateFolder: (args: {
    folderId: string;
    userId: string;
    color?: FolderColorKey;
    title?: string;
  }) => Promise<ServerActionResult>;
  removeFolder: (args: {
    folderId: string;
    userId: string;
  }) => Promise<ServerActionResult>;
  fetchFolders: (args: { userId: string }) => Promise<void>;
}

export const folderSlice: StateCreator<
  FolderSlice & NoteSlice,
  [],
  [],
  FolderSlice
> = (set, get) => ({
  creatingFolder: false,
  fetchingFolders: false,
  folders: [],
  removingFolder: false,
  updatingFolder: false,

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

  updateFolder: async ({ color, folderId, title, userId }) => {
    if (!userId) {
      return { success: false, error: { message: 'Unauthorized' } };
    }
    if (!folderId) {
      return { success: false, error: { message: 'Missing folder id' } };
    }
    if (!color && !title) {
      return { success: false, error: { message: 'Missing required data' } };
    }

    set({ updatingFolder: true });
    const res = await patchFolder({ color, folderId, title });
    if (res.success) {
      get().fetchFolders({ userId }); // Refresh folders
    }
    set({ updatingFolder: false });
    return res;
  },

  removeFolder: async ({ folderId, userId }) => {
    if (!userId) {
      return { success: false, error: { message: 'Unauthorized' } };
    }
    if (!folderId) {
      return { success: false, error: { message: 'Missing folder id' } };
    }

    set({ removingFolder: true });
    const res = await deleteFolder({ folderId });
    if (res.success) {
      get().fetchFolders({ userId }); // Refresh folders
    }
    set({ removingFolder: false });
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
