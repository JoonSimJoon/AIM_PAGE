// 클라이언트 사이드 인증 유틸리티
export interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

// 토큰 저장/조회
export const tokenStorage = {
  get: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  },
  
  set: (token: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('token', token);
  },
  
  remove: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('token');
  },
};

// JWT 토큰 디코딩 (간단한 버전)
export const decodeToken = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

// 토큰 유효성 검사
export const isTokenValid = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) return false;
  
  const currentTime = Date.now() / 1000;
  return decoded.exp > currentTime;
};
