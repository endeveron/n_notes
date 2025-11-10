'use client';

import { useRouter } from 'next/navigation';

import { FileIcon } from '@/core/components/icons/FileIcon';
import { LockIcon } from '@/core/components/icons/LockIcon';
import { NoteItem as TNoteItem } from '@/core/features/note/types';
import { cn } from '@/core/utils';

const NoteItem = ({
  id,
  content,
  // tags,
  // timestamp,
  encrypted,
  title,
}: TNoteItem) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/note/${id}`);
  };

  return (
    <div className="card flex p-2 cursor-pointer">
      <div onClick={handleClick} className="flex w-full items-center">
        <div className="w-6 min-w-6 h-6 ml-1 text-accent -translate-x-1.5">
          {encrypted ? <LockIcon /> : <FileIcon />}
        </div>

        <div className="min-w-fit truncate">{title}</div>
        <div className={cn('ml-3 text-muted/80 truncate', encrypted ? '' : '')}>
          {encrypted ? '3N0RYP73D' : content}
        </div>
      </div>
    </div>
  );
};

export default NoteItem;
