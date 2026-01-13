# Vercel 배포 가이드

## 🚀 빠른 배포

1. GitHub 저장소에 코드 푸시
2. [Vercel](https://vercel.com)에서 Import Project
3. 환경 변수 설정 (아래 참고)
4. Deploy 버튼 클릭!

## 🔐 환경 변수 설정

Vercel Dashboard → Project Settings → Environment Variables에서 다음 변수들을 추가하세요:

### 필수 환경 변수

#### 1. Supabase 설정
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**획득 방법:**
1. [Supabase Dashboard](https://supabase.com/dashboard)에서 프로젝트 열기
2. Settings → API → Project URL과 anon public 키 복사

#### 2. Admin 비밀번호
```
VITE_ADMIN_PASSWORD=your-secure-password
```

**설명:** Admin 페이지 접근 비밀번호 (기본값: tank2025)

#### 3. Google Gemini API Key (AI Chat용)
```
GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-api-key
```

**획득 방법:**
1. [Google AI Studio](https://aistudio.google.com/apikey) 방문
2. "Create API Key" 클릭
3. Free tier: 하루 1,000 요청 (gemini-2.0-flash-lite)

---

## 📝 환경 변수 적용 범위

각 환경 변수의 적용 범위를 선택하세요:

- ✅ **Production**: 프로덕션 배포
- ✅ **Preview**: PR 미리보기
- ✅ **Development**: 로컬 개발 (`vercel dev`)

모든 환경에 동일한 값을 사용하거나, 환경별로 다른 값을 설정할 수 있습니다.

---

## 🔄 재배포

환경 변수를 추가하거나 변경한 후:
1. Vercel Dashboard → Deployments
2. 최근 배포에서 "..." 메뉴 → Redeploy
3. "Use existing Build Cache" 체크 해제
4. Redeploy 클릭

---

## 🛠️ 로컬 개발 시 환경 변수

### 방법 1: .env 파일 (권장)
```bash
# .env 파일 생성 (.env.example 참고)
cp .env.example .env

# 값 입력
nano .env
```

### 방법 2: Vercel CLI
```bash
# Vercel 환경 변수를 로컬로 가져오기
vercel env pull
```

---

## ✅ 배포 확인

배포 후 다음을 확인하세요:

1. **메인 페이지** - 프로젝트들이 제대로 표시되는지
2. **Admin 페이지** - 비밀번호 입력 후 접근 가능한지
3. **AI Chat** - 채팅 버튼 클릭 후 응답이 오는지
4. **Supabase 연동** - Admin에서 데이터 저장/로드 되는지

---

## 🐛 문제 해결

### AI Chat이 작동하지 않음
- Vercel Dashboard에서 `GOOGLE_GENERATIVE_AI_API_KEY` 확인
- Vercel Logs에서 API 키 에러 확인

### Supabase 연결 실패
- `VITE_SUPABASE_URL`과 `VITE_SUPABASE_ANON_KEY` 확인
- Supabase 프로젝트가 활성화되어 있는지 확인

### Admin 페이지 접근 불가
- `VITE_ADMIN_PASSWORD` 환경 변수 설정 확인
- 브라우저 캐시 삭제 후 재시도

---

## 📚 추가 자료

- [Vercel 환경 변수 문서](https://vercel.com/docs/projects/environment-variables)
- [Supabase 설정 가이드](https://supabase.com/docs)
- [Google AI Studio](https://aistudio.google.com/)
