# 백엔드 Dockerfile (프로덕션용)
FROM node:18-alpine AS builder

# OpenSSL 설치 (Prisma 용)
RUN apk add --no-cache openssl-dev openssl

WORKDIR /app

# 의존성 설치
COPY package*.json ./
RUN npm ci

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
RUN npm ci --only=production && npm cache clean --force

# 빌드 결과물 복사
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
RUN npx prisma generate

EXPOSE 3001

CMD ["node", "dist/src/index.js"]
