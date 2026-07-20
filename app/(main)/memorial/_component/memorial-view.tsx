'use client';

import { useState } from 'react';

import type { MemorialsResponse, Message } from '@/types/memorial';

import { MemorialSpace } from '@/app/(main)/memorial/_component/memorial-space';
import { PetProfileBar } from '@/app/(main)/memorial/_component/pet-profile-bar';

interface MemorialViewProps {
  memorials: MemorialsResponse;
  messages: Record<string, Message[]>;
}

export function MemorialView({ memorials, messages }: MemorialViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(
    memorials?.[0]?.id ?? null,
  );

  const selectedMemorial = memorials?.find((m) => m.id === selectedId) ?? null;

  const selectedMessages = selectedId ? (messages[selectedId] ?? []) : [];

  return (
    <div>
      {memorials && memorials.length > 0 && (
        <PetProfileBar
          memorials={memorials}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      )}
      <MemorialSpace
        key={selectedId}
        memorial={selectedMemorial}
        messages={selectedMessages}
      />
    </div>
  );
}
