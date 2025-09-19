# 프론트엔드 Dockerfile
FROM node:18-alpine AS base

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci && npm cache clean --force

# 소스 코드 복사
COPY . .

# 포트 노출
EXPOSE 3000

# 개발 서버 실행 (개발 환경)
CMD ["npm", "run", "dev"]

# 프로덕션 환경용 (주석 해제하여 사용)
# FROM node:18-alpine AS builder
# WORKDIR /app
# COPY package*.json ./
# RUN npm ci
# COPY . .
# RUN npm run build

# FROM node:18-alpine AS production
# WORKDIR /app
# COPY package*.json ./
# RUN npm ci --only=production && npm cache clean --force
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/public ./public
# EXPOSE 3000
# CMD ["npm", "start"]
