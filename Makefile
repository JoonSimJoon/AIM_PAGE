# AIM Page 프로젝트 Makefile

.PHONY: help dev dev-docker prod logs clean setup

# 기본 명령어 (help)
help:
	@echo "사용 가능한 명령어:"
	@echo "  make setup        - 프로젝트 초기 설정"
	@echo "  make dev          - 로컬 개발 서버 실행"
	@echo "  make dev-docker   - Docker로 개발 서버 실행"
	@echo "  make prod         - 프로덕션 배포"
	@echo "  make logs         - Docker 로그 보기"
	@echo "  make clean        - Docker 정리"
	@echo "  make db-setup     - 데이터베이스 설정"

# 프로젝트 초기 설정
setup:
	@echo "🚀 프로젝트 초기 설정 중..."
	@cp docker/dev/env.example docker/dev/.env || true
	@cp docker/prod/env.example docker/prod/.env || true
	@echo "📦 의존성 설치 중..."
	@npm run install:all
	@echo "✅ 설정 완료!"
	@echo "⚠️  docker/dev/.env 파일을 확인하고 AWS 설정을 입력하세요"

# 로컬 개발 (Node.js 직접 실행)
dev:
	@echo "🔧 로컬 개발 서버 실행 중..."
	@npm run dev

# Docker 개발 환경
dev-docker:
	@echo "🐳 Docker 개발 환경 실행 중..."
	@docker-compose -f docker/dev/docker-compose.yml up --build

# Docker 개발 환경 (백그라운드)
dev-docker-bg:
	@echo "🐳 Docker 개발 환경 백그라운드 실행 중..."
	@docker-compose -f docker/dev/docker-compose.yml up --build -d

# 프로덕션 배포
prod:
	@echo "🚀 프로덕션 환경 배포 중..."
	@docker-compose -f docker/prod/docker-compose.yml up --build -d

# Docker 로그 보기
logs:
	@docker-compose -f docker/dev/docker-compose.yml logs -f

# 특정 서비스 로그 보기
logs-backend:
	@docker-compose -f docker/dev/docker-compose.yml logs -f backend

logs-frontend:
	@docker-compose -f docker/dev/docker-compose.yml logs -f frontend

logs-db:
	@docker-compose -f docker/dev/docker-compose.yml logs -f postgres

# 개발 환경 중지
stop:
	@echo "⏹️ 개발 환경 중지 중..."
	@docker-compose -f docker/dev/docker-compose.yml down

# 프로덕션 환경 중지
stop-prod:
	@echo "⏹️ 프로덕션 환경 중지 중..."
	@docker-compose -f docker/prod/docker-compose.yml down

# Docker 정리
clean:
	@echo "🧹 Docker 리소스 정리 중..."
	@docker-compose -f docker/dev/docker-compose.yml down -v
	@docker system prune -f
	@echo "✅ 정리 완료!"

# 데이터베이스 설정
db-setup:
	@echo "🗄️ 데이터베이스 설정 중..."
	@docker-compose -f docker/dev/docker-compose.yml exec backend npm run db:generate
	@docker-compose -f docker/dev/docker-compose.yml exec backend npm run db:push
	@echo "✅ 데이터베이스 설정 완료!"

# 데이터베이스 스튜디오 실행
db-studio:
	@echo "🎨 Prisma Studio 실행 중..."
	@docker-compose -f docker/dev/docker-compose.yml exec backend npm run db:studio

# 컨테이너 쉘 접속
shell-backend:
	@docker-compose -f docker/dev/docker-compose.yml exec backend sh

shell-frontend:
	@docker-compose -f docker/dev/docker-compose.yml exec frontend sh

shell-db:
	@docker-compose -f docker/dev/docker-compose.yml exec postgres psql -U aimpage -d aim_page

# 테스트 실행
test:
	@echo "🧪 테스트 실행 중..."
	@docker-compose -f docker/dev/docker-compose.yml exec backend npm test
	@docker-compose -f docker/dev/docker-compose.yml exec frontend npm test
