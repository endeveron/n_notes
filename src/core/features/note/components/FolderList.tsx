'use client';

import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';

import { HomeIcon } from '@/core/components/icons/HomeIcon';
import { ScrollArea } from '@/core/components/ui/ScrollArea';
import FolderItem from '@/core/features/note/components/FolderItem';
import { useNoteStore } from '@/core/features/note/store';
import { Theme } from '@/core/types';
import { cn } from '@/core/utils';

export interface FolderListProps {
  small?: boolean;
}

const FolderList = ({ small }: FolderListProps) => {
  const { resolvedTheme } = useTheme();
  const router = useRouter();

  const folders = useNoteStore((state) => state.folders);
  const fetchingFolders = useNoteStore((state) => state.fetchingFolders);

  return (
    <div className="fade">
      <ScrollArea>
        <div
          className={cn(
            'flex flex-wrap gap-y-3 trans-o',
            fetchingFolders && 'opacity-40 pointer-events-none',
            small ? 'my-8 gap-x-1' : 'gap-x-4'
          )}
        >
          {small ? (
            <div className="hover:bg-card rounded-full mr-1.5 trans-c">
              <HomeIcon
                onClick={() => {
                  router.push('/');
                }}
                className="icon--action"
              />
            </div>
          ) : null}

          {folders.map((data) => (
            <FolderItem
              {...data}
              small={small}
              theme={resolvedTheme as Theme}
              key={data.id}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default FolderList;
