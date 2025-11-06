# 프론트엔드 환경 변수 설정 가이드

## 🎯 Vercel 환경 변수 설정

프론트엔드가 Railway에 배포된 백엔드와 통신하도록 Vercel 환경 변수를 설정해야 합니다.

### 1. Railway 백엔드 URL 확인

1. [Railway 대시보드](https://railway.app) 접속
2. 백엔드 서비스 선택
3. **Settings** 탭 → **Networking** 섹션 확인
4. **Public Domain** 또는 **Generate Domain** 버튼 클릭
5. 생성된 도메인 복사 (예: `https://aim-page-backend-production.up.railway.app`)

> **참고**: Railway는 자동으로 HTTPS 도메인을 생성합니다. `https://`로 시작하는 URL을 사용하세요.

### 2. Vercel 환경 변수 설정

1. [Vercel 대시보드](https://vercel.com/dashboard) 접속
2. 프로젝트 선택
3. **Settings** 탭 → **Environment Variables** 섹션
4. 다음 환경 변수 추가:

```bash
# 백엔드 API URL (Railway 도메인)
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

**예시:**
```bash
NEXT_PUBLIC_API_URL=https://aim-page-backend-production.up.railway.app
```

### 3. 환경별 설정 (선택사항)

Vercel에서는 환경별로 다른 값을 설정할 수 있습니다:

- **Production**: Railway 프로덕션 URL
- **Preview**: Railway 프로덕션 URL (또는 별도 스테이징 URL)
- **Development**: `http://localhost:3001` (로컬 개발용)

> **참고**: `NEXT_PUBLIC_` 접두사가 붙은 환경 변수는 클라이언트 사이드에서 접근 가능합니다.

### 4. 재배포

환경 변수를 추가/수정한 후:

1. Vercel 대시보드에서 **Deployments** 탭
2. 최신 배포의 **⋯** 메뉴 → **Redeploy** 클릭
3. 또는 Git에 커밋 후 자동 재배포

### 5. 확인 방법

재배포 후 프론트엔드에서 다음을 확인:

1. **브라우저 개발자 도구** (F12) → **Network** 탭
2. API 요청이 Railway 백엔드 URL로 전송되는지 확인
3. **Console** 탭에서 CORS 에러가 없는지 확인

### 6. CORS 에러 발생 시

백엔드에서 CORS 설정을 확인하세요:

1. Railway 환경 변수에서 `FRONTEND_URL` 확인
2. Vercel 프론트엔드 URL과 일치하는지 확인
3. 마지막 슬래시(`/`) 없이 설정되어 있는지 확인

**예시:**
```bash
# Railway 환경 변수
FRONTEND_URL=https://aim-page-frontend.vercel.app
```

---

## 🔧 로컬 개발 환경 설정

로컬에서 개발할 때는 `.env.local` 파일을 사용합니다:

```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
```

> **주의**: `.env.local` 파일은 Git에 커밋하지 마세요. `.gitignore`에 포함되어 있습니다.

---

## 📝 체크리스트

- [ ] Railway 백엔드 URL 확인
- [ ] Vercel 환경 변수 `NEXT_PUBLIC_API_URL` 설정
- [ ] Vercel 재배포 완료
- [ ] 브라우저에서 API 요청 확인
- [ ] CORS 에러 없음 확인
- [ ] 로그인/회원가입 등 주요 기능 테스트

---

## 🐛 문제 해결

### API 요청이 localhost로 가는 경우

- Vercel 환경 변수가 제대로 설정되었는지 확인
- 재배포 후 브라우저 캐시 삭제 (Ctrl+Shift+R 또는 Cmd+Shift+R)

### CORS 에러 발생

- Railway `FRONTEND_URL` 환경 변수 확인
- Vercel 프론트엔드 URL과 일치하는지 확인
- 백엔드 CORS 설정 확인 (`backend/src/index.ts`)

### 404 에러

- Railway 백엔드가 정상 실행 중인지 확인
- Railway 로그에서 에러 확인
- 백엔드 URL이 올바른지 확인 (마지막 슬래시 없음)

