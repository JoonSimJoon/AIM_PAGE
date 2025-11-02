# 🔒 Public 저장소 전환 보안 체크리스트

이 문서는 Git 저장소를 private에서 public으로 변경하기 전에 확인해야 할 보안 사항들입니다.

## ✅ 필수 확인 사항

### 1. 환경변수 파일 (.env)

**확인 사항:**
- [ ] `.env` 파일이 커밋되지 않았는지 확인
- [ ] `.env.local`, `.env.production` 등 모든 환경변수 파일 무시 확인
- [ ] `env.example` 파일만 커밋되어 있는지 확인

**체크 방법:**
```bash
# 커밋된 .env 파일 확인
git ls-files | grep -E "\.env$|\.env\."

# 또는
git log --all --full-history -- "*\.env*"
```

**위험한 파일이 발견되면:**
```bash
# Git 히스토리에서 완전히 제거
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/.env" \
  --prune-empty --tag-name-filter cat -- --all

# 또는 BFG Repo-Cleaner 사용 (더 빠름)
bfg --delete-files .env
```

### 2. 인증 키 및 비밀번호

**확인 사항:**
- [ ] JWT_SECRET이 코드에 하드코딩되지 않았는지
- [ ] AWS Access Key가 코드에 포함되지 않았는지
- [ ] 데이터베이스 비밀번호가 코드에 포함되지 않았는지
- [ ] API 키가 코드에 포함되지 않았는지

**체크 방법:**
```bash
# 일반적인 키 패턴 검색
git grep -i "secret\|password\|key\|token" -- "*.ts" "*.tsx" "*.js" "*.jsx"

# 실제 값이 들어있는지 확인 (예시)
git grep -E "JWT_SECRET|AWS_ACCESS_KEY|DATABASE_URL" -- "*.ts" "*.tsx"
```

**주의사항:**
- 환경변수로만 사용되는 경우 → 안전 ✅
- 실제 값이 코드에 하드코딩 → 위험 ⚠️

### 3. 백업 파일

**확인 사항:**
- [ ] `*_old.*`, `*.bak`, `*.backup` 파일이 커밋되지 않았는지
- [ ] `schema_old.prisma` 같은 백업 파일 확인

**체크 방법:**
```bash
# 백업 파일 확인
git ls-files | grep -E "(old|backup|bak)"

# 발견된 파일 확인
git ls-files | grep -E "schema_old|.*_old\."
```

**제거 방법:**
```bash
# Git에서 제거
git rm --cached backend/prisma/schema_old.prisma
git commit -m "Remove backup files"
```

### 4. 업로드된 파일

**확인 사항:**
- [ ] `uploads/` 폴더의 파일들이 커밋되지 않았는지
- [ ] 사용자 업로드 파일이 포함되지 않았는지

**체크 방법:**
```bash
# 업로드 폴더 확인
git ls-files | grep -E "uploads/|backend/uploads/|frontend/uploads/"
```

### 5. 데이터베이스 덤프 파일

**확인 사항:**
- [ ] `.sql` 파일에 실제 데이터가 포함되지 않았는지
- [ ] 데이터베이스 덤프 파일이 커밋되지 않았는지

**체크 방법:**
```bash
git ls-files | grep -E "\.sql$|\.dump$"
```

---

## 🛡️ 보안 강화 조치

### 1. .gitignore 확인

```bash
# .gitignore가 제대로 작동하는지 확인
git check-ignore -v path/to/.env
```

### 2. Git 히스토리 정리

**민감한 정보가 이미 커밋되었다면:**

```bash
# 방법 1: git filter-branch (기본 방법)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/sensitive-file" \
  --prune-empty --tag-name-filter cat -- --all

# 방법 2: BFG Repo-Cleaner (권장, 더 빠름)
# https://rtyley.github.io/bfg-repo-cleaner/
java -jar bfg.jar --delete-files sensitive-file.git
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 방법 3: git-filter-repo (최신, 권장)
pip install git-filter-repo
git filter-repo --path path/to/sensitive-file --invert-paths
```

### 3. 환경변수 템플릿 확인

**확인 사항:**
- [ ] `env.example` 파일에 실제 값이 아닌 예시만 있는지
- [ ] 모든 필수 환경변수가 문서화되어 있는지

**예시 파일 구조:**
```bash
# env.example (공개 가능)
DATABASE_URL="postgresql://username:password@localhost:5432/aim_page"
JWT_SECRET="your-jwt-secret-key"
AWS_ACCESS_KEY_ID="your-aws-access-key-id"
AWS_SECRET_ACCESS_KEY="your-aws-secret-access-key"

# .env (무시됨, 실제 값)
DATABASE_URL="postgresql://user:realpassword@db.example.com:5432/aim_page"
JWT_SECRET="actual-secret-key-here"
AWS_ACCESS_KEY_ID="AKIAIOSFODNN7EXAMPLE"
AWS_SECRET_ACCESS_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
```

---

## 📋 Public 전환 전 최종 체크리스트

### 코드 검토
- [ ] 모든 API 키가 환경변수로 관리되는지
- [ ] 하드코딩된 비밀번호가 없는지
- [ ] 디버그 로그에 민감한 정보가 출력되지 않는지
- [ ] 에러 메시지에 민감한 정보가 포함되지 않는지

### 파일 검토
- [ ] `.env` 파일이 Git에 커밋되지 않았는지
- [ ] `uploads/` 폴더가 무시되는지
- [ ] 백업 파일들이 제거되었는지
- [ ] 로그 파일이 커밋되지 않았는지

### 문서 검토
- [ ] README에 실제 비밀번호가 없는지
- [ ] 코드 주석에 민감한 정보가 없는지
- [ ] 커밋 메시지에 비밀번호가 없는지

### Git 히스토리 검토
- [ ] 과거 커밋에 민감한 정보가 있는지 확인
- [ ] 필요시 Git 히스토리 정리

---

## 🚨 발견된 문제 해결 방법

### 민감한 파일이 이미 커밋된 경우

1. **즉시 제거:**
```bash
# 파일 제거
git rm --cached sensitive-file

# 커밋
git commit -m "Remove sensitive file"

# 히스토리에서 완전히 제거 (선택사항)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch sensitive-file" \
  --prune-empty --tag-name-filter cat -- --all
```

2. **비밀번호 변경:**
- AWS 키 변경
- 데이터베이스 비밀번호 변경
- JWT_SECRET 변경
- 기타 노출된 인증 정보 변경

3. **GitHub Secret Scanning:**
- GitHub가 자동으로 탐지한 비밀 정보 확인
- 필요시 GitHub 지원팀에 문의

---

## ✅ Public 전환 후 확인 사항

1. **GitHub Secret Scanning 활성화 확인**
   - Settings → Security → Secret scanning

2. **환경변수 문서화**
   - README에 환경변수 설정 가이드 추가
   - 각 환경변수의 용도 설명

3. **보안 정책 설정**
   - SECURITY.md 파일 생성
   - 취약점 리포트 방법 안내

---

## 📚 참고 자료

- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [Git Filter-Branch](https://git-scm.com/docs/git-filter-branch)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
- [git-filter-repo](https://github.com/newren/git-filter-repo)

---

## ⚠️ 중요 알림

**이 체크리스트를 모두 완료한 후에만 public 저장소로 전환하세요!**

민감한 정보가 노출되면:
1. 즉시 비밀번호/키 변경
2. Git 히스토리 정리
3. 영향받는 서비스 확인 및 조치

