# AWS 전용 배포 가이드

## 🎯 AWS 전용 배포 전략

결제가 불가피하다면, AWS만 사용하는 것이 장기적으로 더 나을 수 있습니다.

---

## 📊 배포 옵션 비교

### 옵션 1: Vercel (프론트) + AWS (백엔드) - 현재 계획 ⭐ 추천

**구조:**
```
프론트엔드: Vercel (무료/유료)
  ↓
백엔드: AWS ECS/Fargate + RDS + S3
```

**장점:**
- ✅ 프론트엔드는 Vercel의 Next.js 최적화 활용
- ✅ 백엔드는 AWS에서 완전한 제어
- ✅ 프론트엔드 배포가 매우 간단 (GitHub 연동)
- ✅ 비용: Vercel 무료 + AWS 사용량 기반

**단점:**
- ❌ 두 플랫폼 관리 필요

**예상 비용:**
- Vercel: 무료 (개인 프로젝트) 또는 $20/월
- AWS: 월 $20-50 (소규모)

---

### 옵션 2: AWS만 사용 (Amplify + ECS + RDS)

**구조:**
```
프론트엔드: AWS Amplify
  ↓
백엔드: AWS ECS/Fargate + RDS + S3
```

**장점:**
- ✅ 모든 인프라를 AWS에서 통합 관리
- ✅ AWS 계정 하나로 모든 서비스 관리
- ✅ 더 많은 제어권과 커스터마이징
- ✅ AWS 서비스 간 통합 용이

**단점:**
- ❌ 초기 설정이 복잡함
- ❌ Amplify는 Vercel만큼 간단하지 않음
- ❌ AWS 학습 곡선

**예상 비용:**
- AWS 전체: 월 $30-70 (소규모)

---

### 옵션 3: Railway (백엔드) + Vercel (프론트) - 현재 계획

**장점:**
- ✅ 설정이 매우 간단
- ✅ 빠른 배포

**단점:**
- ❌ Railway 무료 크레딧 제한
- ❌ 장기적으로 비용 증가 가능

**예상 비용:**
- Railway: 월 $10-20 (크레딧 초과 시)
- Vercel: 무료

---

## 🚀 AWS 전용 배포 가이드 (옵션 2)

### 1. 프론트엔드: AWS Amplify

#### Amplify 설정

1. **AWS Amplify 콘솔 접속**
   - [AWS Amplify Console](https://console.aws.amazon.com/amplify)

2. **앱 생성**
   - "New app" → "Host web app"
   - GitHub 저장소 연결
   - Branch: `main`
   - Build settings: 자동 감지 또는 `amplify.yml` 생성

3. **빌드 설정** (`amplify.yml`)
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - cd frontend
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: frontend/.next
       files:
         - '**/*'
     cache:
       paths:
         - frontend/node_modules/**/*
         - frontend/.next/cache/**/*
   ```

4. **환경 변수 설정**
   - Amplify Console → App settings → Environment variables
   - `NEXT_PUBLIC_API_URL`: 백엔드 API URL

---

### 2. 백엔드: AWS ECS Fargate

#### ECS 설정

1. **ECR (Elastic Container Registry)에 이미지 푸시**
   ```bash
   # AWS CLI 설정
   aws configure
   
   # ECR 로그인
   aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-northeast-2.amazonaws.com
   
   # 이미지 빌드 및 푸시
   cd backend
   docker build -t aim-backend .
   docker tag aim-backend:latest <account-id>.dkr.ecr.ap-northeast-2.amazonaws.com/aim-backend:latest
   docker push <account-id>.dkr.ecr.ap-northeast-2.amazonaws.com/aim-backend:latest
   ```

2. **ECS 클러스터 및 서비스 생성**
   - ECS Console → Clusters → Create cluster
   - Fargate 선택
   - Task definition 생성 (컨테이너 이미지, 환경 변수, 포트 설정)
   - Service 생성 (로드 밸런서 연결)

3. **Application Load Balancer 설정**
   - ALB 생성
   - Target group 생성 (ECS 서비스 연결)
   - HTTPS 인증서 설정 (ACM 사용)

---

### 3. 데이터베이스: AWS RDS PostgreSQL

1. **RDS 인스턴스 생성**
   - RDS Console → Create database
   - Engine: PostgreSQL
   - Template: Free tier (개발용) 또는 Production
   - Instance class: `db.t3.micro` (프리티어) 또는 `db.t3.small`
   - Storage: 20GB (프리티어) 또는 더 큰 용량
   - VPC: ECS와 같은 VPC 선택
   - Security group: ECS에서 접근 가능하도록 설정

2. **연결 정보**
   - Endpoint: `your-db.region.rds.amazonaws.com`
   - Port: 5432
   - Database name, username, password 설정

---

### 4. 파일 저장: AWS S3

1. **S3 버킷 생성**
   - S3 Console → Create bucket
   - Region: `ap-northeast-2` (서울)
   - Block public access: 필요에 따라 설정

2. **CloudFront 배포 (선택사항)**
   - CloudFront Console → Create distribution
   - Origin: S3 버킷
   - 캐싱 설정

---

### 5. 환경 변수 설정

#### ECS Task Definition 환경 변수

```bash
DATABASE_URL=postgresql://user:password@your-db.region.rds.amazonaws.com:5432/dbname
JWT_SECRET=your-secret-key
FRONTEND_URL=https://your-amplify-app.amplifyapp.com
PORT=3001
AWS_REGION=ap-northeast-2
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_S3_BUCKET=your-bucket-name
```

#### Amplify 환경 변수

```bash
NEXT_PUBLIC_API_URL=https://your-alb.region.elb.amazonaws.com
```

---

## 💰 AWS 비용 예상

### 소규모 프로젝트 (월 예상)

- **Amplify**: $0.15/GB 빌드 시간 + $0.023/GB 저장
  - 예상: $5-10/월
- **ECS Fargate**: $0.04/vCPU-hour + $0.004/GB-hour
  - 0.25 vCPU, 0.5GB: 약 $8/월
- **RDS PostgreSQL**: 
  - `db.t3.micro` (프리티어): $0 (12개월) 또는 $15/월
  - `db.t3.small`: $30/월
- **S3**: $0.023/GB 저장 + $0.09/GB 전송
  - 예상: $1-5/월
- **ALB**: $0.0225/hour + $0.008/GB 처리
  - 예상: $16/월
- **CloudFront**: $0.085/GB (첫 10TB)
  - 예상: $1-5/월

**총 예상 비용:**
- 프리티어 활용 시: **$30-50/월**
- 프리티어 없이: **$50-80/월**

---

## 🎯 권장사항

### 초기 단계 (현재)
**Vercel (프론트) + Railway (백엔드)**
- 빠른 배포
- 설정 간단
- 비용: 월 $10-20

### 성장 단계
**Vercel (프론트) + AWS (백엔드)** ⭐ 추천
- 프론트엔드는 Vercel의 편의성 유지
- 백엔드는 AWS로 확장성 확보
- 비용: 월 $30-50

### 대규모 단계
**AWS 전용 (Amplify + ECS + RDS)**
- 모든 인프라 통합 관리
- 더 많은 제어권
- 비용: 월 $50-100+

---

## 📝 결론

**편의성을 고려하면:**
- ✅ **Vercel (프론트) + AWS (백엔드)** 조합이 가장 좋습니다
- ✅ 프론트엔드는 Vercel의 Next.js 최적화 활용
- ✅ 백엔드는 AWS에서 안정적으로 운영
- ✅ 초기 설정도 상대적으로 간단

**AWS만 사용하려면:**
- ⚠️ Amplify 설정이 필요 (Vercel보다 복잡)
- ⚠️ 초기 설정 시간이 더 걸림
- ✅ 장기적으로 통합 관리의 이점

**추천: Vercel + AWS 조합으로 시작하세요!**

