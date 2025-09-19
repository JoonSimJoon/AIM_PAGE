// 공통 타입 정의

export interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemberProfile {
  id: string;
  userId: string;
  displayName: string;
  oneLiner?: string;
  avatarKey?: string;
  links?: any;
  isPublic: boolean;
}

export interface StudyPost {
  id: string;
  studyId: string;
  authorId: string;
  title: string;
  contentMd: string;
  coverKey?: string;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
  author?: {
    id: string;
    name?: string;
    profile?: MemberProfile;
  };
  tags?: StudyPostTag[];
}

export interface Tag {
  id: string;
  name: string;
}

export interface StudyPostTag {
  postId: string;
  tagId: string;
  tag?: Tag;
}

export interface Activity {
  id: string;
  title: string;
  category: string;
  date: string;
  description?: string;
  galleryKeys?: any;
}

export interface Award {
  id: string;
  title: string;
  issuer?: string;
  date: string;
  team?: any;
  description?: string;
  link?: string;
}

export interface HistoryEvent {
  id: string;
  year: number;
  month?: number;
  title: string;
  description?: string;
}

export interface RecruitNotice {
  id: string;
  title: string;
  bodyMd: string;
  startAt: string;
  endAt: string;
  isOpen: boolean;
  externalFormUrl?: string;
}

// API 응답 타입
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// 페이지네이션
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 업로드 관련
export interface UploadUrlResponse {
  url: string;
  key: string;
}

export interface S3UploadTarget {
  target: 'avatar' | 'post' | 'temp';
  postId?: string;
  mime: string;
  ext: string;
}
