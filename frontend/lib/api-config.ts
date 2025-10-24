/**
 * API 설정 (서버 사이드용)
 * Next.js API Routes에서 백엔드를 호출할 때 사용
 */

// 서버 사이드에서는 Docker 내부 네트워크 주소(BACKEND_URL) 사용
// 개발 환경에서는 localhost 사용
export const getBackendUrl = () => {
  // Docker 환경인 경우
  if (process.env.BACKEND_URL) {
    return process.env.BACKEND_URL
  }
  
  // 로컬 개발 환경
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL
  }
  
  // 기본값
  return 'http://localhost:3001'
}

export const BACKEND_URL = getBackendUrl()

