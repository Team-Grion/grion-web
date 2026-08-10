'use client';

import { useEffect, useRef, useState } from 'react';

import { Camera } from 'lucide-react';

interface PetPhotoInputProps {
  value: File | null;
  onChange: (file: File) => void;
  error?: string;
}

/**
 * accept="image/*"는 브라우저가 못 그리는 형식까지 통과시킨다.
 * 아이폰 기본 촬영 포맷인 HEIC가 대표적이고(Safari 외에는 표시 불가),
 * AVIF나 TIFF도 환경을 탄다. 막을 것을 나열하기보다 받을 것만 정한다.
 */
const SUPPORTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function isUnsupportedFormat(file: File) {
  // 형식을 못 알아본 브라우저는 type을 비워서 넘기므로 확장자로도 확인한다
  if (SUPPORTED_TYPES.includes(file.type)) return false;
  return !/\.(jpe?g|png|webp)$/i.test(file.name);
}

export function PetPhotoInput({ value, onChange, error }: PetPhotoInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formatError, setFormatError] = useState<string | null>(null);

  // createObjectURL은 직접 해제하기 전까지 메모리에 남아, 렌더 중에 만들면
  // 리렌더마다 쌓인다. 생성과 해제를 effect 한 쌍으로 묶어야 한다.
  //
  // URL을 effect 밖(useMemo 등)에서 만들면 안 된다. StrictMode는 마운트 →
  // 정리 → 재마운트로 effect를 두 번 돌리는데, 정리에서 해제된 URL을
  // 재마운트가 그대로 다시 쓰게 되어 이미지가 깨진다.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!value) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(value);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);
  /* eslint-enable react-hooks/set-state-in-effect */

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    // 같은 파일을 다시 골라도 change가 나도록 비워둔다
    e.target.value = '';
    if (!file) return;

    if (isUnsupportedFormat(file)) {
      // 폼에 넘기지 않는다. 서버도 그릴 수 없는 파일이다
      setFormatError('지원하지 않는 형식이에요. JPG나 PNG로 올려주세요');
      return;
    }

    setFormatError(null);
    onChange(file);
  }

  // 형식 문제는 방금 한 행동의 결과라 폼 검증 메시지보다 먼저 보여준다
  const shownError = formatError ?? error;

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
      {shownError ? (
        <span className="text-destructive text-xs">{shownError}</span>
      ) : (
        <span className="text-muted-foreground text-xs">
          반려동물 사진을 등록해주세요{' '}
          <span className="text-destructive">*</span>
        </span>
      )}
    </div>
  );
}
