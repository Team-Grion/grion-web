# 그리온 (Grion) — 개발 컨벤션

반려동물 추모 플랫폼. 모바일 폭 제한 웹 서비스.

---

## 기술 스택

| 항목          | 내용                                        |
| ------------- | ------------------------------------------- |
| 프레임워크    | Next.js 16 (App Router)                     |
| 언어          | TypeScript 5                                |
| UI 라이브러리 | React 19                                    |
| 스타일링      | Tailwind CSS v4                             |
| 컴포넌트      | shadcn/ui (최대한 활용)                     |
| 아이콘        | lucide-react (커스텀 SVG 사용 금지)         |
| 폼            | react-hook-form + zod + @hookform/resolvers |
| 인증          | better-auth (카카오 소셜 로그인)            |
| DB            | MySQL (mysql2)                              |

---

## 레이아웃 원칙

- 웹 서비스지만 **모바일 폰 화면처럼 세로로 긴 레이아웃** (width 제한)
- 최대 너비: `max-w-[600px]` 기준 (현재 bottom-nav 기준 `max-w-150`)
- Sheet, Dialog, Drawer 등 오버레이 컴포넌트 추가 시 **반드시 width 제한 적용**
  - Sheet 예시: `className="max-w-[600px] mx-auto"` 등 width 맞춰야 함
- 하단 네비게이션 고려해 `pb-16` 확보
- `fixed` 포지션 요소도 반드시 width 제한 적용 — bottom-nav와 동일한 패턴 사용
  - `fixed bottom-16 left-1/2 w-full max-w-150 -translate-x-1/2` (바텀 nav 위에 배치 시)
  - `fixed bottom-0 left-1/2 w-full max-w-150 -translate-x-1/2` (바텀 nav 위치에 배치 시)

---

## 페이지 구조

```
app/
└── (main)/
    ├── memorial/          # 내 추모공간
    │   ├── _component/    # 이 페이지 전용 컴포넌트
    │   ├── create/
    │   └── page.tsx
    ├── public-memorial/   # 공개 추모공간
    │   ├── _component/    # 이 페이지 전용 컴포넌트
    │   └── page.tsx
    └── settings/          # 설정
        ├── _component/
        └── page.tsx
```

---

## 컴포넌트 컨벤션

### 위치 규칙

- **화면에 보이는 컴포넌트는 반드시 파일로 분리**
- 페이지 전용 컴포넌트 → 해당 페이지 폴더 내 `_component/` 폴더에 위치
- 여러 페이지에서 공유하는 컴포넌트 → `components/` 루트에 위치
- shadcn 기본 컴포넌트 → `components/ui/` (변경 금지)

```
app/(main)/memorial/_component/
├── memorial-space.tsx
├── message-inbox.tsx
├── flower-overlay.tsx
└── pet-profile-bar.tsx
```

### 명명 규칙

- 파일명: `kebab-case.tsx`
- 컴포넌트명: `PascalCase`
- Props 타입: `interface ComponentNameProps {}`

### 기본 구조

```tsx
interface ExampleProps {
  // props 정의
}

export function Example({ ... }: ExampleProps) {
  return (
    // JSX
  );
}
```

- `'use client'`는 꼭 필요한 경우(상태, 이벤트)에만 사용
- 기본은 RSC (React Server Component)

---

## 스타일링 규칙

- **Tailwind CSS className만 사용** — `style={}` 인라인 스타일 사용 금지
- CSS 변수는 `globals.css`에 정의하고 Tailwind 토큰으로 연결해서 사용
- `cn()` 유틸 활용 (조건부 클래스)

### Tailwind 임의값(arbitrary value) 주의사항

- **음수 0 클래스 금지** — `-ml-0` → `ml-0` (음수 0은 의미 없음)
- **임의값 내 콤마 뒤 언더스코어 금지** — 언더스코어는 공백을 대체하는 용도. 콤마 바로 뒤는 공백이 아니므로 붙이지 않음
  ```
  // ❌
  bg-[radial-gradient(ellipse_at_top,_#FFF8EC_0%,_#FAF7F1_60%)]
  // ✅
  bg-[radial-gradient(ellipse_at_top,#FFF8EC_0%,#FAF7F1_60%)]
  ```

```tsx
import { cn } from '@/lib/utils';

<div className={cn('base-class', isActive && 'active-class')} />;
```

---

## 컬러 시스템

시안 기반 따뜻한 크림/브라운 팔레트. `globals.css`에 CSS 변수로 추가.

| 토큰                 | Hex       | 용도               |
| -------------------- | --------- | ------------------ |
| `--color-cream`      | `#faf9f5` | 전체 배경          |
| `--color-peach`      | `#FFEFD5` | 카드/섹션 배경     |
| `--color-tan`        | `#D2B48C` | 포인트/보조        |
| `--color-warm-white` | `#FAF7F1` | 컴포넌트 내부 배경 |
| `--color-brown`      | `#5C4830` | 텍스트/주요 액션   |

Tailwind에서 `bg-cream`, `text-brown` 등으로 사용.

---

## 코드 스타일 (Prettier)

- 들여쓰기: 2 spaces
- 따옴표: single quote (`'`)
- 세미콜론: 있음
- trailing comma: all
- 줄 너비: 80자
- JSX 따옴표: double quote (`"`)

### Import 순서

`@ianvs/prettier-plugin-sort-imports`가 `prettier.config.js` 설정대로 저장 시 자동 정렬. 수동 정렬 불필요.

```
1. react
2. next
3. (공백)
4. 빌트인 모듈
5. 서드파티 모듈
6. (공백)
7. @/types
8. (공백)
9. @/fonts
10. @/config
11. @/auth
12. @/lib
13. @/hooks
14. @/actions
15. (공백)
16. @/components/ui
17. @/components
18. @/registry
19. (공백)
20. @/app
21. (공백)
22. 상대경로 (js/ts)
23. 상대경로 (css)
```

---

## shadcn/ui 사용 원칙

- 가능하면 shadcn 컴포넌트 우선 사용
- 커스터마이징 필요 시 `className`으로 오버라이드
- `components/ui/`의 파일은 직접 수정 가능 (shadcn 특성상)

---

## 아이콘

- **lucide-react만 사용**
- 커스텀 SVG 컴포넌트 만들지 않음

```tsx
import { Flower2, Globe, Settings } from 'lucide-react';

<Flower2 className="h-5 w-5" />;
```

---

## 폼

- **react-hook-form 7** + **zod 4** + **@hookform/resolvers** 조합 사용
- zod 스키마는 `lib/validation/` 또는 해당 페이지 `_component/` 폴더 내 별도 파일로 분리 (예: `create/_component/schema.ts`)
- 마크업은 `components/ui/field.tsx`의 `FieldGroup` + `Field` 구조 사용 — raw `div` + `Label` 금지, shadcn 구 `Form`/`FormField`/`FormItem`/`FormLabel`/`FormMessage`(`components/ui/form.tsx`)는 신규 폼에 사용하지 않음
- 필드 바인딩은 `react-hook-form`의 `Controller`를 직접 사용
- 검증 표시: `Field`에는 `data-invalid={!!fieldState.error}`, 실제 컨트롤에는 `aria-invalid={!!fieldState.error}` — shadcn 기본 컨트롤(Input/Textarea/Select/Button 등)은 `aria-invalid:` variant 스타일을 이미 내장하고 있어 별도 `className` 분기 불필요
- 에러 메시지는 `FieldError`(`errors={[fieldState.error]}`)로 표시
- **제어 컴포넌트(Select/RadioGroup/Switch/Checkbox 등)는 반드시 `Controller`로 바인딩** — `watch()`로 값을 읽어 `setValue()`로 되돌려 쓰는 수동 제어 금지. 하위 컴포넌트에 값을 넘길 때도 `field.value`/`field.onChange`를 단일 소스로 쓰고, 내부에 별도 `useState`로 값을 복제하지 않기 (React Compiler 환경에서 값이 안 바뀌는 버그 발생 이력 있음)
- 부모 값이 바뀔 때 하위 컨트롤의 내부 UI 상태를 초기화해야 하면(예: 상위 선택지가 바뀌어 하위 선택지가 리셋되는 경우) `useEffect`로 동기화하지 말고 `key` prop으로 컴포넌트를 리마운트

```tsx
// validation.ts
import { z } from 'zod';

export const exampleSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
});

export type ExampleFormValues = z.infer<typeof exampleSchema>;
```

```tsx
// form component
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { exampleSchema, type ExampleFormValues } from './validation';

export function ExampleForm() {
  const { control, handleSubmit } = useForm<ExampleFormValues>({
    resolver: zodResolver(exampleSchema),
    defaultValues: { name: '' },
  });

  function onSubmit(values: ExampleFormValues) {
    // API 연동 시 여기서 처리
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FieldGroup>
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel>이름</FieldLabel>
              <Input {...field} aria-invalid={!!fieldState.error} />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      </FieldGroup>
      <Button type="submit">제출</Button>
    </form>
  );
}
```

---

## 화면별 컴포넌트 목록 (시안 기준)

### 로그인 (`app/(auth)/login/`)

**`page.tsx`** — 온보딩 캐러셀 + 카카오 소셜 로그인 (신규 유저 진입점, 별도 온보딩 페이지 없이 로그인 페이지에 통합)

| 컴포넌트                  | 위치                 | 설명                                                                                        |
| ------------------------- | -------------------- | ------------------------------------------------------------------------------------------- |
| `onboarding-carousel.tsx` | `_component/`        | 4슬라이드 스와이프 캐러셀 (터치 스와이프 + 좌우 화살표 + 도트 페이지네이션)                 |
| `onboarding-slide.tsx`    | `_component/`        | 슬라이드 1장 (비주얼 이미지 + 제목 + 본문)                                                  |
| `kakao-login-button.tsx`  | `components/` (공통) | 카카오 로그인 CTA 버튼 (노란 배경, 카카오 심볼) — `lib/auth/auth-client.ts`의 `signIn` 호출 |

슬라이드 4개:

1. **intro** — "다시 만나는 작은 공간" / 그리온 로고 비주얼
2. **ai** — "사진으로 다시 그려요" / 전후 사진 비교 비주얼
3. **memorial** — "기억을 오래 간직해요" / 추모공간 비주얼
4. **share** — "마음을 나눠요" / 공유 비주얼

우상단 `건너뛰기` 버튼 → 마지막 슬라이드로 이동  
하단 카카오 로그인 버튼은 모든 슬라이드에서 고정 노출  
배경: `radial-gradient(ellipse at top, #FFF8EC 0%, #FAF7F1 60%)`

---

### 공통 컴포넌트 (`components/`)

| 컴포넌트          | 설명                                                       |
| ----------------- | ---------------------------------------------------------- |
| `bottom-nav.tsx`  | 하단 탭 네비게이션 (memorial / public-memorial / settings) |
| `top-app-bar.tsx` | 상단 앱바 — brand 모드(로고) 단일 모드                     |
| `toast.tsx`       | 바텀 토스트 알림 (성공/실패) — 쪽지 전송 후 노출           |

---

### memorial 페이지 (`app/(main)/memorial/`)

**`page.tsx`** — 내 추모공간 메인 (mock 데이터 조립 후 `MemorialView`에 전달)

| 컴포넌트                 | 위치          | 설명                                                                                                |
| ------------------------ | ------------- | --------------------------------------------------------------------------------------------------- |
| `memorial-view.tsx`      | `_component/` | 최상위 클라이언트 컴포넌트 — 선택된 반려동물 `id` 상태 관리, `PetProfileBar` + `MemorialSpace` 조합 |
| `pet-profile-bar.tsx`    | `_component/` | 상단 아바타 스크롤 바 (반려동물 선택 + 추가 버튼)                                                   |
| `memorial-space.tsx`     | `_component/` | 히어로 이미지 + 이름/날짜 + 소개 카드 + 받은 쪽지 버튼                                              |
| `flower-overlay.tsx`     | `_component/` | 이미지 위에 국화꽃 오버레이 (쪽지 수 기반)                                                          |
| `memorial-edit-card.tsx` | `_component/` | 한 줄 소개(epitaph) 편집 + 공개 설정 Switch (보기/수정 모드 전환)                                   |
| `message-inbox.tsx`      | `_component/` | 받은 쪽지함 Sheet (메시지 목록)                                                                     |

**빈 상태** — 추모공간 없을 때 로고 + "공간 만들기" 버튼

---

**`create/page.tsx`** — 추모공간 생성 (2단계 멀티스텝 폼)

폼 상태: react-hook-form + zod, 단일 스키마로 2단계 관리  
스키마 파일: `create/_component/schema.ts`

#### Zod 스키마 명세

```ts
// STEP 1 필드
petPhoto: z.instanceof(File); // 필수 — 반려동물 사진 (원형 업로드 버튼)
species: z.enum(['dog', 'cat']); // 필수 — 종 (강아지 / 고양이) 버튼 토글
breed: z.string().min(1); // 필수 — 품종 (species별 predefined SELECT + "기타" 선택 시 직접 입력 텍스트)
personalities: z.array(z.string()).optional(); // 선택 — 성격 태그 칩 (predefined + 직접 입력)
bgId: z.string().optional(); // 선택 — 원하는 배경 (7종 이미지 카드 중 선택)

// STEP 2 필드
petName: z.string().min(1).max(20); // 필수 — 반려동물 이름 (최대 20자)
birthDate: z.string().optional(); // 선택 — 태어난 날짜 날짜피커
deathDate: z.string().optional(); // 선택 — 보낸 날 날짜피커
memory: z.string().max(1000).optional(); // 선택 — 함께한 추억 (최대 1000자 textarea)
```

크로스 필드 검증: 둘 다 입력된 경우에만 `birthDate < deathDate` — zod `.refine()`으로 처리  
에러 메시지: "태어난 날은 보낸 날보다 이전이어야 해요"

#### 날짜 피커 disable 규칙

공용 `date-picker.tsx` (`create/_component/`)로 구현 — shadcn `Calendar` + `Popover` 래핑, `react-day-picker`의 `Matcher`를 `disabled` prop으로 받아 처리, 로케일은 `ko`.

- **태어난 날짜** 피커: `deathDate`가 입력된 경우 그 날짜 이후 disable
- **보낸 날** 피커: `birthDate`가 입력된 경우 그 날짜 이전 disable, 미래 날짜 항상 disable

#### 품종 목록 (predefined)

- **강아지**: 말티즈, 푸들, 시바견, 진돗개, 비숑 프리제, 포메라니안, 골든 리트리버, 닥스훈트, 믹스견, 기타
- **고양이**: 코리안 숏헤어, 페르시안, 러시안 블루, 먼치킨, 스코티시폴드, 노르웨이숲, 샴, 뱅갈, 믹스묘, 기타
- "기타" 선택 시 직접 입력 텍스트 필드 표시

#### 배경 목록 (7종)

`bgId` 값: `sky`, `flower-field`, `living-room`, `park`, `beach`, `sunny-window`, `snow-field`  
라벨: 하늘, 꽃밭, 거실 소파, 공원, 바닷가, 햇살 창가, 눈밭  
가로 스크롤 이미지 카드 형태, 선택 없이도 다음 가능

**STEP 1** — 사진 + 종/품종 + 성격 + 배경

| 컴포넌트                   | 위치                 | 설명                                                          |
| -------------------------- | -------------------- | ------------------------------------------------------------- |
| `create-memorial-form.tsx` | `create/_component/` | 전체 폼 컨테이너 (스텝 상태 관리, 스텝 전환)                  |
| `pet-photo-input.tsx`      | `create/_component/` | 반려동물 사진 업로드 (원형 카메라 버튼)                       |
| `species-selector.tsx`     | `create/_component/` | 종 선택 버튼 토글 (강아지 / 고양이만, 기타 없음)              |
| `breed-selector.tsx`       | `create/_component/` | species 기반 shadcn Select + "기타" 선택 시 텍스트 Input 노출 |
| `personality-selector.tsx` | `create/_component/` | 성격 태그 칩 다중 선택 + "직접 입력하기" 칩으로 커스텀 입력   |
| `background-selector.tsx`  | `create/_component/` | 7종 배경 이미지 카드 가로 스크롤 (선택 선택)                  |

→ "다음" 버튼 클릭 시 Step 1 필드 validate → Step 2로 이동

**STEP 2** — 상세 정보 입력

| 컴포넌트                     | 위치                 | 설명                                                                                                                |
| ---------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `memory-prompt-carousel.tsx` | `create/_component/` | 함께한 추억 예시 카드 자동 스크롤 캐러셀. 카드 클릭 시 memory 필드에 자동 입력                                      |
| `date-picker.tsx`            | `create/_component/` | 공용 날짜 피커 (shadcn Calendar + Popover, `ko` 로케일, `Matcher` 기반 disable) — 태어난 날짜/보낸 날 양쪽에서 사용 |

입력 필드 순서:

1. 반려동물 이름 (필수, max 20자)
2. 태어난 날짜 (선택)
3. 보낸 날 (선택) — 기존 "하늘나라 간 날짜"에서 명칭 변경
4. 함께한 추억 (선택, max 500자) — 위에 예시 카드 캐러셀 표시

> `create-loading-screen.tsx`는 플로우 변경으로 미사용 — 추후 정리 예정

---

### public-memorial 페이지 (`app/(main)/public-memorial/`)

**`page.tsx`** — 공개 추모공간 목록

| 컴포넌트                     | 위치          | 설명                                                |
| ---------------------------- | ------------- | --------------------------------------------------- |
| `public-memorial-header.tsx` | `_component/` | 오늘의 통계 ("오늘 N개 공간에 N송이 꽃이 놓였어요") |
| `species-filter.tsx`         | `_component/` | 종류 필터 칩 (전체 / 강아지 / 고양이)               |
| `memorial-grid.tsx`          | `_component/` | 3열 그리드 레이아웃                                 |
| `memorial-grid-card.tsx`     | `_component/` | 그리드 카드 (이미지 + 이름 + 날짜)                  |

**`[id]/page.tsx`** — 공개 추모공간 상세

| 컴포넌트                     | 위치          | 설명                                                  |
| ---------------------------- | ------------- | ----------------------------------------------------- |
| `public-memorial-detail.tsx` | `_component/` | 히어로 이미지 + 이름/날짜/한 줄 소개                  |
| `send-message-form.tsx`      | `_component/` | 쪽지 보내기 폼 (익명 체크박스 + textarea + 전송 버튼) |

---

### settings 페이지 (`app/(main)/settings/`)

**`page.tsx`** — 설정

| 컴포넌트                | 위치          | 설명                                                   |
| ----------------------- | ------------- | ------------------------------------------------------ |
| `profile-section.tsx`   | `_component/` | 사용자 프로필 (아바타 + 이름 + 카카오 로그인 표시)     |
| `sent-message-list.tsx` | `_component/` | 내가 보낸 쪽지 목록 (toPetName + 내용 미리보기 + 날짜) |
| `logout-section.tsx`    | `_component/` | 로그아웃 버튼 + 확인 Dialog                            |

---

### 타입 추가 필요 (`types/memorial.ts`)

현재 타입에서 시안 기준으로 추가 필요한 필드:

```ts
// MemorialProfile에 추가
epitaph?: string;        // 한 줄 소개 (최대 40자)
personalities?: string[]; // 성격 태그
memory?: string;         // 함께한 추억

// PublicMemorial (별도 타입)
species: 'dog' | 'cat';
flowers: number;         // 총 꽃 수
recentFlowers: number;   // 오늘 꽃 수
userPhotos?: string[];   // 사용자 업로드 사진들

// SentMessage (설정 페이지용)
toPetName: string;
anonymous: boolean;
preview: string;
sentAt: string;
```

---

## 인증 (Auth)

**better-auth** + **MySQL**(mysql2 pool) + **카카오 소셜 로그인** 단독 구성.

| 파일                             | 역할                                                                             |
| -------------------------------- | -------------------------------------------------------------------------------- |
| `lib/auth/auth.ts`               | 서버 — `betterAuth()` 설정, `mysql2/promise` pool 연결, 카카오 `socialProviders` |
| `lib/auth/auth-client.ts`        | 클라이언트 — `authClient`, `signIn`/`signOut`/`useSession` 헬퍼 export           |
| `app/api/auth/[...all]/route.ts` | better-auth 핸들러 (모든 인증 요청 처리)                                         |

### 보호된 페이지 패턴

```tsx
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth/auth';

export default async function ProtectedPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect('/login');
  }

  // session.user 사용
}
```

### 필요 환경 변수 (`.env`)

```
DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
KAKAO_CLIENT_ID=
KAKAO_CLIENT_SECRET=
```

---

## API 연동 (참고용)

- API는 `app/api/` 하위 `route.ts` 파일로 구성
- 현재 UI 작업 단계에서는 mock 데이터 또는 props로 처리
- 실제 연동 시 Server Action 또는 fetch 사용

---

## 커밋 메시지 컨벤션

```
[태그] 내용
```

| 태그         | 용도                          |
| ------------ | ----------------------------- |
| `[feat]`     | 새 기능 추가                  |
| `[fix]`      | 버그 수정                     |
| `[refactor]` | 기능 변경 없는 코드 구조 개선 |
| `[style]`    | UI/스타일 변경                |
| `[chore]`    | 설정, 패키지, 기타 작업       |
| `[docs]`     | 문서 작성/수정                |

예시:

```
[feat] 추모 공간 생성 폼 추가
[fix] 메시지 인박스 Sheet width 수정
[refactor] 컴포넌트 _component 폴더 구조로 이동
```

---

## 개발 스킬 (Claude Code)

작업 시 아래 5개 스킬을 항상 사용한다.

- `agent-browser`
- `superpowers`
- `typescript-lsp`
- `vercel-react-best-practices`
- `vercel-composition-patterns`

---

## 코드 품질

- **중복 코드 금지** — 재사용 가능한 부분은 컴포넌트로 분리
- **재사용성 우선** — 컴포넌트 설계 시 props로 유연하게
- 불필요한 주석 달지 않기
- 로직이 자명하지 않을 때만 주석 추가
