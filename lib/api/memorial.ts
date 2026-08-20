import type { ApiResponse } from '@/types/api';
import type {
  PetLetter,
  PetMemorialDetail,
  PetMemorialSummary,
} from '@/types/memorial';

import { apiClient } from '@/lib/api/client';

interface PetPrivateMemorialListResponse {
  memorials: PetMemorialSummary[];
}

/** 내 추모 공간 목록. 아직 만든 공간이 없으면 빈 배열이다. */
export async function getMyMemorials(): Promise<PetMemorialSummary[]> {
  const response =
    await apiClient.get<ApiResponse<PetPrivateMemorialListResponse>>(
      '/memorials/me',
    );

  return response.data.data?.memorials ?? [];
}

/** 추모 공간 상세. 목록에 없는 날짜/소개/공개 여부가 여기에만 있다. */
export async function getMemorialDetail(
  petId: number,
): Promise<PetMemorialDetail> {
  const response = await apiClient.get<ApiResponse<PetMemorialDetail>>(
    `/memorials/me/${petId}`,
  );

  const { data, message } = response.data;
  if (!data) {
    throw new Error(message ?? '추모 공간을 찾을 수 없어요');
  }
  return data;
}

interface PetLetterListResponse {
  petId: number;
  letters: PetLetter[];
}

/** 받은 쪽지 목록. 쪽지함을 열 때만 부른다 — 개수는 상세 응답에 이미 있다. */
export async function getMemorialLetters(petId: number): Promise<PetLetter[]> {
  const response = await apiClient.get<ApiResponse<PetLetterListResponse>>(
    `/memorials/me/${petId}/letters`,
  );

  return response.data.data?.letters ?? [];
}

/** AI 이미지 생성 진행 상태 */
export type MemorialStatus = 'PENDING' | 'SUCCESS' | 'FAIL';

export interface CreateMemorialPayload {
  petPhoto: File;
  species: string;
  breed: string;
  personalities: string[];
  background: string;
}

/**
 * 추모 공간을 만들고 AI 이미지 생성을 시작한다.
 * 응답은 즉시 오지만 이미지는 아직 없다 — status로 진행 상황을 확인한다.
 */
export async function createMemorial({
  petPhoto,
  species,
  breed,
  personalities,
  background,
}: CreateMemorialPayload): Promise<{ petId: number; status: MemorialStatus }> {
  const params = new URLSearchParams({ species, breed, background });
  // 배열은 같은 이름의 파라미터를 값마다 반복한다
  personalities.forEach((personality) =>
    params.append('personalities', personality),
  );

  const formData = new FormData();
  // 파트 이름이 URL 같지만 실제로는 파일이다
  formData.append('petImageUrl', petPhoto);

  const response = await apiClient.post<
    ApiResponse<{ petId: number; status: MemorialStatus }>
  >(`/memorials?${params}`, formData);

  const { data, message } = response.data;
  if (!data) {
    throw new Error(message ?? '추모 공간을 만들지 못했어요');
  }
  return data;
}

export interface AddMemorialInfoPayload {
  petName: string;
  birthDate: string;
  deathDate: string;
  memory?: string;
}

export async function addMemorialInfo(
  petId: number,
  payload: AddMemorialInfoPayload,
): Promise<void> {
  await apiClient.post<ApiResponse<unknown>>(
    `/memorials/${petId}/add`,
    payload,
  );
}

/** AI 이미지 생성 진행 상황. 작업이 없으면 404가 아니라 400이 온다. */
export async function getMemorialStatus(
  petId: number,
): Promise<MemorialStatus> {
  const response = await apiClient.get<ApiResponse<{ status: MemorialStatus }>>(
    `/memorials/${petId}/status`,
  );

  const { data, message } = response.data;
  if (!data) {
    throw new Error(message ?? '생성 상태를 확인하지 못했어요');
  }
  return data.status;
}

export interface UpdateMemorialPayload {
  content: string;
  isPublic: boolean;
}

/** 한 줄 소개와 공개 여부를 함께 수정한다. 둘 중 하나만 바꿔도 전체를 보낸다. */
export async function updateMemorial(
  petId: number,
  payload: UpdateMemorialPayload,
): Promise<void> {
  await apiClient.patch<ApiResponse<unknown>>(
    `/memorials/me/${petId}`,
    payload,
  );
}

/** 추모 공간을 삭제한다(소프트 삭제). 되돌릴 수 없으므로 호출 전 확인 다이얼로그를 거친다. */
export async function deleteMemorial(petId: number): Promise<void> {
  await apiClient.delete<ApiResponse<unknown>>(`/memorials/me/${petId}/delete`);
}
