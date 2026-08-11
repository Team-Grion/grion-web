'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { describeApiError } from '@/lib/api/error';
import {
  addMemorialInfo,
  createMemorial,
  updateMemorial,
} from '@/lib/api/memorial';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { InfoTooltip } from '@/components/info-tooltip';

import { BackgroundSelector } from '@/app/(main)/memorial/create/_component/background-selector';
import { BreedSelector } from '@/app/(main)/memorial/create/_component/breed-selector';
import { DatePicker } from '@/app/(main)/memorial/create/_component/date-picker';
import { MemoryPromptCarousel } from '@/app/(main)/memorial/create/_component/memory-prompt-carousel';
import { PersonalitySelector } from '@/app/(main)/memorial/create/_component/personality-selector';
import { PetPhotoInput } from '@/app/(main)/memorial/create/_component/pet-photo-input';
import {
  createMemorialSchema,
  MEMORY_MAX_LENGTH,
  STEP1_FIELDS,
  step1Schema,
  type CreateMemorialFormValues,
} from '@/app/(main)/memorial/create/_component/schema';
import { SpeciesSelector } from '@/app/(main)/memorial/create/_component/species-selector';

export function CreateMemorialForm() {
  const router = useRouter();
  // Step 2에서 이탈했다가 "이어서 작성하기"로 돌아온 경우.
  // 공간은 이미 서버에 있으므로 Step 1을 다시 밟지 않는다.
  const resumePetId = Number(useSearchParams().get('petId')) || null;

  const [step, setStep] = useState<1 | 2>(resumePetId ? 2 : 1);
  const [step1Attempted, setStep1Attempted] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [petId, setPetId] = useState<number | null>(resumePetId);

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
      background: '',
      petName: '',
      content: '',
      birthDate: '',
      deathDate: '',
      memory: '',
    },
  });

  // Step 1 에러는 setError로 직접 달기 때문에 값이 바뀌어도 저절로 지워지지 않는다.
  // (handleSubmit을 거치지 않아 RHF의 재검증이 돌지 않음)
  useEffect(() => {
    const subscription = watch((_, { name }) => {
      if (name && (STEP1_FIELDS as readonly string[]).includes(name)) {
        clearErrors(name);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, clearErrors]);

  const species = watch('species');
  const birthDate = watch('birthDate');
  const deathDate = watch('deathDate');
  const memory = watch('memory') ?? '';

  async function handleStep1Next() {
    if (isCreating) return;
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

    // Step 2에서 /add를 부르려면 petId가 필요하다. 여기서 미리 만들어두면
    // 사용자가 Step 2를 입력하는 동안 AI 이미지 생성이 함께 진행된다.
    setIsCreating(true);
    try {
      const created = await createMemorial(result.data);
      setPetId(created.petId);
      setStep(2);
      // 새로고침해도 Step 2로 돌아오도록 petId를 URL에 남긴다.
      // push가 아니라 replace여야 뒤로가기가 Step 1로 되돌아가지 않는다.
      router.replace(`/memorial/create?petId=${created.petId}`);
    } catch (error) {
      console.error('[memorial-create]', error);
      toast('추모 공간을 만들지 못했어요', {
        description: describeApiError(error),
      });
    } finally {
      setIsCreating(false);
    }
  }

  async function onSubmit(values: CreateMemorialFormValues) {
    if (petId === null) {
      toast('추모 공간 정보가 없어요', {
        description: '처음부터 다시 시도해주세요',
      });
      return;
    }

    try {
      await addMemorialInfo(petId, {
        petName: values.petName,
        birthDate: values.birthDate,
        deathDate: values.deathDate,
        memory: values.memory,
      });

      // 한 줄 소개를 받는 엔드포인트가 따로 없어 수정 API로 이어 붙인다
      const content = values.content?.trim();
      if (content) {
        await updateMemorial(petId, { content, isPublic: false });
      }

      router.push('/memorial');
    } catch (error) {
      console.error('[memorial-add]', error);
      toast('정보를 저장하지 못했어요', {
        description: describeApiError(error),
      });
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (errors) => {
        // 화면에 없는 필드에서 막히면 사용자는 아무 반응도 못 본다.
        // 표시할 자리가 있는 에러가 하나도 없을 때만 알린다.
        if (Object.keys(errors).length > 0) return;
        toast('입력을 다시 확인해주세요', {
          description: '처음부터 다시 시도하면 해결될 수 있어요',
        });
      })}
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
                    <FieldDescription>
                      AI가 사진을 바탕으로 그려드려요. 실제와 가까운 정보를
                      입력할수록 더 자연스러워요 — 여러 품종이 섞인 것 같다면
                      믹스견/믹스묘를 선택해주세요
                    </FieldDescription>
                  </Field>
                );
              }}
            />

            <Controller
              control={control}
              name="personalities"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>
                    성격 <span className="text-destructive">*</span>
                  </FieldLabel>
                  <PersonalitySelector
                    value={field.value ?? []}
                    onChange={field.onChange}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              control={control}
              name="background"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>
                    원하는 배경 <span className="text-destructive">*</span>
                    <InfoTooltip label="배경이 어떻게 쓰이는지 보기">
                      고른 배경을 바탕으로 AI가 아이의 모습을 그려요. 직접
                      입력하면 원하는 장면을 자세히 적을 수 있어요.
                    </InfoTooltip>
                  </FieldLabel>
                  <BackgroundSelector
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FieldError errors={[fieldState.error]} />
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
              disabled={isCreating}
            >
              {isCreating ? <Spinner /> : null}
              {isCreating ? '준비하는 중' : '다음'}
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
                        태어난 날 <span className="text-destructive">*</span>
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
                        보낸 날 <span className="text-destructive">*</span>
                      </FieldLabel>
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="보낸 날"
                        disabled={
                          birthDate
                            ? { before: new Date(birthDate) }
                            : undefined
                        }
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
              name="content"
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
                        const next = current ? `${current}\n${prompt}` : prompt;
                        // 값을 직접 넣는 경로라 textarea의 maxLength를 거치지 않는다
                        field.onChange(next.slice(0, MEMORY_MAX_LENGTH));
                      }}
                    />
                    <Textarea
                      {...field}
                      placeholder="소중한 추억을 적어주세요"
                      rows={4}
                      maxLength={MEMORY_MAX_LENGTH}
                      className="mt-2 resize-none"
                      aria-invalid={!!error}
                    />
                    <div className="text-muted-foreground flex justify-end text-xs">
                      {memory.length} / {MEMORY_MAX_LENGTH}
                    </div>
                    <FieldError errors={[error]} />
                  </Field>
                );
              }}
            />
          </FieldGroup>

          <div className="fixed bottom-16 left-1/2 w-full max-w-150 -translate-x-1/2 px-6 pt-3 pb-4 backdrop-blur-sm">
            <Button
              type="submit"
              variant="brown"
              className="w-full"
              disabled={formState.isSubmitting}
            >
              {formState.isSubmitting ? <Spinner /> : null}
              {formState.isSubmitting ? '저장하는 중' : '추모 공간 만들기'}
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
