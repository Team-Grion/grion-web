# 그리온 (Grion) — 개발 컨벤션

반려동물 추모 플랫폼. 모바일 폭 제한 웹 서비스.

---

## 기술 스택

| 항목 | 내용 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) |
| 언어 | TypeScript 5 |
| UI 라이브러리 | React 19 |
| 스타일링 | Tailwind CSS v4 |
| 컴포넌트 | shadcn/ui (최대한 활용) |
| 아이콘 | lucide-react (커스텀 SVG 사용 금지) |
| 폼 | react-hook-form + zod + @hookform/resolvers |
| 인증 | better-auth |

---

## 레이아웃 원칙

- 웹 서비스지만 **모바일 폰 화면처럼 세로로 긴 레이아웃** (width 제한)
- 최대 너비: `max-w-[600px]` 기준 (현재 bottom-nav 기준 `max-w-150`)
- Sheet, Dialog, Drawer 등 오버레이 컴포넌트 추가 시 **반드시 width 제한 적용**
  - Sheet 예시: `className="max-w-[600px] mx-auto"` 등 width 맞춰야 함
- 하단 네비게이션 고려해 `pb-16` 확보

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

<div className={cn('base-class', isActive && 'active-class')} />
```

---

## 컬러 시스템

시안 기반 따뜻한 크림/브라운 팔레트. `globals.css`에 CSS 변수로 추가.

| 토큰 | Hex | 용도 |
|------|-----|------|
| `--color-cream` | `#faf9f5` | 전체 배경 |
| `--color-peach` | `#FFEFD5` | 카드/섹션 배경 |
| `--color-tan` | `#D2B48C` | 포인트/보조 |
| `--color-warm-white` | `#FAF7F1` | 컴포넌트 내부 배경 |
| `--color-brown` | `#5C4830` | 텍스트/주요 액션 |

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

```
1. react
2. next
3. (공백)
4. 빌트인 모듈
5. 서드파티 모듈
6. (공백)
7. @/types
8. @/lib
9. @/hooks
10. @/actions
11. (공백)
12. @/components/ui
13. @/components
14. (공백)
15. 상대경로
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

<Flower2 className="h-5 w-5" />
```

---

## 폼

- **react-hook-form** + **zod** + **@hookform/resolvers** 조합 사용
- zod 스키마는 `lib/validation/` 또는 해당 페이지 `_component/` 폴더 내 별도 파일로 분리
- shadcn `Form`, `FormField`, `FormItem`, `FormLabel`, `FormMessage` 컴포넌트 활용

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

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { exampleSchema, type ExampleFormValues } from './validation';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function ExampleForm() {
  const form = useForm<ExampleFormValues>({
    resolver: zodResolver(exampleSchema),
    defaultValues: { name: '' },
  });

  function onSubmit(values: ExampleFormValues) {
    // API 연동 시 여기서 처리
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이름</FormLabel>
              <Input {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">제출</Button>
      </form>
    </Form>
  );
}
```

---

## 화면별 컴포넌트 목록 (시안 기준)

### 온보딩 / 로그인 (`app/(auth)/`)

**`onboarding/page.tsx`** — 첫 방문 온보딩 캐러셀 (신규 유저 진입점)

| 컴포넌트 | 위치 | 설명 |
|---------|------|------|
| `onboarding-carousel.tsx` | `_component/` | 4슬라이드 스와이프 캐러셀 (터치 스와이프 + 좌우 화살표 + 도트 페이지네이션) |
| `onboarding-slide.tsx` | `_component/` | 슬라이드 1장 (비주얼 이미지 + 제목 + 본문) |
| `kakao-login-button.tsx` | `_component/` | 카카오 로그인 CTA 버튼 (노란 배경, 카카오 심볼) |

슬라이드 4개:
1. **intro** — "다시 만나는 작은 공간" / 그리온 로고 비주얼
2. **ai** — "사진으로 다시 그려요" / 전후 사진 비교 비주얼
3. **memorial** — "기억을 오래 간직해요" / 추모공간 비주얼
4. **share** — "마음을 나눠요" / 공유 비주얼

우상단 `건너뛰기` 버튼 → 마지막 슬라이드로 이동  
하단 카카오 로그인 버튼은 모든 슬라이드에서 고정 노출  
배경: `radial-gradient(ellipse at top, #FFF8EC 0%, #FAF7F1 60%)`

**`login/page.tsx`** — 소셜 로그인 (카카오 단독)

---

### 공통 컴포넌트 (`components/`)

| 컴포넌트 | 설명 |
|---------|------|
| `bottom-nav.tsx` | 하단 탭 네비게이션 (memorial / public-memorial / settings) |
| `top-app-bar.tsx` | 상단 앱바 — brand 모드(로고) 단일 모드 |
| `toast.tsx` | 바텀 토스트 알림 (성공/실패) — 쪽지 전송 후 노출 |

---

### memorial 페이지 (`app/(main)/memorial/`)

**`page.tsx`** — 내 추모공간 메인

| 컴포넌트 | 위치 | 설명 |
|---------|------|------|
| `pet-profile-bar.tsx` | `_component/` | 상단 아바타 스크롤 바 (반려동물 선택 + 추가 버튼) |
| `memorial-space.tsx` | `_component/` | 히어로 이미지 + 이름/날짜 + 소개 카드 + 받은 쪽지 버튼 |
| `flower-overlay.tsx` | `_component/` | 이미지 위에 국화꽃 오버레이 (쪽지 수 기반) |
| `memorial-edit-card.tsx` | `_component/` | 한 줄 소개(epitaph) 편집 + 공개 설정 Switch (보기/수정 모드 전환) |
| `message-inbox.tsx` | `_component/` | 받은 쪽지함 Sheet (메시지 목록) |

**빈 상태** — 추모공간 없을 때 로고 + "공간 만들기" 버튼

---

**`create/page.tsx`** — 추모공간 생성

| 컴포넌트 | 위치 | 설명 |
|---------|------|------|
| `create-memorial-form.tsx` | `create/_component/` | 전체 폼 컨테이너 |
| `pet-photo-input.tsx` | `create/_component/` | 반려동물 사진 업로드 (원형 카메라 버튼) |
| `personality-selector.tsx` | `create/_component/` | 성격 태그 다중 선택 (Toggle 칩) |
| `create-loading-screen.tsx` | `create/_component/` | 제출 후 AI 생성 대기 화면 (PawTrailLoader 애니메이션) |
| `waiting-letter-screen.tsx` | `create/_component/` | AI 생성 완료 후 편지 작성 화면 (생성 완료 배너 + textarea) |

---

### public-memorial 페이지 (`app/(main)/public-memorial/`)

**`page.tsx`** — 공개 추모공간 목록

| 컴포넌트 | 위치 | 설명 |
|---------|------|------|
| `public-memorial-header.tsx` | `_component/` | 오늘의 통계 ("오늘 N개 공간에 N송이 꽃이 놓였어요") |
| `species-filter.tsx` | `_component/` | 종류 필터 칩 (전체 / 강아지 / 고양이) |
| `memorial-grid.tsx` | `_component/` | 3열 그리드 레이아웃 |
| `memorial-grid-card.tsx` | `_component/` | 그리드 카드 (이미지 + 이름 + 날짜) |

**`[id]/page.tsx`** — 공개 추모공간 상세

| 컴포넌트 | 위치 | 설명 |
|---------|------|------|
| `public-memorial-detail.tsx` | `_component/` | 히어로 이미지 + 이름/날짜/한 줄 소개 |
| `send-message-form.tsx` | `_component/` | 쪽지 보내기 폼 (익명 체크박스 + textarea + 전송 버튼) |

---

### settings 페이지 (`app/(main)/settings/`)

**`page.tsx`** — 설정

| 컴포넌트 | 위치 | 설명 |
|---------|------|------|
| `profile-section.tsx` | `_component/` | 사용자 프로필 (아바타 + 이름 + 카카오 로그인 표시) |
| `sent-message-list.tsx` | `_component/` | 내가 보낸 쪽지 목록 (toPetName + 내용 미리보기 + 날짜) |
| `logout-section.tsx` | `_component/` | 로그아웃 버튼 + 확인 Dialog |

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

## API 연동 (참고용)

- API는 `app/api/` 하위 `route.ts` 파일로 구성
- 현재 UI 작업 단계에서는 mock 데이터 또는 props로 처리
- 실제 연동 시 Server Action 또는 fetch 사용

---

## 커밋 메시지 컨벤션

```
[태그] 내용
```

| 태그 | 용도 |
|------|------|
| `[feat]` | 새 기능 추가 |
| `[fix]` | 버그 수정 |
| `[refactor]` | 기능 변경 없는 코드 구조 개선 |
| `[style]` | UI/스타일 변경 |
| `[chore]` | 설정, 패키지, 기타 작업 |
| `[docs]` | 문서 작성/수정 |

예시:
```
[feat] 추모 공간 생성 폼 추가
[fix] 메시지 인박스 Sheet width 수정
[refactor] 컴포넌트 _component 폴더 구조로 이동
```

---

## 코드 품질

- **중복 코드 금지** — 재사용 가능한 부분은 컴포넌트로 분리
- **재사용성 우선** — 컴포넌트 설계 시 props로 유연하게
- 불필요한 주석 달지 않기
- 로직이 자명하지 않을 때만 주석 추가
