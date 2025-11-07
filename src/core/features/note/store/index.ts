import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import {
  createFolderSlice,
  FolderSlice,
} from '@/core/features/note/store/folderSlice';
import {
  createNoteSlice,
  NoteSlice,
} from '@/core/features/note/store/noteSlice';
import {
  createRouteSlice,
  RouteSlice,
} from '@/core/features/note/store/routeSlice';

type Store = FolderSlice &
  NoteSlice &
  RouteSlice & {
    reset: () => void;
  };

const initialState = {
  fetchingFolder: false,
  fetchingFolders: false,
  folder: null,
  folders: [],
  fetchingFolderNotes: false,
  folderNotes: [],
  notes: [],
  isFolderRoute: false,
  isRootRoute: true,
};

export const useNoteStore = create<Store>()(
  devtools(
    persist(
      (...a) => ({
        ...createFolderSlice(...a),
        ...createNoteSlice(...a),
        ...createRouteSlice(...a),
        reset: () => a[0](initialState),
      }),
      {
        name: 'app-store',
        partialize: (state) => ({
          folders: state.folders,
          notes: state.notes,
        }),
      }
    )
  )
);

// Usage
// import { useNoteStore } from '@/core/features/note/store';

// const folders = useNoteStore(state => state.folders);
// const fetchFolders = useNoteStore(state => state.fetchFolders);
