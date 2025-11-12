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

export const updateFolderNotes = ({
  folderNotes,
  note,
}: {
  folderNotes: NoteItem[];
  note: NoteItem;
}) => {
  const updFolderNotes = [...folderNotes];
  const index = updFolderNotes.findIndex((n) => n.id === note.id);
  updFolderNotes[index] = note;
  return updFolderNotes;
};
