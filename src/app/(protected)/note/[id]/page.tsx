'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import 'highlight.js/styles/github-dark.css';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';

import { ClearIcon } from '@/core/components/icons/ClearIcon';
import { EditIcon } from '@/core/components/icons/EditIcon';
import { EyeIcon } from '@/core/components/icons/EyeIcon';
import { SaveIcon } from '@/core/components/icons/SaveIcon';
import { TrashIcon } from '@/core/components/icons/TrashIcon';
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
import { NavBack } from '@/core/components/ui/NavBack';
import TaskbarPrompt from '@/core/components/ui/TaskbarPrompt';
import FolderList from '@/core/features/note/components/FolderList';
import Taskbar from '@/core/components/ui/Taskbar';
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
import { cn } from '@/core/utils';

export default function NotePage() {
  const router = useRouter();
  const { noteId, userId } = useNoteInitializer();
  const { paste } = useClipboard();

  const folderNotes = useNoteStore((s) => s.folderNotes);
  const removingNote = useNoteStore((s) => s.removingNote);
  const updatingNote = useNoteStore((s) => s.updatingNote);
  const removeNote = useNoteStore((s) => s.removeNote);
  const updateNote = useNoteStore((s) => s.updateNote);

  const [showContent, setShowContent] = useState(false);
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

  const titleIsDirty = titleForm.formState.isDirty;
  const contentIsDirty = contentForm.formState.isDirty;

  const hasChangesRef = useRef(false);

  const content = contentForm.watch('content');

  const handleToggleMode = () => {
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

  const handleSaveNote = async () => {
    if (!note || !noteId || !userId) return;

    const folderId = note.folderId;
    const title = titleForm.getValues('title');
    const content = contentForm.getValues('content');

    // Validate both forms
    const titleValid = await titleForm.trigger();
    const contentValid = await contentForm.trigger();

    if (!titleValid || !contentValid) return;

    const res = await updateNote({
      folderId,
      noteId,
      userId,
      title,
      content,
    });

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
      setShowContent(true);
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

  if (!note) return null;

  return (
    <div
      className={cn(
        'fade size-full flex flex-col opacity-0 px-4 trans-o',
        showContent && 'opacity-100'
      )}
    >
      <div className="min-h-20 flex items-center gap-4">
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
            <div className="py-4 text-xl font-bold cursor-default">
              {note.title}
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
                <SaveIcon
                  onClick={handleSaveNote}
                  className="ml-1 text-accent cursor-pointer trans-c"
                />
              ) : null}

              <div onClick={handleToggleMode} className="ml-1 icon--action">
                {editMode ? <EyeIcon /> : <EditIcon />}
              </div>

              {content ? (
                <ClearIcon
                  onClick={handleClearContent}
                  className="ml-1 icon--action"
                />
              ) : null}
              <TrashIcon
                onClick={handleRemoveNote}
                className="ml-1 icon--action"
              />
            </>
          )}
        </Taskbar>
      </div>

      <div className="flex-1">
        {!editMode && note && !note.content && !content ? (
          <div className="my-8 flex-center">
            <Button
              onClick={handlePasteContent}
              variant="outline"
              className="fade px-6"
            >
              Paste content from clipboard
            </Button>
          </div>
        ) : null}

        {editMode ? (
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
      </div>

      <div className="flex-center">
        <FolderList small />
      </div>
    </div>
  );
}
