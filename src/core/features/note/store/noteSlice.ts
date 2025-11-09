import { StateCreator } from 'zustand';

import {
  deleteNote,
  getFolderNotes,
  patchNote,
  postNote,
} from '@/core/features/note/actions';
import { FolderSlice } from '@/core/features/note/store/folderSlice';
import { RouteSlice } from '@/core/features/note/store/routeSlice';
import { NoteItem } from '@/core/features/note/types';
import { ServerActionResult } from '@/core/types';

export interface NoteSlice {
  creatingNote: boolean;
  fetchingFolderNotes: boolean;
  folderNotes: NoteItem[];
  notes: NoteItem[];
  removingNote: boolean;
  updatingNote: boolean;
  createNote: (args: {
    folderId: string;
    userId: string;
  }) => Promise<ServerActionResult<{ id: string }>>;
  fetchFolderNotes: (args: {
    folderId: string;
    userId: string;
  }) => Promise<boolean>;
  removeNote: (args: {
    folderId: string;
    noteId: string;
    userId: string;
  }) => Promise<ServerActionResult>;
  updateNote: (args: {
    folderId: string;
    noteId: string;
    userId: string;
    content?: string;
    title?: string;
  }) => Promise<ServerActionResult>;
}

export const noteSlice: StateCreator<
  FolderSlice & NoteSlice & RouteSlice,
  [],
  [],
  NoteSlice
> = (set, get) => ({
  creatingNote: false,
  fetchingFolderNotes: false,
  folderNotes: [],
  notes: [],
  removingNote: false,
  updatingNote: false,

  createNote: async ({ folderId, userId }) => {
    if (!userId) {
      return { success: false, error: { message: 'Unauthorized' } };
    }
    if (!folderId) {
      return { success: false, error: { message: 'Missing folder id' } };
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

  removeNote: async ({ folderId, noteId, userId }) => {
    if (!userId) {
      return { success: false, error: { message: 'Unauthorized' } };
    }
    if (!folderId) {
      return { success: false, error: { message: 'Missing folder id' } };
    }
    if (!noteId) {
      return { success: false, error: { message: 'Missing note id' } };
    }

    set({ removingNote: true });
    const res = await deleteNote({ noteId });
    if (res.success) {
      get().fetchFolderNotes({ folderId, userId }); // Refresh folder notes
    }
    set({ removingNote: false });
    return res;
  },

  updateNote: async ({ folderId, noteId, userId, content, title }) => {
    if (!userId) {
      return { success: false, error: { message: 'Unauthorized' } };
    }
    if (!folderId) {
      return { success: false, error: { message: 'Missing folder id' } };
    }
    if (!noteId) {
      return { success: false, error: { message: 'Missing note id' } };
    }
    if (!content && !title) {
      return { success: false, error: { message: 'Missing required data' } };
    }

    set({ updatingNote: true });
    const res = await patchNote({ noteId, content, title });
    if (res.success) {
      get().fetchFolderNotes({ folderId, userId }); // Refresh folder notes
    }
    set({ updatingNote: false });
    return res;
  },
});
