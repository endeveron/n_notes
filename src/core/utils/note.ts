import { NoteDB, NoteItem } from '@/core/features/note/types';

export const parseNoteItem = (noteDoc: NoteDB): NoteItem => ({
  content: noteDoc.content,
  folderId: noteDoc.folderId,
  id: noteDoc._id.toString(),
  tags: noteDoc.tags,
  encrypted: noteDoc.encrypted,
  timestamp: noteDoc.timestamp,
  title: noteDoc.title,
});
