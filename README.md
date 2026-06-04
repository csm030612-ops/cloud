# ✦ Portfolio Hub

Next.js + Supabase로 만든 포트폴리오 공유 플랫폼

## 🚀 실행 방법

### 1단계: Supabase 세팅

1. [supabase.com](https://supabase.com) → 프로젝트 생성
2. **SQL Editor** → `supabase-setup.sql` 전체 내용 붙여넣고 Run
3. **Project Settings → API** 에서 URL과 anon key 복사

### 2단계: 환경변수

`.env.local` 파일에서 실제 값으로 교체:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 3단계: 실행

```bash
npm install
npm run dev
```

→ http://localhost:3000

---

### 💡 이메일 인증 없이 바로 로그인하려면

Supabase 대시보드 → Authentication → Providers → Email → **Confirm email OFF**

---

## 📁 구조

```
app/
├── page.tsx              # 홈 (로그인/회원가입)
├── portfolio/page.tsx    # 포트폴리오 갤러리
└── portfolio/new/        # 새 포트폴리오 작성

components/
├── Navbar.tsx
├── AuthForm.tsx
├── PortfolioCard.tsx
└── PortfolioForm.tsx

lib/
├── actions.ts            # Server Actions
├── types.ts
└── supabase/             # client / server / middleware
```
