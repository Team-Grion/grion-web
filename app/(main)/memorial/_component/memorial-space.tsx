'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { ImageOff, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import type { PetMemorialDetail } from '@/types/memorial';

import {
  deleteMemorial,
  updateMemorial,
  type UpdateMemorialPayload,
} from '@/lib/api/memorial';
import { formatDateRange } from '@/lib/utils';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import { FlowerOverlay } from '@/components/flower-overlay';

import { ContentPlaque } from '@/app/(main)/memorial/_component/content-plaque';
import type { GenerationIssue } from '@/app/(main)/memorial/_component/memorial-view';
import { MessageInbox } from '@/app/(main)/memorial/_component/message-inbox';
import { RegeneratePhotoSheet } from '@/app/(main)/memorial/_component/regenerate-photo-sheet';

interface MemorialSpaceProps {
  memorial: PetMemorialDetail | null;
  generationIssue: GenerationIssue | null;
  onDeleted?: (petId: number) => void;
  onRegenerating?: () => void;
}

export function MemorialSpace({
  memorial,
  generationIssue,
  onDeleted,
  onRegenerating,
}: MemorialSpaceProps) {
  const [isPublic, setIsPublic] = useState(memorial?.isPublic ?? false);
  const [content, setContent] = useState(memorial?.content ?? '');
  const [isDeleting, setIsDeleting] = useState(false);

  // 먼저 화면을 바꾸고 저장은 뒤따라간다. 실패하면 이전 값으로 되돌린다.
  async function persist(next: UpdateMemorialPayload, revert: () => void) {
    if (!memorial) return;

    try {
      await updateMemorial(memorial.petId, next);
    } catch (error) {
      console.error('[memorial-update]', error);
      revert();
      toast('변경사항을 저장하지 못했어요', {
        description: '잠시 후 다시 시도해주세요',
      });
    }
  }

  function handlePublicChange(next: boolean) {
    const previous = isPublic;
    setIsPublic(next);

    if (next && !content) {
      toast('공개로 전환됐어요', {
        description: '한 줄 소개를 남겨보시겠어요?',
      });
    }

    void persist({ content, isPublic: next }, () => setIsPublic(previous));
  }

  function handleContentChange(next: string) {
    const previous = content;
    setContent(next);

    void persist({ content: next, isPublic }, () => setContent(previous));
  }

  async function handleDelete() {
    if (!memorial) return;

    setIsDeleting(true);
    try {
      await deleteMemorial(memorial.petId);
      onDeleted?.(memorial.petId);
    } catch (error) {
      console.error('[memorial-delete]', error);
      toast('추모 공간을 삭제하지 못했어요', {
        description: '잠시 후 다시 시도해주세요',
      });
    } finally {
      setIsDeleting(false);
    }
  }

  if (!memorial) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 px-6 py-20 text-center">
        <Image src="/logo.png" alt="" width={96} height={78} />
        <div className="flex flex-col gap-1.5">
          <h2 className="text-lg font-semibold">첫 추모 공간을 만들어보세요</h2>
          <p className="text-muted-foreground text-sm">
            사진 한 장으로 소중한 아이를 위한 공간을 남길 수 있어요
          </p>
        </div>
        <Button asChild variant="brown">
          <Link href="/memorial/create">추모 공간 만들기</Link>
        </Button>
      </div>
    );
  }

  // Step 2를 마치지 못한 공간. 이름이 없으면 보여줄 것도 거의 없다.
  if (!memorial.petName) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 px-6 py-20 text-center">
        <Image src="/logo.png" alt="" width={96} height={78} />
        <div className="flex flex-col gap-1.5">
          <h2 className="text-lg font-semibold">거의 다 왔어요</h2>
          <p className="text-muted-foreground text-sm">
            이름과 날짜만 채우면 추모 공간이 완성돼요
          </p>
        </div>
        <Button asChild variant="brown">
          <Link href={`/memorial/create?petId=${memorial.petId}`}>
            이어서 작성하기
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 px-6 py-6">
      <div className="bg-gr-secondary relative aspect-square w-full max-w-sm overflow-hidden rounded-2xl">
        {memorial.aiImageUrl ? (
          <Image
            src={memorial.aiImageUrl}
            alt={memorial.petName}
            fill
            className="object-cover"
            // NAT64(DNS64) 네트워크에서는 Next.js 이미지 서버가 외부 호스트의
            // 공인 IP를 사설 IP로 오판해 차단한다. 개발 중에만 최적화를 건너뛴다.
            unoptimized={process.env.NODE_ENV === 'development'}
          />
        ) : (
          // AI 이미지 생성이 끝나기 전에도 화면은 떠야 한다
          <div className="text-muted-foreground flex h-full flex-col items-center justify-center gap-2 px-6 text-center text-sm">
            {generationIssue === null ? (
              <>
                <Spinner />
                AI가 보고 싶던 모습을 그리고 있어요
              </>
            ) : (
              <>
                <ImageOff className="size-5" />
                {generationIssue === 'failed'
                  ? 'AI 이미지 생성에 실패했어요'
                  : '생성이 오래 걸리고 있어요. 잠시 후 새로고침해주세요'}
              </>
            )}
          </div>
        )}
        <FlowerOverlay count={memorial.letterCount} />
      </div>
      <h2 className="text-xl font-semibold">{memorial.petName}</h2>
      <p className="text-muted-foreground text-sm">
        {formatDateRange(memorial.birthDate, memorial.deathDate)}
      </p>

      <ContentPlaque
        value={content}
        onChange={handleContentChange}
        isPublic={isPublic}
      />

      <div className="mt-2 flex w-full max-w-sm flex-col divide-y overflow-hidden rounded-xl border">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-sm font-medium">
              {isPublic ? '공개 추모 공간' : '비공개 추모 공간'}
            </p>
            <p className="text-muted-foreground text-xs">
              {isPublic
                ? '모두에게 공개된 상태예요'
                : '나만 볼 수 있는 상태예요'}
            </p>
          </div>
          <Switch checked={isPublic} onCheckedChange={handlePublicChange} />
        </div>

        <MessageInbox petId={memorial.petId} count={memorial.letterCount} />

        {onRegenerating && (
          <RegeneratePhotoSheet
            petId={memorial.petId}
            onRegenerating={onRegenerating}
          />
        )}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              type="button"
              className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive flex items-center justify-between px-4 py-3 text-left transition-colors"
            >
              <span className="text-sm">추모 공간 삭제</span>
              <Trash2 className="size-4" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {memorial.petName}의 추모 공간을 삭제할까요?
              </AlertDialogTitle>
              <AlertDialogDescription>
                삭제하면 되돌릴 수 없어요. 받은 쪽지도 함께 사라져요.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                disabled={isDeleting}
                onClick={(e) => {
                  e.preventDefault();
                  void handleDelete();
                }}
              >
                {isDeleting ? '삭제하는 중…' : '삭제'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
