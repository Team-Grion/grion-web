'use client';

import { useState } from 'react';

import type { PublicMemorial } from '@/types/memorial';

import { MemorialGrid } from '@/app/(main)/public-memorial/_component/memorial-grid';
import { PublicMemorialHeader } from '@/app/(main)/public-memorial/_component/public-memorial-header';
import {
  SpeciesFilter,
  type SpeciesFilterValue,
} from '@/app/(main)/public-memorial/_component/species-filter';

interface PublicMemorialViewProps {
  memorials: PublicMemorial[];
}

export function PublicMemorialView({ memorials }: PublicMemorialViewProps) {
  const [species, setSpecies] = useState<SpeciesFilterValue>('all');

  const filteredMemorials =
    species === 'all'
      ? memorials
      : memorials.filter((m) => m.species === species);

  return (
    <div>
      <PublicMemorialHeader memorials={memorials} />
      <SpeciesFilter value={species} onChange={setSpecies} />
      <MemorialGrid memorials={filteredMemorials} />
    </div>
  );
}
