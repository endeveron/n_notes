'use client';

import { useRouter } from 'next/navigation';

import { FolderElement } from '@/core/components/images/FolderElement';
import { folderColorMap } from '@/core/features/note/maps';
import { FolderItem as TFolderItem } from '@/core/features/note/types';
import { Theme } from '@/core/types';
import { cn } from '@/core/utils';

interface FolderListProps extends TFolderItem {
  theme: Theme;
  small?: boolean;
}

const FolderItem = ({
  id,
  color,
  // tags,
  // timestamp,
  small,
  title,
  theme,
}: FolderListProps) => {
  const router = useRouter();

  const colorGroup = folderColorMap.get(color)!;
  const backgroundColor = colorGroup[theme];

  const handleClick = () => {
    router.push(`/folder/${id}`);
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'cursor-pointer',
        small
          ? 'flex items-center hover:bg-card rounded-full pl-2 pr-2.5 trans-c'
          : 'w-16'
      )}
    >
      {small ? (
        <div
          className="w-2.5 h-2.5 rounded-full mr-1 trans-c"
          style={{ backgroundColor }}
        ></div>
      ) : (
        <div
          className="mb-2 relative overflow-hidden h-10 rounded-sm trans-c"
          style={{ backgroundColor }}
        >
          <div className="absolute top-0 right-0 opacity-20 dark:opacity-30 trans-o">
            <FolderElement />
          </div>
        </div>
      )}

      <div
        className="text-xs font-semibold tracking-wider text-center truncate trans-c"
        title={small ? '' : title}
      >
        {title}
      </div>
    </div>
  );
};

export default FolderItem;
