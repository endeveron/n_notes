import { redirect } from 'next/navigation';

import MainMenu from '@/core/components/ui/MainMenu';
import { SIGNIN_REDIRECT } from '@/core/constants';
import { auth } from '~/auth';
import NotesClient from '@/core/features/notes/components/NotesClient';

export default async function MainPage() {
  const session = await auth();
  if (!session?.user) return redirect(SIGNIN_REDIRECT);

  return (
    <div className="fade px-4 size-full min-w-xs flex flex-col">
      <div className="fixed top-4 left-3">
        <MainMenu
          userData={{ name: session.user.name, email: session.user.email }}
        />
      </div>

      <NotesClient />
    </div>
  );
}
