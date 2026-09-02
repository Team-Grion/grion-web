'use client';

import { useState } from 'react';

import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

import { describeApiError } from '@/lib/api/error';
import { regenerateMemorialImage } from '@/lib/api/memorial';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import { PetPhotoInput } from '@/app/(main)/memorial/create/_component/pet-photo-input';

interface RegeneratePhotoSheetProps {
  petId: number;
  onRegenerating: () => void;
}

export function RegeneratePhotoSheet({
  petId,
  onRegenerating,
}: RegeneratePhotoSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleOpenChange(next: boolean) {
    setIsOpen(next);
    if (!next) setPhoto(null);
  }

  async function handleSubmit() {
    if (!photo) return;

    setIsSubmitting(true);
    try {
      await regenerateMemorialImage(petId, photo);
      onRegenerating();
      handleOpenChange(false);
      toast('새 사진으로 이미지를 다시 만들고 있어요');
    } catch (error) {
      console.error('[memorial-regenerate]', error);
      toast('이미지를 다시 만들지 못했어요', {
        description: describeApiError(error),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="hover:bg-muted/50 flex items-center justify-between px-4 py-3 text-left transition-colors"
        >
          <span className="text-sm">AI 이미지 다시 만들기</span>
          <RefreshCw className="text-muted-foreground size-4" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="rounded-t-2xl data-[side=bottom]:right-auto data-[side=bottom]:left-1/2 data-[side=bottom]:w-full data-[side=bottom]:max-w-150 data-[side=bottom]:-translate-x-1/2"
      >
        <SheetHeader className="pb-2">
          <SheetTitle>AI 이미지 다시 만들기</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col items-center gap-4 px-4 pb-8">
          <p className="text-muted-foreground text-center text-sm">
            새 사진을 올리면 그 사진으로 AI 이미지를 다시 만들어드려요
          </p>
          <PetPhotoInput value={photo} onChange={setPhoto} />
          <Button
            variant="brown"
            className="w-full"
            disabled={!photo || isSubmitting}
            onClick={() => void handleSubmit()}
          >
            {isSubmitting ? '요청하는 중…' : '다시 만들기'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
