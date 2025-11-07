import { FolderColorKey } from '@/core/features/note/maps';
import { ObjectId } from 'mongoose';

export type Folder = {
  color: FolderColorKey;
  tags: string[];
  timestamp: number;
  title: string;
  userId: string;
};
export type FolderDB = Folder & { _id: ObjectId };
export type FolderItem = Omit<Folder, 'userId'> & { id: string };

export type Note = {
  content: string;
  folderId: string;
  tags: string[];
  timestamp: number;
  title: string;
  userId: string;
};
export type NoteDB = Note & { _id: ObjectId };
export type NoteItem = Omit<Note, 'userId'> & { id: string };
