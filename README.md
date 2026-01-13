# 🎖️ TANK Portfolio 2025

> GDC Project Manager의 2025년 프로젝트 포트폴리오 - 밀리터리 테마의 수평 스크롤 타임라인

인터랙티브한 3D 인트로, AI 챗봇, 실시간 데이터 관리가 가능한 현대적인 포트폴리오 웹사이트입니다.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/feel2wa41-art/vibeTank)

---

## ✨ 주요 기능

### 🎬 3D 인트로 화면
- Three.js를 활용한 3D 렌더링
- 밀리터리 스타일의 HUD 디자인
- 터미널 타이핑 애니메이션

### 📊 인터랙티브 타임라인
- 수평 스크롤 방식의 연간 프로젝트 타임라인
- 프로젝트별 상세 정보 (기술 스택, 성과, 챌린지)
- 실시간 진행 상황 표시

### 🤖 AI 챗봇 (Google Gemini)
- Google Gemini 2.0 Flash Lite 모델 연동
- 스트리밍 방식의 실시간 응답
- 포트폴리오 관련 질문 답변

### 🎯 2026 목표 관리
- 인터랙티브한 목표 카드
- 주요 기능 및 마일스톤 표시

### 🔐 Admin 페이지
- 프로필 정보 관리
- 프로젝트 CRUD (생성, 읽기, 수정, 삭제)
- 2026 목표 관리
- 데이터 백업/복원 (JSON)
- Supabase 실시간 동기화

---

## 🛠️ 기술 스택

### Frontend
- **React 19.2** - 최신 React 버전
- **TypeScript** - 타입 안전성
- **Vite 7** - 고속 빌드 도구
- **Tailwind CSS 3** - 유틸리티 CSS 프레임워크
- **Three.js** - 3D 그래픽
- **@react-three/fiber** - React용 Three.js

### Backend & Services
- **Vercel** - 서버리스 배포
- **Supabase** - 실시간 데이터베이스
- **Google Gemini API** - AI 챗봇

### AI & ML
- **@ai-sdk/google** - Google AI SDK
- **Vercel AI SDK** - 스트리밍 AI 응답

---

## 🚀 Quick Start

### 1. 저장소 클론

```bash
git clone https://github.com/feel2wa41-art/vibeTank.git
cd vibeTank
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env.example`을 복사해서 `.env` 파일을 만듭니다:

```bash
cp .env.example .env
```

`.env` 파일에 다음 값들을 입력하세요:

```env
# Supabase (선택사항 - 없으면 localStorage 사용)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Admin 비밀번호 (기본값: tank2025)
VITE_ADMIN_PASSWORD=your-secure-password

# Google Gemini API (AI Chat용 - 선택사항)
GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-api-key
```

**환경 변수 획득 방법:**
- **Supabase**: [Supabase Dashboard](https://supabase.com/dashboard) → Project Settings → API
- **Gemini API**: [Google AI Studio](https://aistudio.google.com/apikey) (무료 1,000 req/day)

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173`을 열어 확인하세요.

### 5. 빌드

```bash
npm run build
```

---

## 🌐 Vercel 배포

### 빠른 배포

1. GitHub에 코드 푸시
2. [Vercel](https://vercel.com)에서 Import Project
3. 환경 변수 설정 (위의 `.env` 내용 참고)
4. Deploy 버튼 클릭!

**상세 가이드:** [VERCEL_SETUP.md](./VERCEL_SETUP.md) 참고

### 환경 변수 설정 (Vercel Dashboard)

Vercel Dashboard → Project Settings → Environment Variables에서 다음을 추가:

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_ADMIN_PASSWORD
GOOGLE_GENERATIVE_AI_API_KEY
```

---

## 📁 프로젝트 구조

```
vibeTank/
├── api/                    # Vercel Serverless Functions
│   └── chat.ts            # Gemini AI API 엔드포인트
├── public/                # 정적 파일
│   └── logos/            # 프로젝트 로고 이미지
├── src/
│   ├── components/        # React 컴포넌트
│   │   ├── IntroScreen.tsx       # 3D 인트로
│   │   ├── AiChat.tsx            # AI 챗봇
│   │   ├── AdminPage.tsx         # Admin 패널
│   │   ├── HeroSection.tsx       # 히어로
│   │   ├── ProjectSection.tsx    # 프로젝트 카드
│   │   ├── TimelineSection.tsx   # 타임라인
│   │   ├── Goals2026Section.tsx  # 2026 목표
│   │   ├── Tank.tsx              # 탱크 애니메이션
│   │   └── ...
│   ├── context/          # React Context
│   │   └── DataContext.tsx       # 전역 상태 관리
│   ├── data/             # 데이터
│   │   └── projects.ts           # 프로젝트 데이터 ⭐
│   ├── hooks/            # Custom Hooks
│   │   └── useHorizontalScroll.ts
│   ├── lib/              # 유틸리티
│   │   └── supabase.ts           # Supabase 클라이언트
│   ├── App.tsx           # 메인 App
│   └── main.tsx          # 엔트리 포인트
├── .env.example          # 환경 변수 예제
├── vercel.json           # Vercel 설정
├── vite.config.ts        # Vite 설정
└── package.json
```

---

## ✏️ 프로젝트 데이터 수정하기

### 방법 1: 코드로 직접 수정

`src/data/projects.ts` 파일에서 프로젝트 정보를 수정하세요:

```typescript
export const projects: Project[] = [
  {
    id: 1,
    name: "프로젝트 이름",
    period: "JAN — JUL",
    timeline: "JAN 2025 — JUL 2025",
    description: "프로젝트 설명...",
    tags: ["React", "TypeScript"],
    icon: "🎯",
    color: "#8bc34a",
    startMonth: 0,  // 0=JAN, 11=DEC
    endMonth: 6,
    // ...
  }
];
```

### 방법 2: Admin 페이지에서 수정

1. 메인 페이지에서 **Admin** 버튼 클릭
2. 비밀번호 입력 (기본값: `tank2025`)
3. Projects 탭에서 프로젝트 추가/수정/삭제
4. Save 버튼으로 저장 (Supabase 또는 localStorage)

---

## 🎮 사용 방법

### Admin 페이지 접근

1. 우측 상단 **Admin** 버튼 클릭
2. 비밀번호 입력 (환경 변수 `VITE_ADMIN_PASSWORD`)
3. 다음 기능 사용 가능:
   - **Profile**: 프로필 정보 수정
   - **Projects**: 프로젝트 관리
   - **2026 Goals**: 목표 관리
   - **Backup**: 데이터 백업/복원
   - **Guide**: 배포 가이드

### AI Chat 사용

1. 우측 하단 💬 버튼 클릭
2. 질문 입력 (예: "프로젝트 경험에 대해 알려주세요")
3. Gemini AI가 실시간으로 응답

---

## 🔧 개발 가이드

### 새로운 프로젝트 추가

1. `src/data/projects.ts`에 프로젝트 추가
2. 로고 이미지를 `public/logos/`에 추가
3. `iconImage` 속성에 경로 설정

### 컴포넌트 수정

모든 컴포넌트는 `src/components/`에 있습니다. Tailwind CSS를 사용합니다.

### 스타일 커스터마이징

`tailwind.config.js`에서 테마 색상을 변경할 수 있습니다:

```js
colors: {
  military: {
    950: '#0a0f0d',
    900: '#1a1f1d',
    // ...
  }
}
```

---

## 🐛 문제 해결

### AI Chat이 작동하지 않음
- `GOOGLE_GENERATIVE_AI_API_KEY` 환경 변수 확인
- Vercel Functions 로그 확인

### Supabase 연결 실패
- `VITE_SUPABASE_URL`과 `VITE_SUPABASE_ANON_KEY` 확인
- Supabase 프로젝트가 활성화되어 있는지 확인
- → 실패 시 자동으로 localStorage로 폴백됨

### 빌드 에러
```bash
# 의존성 재설치
rm -rf node_modules package-lock.json
npm install

# TypeScript 캐시 삭제
rm -rf node_modules/.cache
```

---

## 📄 라이선스

이 프로젝트는 개인 포트폴리오용으로 제작되었습니다.

---

## 🤝 기여

Issue와 Pull Request를 환영합니다!

---

## 📞 연락처

- GitHub: [@feel2wa41-art](https://github.com/feel2wa41-art)
- Email: feel2wa41@gmail.com

---

**Built with ❤️ by TANK**

© 2025 TANK — ALL SYSTEMS OPERATIONAL
