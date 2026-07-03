import { Spinner } from '@/components/ui/spinner';

export function CreateLoadingScreen() {
  return (
    <div className="flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center gap-4 px-6 text-center">
      <Spinner className="text-primary size-10" />
      <p className="font-medium">추모 공간을 만들고 있어요</p>
      <p className="text-muted-foreground text-sm">
        AI가 반려동물의 추모 이미지를 생성하고 있어요
      </p>
    </div>
  );
}
