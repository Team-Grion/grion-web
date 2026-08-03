'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
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
  step1Schema,
  type CreateMemorialFormValues,
} from '@/app/(main)/memorial/create/_component/schema';
import { SpeciesSelector } from '@/app/(main)/memorial/create/_component/species-selector';

export function CreateMemorialForm() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [step1Attempted, setStep1Attempted] = useState(false);

  const {
    control,
    handleSubmit,
    resetField,
    watch,
    getValues,
    setError,
    clearErrors,
    formState,
  } = useForm<CreateMemorialFormValues>({
    resolver: zodResolver(createMemorialSchema),
    defaultValues: {
      personalities: [],
      bgId: undefined,
      petName: '',
      epitaph: '',
      birthDate: '',
      deathDate: '',
      memory: '',
    },
  });

  const species = watch('species');
  const birthDate = watch('birthDate');
  const deathDate = watch('deathDate');
  const memory = watch('memory') ?? '';

  function handleStep1Next() {
    setStep1Attempted(true);
    // zodResolver validates the whole schema, so trigger()/handleSubmit()
    // would surface errors on untouched Step 2 fields (e.g. petName) before
    // Step 2 is even visible. Validate Step 1 against its own sub-schema
    // instead, which never looks at Step 2 fields.
    clearErrors(
      Object.keys(step1Schema.shape) as (keyof CreateMemorialFormValues)[],
    );
    const result = step1Schema.safeParse(getValues());
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        setError(issue.path[0] as keyof CreateMemorialFormValues, {
          type: issue.code,
          message: issue.message,
        });
      });
      return;
    }
    setStep(2);
  }

  async function onSubmit(values: CreateMemorialFormValues) {
    console.log(values);
    router.push('/memorial');
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 px-6 py-6 pb-28"
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'h-1.5 rounded-full transition-all',
            step === 1 ? 'bg-gr-primary w-8' : 'bg-gr-accent/40 w-4',
          )}
        />
        <span
          className={cn(
            'h-1.5 rounded-full transition-all',
            step === 2 ? 'bg-gr-primary w-8' : 'bg-gr-accent/40 w-4',
          )}
        />
        <span className="text-muted-foreground ml-auto text-xs">{step}/2</span>
      </div>

      {step === 1 ? (
        <>
          <FieldGroup>
            <Controller
              control={control}
              name="petPhoto"
              render={({ field, fieldState }) => {
                const error = step1Attempted ? fieldState.error : undefined;
                return (
                  <Field data-invalid={!!error} className="items-center">
                    <PetPhotoInput
                      value={field.value ?? null}
                      onChange={field.onChange}
                      error={error?.message}
                    />
                  </Field>
                );
              }}
            />

            <Controller
              control={control}
              name="species"
              render={({ field, fieldState }) => {
                const error = step1Attempted ? fieldState.error : undefined;
                return (
                  <Field data-invalid={!!error}>
                    <FieldLabel>
                      종 <span className="text-destructive">*</span>
                    </FieldLabel>
                    <SpeciesSelector
                      value={field.value}
                      onChange={(v) => {
                        field.onChange(v);
                        resetField('breed');
                      }}
                      error={error?.message}
                    />
                  </Field>
                );
              }}
            />

            <Controller
              control={control}
              name="breed"
              render={({ field, fieldState }) => {
                const error = step1Attempted ? fieldState.error : undefined;
                return (
                  <Field data-invalid={!!error}>
                    <FieldLabel>
                      품종 <span className="text-destructive">*</span>
                    </FieldLabel>
                    <BreedSelector
                      key={species ?? 'none'}
                      species={species}
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      error={error?.message}
                    />
                  </Field>
                );
              }}
            />

            <Controller
              control={control}
              name="personalities"
              render={({ field }) => (
                <Field>
                  <FieldLabel>
                    성격{' '}
                    <span className="text-muted-foreground text-xs font-normal">
                      (선택)
                    </span>
                  </FieldLabel>
                  <PersonalitySelector
                    value={field.value ?? []}
                    onChange={field.onChange}
                  />
                </Field>
              )}
            />

            <Controller
              control={control}
              name="bgId"
              render={({ field }) => (
                <Field>
                  <FieldLabel>
                    원하는 배경{' '}
                    <span className="text-muted-foreground text-xs font-normal">
                      (선택)
                    </span>
                  </FieldLabel>
                  <BackgroundSelector
                    value={field.value}
                    onChange={field.onChange}
                  />
                </Field>
              )}
            />
          </FieldGroup>

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
          <FieldGroup>
            <Controller
              control={control}
              name="petName"
              render={({ field, fieldState }) => {
                const error = formState.isSubmitted
                  ? fieldState.error
                  : undefined;
                return (
                  <Field data-invalid={!!error}>
                    <FieldLabel>
                      반려동물 이름 <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      placeholder="이름을 입력해주세요"
                      maxLength={20}
                      aria-invalid={!!error}
                    />
                    <FieldError errors={[error]} />
                  </Field>
                );
              }}
            />

            <div className="grid grid-cols-2 gap-3">
              <Controller
                control={control}
                name="birthDate"
                render={({ field, fieldState }) => {
                  const error = formState.isSubmitted
                    ? fieldState.error
                    : undefined;
                  return (
                    <Field data-invalid={!!error}>
                      <FieldLabel>
                        태어난 날{' '}
                        <span className="text-muted-foreground text-xs font-normal">
                          (선택)
                        </span>
                      </FieldLabel>
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="태어난 날"
                        disabled={
                          deathDate ? { after: new Date(deathDate) } : undefined
                        }
                        ariaInvalid={!!error}
                      />
                      <FieldError errors={[error]} />
                    </Field>
                  );
                }}
              />

              <Controller
                control={control}
                name="deathDate"
                render={({ field, fieldState }) => {
                  const error = formState.isSubmitted
                    ? fieldState.error
                    : undefined;
                  return (
                    <Field data-invalid={!!error}>
                      <FieldLabel>
                        보낸 날{' '}
                        <span className="text-muted-foreground text-xs font-normal">
                          (선택)
                        </span>
                      </FieldLabel>
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="보낸 날"
                        disabled={[
                          ...(birthDate
                            ? [{ before: new Date(birthDate) }]
                            : []),
                          { after: new Date() },
                        ]}
                        ariaInvalid={!!error}
                      />
                      <FieldError errors={[error]} />
                    </Field>
                  );
                }}
              />
            </div>

            <Controller
              control={control}
              name="epitaph"
              render={({ field, fieldState }) => {
                const error = formState.isSubmitted
                  ? fieldState.error
                  : undefined;
                return (
                  <Field data-invalid={!!error}>
                    <FieldLabel>
                      한 줄 소개{' '}
                      <span className="text-muted-foreground text-xs font-normal">
                        (선택)
                      </span>
                    </FieldLabel>
                    <Input
                      {...field}
                      placeholder="공개 추모 공간에 표시될 한 줄 소개예요"
                      maxLength={40}
                      aria-invalid={!!error}
                    />
                    <FieldError errors={[error]} />
                  </Field>
                );
              }}
            />

            <Controller
              control={control}
              name="memory"
              render={({ field, fieldState }) => {
                const error = formState.isSubmitted
                  ? fieldState.error
                  : undefined;
                return (
                  <Field data-invalid={!!error}>
                    <FieldLabel>
                      함께한 추억{' '}
                      <span className="text-muted-foreground text-xs font-normal">
                        (선택)
                      </span>
                    </FieldLabel>
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
                      aria-invalid={!!error}
                    />
                    <div className="text-muted-foreground flex justify-end text-xs">
                      {memory.length} / 1000
                    </div>
                    <FieldError errors={[error]} />
                  </Field>
                );
              }}
            />
          </FieldGroup>

          <div className="fixed bottom-16 left-1/2 w-full max-w-150 -translate-x-1/2 px-6 pt-3 pb-4 backdrop-blur-sm">
            <Button type="submit" variant="brown" className="w-full">
              추모 공간 만들기
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
