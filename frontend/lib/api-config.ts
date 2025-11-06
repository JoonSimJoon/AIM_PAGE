/**
 * API 설정 (서버 사이드용)
 * Next.js API Routes에서 백엔드를 호출할 때 사용
 */

// 서버 사이드에서는 Docker 내부 네트워크 주소(BACKEND_URL) 사용
// 개발 환경에서는 localhost 사용
export const getBackendUrl = () => {
  let url: string
  
  // Docker 환경인 경우
  if (process.env.BACKEND_URL) {
    url = process.env.BACKEND_URL
  }
  // 로컬 개발 환경
  else if (process.env.NEXT_PUBLIC_API_URL) {
    url = process.env.NEXT_PUBLIC_API_URL
  }
  // 기본값
  else {
    url = 'http://localhost:3001'
  }
  
  // 끝의 슬래시 제거 (이중 슬래시 방지)
  return url.replace(/\/+$/, '')
}

export const BACKEND_URL = getBackendUrl()

