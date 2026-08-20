/** GET /memorials/me — 목록에는 요약 정보만 내려온다 */
export interface PetMemorialSummary {
  petId: number;
  petName: string;
  aiImageUrl: string;
}

/** GET /memorials/me/{petId} */
export interface PetMemorialDetail {
  petId: number;
  petName: string;
  // AI 이미지 생성이 끝나기 전에는 비어 있을 수 있다
  aiImageUrl: string | null;
  birthDate: string | null; // "YYYY-MM-DD"
  deathDate: string | null;
  letterCount: number;
  content: string | null; // 한 줄 소개
  isPublic: boolean;
}

/** GET /memorials/public 응답의 오늘의 통계 */
export interface PetMemorialPublicTodaySummary {
  memorialCount: number;
  messageCount: number;
}

/** GET /memorials/public — 목록에는 요약 정보만 내려온다 */
export interface PetMemorialPublicSummary {
  petId: number;
  petName: string;
  aiImageUrl: string | null;
  birthDate: string | null; // "YYYY-MM-DD"
  deathDate: string | null;
  introduction: string | null; // 한 줄 소개
  personalities: string[];
  todayMessageCount: number;
  totalMessageCount: number;
}

/**
 * GET /memorials/public/{petId}
 * 목록과 달리 introduction/쪽지 수가 아직 안 내려온다 — 백엔드 확인 필요.
 */
export interface PetMemorialPublicDetail {
  petId: number;
  petName: string;
  userName: string;
  aiImageUrl: string | null;
  birthDate: string | null;
  deathDate: string | null;
  personalities: string[];
}

/** GET /memorials/me/{petId}/letters */
export interface PetLetter {
  letterId: number;
  senderName: string;
  content: string;
  createdAt: string; // ISO 8601
}

/** GET /users/me — 내가 보낸 쪽지 */
export interface UserLetterSummary {
  letterId: number;
  petId: number;
  petName: string;
  isAnonymous: boolean;
  content: string;
  createdAt: string; // ISO 8601
  // 주인이 비공개로 돌리면 공개 추모공간에 들어갈 수 없다.
  // 서버 배포 전에는 내려오지 않아 optional로 둔다.
  isPetPublic?: boolean;
}

/** GET /users/me */
export interface UserPage {
  userId: number;
  name: string;
  profileImageUrl: string | null;
  totalCount: number;
  letters: UserLetterSummary[];
}
