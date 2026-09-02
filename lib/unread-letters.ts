/**
 * 받은 쪽지함 아이콘에 "안 읽은 쪽지가 있다"는 걸 보여주기 위한 헬퍼.
 *
 * 서버에 읽음/안읽음 개념이 없어서(letterCount는 총합일 뿐) 프론트에서
 * 반려동물별로 "마지막으로 쪽지함을 열었을 때의 쪽지 수"를 캐시해두고,
 * 지금 쪽지 수가 그보다 많으면 안 읽은 쪽지가 있다고 취급한다.
 *
 * localStorage 접근은 프라이버시 모드 등에서 SecurityError를 던질 수
 * 있어 항상 try/catch로 감싼다. 실패해도 부가 기능일 뿐이라 조용히
 * 무시하고 "안 읽음 없음"으로 흘러가게 둔다.
 */
const SEEN_KEY_PREFIX = 'grion:seen-letters:';

function readSeenCount(petId: number): number {
  if (typeof window === 'undefined') return 0;

  try {
    const value = Number(localStorage.getItem(`${SEEN_KEY_PREFIX}${petId}`));
    return Number.isFinite(value) && value >= 0 ? value : 0;
  } catch {
    return 0;
  }
}

export function hasUnreadLetters(petId: number, currentCount: number): boolean {
  return currentCount > readSeenCount(petId);
}

/** 쪽지함을 열어 실제로 확인했을 때 호출해 지금까지의 쪽지를 읽음 처리한다 */
export function markLettersSeen(petId: number, currentCount: number): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(`${SEEN_KEY_PREFIX}${petId}`, String(currentCount));
  } catch {
    // 무시 — 위 설명대로 부가 기능이라 실패해도 흐름을 막지 않는다
  }
}
