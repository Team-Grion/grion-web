import { z } from 'zod';

const memorialShape = z.object({
  // Step 1
  petPhoto: z.instanceof(File, { message: '사진을 등록해주세요' }),
  species: z.enum(['dog', 'cat'], { message: '종을 선택해주세요' }),
  breed: z.string().min(1, '품종을 선택해주세요'),
  personalities: z.array(z.string()).optional(),
  bgId: z.string().optional(),
  // Step 2
  petName: z
    .string()
    .min(1, '이름을 입력해주세요')
    .max(20, '이름은 최대 20자까지 입력할 수 있어요'),
  epitaph: z
    .string()
    .max(40, '한 줄 소개는 최대 40자까지 입력할 수 있어요')
    .optional(),
  birthDate: z.string().optional(),
  deathDate: z.string().optional(),
  memory: z
    .string()
    .max(1000, '추억은 최대 1000자까지 입력할 수 있어요')
    .optional(),
});

export const createMemorialSchema = memorialShape.refine(
  (data) => {
    if (data.birthDate && data.deathDate) {
      return new Date(data.birthDate) < new Date(data.deathDate);
    }
    return true;
  },
  {
    message: '태어난 날은 보낸 날보다 이전이어야 해요',
    path: ['birthDate'],
  },
);

export type CreateMemorialFormValues = z.infer<typeof createMemorialSchema>;

export const STEP1_FIELDS = [
  'petPhoto',
  'species',
  'breed',
  'personalities',
  'bgId',
] as const;

export const STEP2_FIELDS = [
  'petName',
  'birthDate',
  'deathDate',
  'epitaph',
  'memory',
] as const;

// zodResolver validates the whole schema on every trigger()/handleSubmit()
// call, so Step 1's "다음" gate uses this narrower schema instead — otherwise
// untouched Step 2 fields (e.g. petName) would show errors before Step 2 is
// even visible.
export const step1Schema = memorialShape.pick({
  petPhoto: true,
  species: true,
  breed: true,
  personalities: true,
  bgId: true,
});

export const DOG_BREEDS = [
  '말티즈',
  '푸들',
  '시바견',
  '진돗개',
  '비숑 프리제',
  '포메라니안',
  '골든 리트리버',
  '닥스훈트',
  '믹스견',
  '기타',
];

export const CAT_BREEDS = [
  '코리안 숏헤어',
  '페르시안',
  '러시안 블루',
  '먼치킨',
  '스코티시폴드',
  '노르웨이숲',
  '샴',
  '뱅갈',
  '믹스묘',
  '기타',
];

export const BACKGROUNDS = [
  { id: 'sky', label: '하늘' },
  { id: 'flower-field', label: '꽃밭' },
  { id: 'living-room', label: '거실 소파' },
  { id: 'park', label: '공원' },
  { id: 'beach', label: '바닷가' },
  { id: 'sunny-window', label: '햇살 창가' },
  { id: 'snow-field', label: '눈밭' },
] as const;

export const PERSONALITY_OPTIONS = [
  '활발해요',
  '조용해요',
  '애교쟁이',
  '먹보',
  '호기심쟁이',
  '겁쟁이',
  '겁이 없어요',
  '장난꾸러기',
  '순해요',
  '고집쟁이',
];

export const MEMORY_PROMPTS = [
  '같이 공원 산책하던 날이 떠올라요',
  '이름을 부르면 달려오던 모습',
  '무릎 위에서 잠들던 따뜻한 기억',
  '처음 집에 데려오던 날',
  '좋아하던 간식을 먹을 때의 표정',
  '함께 찍은 사진 속 모습',
  '아침마다 깨워주던 습관',
  '비 오는 날 옆에서 함께 있어 줬던 기억',
];
