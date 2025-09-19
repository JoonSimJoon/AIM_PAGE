# Docker 설정 가이드

이 폴더는 AIM Page 프로젝트의 Docker 관련 설정들을 관리합니다.

## 📁 폴더 구조

```
docker/
├── dev/                    # 개발 환경 설정
│   ├── docker-compose.yml  # 개발용 Docker Compose
│   └── env.example         # 개발용 환경변수 템플릿
├── prod/                   # 프로덕션 환경 설정
│   ├── docker-compose.yml  # 프로덕션용 Docker Compose
│   └── env.example         # 프로덕션용 환경변수 템플릿
├── nginx/                  # Nginx 설정
│   └── nginx.conf          # Nginx 설정 파일
└── docker-compose.yml      # 기본 Docker Compose (개발용)
```

## 🚀 빠른 시작

### 1. 환경 설정
```bash
# 프로젝트 루트에서 실행
make setup
```

### 2. 개발 환경 실행
```bash
make dev-docker
```

### 3. 데이터베이스 설정
```bash
make db-setup
```

## 🔧 개발 환경 (dev/)

### 특징
- 핫 리로드 지원
- 개발용 데이터베이스 (PostgreSQL)
- Redis 캐시 서버
- 볼륨 마운트로 실시간 코드 변경 반영

### 서비스 구성
- **frontend**: Next.js (포트 3000)
- **backend**: Express.js (포트 3001)  
- **postgres**: PostgreSQL (포트 5432)
- **redis**: Redis (포트 6379)

### 환경변수 설정
`docker/dev/.env` 파일을 생성하고 다음 값들을 설정하세요:

```bash
# AWS S3 설정
AWS_REGION=ap-northeast-2
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=your-bucket-name

# 데이터베이스 (기본값 사용 권장)
POSTGRES_USER=aimpage
POSTGRES_PASSWORD=aimpage123
POSTGRES_DB=aim_page

# JWT 시크릿
JWT_SECRET=dev-jwt-secret-key
```

## 🚀 프로덕션 환경 (prod/)

### 특징
- 최적화된 빌드
- Nginx 리버스 프록시
- 보안 강화된 설정
- 백그라운드 실행

### 서비스 구성
- **frontend**: Next.js (내부)
- **backend**: Express.js (내부)
- **postgres**: PostgreSQL (내부)
- **redis**: Redis (내부)
- **nginx**: 리버스 프록시 (포트 80, 443)

### 환경변수 설정
`docker/prod/.env` 파일을 생성하고 프로덕션 값들을 설정하세요:

```bash
# 보안이 중요한 프로덕션 설정
POSTGRES_PASSWORD=super-secure-password
JWT_SECRET=super-secret-jwt-key
FRONTEND_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## 🔍 유용한 명령어

### 로그 확인
```bash
make logs              # 전체 로그
make logs-backend      # 백엔드 로그만
make logs-frontend     # 프론트엔드 로그만
make logs-db           # 데이터베이스 로그만
```

### 컨테이너 접속
```bash
make shell-backend     # 백엔드 컨테이너 쉘
make shell-frontend    # 프론트엔드 컨테이너 쉘
make shell-db          # 데이터베이스 쉘
```

### 데이터베이스 관리
```bash
make db-setup          # 스키마 적용
make db-studio         # Prisma Studio 실행
```

### 환경 관리
```bash
make stop              # 개발 환경 중지
make clean             # Docker 리소스 정리
```

## 🔧 커스터마이징

### Nginx 설정 변경
`docker/nginx/nginx.conf` 파일을 수정하여 리버스 프록시 설정을 변경할 수 있습니다.

### 새로운 서비스 추가
Docker Compose 파일에 새로운 서비스를 추가하고 네트워크를 연결하세요.

### 환경별 설정 분리
개발/스테이징/프로덕션 환경별로 별도의 폴더와 설정을 만들 수 있습니다.

## 🚨 주의사항

1. **보안**: 프로덕션 환경에서는 반드시 강력한 비밀번호와 시크릿 키를 사용하세요.
2. **백업**: 프로덕션 데이터베이스는 정기적으로 백업하세요.
3. **모니터링**: 프로덕션 환경에서는 로그 모니터링과 헬스체크를 설정하세요.
4. **SSL**: 프로덕션에서는 HTTPS 인증서를 설정하세요.
