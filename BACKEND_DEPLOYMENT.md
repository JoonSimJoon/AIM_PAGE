# 백엔드 배포 가이드

## 🚀 Railway 배포 (추천)

Railway는 Docker를 지원하고 PostgreSQL 데이터베이스를 제공하므로 가장 간단한 배포 방법입니다.

### 1. Railway 프로젝트 생성

1. [Railway](https://railway.app)에 가입/로그인
2. "New Project" → "Deploy from GitHub repo" 선택
3. GitHub 저장소 연결 후 `backend` 디렉토리 선택

### 2. PostgreSQL 데이터베이스 추가

1. Railway 대시보드에서 프로젝트 선택
2. "+ New" → "Database" → "Add PostgreSQL" 클릭
3. 생성된 데이터베이스의 "Connect" 버튼 클릭
4. **`DATABASE_URL`** 변수를 복사해두기

### 3. 환경 변수 설정

Railway 프로젝트 → Variables 탭에서 다음 환경 변수들을 추가:

**필수 환경 변수:**
```bash
# 데이터베이스 (Railway PostgreSQL에서 자동 생성됨)
# Railway 내부에서는 DATABASE_URL 사용 (내부 네트워크)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# 서버 설정
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# 프론트엔드 URL (CORS용) - 마지막 슬래시 제거
FRONTEND_URL=https://your-vercel-app.vercel.app
```

> **중요**: 
> - `DATABASE_URL`은 Railway 내부 네트워크용이므로 `${{Postgres.DATABASE_URL}}` 사용
> - `DATABASE_PUBLIC_URL`은 로컬 개발용이므로 Railway 서비스에서는 사용하지 않음
> - `FRONTEND_URL`은 마지막 슬래시(`/`) 없이 설정

**AWS S3 사용 시 (선택사항):**
```bash
# AWS S3 설정 (파일 저장용)
AWS_REGION=ap-northeast-2
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_S3_BUCKET=your-s3-bucket-name

# CloudFront (선택사항)
CLOUDFRONT_DOMAIN=your-cloudfront-domain.cloudfront.net
```

> **참고**: 현재 프로젝트는 로컬 파일 스토리지를 사용하므로, AWS 설정 없이도 작동합니다. 파일은 Railway 서버 내부에 저장됩니다.

### 4. Railway 빌드 설정

Railway 대시보드 → `aim-page-backend` 서비스 → Settings 탭에서:

1. **Root Directory**: `backend` 설정
   - 프로젝트 루트가 아닌 `backend` 디렉토리를 기준으로 설정
2. **Builder**: `Dockerfile` 선택
3. **Dockerfile Path**: `Dockerfile` 설정
   - Root Directory가 `backend`이므로, `Dockerfile`만 입력 (또는 `./Dockerfile`)
   - ❌ `/backend/Dockerfile` (잘못된 경로)
   - ✅ `Dockerfile` (올바른 경로)
4. **Custom Build Command**: 비워두기 (Dockerfile에서 빌드 명령 처리)
5. **Custom Start Command**: 두 가지 옵션
   
   **옵션 1: 비워두기 (권장)**
   - Dockerfile의 `CMD ["node", "dist/backend/src/index.js"]`가 실행됩니다
   - 이 방법이 작동하지 않으면 옵션 2 사용
   
   **옵션 2: 명시적으로 설정**
   - `npm start` 입력
   - 또는 `node dist/backend/src/index.js` 입력
   - Dockerfile의 CMD를 덮어씁니다

### 5. Dockerfile 수정 확인

프로덕션 빌드를 위해 `backend/Dockerfile`이 올바르게 설정되어 있는지 확인:

```dockerfile
FROM node:18-alpine AS builder

# OpenSSL 설치 (Prisma 용)
RUN apk add --no-cache openssl-dev openssl

WORKDIR /app

# 의존성 설치
COPY package*.json ./
RUN npm install

# 소스 코드 복사 및 Prisma 클라이언트 생성
COPY . .
RUN npx prisma generate
RUN npm run build

# 프로덕션 이미지
FROM node:18-alpine AS production

RUN apk add --no-cache openssl

WORKDIR /app

# 프로덕션 의존성만 설치
COPY package*.json ./
RUN npm install --only=production && npm cache clean --force

# 빌드 결과물 복사
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
RUN npx prisma generate

EXPOSE 3001

CMD ["node", "dist/backend/src/index.js"]
```

> **중요**: 
> - Railway Settings에서 `Custom Start Command`가 설정되어 있다면 **비워두세요**. Dockerfile의 `CMD`가 실행 명령어를 지정합니다.
> - 빌드 출력 경로: `dist/backend/src/index.js` (tsconfig.json의 include 설정으로 인해 `backend` 디렉토리가 포함됨)

### 6. 데이터베이스 마이그레이션

Railway 배포 후, 데이터베이스 마이그레이션 실행:

#### 방법 1: Railway Shell 사용 (권장)

1. Railway 프로젝트 → 백엔드 서비스 선택
2. "View Logs" 탭 → "Shell" 클릭
3. 다음 명령어 실행:
```bash
cd /app
npx prisma db push
```

#### 방법 2: Railway CLI 사용

1. Railway CLI 설치:
```bash
npm install -g @railway/cli
railway login
```

2. 프로젝트 연결 및 마이그레이션 실행:
```bash
railway link
railway run --service backend npx prisma db push
```

#### 방법 3: 로컬에서 실행 (DATABASE_PUBLIC_URL 사용)

Railway PostgreSQL은 자동으로 `DATABASE_PUBLIC_URL`을 제공합니다.

1. Railway PostgreSQL → Variables 탭에서 `DATABASE_PUBLIC_URL` 복사
2. 로컬 `backend/.env` 파일에 설정:
```bash
DATABASE_URL="postgresql://postgres:비밀번호@공개호스트.railway.app:5432/railway"
```

또는 직접 `DATABASE_PUBLIC_URL`을 사용:
```bash
# Railway에서 DATABASE_PUBLIC_URL 복사
DATABASE_URL="[DATABASE_PUBLIC_URL 값 그대로 붙여넣기]"
```

3. 로컬에서 실행:
```bash
cd backend
npx prisma db push
```

> **참고**: 
> - `DATABASE_URL`은 Railway 내부 네트워크용 (`postgres.railway.internal`)이므로 로컬에서 접근 불가
> - `DATABASE_PUBLIC_URL`은 공개 접근용이므로 로컬에서 접근 가능
> - Railway 서비스 내에서는 `DATABASE_URL` 사용
> - 로컬 개발/마이그레이션 시에는 `DATABASE_PUBLIC_URL` 사용

### 7. 파일 저장소 설정 (선택사항)

Railway에서 파일이 영구적으로 저장되도록 Volume 추가:

1. Railway 프로젝트 → 백엔드 서비스 선택
2. "+ New" → "Volume" 클릭
3. Volume 이름: `uploads`
4. Mount Path: `/app/uploads`
5. Volume을 서비스에 연결

> **참고**: Volume 없이도 작동하지만, 서비스 재배포 시 파일이 삭제될 수 있습니다.  
> Volume은 유료 서비스이므로, 초기에는 Volume 없이 시작하고 필요 시 추가하는 것을 권장합니다.

### 8. 배포 확인 및 문제 해결

#### "No deploys for this service" 에러 해결

이 메시지가 나타나면 배포가 시도되지 않았거나 실패한 것입니다.

**1단계: GitHub 연결 확인**
- Railway → `aim-page-backend` 서비스 → Settings → "Source"
- GitHub 저장소가 연결되어 있는지 확인
- 브랜치가 올바르게 설정되어 있는지 확인 (보통 `main` 또는 `master`)

**2단계: 배포 트리거 확인**
- Railway는 GitHub에 푸시할 때 자동으로 배포를 시도합니다
- 최근에 GitHub에 푸시했는지 확인
- 수동 배포: "Deployments" 탭 → "Redeploy" 버튼 클릭

**3단계: Settings 확인**
- Railway → `aim-page-backend` 서비스 → Settings
- **Root Directory**: `backend` 설정 확인
- **Builder**: `Dockerfile` 선택 확인
- **Dockerfile Path**: `Dockerfile` 설정 확인
- **Custom Build Command**: 비워두기
- **Custom Start Command**: 비워두거나 `npm start` 설정

**4단계: 빌드 로그 확인**
- Railway → `aim-page-backend` 서비스 → "Deployments" 탭
- 배포 시도가 있다면 클릭하여 빌드 로그 확인
- TypeScript 컴파일 에러, 의존성 설치 에러 등 확인

**5단계: 환경 변수 확인**
- Railway → `aim-page-backend` 서비스 → Variables
- 필수 변수 확인:
  - `DATABASE_URL=${{Postgres.DATABASE_URL}}`
  - `FRONTEND_URL=https://aim-page-frontend.vercel.app`
  - `JWT_SECRET=AIM4EVER`
  - `PORT=3001`

**6단계: 수동 배포 시도**
- "Deployments" 탭 → "Redeploy" 버튼 클릭
- 또는 Settings → "Redeploy" 버튼 클릭

#### 배포 성공 후 확인

1. **Railway 대시보드에서 서비스 상태 확인**
   - 서비스가 "Active" 상태인지 확인
   - 배포가 성공했는지 확인 (빌드 로그 확인)

2. **로그 확인**
   - Railway 서비스 → "View Logs" 탭
   - `🚀 Backend server running on port 3001` 메시지가 있는지 확인
   - 에러 메시지가 있는지 확인

3. **도메인 및 엔드포인트 테스트**
   - "Settings" → "Generate Domain"으로 공개 URL 생성
   - **중요**: 루트 경로(`/`)는 없습니다. 다음 엔드포인트를 테스트하세요:
     - `https://your-service.railway.app/health` (정상: `{"status":"OK","timestamp":"..."}`)
     - `https://your-service.railway.app/api/auth/login` (404는 정상 - API 엔드포인트)

4. **문제 해결: Railway 404 페이지가 나오는 경우**
   - 서비스가 실행 중이 아닐 수 있습니다
   - 로그에서 에러 확인
   - 환경 변수 설정 확인 (특히 `DATABASE_URL`, `JWT_SECRET`)
   - 포트 설정 확인 (`PORT=3001`)

5. **문제 해결: "Connection reset by peer" 에러**

   이 에러는 **PostgreSQL 로그**입니다. 백엔드 서비스가 실행되지 않아서 발생합니다.
   
   **확인 사항:**
   
   a. **백엔드 서비스 로그 확인** (중요!)
      - Railway 대시보드 → `aim-page-backend` 서비스 (PostgreSQL이 아님!)
      - "View Logs" 탭 확인
      - 다음 메시지가 있는지 확인:
        - `🚀 Backend server running on port 3001` (정상)
        - 빌드 에러 메시지
        - `Cannot find module` 에러
        - `DATABASE_URL` 관련 에러
   
   b. **환경 변수 확인**
      - Railway → `aim-page-backend` 서비스 → Variables
      - `DATABASE_URL`이 설정되어 있는지 확인
      - `JWT_SECRET`이 설정되어 있는지 확인
      - `PORT=3001`이 설정되어 있는지 확인
   
   c. **빌드 로그 확인**
      - Railway → `aim-page-backend` 서비스 → "Deployments" 탭
      - 최근 배포의 빌드 로그 확인
      - TypeScript 컴파일 에러가 있는지 확인
      - `dist/backend/src/index.js` 파일이 생성되었는지 확인
   
   d. **Custom Start Command 확인**
      - Settings → Custom Start Command
      - `npm start` 또는 `node dist/backend/src/index.js` 설정 확인

6. **문제 해결: Custom Start Command가 작동하지 않는 경우**
   - Railway 로그에서 에러 메시지 확인
   - 빌드가 성공했는지 확인 (`dist/backend/src/index.js` 파일이 생성되었는지)
   - Custom Start Command에 `npm start` 명시적으로 입력
   - 또는 `node dist/backend/src/index.js` 직접 입력

7. **파일 업로드 테스트**
   - `/api/upload/file` 엔드포인트 확인 (인증 필요)

---

## 🔧 프론트엔드 환경 변수 설정

### Vercel 환경 변수 추가

1. Vercel 대시보드 → 프로젝트 선택
2. Settings → Environment Variables
3. 다음 변수 추가:

```bash
# 백엔드 API URL (Railway에서 생성한 URL)
NEXT_PUBLIC_API_URL=https://your-backend.railway.app

# NextAuth (사용하는 경우)
NEXTAUTH_URL=https://your-frontend.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret-key
```

### 환경 변수 적용

변경 후 Vercel에서 자동으로 재배포됩니다. 수동 재배포가 필요하면:
1. Deployments 탭 → "Redeploy" 클릭

---

## 📋 체크리스트

### 백엔드 배포 전

- [ ] Railway 프로젝트 생성
- [ ] PostgreSQL 데이터베이스 추가
- [ ] 필수 환경 변수 설정 (DATABASE_URL, JWT_SECRET, FRONTEND_URL)
- [ ] (선택) AWS S3 설정 (필요한 경우만)
- [ ] Dockerfile 프로덕션 빌드 확인
- [ ] 백엔드 배포 및 도메인 확인

### 데이터베이스 설정

- [ ] `railway run --service backend npx prisma db push` 실행
- [ ] 데이터베이스 스키마 확인

### 프론트엔드 설정

- [ ] Vercel 환경 변수에 `NEXT_PUBLIC_API_URL` 설정
- [ ] 프론트엔드 재배포
- [ ] API 연결 테스트

---

## 🔍 문제 해결

### CORS 오류

백엔드의 CORS 설정에 프론트엔드 URL이 포함되어 있는지 확인:
```typescript
// backend/src/index.ts
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  // ...
}
```

### 데이터베이스 연결 오류

1. `DATABASE_URL` 형식 확인
2. Railway PostgreSQL의 네트워크 설정 확인
3. SSL 연결 필요 시 `?sslmode=require` 추가

### 빌드 실패

1. Railway 로그 확인
2. `package.json`의 빌드 스크립트 확인
3. Dockerfile의 빌드 단계 확인

---

## 🌐 최종 구조

### 옵션 1: 완전 무료 구조

```
프론트엔드 (Vercel - 무료)
  ↓ API 요청
  NEXT_PUBLIC_API_URL=https://your-backend.railway.app
  ↓
백엔드 (Railway - 무료 크레딧)
  ↓ 데이터베이스
  PostgreSQL (Railway - 무료 크레딧)
  ↓ 파일 저장
  로컬 파일 시스템 (Railway 서버 내부)
```

### 옵션 2: AWS S3 사용 구조

```
프론트엔드 (Vercel - 무료)
  ↓ API 요청
  NEXT_PUBLIC_API_URL=https://your-backend.railway.app
  ↓
백엔드 (Railway - 무료 크레딧)
  ↓ 데이터베이스
  PostgreSQL (Railway - 무료 크레딧)
  ↓ 파일 저장
  AWS S3 (무료 티어) + CloudFront (선택)
```

---

## 💰 비용 옵션

### 옵션 1: 완전 무료 (추천) ⭐

프로젝트가 이미 로컬 파일 스토리지를 사용하므로, **AWS 없이 완전 무료**로 배포 가능합니다:

- **Railway**: $5/월 무료 크레딧 (소규모 프로젝트에 충분)
  - 백엔드 서버: 약 $0.012/시간 (월 $8.64)
  - PostgreSQL: 약 $0.012/시간 (월 $8.64)
  - **총 월 $17.28 → 무료 크레딧 $5로 일부 커버 가능**
  - 실제 사용량은 트래픽에 따라 달라짐
- **Vercel**: 무료 플랜 (개인 프로젝트)
- **파일 저장**: Railway 서버 내 로컬 저장소

**예상 비용**:
- 초기 몇 달: **$0** (무료 크레딧으로 충분)
- 트래픽 증가 시: **월 $10-20** (Railway 사용량 기반)

**장점**: 
- AWS 설정 불필요
- 설정 간단
- Railway Volume 없이도 작동

**단점**: 
- 파일이 Railway 서버에 저장 (재배포 시 삭제 가능)
- 대용량 파일 시 비용 증가

### 옵션 2: AWS S3 무료 티어 사용 (장기적으로 더 경제적)

대용량 파일이나 안정적인 파일 저장이 필요한 경우:

- **AWS S3 무료 티어** (신규 가입 시 12개월): 
  - 5GB 저장 공간
  - 20,000 GET 요청/월
  - 2,000 PUT 요청/월
  - 무료 티어 초과 시: 저장 $0.023/GB, 전송 $0.09/GB
- **Railway**: 백엔드 + PostgreSQL만 사용 (파일 저장 제외)

**예상 비용**:
- 첫 12개월: **$0** (S3 무료 티어)
- 이후 소규모: **월 $0-1** (S3 사용량 기반)
- Railway: 무료 크레딧 또는 월 $10-15

**장점**: 
- 안정적인 파일 저장 (서버 재배포와 무관)
- CDN 연동 가능 (CloudFront)
- 장기적으로 더 안정적

**단점**: 
- 초기 설정 필요 (AWS 계정, S3 버킷 생성)
- 코드 수정 필요 (S3 사용하도록 변경)

### 권장사항

**초기 배포**: 옵션 1 (완전 무료)로 시작  
**트래픽 증가 시**: 옵션 2 (AWS S3)로 마이그레이션 고려

---

## 📚 추가 리소스

- [Railway 문서](https://docs.railway.app)
- [Vercel 환경 변수 설정](https://vercel.com/docs/concepts/projects/environment-variables)
- [Prisma 배포 가이드](https://www.prisma.io/docs/guides/deployment)


