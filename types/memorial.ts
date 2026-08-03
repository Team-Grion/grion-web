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

export interface Message {
  id: string;
  senderName: string;
  content: string;
  sentAt: string; // ISO 8601
}

export interface SentMessage {
  id: string;
  toPetName: string;
  anonymous: boolean;
  preview: string;
  sentAt: string; // ISO 8601
}
