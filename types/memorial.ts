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

export interface MemorialProfile {
  id: string;
  petName: string;
  birthDate: string; // "YYYY-MM-DD"
  deathDate: string; // "YYYY-MM-DD"
  userImageUrl: string; // 사용자가 업로드한 반려동물 사진
  aiImageUrl: string; // AI가 생성한 추모 이미지
  isPublic: boolean;
  epitaph?: string; // 한 줄 소개 (최대 40자, 공개 추모 공간에 노출)
  personalities?: string[]; // 성격 태그
  memory?: string; // 함께한 추억
}

export type MemorialsResponse = MemorialProfile[] | null;

export interface PublicMemorial extends MemorialProfile {
  species: 'dog' | 'cat';
  flowers: number; // 총 꽃 수
  recentFlowers: number; // 오늘 꽃 수
  userPhotos?: string[]; // 사용자 업로드 사진들
}

/** GET /memorials/me/{petId}/letters */
export interface PetLetter {
  letterId: number;
  senderName: string;
  content: string;
  createdAt: string; // ISO 8601
}

export interface SentMessage {
  id: string;
  toPetName: string;
  anonymous: boolean;
  preview: string;
  sentAt: string; // ISO 8601
}
