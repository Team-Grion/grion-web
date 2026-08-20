'use client';

import { useEffect, useState } from 'react';

import { toast } from 'sonner';

import type {
  PetMemorialPublicSummary,
  PetMemorialPublicTodaySummary,
} from '@/types/memorial';

import { getPublicMemorials, type PublicSpecies } from '@/lib/api/memorial';

import { MemorialGrid } from '@/app/(main)/public-memorial/_component/memorial-grid';
import { PublicMemorialHeader } from '@/app/(main)/public-memorial/_component/public-memorial-header';
import {
  SpeciesFilter,
  type SpeciesFilterValue,
} from '@/app/(main)/public-memorial/_component/species-filter';

const SPECIES_PARAM: Record<SpeciesFilterValue, PublicSpecies> = {
  all: 'ALL',
  dog: 'DOG',
  cat: 'CAT',
};

export function PublicMemorialView() {
  const [species, setSpecies] = useState<SpeciesFilterValue>('all');
  const [memorials, setMemorials] = useState<PetMemorialPublicSummary[]>([]);
  const [todaySummary, setTodaySummary] =
    useState<PetMemorialPublicTodaySummary | null>(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  useEffect(() => {
    let isStale = false;

    getPublicMemorials(SPECIES_PARAM[species])
      .then((res) => {
        if (isStale) return;
        setMemorials(res.content);
        setTodaySummary(res.todaySummary);
      })
      .catch((error) => {
        if (isStale) return;
        console.error('[public-memorials]', error);
        toast('공개 추모 공간을 불러오지 못했어요', {
          description: '잠시 후 다시 시도해주세요',
        });
      })
      .finally(() => {
        if (!isStale) setHasLoadedOnce(true);
      });

    return () => {
      isStale = true;
    };
  }, [species]);

  if (!hasLoadedOnce) return null;

  return (
    <div>
      <PublicMemorialHeader summary={todaySummary} />
      <SpeciesFilter value={species} onChange={setSpecies} />
      <MemorialGrid memorials={memorials} />
    </div>
  );
}
