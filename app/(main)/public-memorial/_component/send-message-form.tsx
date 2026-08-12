'use client';

import { useState } from 'react';

import { CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

import { describeApiError } from '@/lib/api/error';
import { sendLetter } from '@/lib/api/memorial';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const CONTENT_MAX_LENGTH = 500;

interface SendMessageFormProps {
  petId: number;
  userName: string;
}

export function SendMessageForm({ petId, userName }: SendMessageFormProps) {
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      await sendLetter(petId, { content, isAnonymous });
      setIsDone(true);
      toast('쪽지를 보냈어요');
    } catch (error) {
      console.error('[send-letter]', error);
      toast('쪽지를 보내지 못했어요', {
        description: describeApiError(error),
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isDone) {
    return (
      <div className="flex flex-col items-center gap-2 py-6 text-center">
        <CheckCircle2 className="text-primary size-8" />
        <p className="font-medium">쪽지가 전달됐어요</p>
        <p className="text-muted-foreground text-sm">
          소중한 마음이 잘 전달됐을 거예요
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          보내는 사람:{' '}
          <span className="text-foreground font-medium">
            {isAnonymous ? '익명' : userName}
          </span>
        </p>
        <label className="flex cursor-pointer items-center gap-1.5">
          <Checkbox
            checked={isAnonymous}
            onCheckedChange={(checked) => setIsAnonymous(checked === true)}
          />
          <Label className="cursor-pointer text-xs">익명으로 보내기</Label>
        </label>
      </div>

      <Textarea
        placeholder="전하고 싶은 말을 적어주세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        maxLength={CONTENT_MAX_LENGTH}
        required
      />

      <Button type="submit" className="w-full" disabled={!content || isLoading}>
        {isLoading ? '전달 중...' : '쪽지 보내기'}
      </Button>
    </form>
  );
}
