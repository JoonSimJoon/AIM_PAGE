-- 데이터베이스 초기화 스크립트
-- PostgreSQL 컨테이너 시작 시 자동 실행됩니다

-- 기본 확장 기능 설치
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 데이터베이스가 정상적으로 생성되었는지 확인
SELECT 'Database initialized successfully' AS status;
