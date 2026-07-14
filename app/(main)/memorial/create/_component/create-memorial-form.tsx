'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { BackgroundSelector } from '@/app/(main)/memorial/create/_component/background-selector';
import { BreedSelector } from '@/app/(main)/memorial/create/_component/breed-selector';
import { DatePicker } from '@/app/(main)/memorial/create/_component/date-picker';
import { MemoryPromptCarousel } from '@/app/(main)/memorial/create/_component/memory-prompt-carousel';
import { PersonalitySelector } from '@/app/(main)/memorial/create/_component/personality-selector';
import { PetPhotoInput } from '@/app/(main)/memorial/create/_component/pet-photo-input';
import {
  createMemorialSchema,
  STEP1_FIELDS,
  type CreateMemorialFormValues,
} from '@/app/(main)/memorial/create/_component/schema';
import { SpeciesSelector } from '@/app/(main)/memorial/create/_component/species-selector';

export function CreateMemorialForm() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);

  const form = useForm<CreateMemorialFormValues>({
    resolver: zodResolver(createMemorialSchema),
    defaultValues: {
      personalities: [],
      bgId: undefined,
      petName: '',
      birthDate: '',
      deathDate: '',
      memory: '',
    },
  });

  const birthDate = form.watch('birthDate');
  const deathDate = form.watch('deathDate');
  const memory = form.watch('memory') ?? '';

  async function handleStep1Next() {
    const valid = await form.trigger(
      STEP1_FIELDS as unknown as (keyof CreateMemorialFormValues)[],
    );
    if (valid) setStep(2);
  }

  async function onSubmit(values: CreateMemorialFormValues) {
    console.log(values);
    router.push('/memorial');
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6 px-6 py-6 pb-28"
      >
        {step === 1 ? (
          <>
            <FormField
              control={form.control}
              name="petPhoto"
              render={({ field, fieldState }) => (
                <FormItem className="items-center">
                  <PetPhotoInput
                    value={field.value ?? null}
                    onChange={field.onChange}
                    error={fieldState.error?.message}
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="species"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>
                    종 <span className="text-destructive">*</span>
                  </FormLabel>
                  <SpeciesSelector
                    value={field.value}
                    onChange={(v) => {
                      field.onChange(v);
                      form.resetField('breed');
                    }}
                    error={fieldState.error?.message}
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="breed"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>
                    품종 <span className="text-destructive">*</span>
                  </FormLabel>
                  <BreedSelector
                    species={form.watch('species')}
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    error={fieldState.error?.message}
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="personalities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    성격{' '}
                    <span className="text-muted-foreground text-xs font-normal">
                      (선택)
                    </span>
                  </FormLabel>
                  <PersonalitySelector
                    value={field.value ?? []}
                    onChange={field.onChange}
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bgId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    원하는 배경{' '}
                    <span className="text-muted-foreground text-xs font-normal">
                      (선택)
                    </span>
                  </FormLabel>
                  <BackgroundSelector
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormItem>
              )}
            />

            <div className="fixed bottom-16 left-1/2 w-full max-w-150 -translate-x-1/2 px-6 pt-3 pb-4 backdrop-blur-sm">
              <Button
                type="button"
                variant="brown"
                className="w-full"
                onClick={handleStep1Next}
              >
                다음
              </Button>
            </div>
          </>
        ) : (
          <>
            <FormField
              control={form.control}
              name="petName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    반려동물 이름 <span className="text-destructive">*</span>
                  </FormLabel>
                  <Input
                    {...field}
                    placeholder="이름을 입력해주세요"
                    maxLength={20}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    태어난 날{' '}
                    <span className="text-muted-foreground text-xs font-normal">
                      (선택)
                    </span>
                  </FormLabel>
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="태어난 날 선택"
                    disabled={
                      deathDate ? { after: new Date(deathDate) } : undefined
                    }
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deathDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    보낸 날{' '}
                    <span className="text-muted-foreground text-xs font-normal">
                      (선택)
                    </span>
                  </FormLabel>
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="보낸 날 선택"
                    disabled={[
                      ...(birthDate ? [{ before: new Date(birthDate) }] : []),
                      { after: new Date() },
                    ]}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="memory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    함께한 추억{' '}
                    <span className="text-muted-foreground text-xs font-normal">
                      (선택)
                    </span>
                  </FormLabel>
                  <MemoryPromptCarousel
                    onSelect={(prompt) => {
                      const current = field.value ?? '';
                      field.onChange(
                        current ? `${current}\n${prompt}` : prompt,
                      );
                    }}
                  />
                  <Textarea
                    {...field}
                    placeholder="소중한 추억을 적어주세요"
                    rows={4}
                    maxLength={1000}
                    className="mt-2 resize-none"
                  />
                  <div className="text-muted-foreground flex justify-end text-xs">
                    {memory.length} / 1000
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="fixed bottom-16 left-1/2 w-full max-w-150 -translate-x-1/2 px-6 pt-3 pb-4 backdrop-blur-sm">
              <Button type="submit" variant="brown" className="w-full">
                추모 공간 만들기
              </Button>
            </div>
          </>
        )}
      </form>
    </Form>
  );
}
