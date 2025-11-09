import { StateCreator } from 'zustand';

import { FolderSlice } from '@/core/features/note/store/folderSlice';
import { NoteSlice } from '@/core/features/note/store/noteSlice';

// Route Slice
export interface RouteSlice {
  isFolderRoute: boolean;
  isRootRoute: boolean;
  setRouteState: (isFolderRoute: boolean, isRootRoute: boolean) => void;
}

export const createRouteSlice: StateCreator<
  FolderSlice & NoteSlice & RouteSlice,
  [],
  [],
  RouteSlice
> = (set) => ({
  isFolderRoute: false,
  isRootRoute: true,

  setRouteState: (isFolderRoute, isRootRoute) => {
    return set({ isFolderRoute, isRootRoute });
  },
});
