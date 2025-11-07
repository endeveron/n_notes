'use client';

import { useSessionClient } from '@/core/features/auth/hooks/useSessionClient';

const NotesClient = () => {
  const { session } = useSessionClient();

  console.log('session', session);

  return (
    <div className="py-12">
      <div className="text-4xl font-bold text-accent">Title</div>
      <div className="">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Facere
        voluptatem, possimus provident nisi corporis assumenda neque dolorum
        numquam suscipit eaque totam tempore modi placeat voluptatibus. Nulla
        pariatur temporibus vitae saepe!
      </div>
      <div className="my-4 p-8 card">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis
        commodi expedita consectetur officiis esse tenetur quod placeat cumque
        dolores debitis corrupti repellendus ab sed neque suscipit distinctio,
        quam possimus asperiores.
      </div>
    </div>
  );
};

export default NotesClient;
