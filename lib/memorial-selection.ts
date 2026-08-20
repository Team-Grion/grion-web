/**
 * 내 추모공간에서 마지막으로 보던 반려동물을 세션에 남긴다.
 * memorial-view.tsx(선택 유지)와 create-memorial-form.tsx(생성 직후 선택)
 * 양쪽에서 같이 쓰기 때문에 별도 모듈로 뺐다 — 순환 참조 없이 공유 가능하다.
 *
 * sessionStorage 접근은 프라이버시 모드나 서드파티 스토리지 차단 환경에서
 * SecurityError를 던질 수 있어 항상 try/catch로 감싼다. 실패해도 "선택
 * 유지"는 부가 기능일 뿐이라, 조용히 무시하고 기본 동작(목록 첫 번째)으로
 * 흘러가게 둔다.
 */
const SELECTED_PET_STORAGE_KEY = 'grion:memorial-selected-pet-id';

export function readStoredMemorialSelection(): number | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = Number(sessionStorage.getItem(SELECTED_PET_STORAGE_KEY));
    return Number.isInteger(stored) && stored > 0 ? stored : null;
  } catch {
    return null;
  }
}

export function storeMemorialSelection(petId: number | null): void {
  if (typeof window === 'undefined') return;

  try {
    if (petId === null) {
      sessionStorage.removeItem(SELECTED_PET_STORAGE_KEY);
    } else {
      sessionStorage.setItem(SELECTED_PET_STORAGE_KEY, String(petId));
    }
  } catch {
    // 무시 — 위 설명대로 부가 기능이라 실패해도 흐름을 막지 않는다
  }
}
