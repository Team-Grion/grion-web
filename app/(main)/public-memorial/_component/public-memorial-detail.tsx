import Image from 'next/image';

import type { MemorialProfile } from '@/types/memorial';

import { formatDateRange } from '@/lib/utils';

import { SendMessageForm } from '@/app/(main)/public-memorial/_component/send-message-form';

interface PublicMemorialDetailProps {
  memorial: MemorialProfile;
  userName: string;
}

export function PublicMemorialDetail({
  memorial,
  userName,
}: PublicMemorialDetailProps) {
  return (
    <div className="flex flex-col gap-6 px-6 py-6">
      <div className="flex flex-col items-center gap-3">
        <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-2xl">
          <Image
            src={memorial.aiImageUrl}
            alt={memorial.petName}
            fill
            className="object-cover"
          />
        </div>
        <h1 className="text-xl font-semibold">{memorial.petName}</h1>
        <p className="text-muted-foreground text-sm">
          {formatDateRange(memorial.birthDate, memorial.deathDate)}
        </p>
      </div>

      <div className="border-t pt-6">
        <h2 className="mb-4 font-medium">쪽지 보내기</h2>
        <SendMessageForm memorialId={memorial.id} userName={userName} />
      </div>
    </div>
  );
}
