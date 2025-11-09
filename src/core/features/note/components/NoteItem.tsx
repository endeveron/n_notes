'use client';

import { useRouter } from 'next/navigation';

import { FileIcon } from '@/core/components/icons/FileIcon';
import { NoteItem as TNoteItem } from '@/core/features/note/types';

const NoteItem = ({
  id,
  content,
  // tags,
  // timestamp,
  title,
}: TNoteItem) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/note/${id}`);
  };

  return (
    <div className="card flex p-2 cursor-pointer">
      <div onClick={handleClick} className="flex w-full items-center">
        <FileIcon className="w-6 min-w-6 h-6 ml-1 text-accent -translate-x-1.5" />
        <div className="min-w-fit truncate">{title}</div>
        <div className="ml-3 text-muted/80 truncate">{content}</div>
      </div>
    </div>
  );
};

export default NoteItem;
