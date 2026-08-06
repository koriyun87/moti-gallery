# 🏋️ Moti 콘텐츠 갤러리

모티 장비의 활용 사례를 센터별, 목적별로 분류해서 보여주는 웹사이트입니다.

## 🎯 기능

✅ **공개 갤러리** - SNS 콘텐츠를 필터링해서 감상
- 센터 컨셉별 필터 (재활 | 필라테스 | 피트니스 | 퍼포먼스)
- 활용 목적별 필터 (재활훈련 | 체형교정 | 근력강화 | 유연성 | 운동 능력 개발)
- 위치별 필터

✅ **관리자 패널** - 콘텐츠 관리
- 새 콘텐츠 추가
- 기존 콘텐츠 수정/삭제
- YouTube, Instagram 링크 지원

---

## 📋 사전 준비

### 1️⃣ GitHub 계정
- https://github.com 가입 (무료)

### 2️⃣ Supabase 계정 (무료 데이터베이스)
- https://supabase.com 접속
- "Start your project" 클릭
- 이메일로 가입
- 새 프로젝트 생성

### 3️⃣ Vercel 계정 (무료 호스팅)
- https://vercel.com 접속
- GitHub으로 회원가입

---

## 🚀 설치 및 배포 (5단계, 10분)

### **Step 1: 이 코드를 GitHub에 업로드**

1. GitHub에서 새 저장소 생성
   - 저장소명: `moti-gallery`
   - Public으로 설정

2. 로컬에서 클론 (또는 zip으로 다운로드)
   ```bash
   git clone https://github.com/YOUR_USERNAME/moti-gallery.git
   cd moti-gallery
   ```

3. 파일들을 저장소에 추가
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

---

### **Step 2: Supabase 데이터베이스 생성**

1. **Supabase 프로젝트 생성**
   - https://supabase.com/dashboard 접속
   - "New Project" 클릭
   - 프로젝트명: `moti-gallery`
   - 암호 설정 (기억해두기)
   - Region: `Asia Pacific (ap-southeast-1)`

2. **테이블 생성**
   - Supabase 대시보드 → SQL Editor
   - "New Query" 클릭
   - 다음 파일의 SQL을 복사/붙여넣기: `supabase_init.sql`
   - "Run" 클릭

3. **API 키 얻기**
   - Settings → API → Project URL, anon key 복사
   - 메모장에 저장 (다음 단계에서 필요)

---

### **Step 3: Vercel에 배포**

1. https://vercel.com/dashboard 접속

2. "Add New..." → "Project" 클릭

3. GitHub 저장소 선택
   - `moti-gallery` 저장소 선택

4. **환경변수 추가**
   - "Environment Variables" 섹션
   - 다음 값들 입력:
     ```
     NEXT_PUBLIC_SUPABASE_URL = [Supabase 프로젝트 URL]
     NEXT_PUBLIC_SUPABASE_ANON_KEY = [Supabase anon key]
     ```

5. "Deploy" 클릭
   - 배포 완료 대기 (1-2분)

6. **배포 완료!**
   - Vercel이 제공하는 URL 확인
   - 예: `https://moti-gallery.vercel.app`

---

### **Step 4: 도메인 연결 (선택사항)**

무료 도메인 원하면:
1. Vercel Dashboard에서 "Domains" 클릭
2. Freenom (https://www.freenom.com)에서 무료 도메인 등록 후 연결

---

### **Step 5: 첫 콘텐츠 추가**

1. 배포된 사이트 방문
2. 상단 "관리자" 클릭
3. "새 콘텐츠 추가" 버튼 클릭
4. SNS 정보 입력

---

## 📝 사용 방법

### **콘텐츠 추가 양식**

| 필드 | 설명 | 예시 |
|------|------|------|
| **제목** | 활용 사례 제목 | 척추 재활 훈련 |
| **센터명** | 콘텐츠 올린 센터 | OO 재활센터 |
| **위치** | 센터 위치 | 서울시 강남구 |
| **센터 컨셉** | 센터 유형 | 재활센터 |
| **활용 목적** | 주 활용 목적 (복수선택) | 재활훈련, 근력강화 |
| **미디어 타입** | YouTube 또는 Instagram | YouTube |
| **SNS 링크** | YouTube/Instagram 게시물 주소 | https://youtube.com/watch?v=... |
| **설명** | 활용 사례 설명 | 환자가 느낀 변화... |
| **태그** | 검색용 키워드 | 척추, 근력, 회복 |

---

## 🎨 커스터마이징

### **색상 변경**
`tailwind.config.ts` 파일 수정:
```typescript
moti: {
  primary: '#FF6B35',      // 주 색상 (오렌지)
  secondary: '#004E89',    // 보조 색상 (파랑)
  light: '#F7F7F7',        // 라이트
  dark: '#1A1A1A',         // 다크
},
```

### **필터 옵션 추가/변경**
`app/page.tsx`의 `CENTER_TYPES`, `PURPOSES` 수정:
```javascript
const CENTER_TYPES = [
  { id: 'rehabilitation', label: '재활센터' },
  { id: 'newType', label: '새로운 타입' }, // 추가
  ...
]
```

---

## 🔒 보안 주의사항

**프로덕션 배포 전:**
1. Supabase RLS (Row Level Security) 활성화
2. 관리자 로그인 추가 (비밀번호 인증)
3. API 키 환경변수로 관리

현재는 테스트용이므로 누구나 콘텐츠 추가 가능합니다.

---

## 📱 반응형 디자인

✅ 모바일 (모든 화면 크기)
✅ 태블릿
✅ 데스크톱

---

## ⚙️ 기술 스택

- **프론트엔드**: React 18, Next.js 14, Tailwind CSS
- **백엔드**: Supabase (PostgreSQL)
- **호스팅**: Vercel
- **상태관리**: React Hooks

---

## 📞 문제 해결

### "Supabase 연결 실패"
- ✅ 환경변수 확인 (대소문자 구분)
- ✅ Supabase 프로젝트가 활성화되어 있는지 확인
- ✅ anon key가 올바른지 재확인

### "콘텐츠가 보이지 않음"
- ✅ Supabase 테이블 생성 확인 (supabase_init.sql 실행)
- ✅ 샘플 데이터 확인

### "배포가 실패함"
- ✅ GitHub 저장소 public 설정 확인
- ✅ package.json에 의존성이 정확한지 확인

---

## 📈 향후 기능 추가 계획

- [ ] 사용자 댓글/평가
- [ ] SNS 자동 크롤링
- [ ] 통계 대시보드
- [ ] 다국어 지원
- [ ] 다크 모드

---

## 📄 라이선스

MIT License

---

## 🤝 지원

문제 발생 시:
1. GitHub Issues에 보고
2. Supabase 문서: https://supabase.com/docs
3. Vercel 문서: https://vercel.com/docs

---

**Happy coding! 🚀**
