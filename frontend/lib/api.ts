import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Axios 인스턴스 생성
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 토큰 자동 첨부 인터셉터
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// 응답 인터셉터 (에러 처리)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료 시 로그아웃 처리
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/auth/signin';
      }
    }
    return Promise.reject(error);
  }
);

// API 함수들
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),
  
  register: (email: string, password: string, name: string) =>
    api.post('/api/auth/register', { email, password, name }),
  
  getMe: () => api.get('/api/auth/me'),
};

export const studiesAPI = {
  getPosts: () => api.get('/api/studies/posts'),
  
  getPost: (id: string) => api.get(`/api/studies/posts/${id}`),
  
  createPost: (data: {
    title: string;
    contentMd: string;
    coverKey?: string;
    tags?: string[];
    studyId?: string;
  }) => api.post('/api/studies/posts', data),
  
  updatePost: (id: string, data: {
    title?: string;
    contentMd?: string;
    coverKey?: string;
    status?: string;
  }) => api.put(`/api/studies/posts/${id}`, data),
  
  deletePost: (id: string) => api.delete(`/api/studies/posts/${id}`),
};

export const uploadAPI = {
  getUploadUrl: (data: {
    target: 'avatar' | 'post' | 'temp';
    postId?: string;
    mime: string;
    ext: string;
  }) => api.post('/api/upload/url', data),
  
  copyObject: (fromKey: string, toKey: string) =>
    api.post('/api/upload/copy', { fromKey, toKey }),
};

export const activitiesAPI = {
  getActivities: () => api.get('/api/activities'),
  getActivity: (id: string) => api.get(`/api/activities/${id}`),
};

export const membersAPI = {
  getMembers: () => api.get('/api/members'),
  getMember: (id: string) => api.get(`/api/members/${id}`),
};
