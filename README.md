# 동아리 웹사이트 (모노레포)

동아리 외부 홍보 및 내부 부원 관리/활동 공유를 위한 웹사이트입니다.

## 기술 스택

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL (Supabase)
- **Authentication**: JWT (with React Context API)
- **Storage**: AWS S3 + CloudFront
- **ORM**: Prisma
- **State Management**: React Context API
- **API Client**: Centralized API client with environment-based URLs

## 프로젝트 구조

```
├── frontend/              # Next.js 프론트엔드
│   ├── app/              # Next.js App Router
│   ├── lib/              # 클라이언트 유틸리티
│   ├── components/       # React 컴포넌트
│   └── types/           # 프론트엔드 타입 정의
├── backend/              # Express.js 백엔드
│   ├── src/
│   │   ├── routes/      # API 라우트
│   │   ├── controllers/ # 컨트롤러
│   │   ├── services/    # 비즈니스 로직
│   │   ├── middleware/  # 미들웨어
│   │   └── utils/       # 유틸리티 함수
│   └── prisma/          # 데이터베이스 스키마
├── shared/               # 공유 타입 및 유틸리티
│   └── src/
│       └── types.ts     # 공통 타입 정의
├── docker/               # Docker 설정 관리
│   ├── dev/             # 개발 환경 설정
│   ├── prod/            # 프로덕션 환경 설정
│   └── nginx/           # Nginx 설정
├── Makefile             # 편리한 명령어 모음
└── package.json         # 모노레포 설정
```

## 시작하기

### 🐳 Docker로 시작하기 (권장)

#### 1. 프로젝트 초기 설정
```bash
make setup
```

#### 2. 환경 변수 설정
`docker/dev/.env` 파일을 열어 AWS S3 설정을 입력하세요:
```bash
AWS_REGION=ap-northeast-2
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=your-bucket-name
```

#### 3. 개발 서버 실행
```bash
# Docker로 전체 스택 실행
make dev-docker

# 또는 백그라운드에서 실행
make dev-docker-bg
```

#### 4. 데이터베이스 설정
```bash
# 컨테이너가 실행된 후
make db-setup
```

#### 5. 접속
- 프론트엔드: [http://localhost:3000](http://localhost:3000)
- 백엔드 API: [http://localhost:3001](http://localhost:3001)
- Prisma Studio: `make db-studio`

### 📋 주요 명령어

```bash
make help          # 모든 명령어 보기
make dev-docker     # Docker 개발 환경 실행
make logs           # 로그 보기
make stop           # 개발 환경 중지
make clean          # Docker 리소스 정리
make db-setup       # 데이터베이스 설정
make db-studio      # Prisma Studio 실행
```

### 💻 로컬 개발 (Docker 없이)

#### 1. 의존성 설치
```bash
npm run install:all
```

#### 2. PostgreSQL 설치 및 실행
로컬에 PostgreSQL을 설치하고 데이터베이스를 생성하세요.

#### 3. 환경 변수 설정
각 폴더의 `env.example` 파일을 참고하여 환경 변수를 설정하세요:
- `frontend/.env.local`
- `backend/.env`

#### 4. 데이터베이스 설정
```bash
cd backend
npm run db:generate
npm run db:push
```

#### 5. 개발 서버 실행
```bash
npm run dev
```

## 주요 기능

### 게스트 (비로그인 사용자)
- 메인 페이지 및 동아리 소개
- 동아리 역사 및 활동 기록 조회
- 공개 스터디 글 조회

### 로그인 사용자 (동아리 부원)
- 프로필 관리
- 스터디 글 작성/수정/삭제
- 외부 블로그 글 링크 연동

### 운영진
- 동아리 활동/수상 경력 관리
- 모집 공고 관리
- 전체 콘텐츠 관리

## 아키텍처 개선 사항

### ✅ 최근 개선 완료 (2025년 10월)

#### 1. **중앙화된 API 클라이언트**
- ❌ Before: 하드코딩된 `http://localhost:3001` URL 34개 파일에 분산
- ✅ After: `lib/api-client.ts`로 모든 API 호출 통합
- **혜택**: 
  - 환경 변수로 API URL 관리
  - 자동 인증 토큰 추가
  - 일관된 에러 처리
  - 배포 환경별 URL 자동 전환

```typescript
// Before
fetch('http://localhost:3001/api/members', {
  headers: { 'Authorization': `Bearer ${token}` }
})

// After
import { authGet } from '@/lib/api-client'
authGet('/api/members')
```

#### 2. **전역 인증 상태 관리 (Auth Context)**
- ❌ Before: 27개 파일에서 `localStorage` 직접 접근
- ✅ After: React Context API로 전역 인증 상태 관리
- **혜택**:
  - 단일 진실 공급원 (Single Source of Truth)
  - 자동 로그인/로그아웃 처리
  - 인증 상태 동기화
  - 코드 중복 제거

```typescript
// Before
const token = localStorage.getItem('token')
const user = JSON.parse(localStorage.getItem('user'))

// After
import { useAuth } from '@/contexts/AuthContext'
const { user, token, isAuthenticated, isAdmin, login, logout } = useAuth()
```

#### 3. **백업 파일 정리**
- 7개 불필요한 백업 파일 제거 (`.bak`, `_old`, `_backup`)
- 프로젝트 구조 정리 및 혼란 방지

### 🎯 다음 단계 개선 권장사항

1. **Metadata API 적용** - SEO 개선 (Server Components 전환 필요)
2. **Image 최적화** - `next/image` 사용으로 성능 향상
3. **Error Boundary** - 전역 에러 처리
4. **Loading States** - Suspense Boundary 적용

## 배포

### 🚀 빠른 시작

배포와 기능 개발을 병행하려면 [빠른 시작 가이드](./QUICK_START_DEPLOYMENT.md)를 참고하세요.

### 📚 배포 가이드

- **[빠른 시작 가이드](./QUICK_START_DEPLOYMENT.md)** - 배포 + 기능 개발 병행 전략
- **[배포 워크플로우](./DEPLOYMENT_WORKFLOW.md)** - Git 브랜치 전략 및 개발 프로세스
- **[배포 가이드](./DEPLOYMENT.md)** - 상세 배포 절차 (Vercel + Supabase)
- **[Supabase 마이그레이션](./SUPABASE_MIGRATION.md)** - Express → Edge Functions 변환

### 배포 구조

- **Frontend**: Vercel (Next.js)
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Storage**: Supabase Storage 또는 AWS S3

**환경 변수 설정:**
```bash
NEXT_PUBLIC_API_URL=https://[your-supabase-project].supabase.co
```

## 라이센스

MIT License
