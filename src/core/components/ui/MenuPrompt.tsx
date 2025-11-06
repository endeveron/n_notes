'use client';

import { AcceptIcon } from '@/core/components/icons/AcceptIcon';
import { DeclineIcon } from '@/core/components/icons/DeclineIcon';
import Loading from '@/core/components/ui/Loading';

interface MenuPromptProps {
  loading: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

const MenuPrompt = ({ loading, onAccept, onDecline }: MenuPromptProps) => {
  return (
    <div className="h-8 flex-center mx-auto">
      {loading ? (
        <div className="scale-75 mx-1">
          <Loading />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div
            onClick={onAccept}
            className="w-8 h-8 rounded-full flex-center bg-card trans-c"
          >
            <AcceptIcon className="icon--action scale-75" />
          </div>

          <div
            onClick={onDecline}
            className="w-8 h-8 rounded-full flex-center bg-card trans-c"
          >
            <DeclineIcon className="icon--action scale-75" />
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPrompt;
