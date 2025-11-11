'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import 'highlight.js/styles/github-dark.css';
import { Lock, LockOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';

import { ClearIcon } from '@/core/components/icons/ClearIcon';
import { EditIcon } from '@/core/components/icons/EditIcon';
import { EyeIcon } from '@/core/components/icons/EyeIcon';
import { FileIcon } from '@/core/components/icons/FileIcon';
import { LockIcon } from '@/core/components/icons/LockIcon';
import { SaveIcon } from '@/core/components/icons/SaveIcon';
import { TrashIcon } from '@/core/components/icons/TrashIcon';
import { UnlockIcon } from '@/core/components/icons/UnlockIcon';
import { Button } from '@/core/components/ui/Button';
import {
  Form,
  FormControl,
  FormField,
  FormInput,
  FormItem,
  FormMessage,
  FormTextarea,
} from '@/core/components/ui/Form';
import Loading from '@/core/components/ui/Loading';
import LoadingIcon from '@/core/components/ui/LoadingIcon';
import { NavBack } from '@/core/components/ui/NavBack';
import Taskbar from '@/core/components/ui/Taskbar';
import TaskbarPrompt from '@/core/components/ui/TaskbarPrompt';
import FolderList from '@/core/features/note/components/FolderList';
import {
  updateNoteContentSchema,
  UpdateNoteContentSchema,
  updateNoteTitleSchema,
  UpdateNoteTitleSchema,
} from '@/core/features/note/schemas';
import { useNoteStore } from '@/core/features/note/store';
import { useNoteInitializer } from '@/core/features/note/store/useNoteInitializer';
import { NoteItem } from '@/core/features/note/types';
import { useClipboard } from '@/core/hooks/useClipboard';
import { ServerActionResult } from '@/core/types';
import { cn } from '@/core/utils';

export default function NotePage() {
  const router = useRouter();
  const { noteId, userId } = useNoteInitializer();
  const { paste } = useClipboard();

  const decryptNote = useNoteStore((s) => s.decryptNote);
  const decryptNoteInDB = useNoteStore((s) => s.decryptNoteInDB);
  const encryptNote = useNoteStore((s) => s.encryptNote);
  const folderNotes = useNoteStore((s) => s.folderNotes);
  const removeNote = useNoteStore((s) => s.removeNote);
  const removingNote = useNoteStore((s) => s.removingNote);
  const updateNote = useNoteStore((s) => s.updateNote);
  const updatingNote = useNoteStore((s) => s.updatingNote);

  const [note, setNote] = useState<NoteItem | null>(null);
  const [removeNotePrompt, setRemoveNotePrompt] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const titleForm = useForm<UpdateNoteTitleSchema>({
    resolver: zodResolver(updateNoteTitleSchema),
    defaultValues: {
      title: '',
    },
  });

  const contentForm = useForm<UpdateNoteContentSchema>({
    resolver: zodResolver(updateNoteContentSchema),
    defaultValues: {
      content: '',
    },
  });

  const hasChangesRef = useRef(false);
  const content = contentForm.watch('content');

  const folderId = note && note.folderId;
  const titleIsDirty = titleForm.formState.isDirty;
  const contentIsDirty = contentForm.formState.isDirty;
  const contentIsEmpty = note && !note.content && !content;
  const contentIsEncrypted = note && note.encrypted;
  const contentIsDecrypted = note && note.decrypted;

  const handleToggleMode = () => {
    if (contentIsEncrypted) return;

    if (editMode) {
      // When switching from edit to view, update the note with current form values
      const currentContent = contentForm.getValues('content');
      const currentTitle = titleForm.getValues('title');

      setNote((prev) =>
        prev
          ? {
              ...prev,
              content: currentContent,
              title: currentTitle,
            }
          : null
      );
    }

    setEditMode((prev) => !prev);
  };

  const handlePasteContent = async () => {
    const content = await paste();
    if (content) {
      setEditMode(true);
      contentForm.setValue('content', content);
      hasChangesRef.current = true;
    }
  };

  const handleClearContent = () => {
    contentForm.setValue('content', '');
    hasChangesRef.current = true;
    setNote((prev) =>
      prev
        ? {
            ...prev,
            content: '',
          }
        : null
    );
  };

  const handleEncryptNote = async () => {
    if (!noteId || !folderId || !userId || contentIsEmpty) return;

    const res = await encryptNote({
      folderId,
      noteId,
      userId,
      content,
    });

    if (!res.success) {
      toast(res.error.message ?? 'Unable to encrypt note');
      return;
    }

    toast(
      <div className="flex items-center gap-2">
        <Lock className="scale-80 text-success" />
        <div>Note content is encrypted and safe</div>
      </div>
    );
  };

  const handleDecryptNoteInDB = async () => {
    if (!noteId || !folderId || !userId) return;

    const res = await decryptNoteInDB({
      folderId,
      noteId,
      userId,
    });

    if (!res.success) {
      toast(res.error.message ?? 'Unable to decrypt note in db');
      return;
    }

    toast(
      <div className="flex items-center gap-2">
        <LockOpen className="scale-80 text-warning" />
        <div>Note content is decrypted and may be exposed</div>
      </div>
    );
  };

  const handleSaveNote = async () => {
    if (!note || !noteId || !folderId || !userId) return;

    const title = titleForm.getValues('title');
    const content = contentForm.getValues('content');

    // Validate both forms
    const titleValid = await titleForm.trigger();
    const contentValid = await contentForm.trigger();

    if (!titleValid || !contentValid) return;

    const noteData: {
      folderId: string;
      noteId: string;
      userId: string;
      content?: string;
      title?: string;
    } = {
      content,
      folderId,
      noteId,
      userId,
      title,
    };

    let res: ServerActionResult;

    // If content is been decrypted locally
    if (contentIsDecrypted) {
      res = await encryptNote({
        ...noteData,
        content,
      });
    } else {
      res = await updateNote(noteData);
    }

    if (!res.success) {
      toast(res.error.message ?? 'Unable to update note');
      return;
    }

    setNote((prev) =>
      prev
        ? {
            ...prev,
            content,
            title,
          }
        : null
    );

    hasChangesRef.current = false;
    setEditMode(false);
  };

  const handleRemoveNote = () => {
    setRemoveNotePrompt(true);
  };

  const handleRemoveNoteAccept = async () => {
    if (!noteId || !userId) return;

    const folderId = note?.folderId;
    if (!folderId) return;

    setRemoveNotePrompt(true);
    const res = await removeNote({ folderId, noteId, userId });

    if (!res.success) {
      toast(res.error.message ?? 'Unable to delete note');
      setRemoveNotePrompt(false);
      return;
    }

    setRemoveNotePrompt(false);
    router.replace(`/folder/${folderId}`);
  };

  const handleRemoveNoteDecline = () => {
    setRemoveNotePrompt(false);
  };

  const decryptNoteContentLocally = useCallback(async () => {
    if (!noteId || !folderId || !userId) return;

    const res = await decryptNote({
      folderId,
      noteId,
      userId,
    });

    if (!res.success) {
      toast(res.error.message ?? 'Unable to decrypt note content locally');
      return;
    }

    if (!res.data) {
      toast('Unable to decrypt note content');
      return;
    }

    const decryptedContent = res.data;

    setTimeout(() => {
      setNote((prev) =>
        prev
          ? {
              ...prev,
              content: decryptedContent,
              encrypted: false,
              decrypted: true,
            }
          : null
      );
    }, 50);
  }, [decryptNote, folderId, noteId, userId]);

  // Auto-decrypt content
  useEffect(() => {
    if (contentIsEncrypted && !contentIsDecrypted) {
      decryptNoteContentLocally();
    }
  }, [contentIsEncrypted, contentIsDecrypted, decryptNoteContentLocally]);

  // Update ref when forms change
  useEffect(() => {
    if (titleIsDirty || contentIsDirty) {
      hasChangesRef.current = true;
    }
  }, [titleIsDirty, contentIsDirty]);

  useEffect(() => {
    if (!folderNotes.length) return;

    (async () => {
      const index = folderNotes.findIndex((n) => n.id === noteId);

      if (index === -1 && note) {
        setNote(null);
        return;
      }

      setNote(folderNotes[index]);
    })();

    // Don't include `note` in the deps array - when update note state
    // in handleToggleMode, this effect runs again and overwrites
    // changes with the original folderNotes[index] value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folderNotes, noteId]);

  // Reset forms
  useEffect(() => {
    if (!note) return;

    titleForm.reset({
      title: note.title,
    });

    contentForm.reset({
      content: note.content,
    });
  }, [contentForm, note, titleForm]);

  return (
    <div className="fade size-full flex flex-col px-4">
      <div className="sticky z-10 top-0 min-h-20 flex items-center gap-4 bg-background trans-c">
        <div className="flex flex-1 items-center gap-4">
          <NavBack />

          {note && editMode ? (
            <Form {...titleForm}>
              <form className={cn('w-full', updatingNote && 'inactive')}>
                <FormField
                  control={titleForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <FormInput className="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          ) : null}

          {note && !editMode ? (
            <div className="flex items-center gap-1">
              <div className="text-icon">
                {contentIsEncrypted ? <LockIcon /> : <FileIcon />}
              </div>
              <div className="py-4 text-xl font-bold cursor-default">
                {note.title}
              </div>
            </div>
          ) : null}
        </div>

        <Taskbar loading={removingNote || updatingNote}>
          {removeNotePrompt ? (
            <TaskbarPrompt
              onAccept={handleRemoveNoteAccept}
              onDecline={handleRemoveNoteDecline}
              loading={removingNote}
            />
          ) : (
            <>
              {hasChangesRef.current ? (
                <div
                  onClick={handleSaveNote}
                  className="ml-1 text-accent cursor-pointer trans-c"
                  title="Save changes"
                >
                  <SaveIcon />
                </div>
              ) : null}

              {contentIsDecrypted ? (
                <div
                  onClick={handleDecryptNoteInDB}
                  className="ml-1 icon--action"
                  title="Decrypt content in DB"
                >
                  <UnlockIcon />
                </div>
              ) : null}

              {!contentIsEncrypted && !contentIsEmpty && !contentIsDecrypted ? (
                <div
                  onClick={handleEncryptNote}
                  className="ml-1 text-icon cursor-pointer"
                  title="Encrypt note content"
                >
                  <LockIcon />
                </div>
              ) : null}

              <div onClick={handleToggleMode} className="ml-1 icon--action">
                {editMode ? (
                  <div title="Preview mode">
                    <EyeIcon />
                  </div>
                ) : (
                  <div title="Edit mode">
                    <EditIcon />
                  </div>
                )}
              </div>

              {content ? (
                <div
                  onClick={handleClearContent}
                  className="ml-1 icon--action"
                  title="Clear note content"
                >
                  <ClearIcon />
                </div>
              ) : null}

              <div
                onClick={handleRemoveNote}
                className="ml-1 icon--action"
                title="Delete note"
              >
                <TrashIcon />
              </div>
            </>
          )}
        </Taskbar>
      </div>

      <div className="flex-1">
        {note ? (
          <>
            {contentIsEncrypted ? (
              <div className="size-full flex-center select-none">
                <div className="flex items-center gap-2">
                  <div className="scale-75">
                    <LoadingIcon />
                  </div>
                  <div className="text-muted">Decrypting content...</div>
                </div>
              </div>
            ) : editMode ? (
              <Form {...contentForm}>
                <form className={cn('w-full', updatingNote && 'inactive')}>
                  <FormField
                    control={contentForm.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <FormTextarea className="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            ) : contentIsEmpty ? (
              <div className="my-6 flex-center">
                <Button
                  onClick={handlePasteContent}
                  variant="outline"
                  className="fade px-6"
                >
                  Paste content from clipboard
                </Button>
              </div>
            ) : (
              <article className="prose prose-lg dark:prose-invert max-w-none cursor-default">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                >
                  {note.content}
                </ReactMarkdown>
              </article>
            )}
          </>
        ) : (
          <div className="mt-20 flex-center">
            <Loading delay={2000} />
          </div>
        )}
      </div>

      <div className="flex-center">
        <FolderList small />
      </div>
    </div>
  );
}
