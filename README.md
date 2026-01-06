# TANK Portfolio 2025

GDC Project Manager의 2025년 프로젝트 포트폴리오 - 밀리터리 테마의 수평 스크롤 타임라인

## 🚀 Quick Start

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

## 📁 프로젝트 구조

```
src/
├── components/          # UI 컴포넌트
│   ├── Tank.tsx        # 탱크 SVG 애니메이션
│   ├── Navbar.tsx      # 네비게이션 바
│   ├── HeroSection.tsx # 히어로 섹션
│   ├── ProjectSection.tsx # 프로젝트 카드
│   ├── TimelineSection.tsx # 연간 타임라인
│   └── ...
├── data/
│   └── projects.ts     # 프로젝트 데이터 (여기서 수정!)
├── hooks/
│   └── useHorizontalScroll.ts
└── App.tsx
```

## ✏️ 프로젝트 수정하기

`src/data/projects.ts` 파일에서 프로젝트 정보를 수정하세요.

## ☁️ AWS Amplify 배포

1. GitHub에 푸시
2. AWS Amplify Console → New App → Host web app
3. GitHub 연결
4. 자동 배포 완료!

## 🛠️ VSCode + Claude 개발

1. Claude Code 확장 설치
2. `code tank-portfolio-2025` 로 프로젝트 열기
3. Claude에게 수정 요청!
