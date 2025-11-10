'use server';

import { FolderColorKey } from '@/core/features/note/maps';
import FolderModel from '@/core/features/note/models/folder';
import NoteModel from '@/core/features/note/models/note';
import {
  FolderDB,
  FolderItem,
  NoteDB,
  NoteItem,
} from '@/core/features/note/types';
import { decryptString, encryptString } from '@/core/lib/crypto';
import { mongoDB } from '@/core/lib/mongo';
import { ServerActionResult } from '@/core/types';
import { handleActionError } from '@/core/utils/error';
import { parseNoteItem } from '@/core/utils/note';

export const getFolders = async ({
  userId,
}: {
  userId: string;
}): Promise<ServerActionResult<FolderItem[]>> => {
  if (!userId) {
    return handleActionError('getFolders: Missing required data');
  }

  try {
    await mongoDB.connect();

    const folderDocs = await FolderModel.find<FolderDB>({ userId });

    const folderItems: FolderItem[] = folderDocs.map((d) => ({
      id: d._id.toString(),
      color: d.color,
      tags: d.tags,
      timestamp: d.timestamp,
      title: d.title,
    }));

    return {
      success: true,
      data: folderItems,
    };
  } catch (err: unknown) {
    return handleActionError('getFolders: Unable to retrieve folders', err);
  }
};

export const getFolder = async ({
  id,
}: {
  id: string;
}): Promise<ServerActionResult<NoteItem[]>> => {
  if (!id) {
    return handleActionError('getFolder: Missing required data');
  }

  try {
    await mongoDB.connect();

    const noteDocs = await NoteModel.find<NoteDB>({ folderId: id });

    if (!noteDocs.length) {
      return {
        success: true,
        data: [],
      };
    }

    const noteItems: NoteItem[] = noteDocs.map((d) => parseNoteItem(d));

    return {
      success: true,
      data: noteItems,
    };
  } catch (err: unknown) {
    return handleActionError('getFolder: Unable to retrieve folder data', err);
  }
};

export const deleteFolder = async ({
  folderId,
}: {
  folderId: string;
}): Promise<ServerActionResult> => {
  if (!folderId) {
    return handleActionError('postFolder: Missing required data');
  }

  try {
    await mongoDB.connect();

    // Delete related notes
    await NoteModel.deleteMany({ folderId });

    // Delete folder
    await FolderModel.findByIdAndDelete(folderId);

    return {
      success: true,
    };
  } catch (err: unknown) {
    return handleActionError('postFolder: Unable to create folder', err);
  }
};

export const patchFolder = async ({
  folderId,
  color,
  title,
}: {
  folderId: string;
  color?: FolderColorKey;
  title?: string;
}): Promise<ServerActionResult> => {
  if (!folderId) {
    return handleActionError('patchFolder: Missing required data');
  }

  try {
    await mongoDB.connect();

    const folderDoc = await FolderModel.findById(folderId);
    if (!folderDoc) {
      return {
        success: false,
        error: {
          message: 'Not found',
        },
      };
    }

    // Update properties
    if (color && color !== folderDoc.color) {
      folderDoc.color = color;
    }
    if (title && title !== folderDoc.title) {
      folderDoc.title = title;
    }

    await folderDoc.save();

    return {
      success: true,
    };
  } catch (err: unknown) {
    return handleActionError('patchFolder: Unable to update folder', err);
  }
};

export const postFolder = async ({
  userId,
}: {
  userId: string;
}): Promise<ServerActionResult<{ id: string }>> => {
  if (!userId) {
    return handleActionError('postFolder: Missing required data');
  }

  try {
    await mongoDB.connect();

    const folder = await FolderModel.create({
      color: 'gray',
      tags: [],
      timestamp: Date.now(),
      title: 'Untitled',
      userId,
    });

    return {
      success: true,
      data: {
        id: folder._id.toString(),
      },
    };
  } catch (err: unknown) {
    return handleActionError('postFolder: Unable to create folder', err);
  }
};

export const patchNote = async ({
  noteId,
  content,
  title,
}: {
  noteId: string;
  content?: string;
  title?: string;
}): Promise<ServerActionResult> => {
  if (!noteId || (!content && !title)) {
    return handleActionError('patchNote: Missing required data');
  }

  try {
    await mongoDB.connect();

    const noteDoc = await NoteModel.findById(noteId);
    if (!noteDoc) {
      return {
        success: false,
        error: {
          message: 'Not found',
        },
      };
    }

    // Update properties
    if (content !== noteDoc.content) {
      noteDoc.content = content;
    }
    if (!content && noteDoc.encrypted) {
      noteDoc.encrypted = false;
    }
    if (title && title !== noteDoc.title) {
      noteDoc.title = title;
    }

    await noteDoc.save();

    return {
      success: true,
    };
  } catch (err: unknown) {
    return handleActionError('patchNote: Unable to update note', err);
  }
};

export const getNoteDecrypt = async ({
  noteId,
}: {
  noteId: string;
}): Promise<ServerActionResult<string>> => {
  if (!noteId) {
    return handleActionError('getNoteDecrypt: Missing note id');
  }

  try {
    await mongoDB.connect();

    const noteDoc = await NoteModel.findById(noteId);
    if (!noteDoc) {
      return {
        success: false,
        error: {
          message: 'Not found',
        },
      };
    }

    const content = noteDoc.content;
    if (!content) {
      return {
        success: false,
        error: {
          message: 'Missing note content to decrypt',
        },
      };
    }

    // Decrypt content
    const decryptedContent = decryptString(content);

    return {
      success: true,
      data: decryptedContent,
    };
  } catch (err: unknown) {
    return handleActionError('getNoteDecrypt: Unable to decrypt note', err);
  }
};

export const patchNoteDecrypt = async ({
  noteId,
}: {
  noteId: string;
}): Promise<ServerActionResult<string>> => {
  if (!noteId) {
    return handleActionError('patchNoteDecrypt: Missing note id');
  }

  try {
    await mongoDB.connect();

    const noteDoc = await NoteModel.findById(noteId);
    if (!noteDoc) {
      return {
        success: false,
        error: {
          message: 'Not found',
        },
      };
    }

    const content = noteDoc.content;
    if (!content) {
      return {
        success: false,
        error: {
          message: 'Missing note content to decrypt',
        },
      };
    }

    // Decrypt content and update note document
    noteDoc.content = decryptString(content);
    noteDoc.encrypted = false;
    await noteDoc.save();

    return {
      success: true,
    };
  } catch (err: unknown) {
    return handleActionError('patchNoteDecrypt: Unable to decrypt note', err);
  }
};

export const patchNoteEncrypt = async ({
  noteId,
  content,
  title,
}: {
  noteId: string;
  content: string;
  title?: string;
}): Promise<ServerActionResult> => {
  if (!noteId || !content) {
    return handleActionError('patchNoteEncrypt: Missing required data');
  }

  try {
    await mongoDB.connect();

    const noteDoc = await NoteModel.findById(noteId);
    if (!noteDoc) {
      return {
        success: false,
        error: {
          message: 'Not found',
        },
      };
    }

    // Encrypt content
    const encryptedContent = encryptString(content);

    // Update note document
    if (title && title !== noteDoc.title) {
      noteDoc.title = title;
    }
    noteDoc.content = encryptedContent;
    noteDoc.encrypted = true;
    await noteDoc.save();

    return {
      success: true,
    };
  } catch (err: unknown) {
    return handleActionError('patchNoteEncrypt: Unable to encrypt note', err);
  }
};

export const postNote = async ({
  folderId,
  userId,
}: {
  folderId: string;
  userId: string;
}): Promise<ServerActionResult<{ id: string }>> => {
  if (!folderId || !userId) {
    return handleActionError('postNote: Missing required data');
  }

  try {
    await mongoDB.connect();

    const note = await NoteModel.create({
      content: '',
      folderId,
      tags: [],
      timestamp: Date.now(),
      title: 'Untitled',
      userId,
    });

    return {
      success: true,
      data: {
        id: note._id.toString(),
      },
    };
  } catch (err: unknown) {
    return handleActionError('postNote: Unable to create note', err);
  }
};

export const deleteNote = async ({
  noteId,
}: {
  noteId: string;
}): Promise<ServerActionResult> => {
  if (!noteId) {
    return handleActionError('deleteNote: Missing required data');
  }

  try {
    await mongoDB.connect();

    await NoteModel.findByIdAndDelete(noteId);

    return {
      success: true,
    };
  } catch (err: unknown) {
    return handleActionError('deleteNote: Unable to delete note', err);
  }
};

export const getFolderNotes = async ({
  folderId,
  userId,
}: {
  folderId: string;
  userId: string;
}): Promise<ServerActionResult<NoteItem[]>> => {
  if (!userId) {
    return handleActionError('getFolderNotes: Missing required data');
  }

  try {
    await mongoDB.connect();

    const noteDocs = await NoteModel.find<NoteDB>({ folderId, userId });

    const noteItems: NoteItem[] = noteDocs.map((d) => parseNoteItem(d));

    return {
      success: true,
      data: noteItems,
    };
  } catch (err: unknown) {
    return handleActionError('getFolderNotes: Unable to retrieve notes', err);
  }
};
