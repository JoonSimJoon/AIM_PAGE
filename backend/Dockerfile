# 백엔드 Dockerfile
FROM node:18-alpine AS base

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci --only=production && npm cache clean --force

# 개발 의존성도 설치 (개발 환경용)
RUN npm ci

# 소스 코드 복사
COPY . .

# Prisma 클라이언트 생성
RUN npx prisma generate

# TypeScript 컴파일 (프로덕션용)
# RUN npm run build

# 포트 노출
EXPOSE 3001

# 개발 서버 실행 (개발 환경)
CMD ["npm", "run", "dev"]

# 프로덕션 환경용 (주석 해제하여 사용)
# FROM node:18-alpine AS production
# WORKDIR /app
# COPY package*.json ./
# RUN npm ci --only=production && npm cache clean --force
# COPY --from=base /app/dist ./dist
# COPY --from=base /app/prisma ./prisma
# RUN npx prisma generate
# EXPOSE 3001
# CMD ["npm", "start"]
