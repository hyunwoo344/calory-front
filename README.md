# 🍽️ Calory Frontend

칼로리 관리 및 음식 분석을 위한 Next.js 기반 프론트엔드 애플리케이션입니다.

## 🌟 주요 기능

- 📊 **실시간 칼로리 추적**: 직관적인 대시보드로 일일 칼로리 섭취량 확인
- 🥗 **음식 분석**: 이미지 업로드를 통한 자동 음식 인식 및 영양 정보 분석  
- 📱 **반응형 디자인**: 모바일, 태블릿, 데스크톱 완벽 지원
- 🎨 **모던 UI/UX**: Tailwind CSS와 Headless UI로 구현한 세련된 인터페이스
- 🔐 **사용자 인증**: 안전한 로그인/회원가입 시스템
- 📈 **데이터 시각화**: 칼로리 섭취 패턴과 영양 정보 차트
- 💫 **실시간 알림**: React Hot Toast를 활용한 사용자 피드백

## 🛠 기술 스택

### Core
- **Next.js 14** - React 기반 풀스택 프레임워크
- **TypeScript** - 정적 타입 지원
- **React 18** - 최신 React 기능 활용

### Styling & UI
- **Tailwind CSS 3.3** - 유틸리티 퍼스트 CSS 프레임워크
- **Headless UI** - 완전한 접근성을 갖춘 UI 컴포넌트
- **Heroicons** - 아름다운 SVG 아이콘 세트
- **PostCSS & Autoprefixer** - CSS 후처리

### Libraries
- **Axios** - HTTP 클라이언트
- **React Dropzone** - 파일 업로드 인터페이스
- **React Hot Toast** - 사용자 알림 시스템

### Development
- **ESLint** - 코드 품질 관리
- **Next.js ESLint Config** - Next.js 최적화된 린팅

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 React 컴포넌트
│   ├── ui/             # 기본 UI 컴포넌트 (Button, Input 등)
│   ├── layout/         # 레이아웃 컴포넌트 (Header, Footer 등)
│   └── features/       # 기능별 컴포넌트
├── pages/              # Next.js 페이지 컴포넌트
│   ├── api/           # API 라우트
│   ├── auth/          # 인증 관련 페이지
│   └── dashboard/     # 대시보드 페이지
├── services/           # API 호출 로직
├── types/              # TypeScript 타입 정의
├── utils/              # 유틸리티 함수
└── styles/             # 글로벌 스타일
```

## ⚙️ 설치 및 실행

### Prerequisites
- Node.js 18.0 이상
- npm 또는 yarn

### 1. 저장소 클론
```bash
git clone <repository-url>
cd calory/frontend
```

### 2. 의존성 설치
```bash
npm install
# 또는
yarn install
```

### 3. 환경변수 설정
```bash
cp .env.example .env.local
```

`.env.local` 파일을 편집하여 필요한 환경변수를 설정하세요:
```env
# API 서버 URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# 인증
NEXT_PUBLIC_JWT_SECRET=your-jwt-secret

# 외부 API (필요시)
NEXT_PUBLIC_FOOD_API_KEY=your-api-key
```

### 4. 개발 서버 실행
```bash
npm run dev
# 또는
yarn dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하세요.

## 🚀 빌드 및 배포

### 프로덕션 빌드
```bash
npm run build
npm start
```

### 정적 사이트 내보내기
```bash
npm run build
npm run export
```

### Vercel 배포
```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel --prod
```

## 📱 주요 화면

### 🏠 대시보드
- 일일/주간/월간 칼로리 섭취 현황
- 목표 칼로리 대비 진행률
- 최근 식단 기록

### 🔍 음식 분석
- 이미지 업로드를 통한 음식 인식
- 영양 성분 자동 분석
- 칼로리 계산 및 기록

### 📊 통계
- 칼로리 섭취 패턴 차트
- 영양소별 분석 그래프
- 목표 달성 현황

### ⚙️ 설정
- 개인 정보 관리
- 목표 칼로리 설정
- 알림 설정

## 🧪 개발 가이드

### 컴포넌트 생성
```typescript
// src/components/ui/Button.tsx
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

export default function Button({ children, variant = 'primary', onClick }: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 rounded-md ${
        variant === 'primary' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

### API 호출
```typescript
// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const foodService = {
  analyzeFood: (imageFile: File) => api.post('/foods/analyze/', { image: imageFile }),
  getCalories: () => api.get('/calories/'),
  addCalorie: (data: CalorieData) => api.post('/calories/', data),
};
```

### 스타일 가이드
- Tailwind CSS 유틸리티 클래스 사용
- 컴포넌트별 스타일 분리
- 다크 모드 지원을 위한 색상 변수 사용

## 🔧 환경변수

| 변수명 | 설명 | 기본값 |
|--------|------|--------|
| `NEXT_PUBLIC_API_URL` | 백엔드 API 서버 URL | `http://localhost:8000` |
| `NEXT_PUBLIC_JWT_SECRET` | JWT 토큰 시크릿 | - |
| `NEXT_PUBLIC_FOOD_API_KEY` | 음식 API 키 | - |

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 커밋 메시지 규칙
- `feat:` 새로운 기능 추가
- `fix:` 버그 수정
- `docs:` 문서 수정
- `style:` 스타일 변경
- `refactor:` 코드 리팩토링
- `test:` 테스트 코드 추가

## 📞 문의

프로젝트에 대한 질문이나 제안사항이 있으시면 이슈를 등록해주세요.

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.

---

⭐ 이 프로젝트가 도움이 되셨다면 스타를 눌러주세요!