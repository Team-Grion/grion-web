import { z } from 'zod';

/** zod 검증, textarea maxLength, 글자 수 카운터가 함께 쓴다 */
export const MEMORY_MAX_LENGTH = 500;

const step1Shape = {
  petPhoto: z.instanceof(File, { message: '사진을 등록해주세요' }),
  species: z.enum(['dog', 'cat'], { message: '종을 선택해주세요' }),
  breed: z.string().min(1, '품종을 선택해주세요'),
  // 각 항목 50자 이내, 중복 불가 (서버 PK가 (pet_id, personality))
  personalities: z
    .array(z.string().max(50, '성격은 최대 50자까지 입력할 수 있어요'))
    .min(1, '성격을 하나 이상 선택해주세요'),
  background: z
    .string()
    .min(1, '배경을 선택해주세요')
    .max(255, '배경은 최대 255자까지 입력할 수 있어요'),
};

export const step1Schema = z.object(step1Shape);

/**
 * Step 1은 "다음"에서 step1Schema로 검증하고 곧바로 서버에 보낸다.
 * 그래서 제출 시점에는 Step 1 규칙을 아예 검사하지 않는다 —
 * 이어서 작성하기로 들어오면 이 값들이 기본값(빈 배열/빈 문자열)로 남아 있어
 * .optional()만으로는 통과하지 못한다(undefined가 아니므로 안쪽 규칙이 돈다).
 */
const memorialShape = z.object({
  // Step 1 — 여기서는 값을 담아두기만 한다
  petPhoto: z.instanceof(File).optional(),
  species: z.enum(['dog', 'cat']).optional(),
  breed: z.string().optional(),
  personalities: z.array(z.string()).optional(),
  background: z.string().optional(),
  // Step 2
  petName: z
    .string()
    .min(1, '이름을 입력해주세요')
    .max(20, '이름은 최대 20자까지 입력할 수 있어요'),
  content: z
    .string()
    .max(40, '한 줄 소개는 최대 40자까지 입력할 수 있어요')
    .optional(),
  birthDate: z.string().min(1, '태어난 날짜를 선택해주세요'),
  deathDate: z.string().min(1, '보낸 날을 선택해주세요'),
  memory: z
    .string()
    .max(
      MEMORY_MAX_LENGTH,
      `추억은 최대 ${MEMORY_MAX_LENGTH}자까지 입력할 수 있어요`,
    )
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
  'background',
] as const;

export const STEP2_FIELDS = [
  'petName',
  'birthDate',
  'deathDate',
  'content',
  'memory',
] as const;

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
  '처음 집에 온 날, 낯선지 구석에 숨어 한참을 나오지 않았어요',
  '이름을 부르면 어디 있든 한달음에 달려왔어요',
  '내 무릎 위에서 새근새근 잠들 때 전해지던 온기가 기억나요',
  '좋아하는 간식 봉지 소리만 나면 눈이 반짝반짝 빛났어요',
  '아침마다 얼굴을 톡톡 건드리며 나를 깨워줬어요',
  '힘든 날엔 말없이 곁에 와서 가만히 기대 앉아 있었어요',
  '햇살 드는 창가에서 함께 낮잠 자던 오후가 그리워요',
  '현관문을 열면 늘 제일 먼저 나를 반겨줬어요',
];
