'use client';

import { signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';

import { LightbulbIcon } from '@/core/components/icons/LightbulbIcon';
import { MenuIcon } from '@/core/components/icons/MenuIcon';
import { MoonIcon } from '@/core/components/icons/MoonIcon';
import { SignOutIcon } from '@/core/components/icons/SignOutIcon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/core/components/ui/DropdownMenu';
import { cn } from '@/core/utils';

type MainMenuProps = {
  userData: {
    name?: string | null;
    email?: string | null;
  };
  className?: string;
};

const MainMenu = ({ userData, className }: MainMenuProps) => {
  // const router = useRouter();
  const { setTheme, theme } = useTheme();

  // const handleEditQuotes = () => {
  //   router.push('/edit-quotes');
  // };

  const handleToggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const handleSignOut = () => {
    signOut();
  };

  const themeIcon =
    theme === 'light' ? (
      <MoonIcon className="icon--menu" />
    ) : (
      <LightbulbIcon className="icon--menu" />
    );

  return (
    <div className={cn('main-menu h-6', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MenuIcon className="icon--action" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {userData && (
            <>
              <div className="cursor-default px-4 py-2">
                <div className="text-lg font-bold text-accent">
                  {userData.name}
                </div>
                <div className="text-sm text-muted">{userData.email}</div>
              </div>
            </>
          )}

          <DropdownMenuSeparator />

          {/* <DropdownMenuItem onClick={handleEditQuotes}>
            <EditIcon className="icon--menu" />
            Edit quotes
          </DropdownMenuItem> */}

          <DropdownMenuItem onClick={handleToggleTheme}>
            {themeIcon}
            {theme === 'light' ? 'Dark' : 'Light'} theme
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleSignOut}>
            <SignOutIcon className="icon--menu flip-x" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

MainMenu.displayName = 'MainMenu';

export default MainMenu;
