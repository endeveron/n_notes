import { FolderSlice } from '@/core/features/note/store/folderSlice';
import { NoteSlice } from '@/core/features/note/store/noteSlice';
import { StateCreator } from 'zustand';

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
    console.log('setRouteState');
    return set({ isFolderRoute, isRootRoute });
  },
});
