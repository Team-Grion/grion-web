'use client';

import { useRef } from 'react';

import { Camera } from 'lucide-react';

interface PetPhotoInputProps {
  value: File | null;
  onChange: (file: File) => void;
  error?: string;
}

export function PetPhotoInput({ value, onChange, error }: PetPhotoInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrl = value ? URL.createObjectURL(value) : null;

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
