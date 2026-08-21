/** 서버가 모든 응답을 감싸는 공통 래퍼 */
export interface ApiResponse<T> {
  status: 'SUCCESS' | 'FAIL';
  statusCode: number;
  data: T | null;
  message: string | null;
}
