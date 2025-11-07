'use client';

import { useRouter } from 'next/navigation';

import { FileIcon } from '@/core/components/icons/FileIcon';
import { MenuIcon } from '@/core/components/icons/MenuIcon';
import { NoteItem as TNoteItem } from '@/core/features/note/types';

const NoteItem = ({
  id,
  // content,
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
      <div onClick={handleClick} className="flex flex-1 items-center">
        <FileIcon className="ml-1 text-accent scale-90 -translate-x-1" />
        <div className="flex-1 truncate">{title}</div>
      </div>

      <MenuIcon className="ml-1 icon--action" />
    </div>
  );
};

export default NoteItem;
