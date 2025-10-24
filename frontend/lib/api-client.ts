/**
 * API 클라이언트 유틸리티
 * 모든 백엔드 API 호출을 위한 중앙화된 클라이언트
 */

import { API_BASE_URL } from './config'

interface ApiClientOptions extends RequestInit {
  requireAuth?: boolean
}

/**
 * API 호출을 위한 중앙화된 클라이언트
 * 자동으로 인증 토큰을 추가하고 에러 처리를 수행합니다.
 */
export async function apiClient(
  endpoint: string,
  options: ApiClientOptions = {}
): Promise<Response> {
  const { requireAuth = false, headers = {}, ...restOptions } = options

  // 기본 헤더 설정
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  // 추가 헤더 병합
  if (headers) {
    Object.entries(headers).forEach(([key, value]) => {
      if (typeof value === 'string') {
        defaultHeaders[key] = value
      }
    })
  }

  // 인증이 필요한 경우 토큰 추가
  if (requireAuth && typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`
    }
  }

  // API 호출
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...restOptions,
    headers: defaultHeaders,
  })

  return response
}

/**
 * GET 요청 헬퍼
 */
export async function get(endpoint: string, requireAuth = false) {
  return apiClient(endpoint, { method: 'GET', requireAuth })
}

/**
 * POST 요청 헬퍼
 */
export async function post(
  endpoint: string,
  data: any,
  requireAuth = false
) {
  return apiClient(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
    requireAuth,
  })
}

/**
 * PUT 요청 헬퍼
 */
export async function put(
  endpoint: string,
  data: any,
  requireAuth = false
) {
  return apiClient(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
    requireAuth,
  })
}

/**
 * DELETE 요청 헬퍼
 */
export async function del(endpoint: string, requireAuth = false) {
  return apiClient(endpoint, {
    method: 'DELETE',
    requireAuth,
  })
}

/**
 * 인증된 GET 요청 (토큰 자동 추가)
 */
export async function authGet(endpoint: string) {
  return get(endpoint, true)
}

/**
 * 인증된 POST 요청 (토큰 자동 추가)
 */
export async function authPost(endpoint: string, data: any) {
  return post(endpoint, data, true)
}

/**
 * 인증된 PUT 요청 (토큰 자동 추가)
 */
export async function authPut(endpoint: string, data: any) {
  return put(endpoint, data, true)
}

/**
 * 인증된 DELETE 요청 (토큰 자동 추가)
 */
export async function authDelete(endpoint: string) {
  return del(endpoint, true)
}

