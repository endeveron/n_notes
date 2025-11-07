'use server';

import FolderModel from '@/core/features/note/models/folder';
import NoteModel from '@/core/features/note/models/note';
import {
  FolderDB,
  FolderItem,
  NoteDB,
  NoteItem,
} from '@/core/features/note/types';
import { mongoDB } from '@/core/lib/mongo';
import { ServerActionResult } from '@/core/types';
import { handleActionError } from '@/core/utils/error';

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

    const noteItems: NoteItem[] = noteDocs.map((d) => ({
      content: d.content,
      folderId: id,
      id: d._id.toString(),
      tags: d.tags,
      timestamp: d.timestamp,
      title: d.title,
    }));

    return {
      success: true,
      data: noteItems,
    };
  } catch (err: unknown) {
    return handleActionError('getFolder: Unable to retrieve folder data', err);
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

    console.log('postFolder: result', folder);

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

    console.log('postNote: result', note);

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

    const noteItems: NoteItem[] = noteDocs.map((d) => ({
      content: d.content,
      folderId: d.folderId,
      id: d._id.toString(),
      tags: d.tags,
      timestamp: d.timestamp,
      title: d.title,
    }));

    return {
      success: true,
      data: noteItems,
    };
  } catch (err: unknown) {
    return handleActionError('getFolderNotes: Unable to retrieve notes', err);
  }
};

// export const deleteQuote = async (id: string): Promise<ServerActionResult> => {
//   if (!id) {
//     return handleActionError('deleteQuote: Invalid quote id');
//   }

//   try {
//     await mongoDB.connect();

//     await QuoteModel.findByIdAndDelete(id);

//     return {
//       success: true,
//     };
//   } catch (err: unknown) {
//     return handleActionError('Unable to delete quote item in db', err);
//   }
// };
