import { NavBackIcon } from '@/core/components/icons/NavBackIcon';
import { cn } from '@/core/utils';
import { useRouter } from 'next/navigation';

interface NavbackProps {
  className?: string;
}

export const NavBack = ({ className }: NavbackProps) => {
  const router = useRouter();

  return (
    <div onClick={() => router.back()} className={cn('w-6 h-6', className)}>
      <NavBackIcon className="icon--action" />
    </div>
  );
};
