'use client';

import MainMenu from '@/core/components/ui/MainMenu';
import { cn } from '@/core/utils';

interface TaskbarProps {
  children?: React.ReactNode;
  loading?: boolean;
}

const Taskbar = ({ children, loading }: TaskbarProps) => {
  return (
    <div
      className={cn(
        'flex items-center gap-3 mx-auto card bg-card/40 hover:bg-card rounded-full my-4 p-2',
        loading && 'opacity-40 pointer-events-none trans-o'
      )}
    >
      {children}
      <MainMenu />
    </div>
  );
};

export default Taskbar;
