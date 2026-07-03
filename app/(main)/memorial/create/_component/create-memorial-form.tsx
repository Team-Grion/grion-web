'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { CreateLoadingScreen } from '@/app/(main)/memorial/create/_component/create-loading-screen';
import { PersonalitySelector } from '@/app/(main)/memorial/create/_component/personality-selector';
import { PetPhotoInput } from '@/app/(main)/memorial/create/_component/pet-photo-input';

export function CreateMemorialForm() {
  const router = useRouter();

  const [petName, setPetName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [deathDate, setDeathDate] = useState('');
  const [personalities, setPersonalities] = useState<string[]>([]);
  const [memory, setMemory] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 40000));
    router.push('/memorial');
  }

  if (isLoading) return <CreateLoadingScreen />;

  return (
    <div className="px-6 py-8">
      <h1 className="mb-6 text-xl font-semibold">추모 공간 만들기</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <PetPhotoInput previewUrl={previewUrl} onChange={setPreviewUrl} />

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="petName">
            반려동물 이름 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="petName"
            placeholder="이름을 입력해주세요"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="birthDate">
            생일 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="birthDate"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="deathDate">
            하늘나라 간 날짜 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="deathDate"
            type="date"
            value={deathDate}
            onChange={(e) => setDeathDate(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>
            성격{' '}
            <span className="text-muted-foreground text-xs font-normal">
              (선택)
            </span>
          </Label>
          <PersonalitySelector
            selected={personalities}
            onChange={setPersonalities}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="memory">
            함께한 추억{' '}
            <span className="text-muted-foreground text-xs font-normal">
              (선택)
            </span>
          </Label>
          <Textarea
            id="memory"
            placeholder="소중한 추억을 적어주세요. AI가 더 특별한 이미지를 만들어줄 거예요."
            value={memory}
            onChange={(e) => setMemory(e.target.value)}
            rows={4}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={!petName || !birthDate || !deathDate || !previewUrl}
        >
          추모 공간 만들기
        </Button>
      </form>
    </div>
  );
}
