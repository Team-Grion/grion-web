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
