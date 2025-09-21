# 동아리 웹사이트 Color Guide

## 0. 기본 컨셉
- **배경색**: 검은색 (#000000)
- **분위기**: 미래지향적, 기술적, 심플 + 동아리 로고와 어울리는 톤
- **원칙**: 높은 대비(Contrast), 가독성 확보, 강조 색상 최소화

---

## 1. 기본 팔레트

| 역할          | HEX      | 사용처 |
|---------------|----------|--------|
| Primary (메인)| #00BFFF  | 주요 버튼, 링크, 하이라이트 |
| Secondary     | #FF4081  | 포인트 강조, 배너, CTA |
| Accent        | #FFD700  | 아이콘, 작은 장식, 수상경력 강조 |
| Background    | #000000  | 전체 배경 |
| Surface       | #111111  | 카드, 컨테이너 배경 |
| Border/Line   | #333333  | 구분선, 박스 테두리 |
| Text - 기본   | #FFFFFF  | 본문 텍스트 |
| Text - 보조   | #AAAAAA  | 설명/부제, 덜 중요한 정보 |

---

## 2. 확장 팔레트 (옵션)

### Cool Tone (AI/Tech 느낌)
- Blue Neon: #00FFFF
- Purple Glow: #9D4EDD

### Warm Tone (친근함 강조)
- Orange: #FF9800
- Light Pink: #FFB6C1

### 관리자 페이지 전용 색상
- Surface Dark: #374151 (gray-700) - 인터랙티브 박스, 빠른 작업 카드, 입력 필드
- Border Medium: #4B5563 (gray-600) - 카드 테두리, 호버 효과, 입력 필드 테두리
- Icon Cyan: #22D3EE (cyan-400) - 멤버 관리 아이콘
- Icon Pink: #F472B6 (pink-400) - 활동 관리 아이콘  
- Icon Yellow: #FACC15 (yellow-400) - 스터디 관리 아이콘
- Primary Button: #0891B2 (cyan-600) - 주요 액션 버튼
- Success Badge: #059669 (green-600) - 성공/활성 상태 표시
- Warning Badge: #DC2626 (red-600) - 경고/비활성 상태 표시
- Admin Badge: #DB2777 (pink-600) - 관리자 권한 표시

---

## 3. 사용 가이드

- **Primary (#00BFFF)**  
  버튼, 주요 링크, hover 효과 등에 사용. 브랜드 대표 색상.  
- **Secondary (#FF4081)**  
  한정적으로 강조할 때 사용 (모집 안내, 이벤트 배너).  
- **Accent (#FFD700)**  
  수상경력, 주요 성과 등에서 주목 포인트.  
- **Background (#000000)**  
  전체 화면 배경.  
- **Surface (#111111)**  
  카드형 컨텐츠 영역.  
- **Border/Line (#333333)**  
  구분선, section 간 구별.  
- **Text - 기본/보조**  
  - 기본: 흰색 (#FFFFFF)  
  - 보조: 회색 (#AAAAAA), 중요도 낮은 설명용.  

---

## 4. 대비 및 접근성
- 텍스트와 배경 대비율은 최소 WCAG AA 기준(4.5:1 이상) 유지.  
- Primary/Secondary 색상은 hover 시 밝기 15% 증가 처리.  
- 링크 hover, 버튼 hover → box-shadow + 색상 강조로 피드백 제공.

---

## 5. 예시
- 메인 히어로 배너: 검정 배경 + Primary 버튼 (#00BFFF) + Secondary 링크 (#FF4081)  
- 활동 카드: Surface(#111111) + 흰색 텍스트 + Accent 아이콘(#FFD700)  
- Footer: 배경 검정(#000000) + 보조 텍스트(#AAAAAA)  
- 관리자 빠른 작업 박스: bg-gray-700 (#374151) + border-gray-600 (#4B5563) + hover:bg-gray-600 (#4B5563)
- 관리자 시스템 정보 카드: bg-gray-800 (#1F2937) 메인 + bg-gray-700 (#374151) 서브카드 + border-gray-600/700 (#4B5563/#374151)
- 멤버 관리 카드: bg-gray-800 (#1F2937) + 프로필 그라데이션(cyan-400 to pink-500) + 상태 배지(각 색상별)
- Sticky 네비게이션: bg-black/bg-gray-800 + backdrop-blur-sm + bg-opacity-95 + shadow 효과
- 오버스크롤 배경: body::before/after로 상하단 검은색 영역 확장 (자연스러운 스크롤 유지)
- 모집 페이지 정보 카드: bg-gray-800 메인 + bg-gray-700 서브카드 + 색상별 구분 (cyan/pink/yellow/purple)
- 모집 페이지 단계 표시: 숫자 배지 (cyan-500/pink-500/yellow-500) + 체크 아이콘  