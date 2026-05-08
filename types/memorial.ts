export interface MemorialProfile {
  id: string;
  petName: string;
  deathDate: string; // "YYYY-MM-DD"
  userImageUrl: string; // 사용자가 업로드한 반려동물 사진
  aiImageUrl: string; // AI가 생성한 추모 이미지
  isPublic: boolean;
}

export type MemorialsResponse = MemorialProfile[] | null;

export interface Message {
  id: string;
  senderName: string;
  content: string;
  sentAt: string; // ISO 8601
}
