'use client';

import { useEffect, useMemo, useRef } from 'react';

import { Camera } from 'lucide-react';

interface PetPhotoInputProps {
  value: File | null;
  onChange: (file: File) => void;
  error?: string;
}

export function PetPhotoInput({ value, onChange, error }: PetPhotoInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // createObjectURL은 호출할 때마다 새 blob을 만들고 직접 해제하기 전까지
  // 메모리에 남는다. 파일이 바뀔 때만 만들고, 쓰임이 끝나면 돌려준다.
  const previewUrl = useMemo(
    () => (value ? URL.createObjectURL(value) : null),
    [value],
  );

  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    onChange(file);
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="border-muted-foreground/40 bg-muted hover:border-gr-accent/60 relative flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-dashed transition-colors"
      >
        {previewUrl ? (
          // blob URL은 브라우저 메모리에만 있어서 next/image가 최적화할 수
          // 없다. 사용자가 방금 고른 파일이라 네트워크도 타지 않는다.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="반려동물 사진"
            className="size-full object-cover"
          />
        ) : (
          <Camera className="text-muted-foreground/60 size-7" />
        )}
      </button>
      {error ? (
        <span className="text-destructive text-xs">{error}</span>
      ) : (
        <span className="text-muted-foreground text-xs">
          반려동물 사진을 등록해주세요{' '}
          <span className="text-destructive">*</span>
        </span>
      )}
    </div>
  );
}
