# 🎯 Moti 갤러리 단계별 설치 가이드

**지난번 견적서처럼 직접 설치하고 테스트하는 방식입니다.**

---

## 📋 사전 준비 (설치 필수)

### **1. Node.js 설치** (없으면)
- https://nodejs.org 접속
- **LTS 버전** 다운로드 및 설치
- 설치 확인:
  ```bash
  node --version    # v18.x 이상
  npm --version     # 9.x 이상
  ```

### **2. Git 설치** (없으면)
- https://git-scm.com 다운로드
- 기본 설정으로 설치

### **3. 코드 에디터** (추천)
- VSCode: https://code.visualstudio.com
- WebStorm, Sublime 등 원하는 것 사용

---

## 🚀 **Step 1: 프로젝트 폴더 생성 및 파일 준비**

### **1-1. 폴더 생성**
```bash
mkdir moti-gallery
cd moti-gallery
```

### **1-2. 파일 다운로드 또는 복사**

방법 A: **이 저장소 clone** (추천)
```bash
git clone https://github.com/YOUR_USERNAME/moti-gallery.git .
```

방법 B: **직접 파일 생성**
- 에디터에서 위의 모든 파일들을 수동으로 폴더 구조대로 생성

### **1-3. 폴더 구조 확인**
```
moti-gallery/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── admin/
│       └── page.tsx
├── components/
│   ├── ContentCard.tsx
│   ├── FilterPanel.tsx
│   └── AdminForm.tsx
├── lib/
│   └── supabase.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
├── supabase_init.sql
└── README.md
```

✅ 모든 파일이 있는지 확인

---

## 🔧 **Step 2: Supabase 데이터베이스 설정**

### **2-1. Supabase 계정 생성**
1. https://supabase.com 접속
2. "Sign Up" → 이메일 입력 → 이메일 확인
3. 로그인

### **2-2. 새 프로젝트 생성**
1. Dashboard에서 "New Project" 클릭
2. 프로젝트명: `moti-gallery`
3. 암호 입력: 복잡하게 설정 (기억하기!)
4. Region: **Asia Pacific (ap-southeast-1)** 선택
5. "Create new project" 클릭
6. **3-5분 대기** (프로젝트 초기화)

### **2-3. 데이터베이스 테이블 생성**

1. Supabase 대시보드 좌측에서 "SQL Editor" 클릭
   
2. "New Query" 클릭

3. 다음 SQL **전체를 복사**해서 붙여넣기:

```sql
-- Moti 콘텐츠 갤러리 테이블 생성

-- 컨텐츠 테이블
CREATE TABLE IF NOT EXISTS contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  centerName TEXT NOT NULL,
  location TEXT NOT NULL,
  centerType TEXT NOT NULL CHECK (centerType IN ('rehabilitation', 'pilates', 'fitness', 'performance')),
  purpose TEXT[] NOT NULL DEFAULT '{}',
  mediaType TEXT NOT NULL CHECK (mediaType IN ('youtube', 'instagram', 'image')),
  mediaLink TEXT NOT NULL,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_contents_centerType ON contents(centerType);
CREATE INDEX idx_contents_location ON contents(location);
CREATE INDEX idx_contents_purpose ON contents USING GIN(purpose);
CREATE INDEX idx_contents_createdAt ON contents(createdAt DESC);

-- 샘플 데이터 추가
INSERT INTO contents (title, centerName, location, centerType, purpose, mediaType, mediaLink, description, tags)
VALUES
  (
    '척추 재활 훈련',
    'OO 재활센터',
    '서울시 강남구',
    'rehabilitation',
    ARRAY['rehabilitation', 'strength'],
    'youtube',
    'https://youtube.com/watch?v=example1',
    '척추 부상 회복을 위한 모티 장비 활용 사례',
    ARRAY['척추', '근력', '회복']
  ),
  (
    '필라테스 코어 강화',
    'YY 필라테스 스튜디오',
    '부산시 해운대구',
    'pilates',
    ARRAY['strength', 'flexibility'],
    'instagram',
    'https://instagram.com/p/example2',
    '코어 안정성을 높이는 필라테스 운동',
    ARRAY['필라테스', '코어', '유연성']
  ),
  (
    '체형 교정 운동',
    'ZZ 피트니스',
    '대구시 중구',
    'fitness',
    ARRAY['bodyShape'],
    'youtube',
    'https://youtube.com/watch?v=example3',
    '일상 생활로 인한 체형 불균형 개선',
    ARRAY['체형', '교정']
  );
```

4. "Run" 버튼 클릭
5. ✅ 테이블이 생성되고 샘플 데이터 3개가 추가됨

### **2-4. API 키 복사** (가장 중요!)

1. Supabase 대시보드 좌측 "Settings" 클릭
2. "API" 탭 클릭
3. 다음 2개 값을 **메모장에 복사**:

   ```
   NEXT_PUBLIC_SUPABASE_URL = https://xxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOi...
   ```

---

## 💾 **Step 3: 프로젝트 의존성 설치**

### **3-1. Terminal 열기**
- 프로젝트 폴더에서 우클릭 → "Open terminal here"
- 또는 VSCode에서 `Ctrl + ~`

### **3-2. npm 설치**
```bash
npm install
```

**출력 예시:**
```
added 250 packages in 45s
```

이 과정이 1-2분 걸립니다. ☕ 기다리기...

### **3-3. 설치 확인**
```bash
npm list next react supabase
```

---

## 🔌 **Step 4: 환경변수 설정**

### **4-1. `.env.local` 파일 생성**

프로젝트 루트에 새 파일 생성:

**파일명**: `.env.local`

**내용**:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

**주의:**
- Step 2-4에서 복사한 값 그대로 붙여넣기
- 공백 없이!
- 대소문자 정확하게!

### **4-2. 파일 저장**

Ctrl+S 눌러서 저장

---

## ▶️ **Step 5: 개발 서버 시작**

### **5-1. 서버 실행**
```bash
npm run dev
```

**출력 예시:**
```
> next dev

  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
  - Environments: .env.local
```

### **5-2. 웹 브라우저에서 확인**

1. 브라우저 열기
2. `http://localhost:3000` 접속
3. ✅ 갤러리 페이지가 보이면 성공!

**확인 사항:**
- [ ] "🏋️ Moti 콘텐츠 갤러리" 제목 보이는가?
- [ ] 상단에 "갤러리", "관리자" 메뉴 보이는가?
- [ ] 샘플 콘텐츠 3개가 보이는가?

---

## 🧪 **Step 6: 기능 테스트**

### **6-1. 갤러리 페이지 테스트**

**필터링 테스트:**
1. 좌측 "필터" 패널에서 "재활센터" 체크
2. 콘텐츠가 1개로 줄어드는지 확인
3. 다시 "필라테스" 체크
4. 콘텐츠가 2개로 늘어나는지 확인

**목적별 필터:**
1. "활용 목적"에서 "근력강화" 체크
2. 관련 콘텐츠만 보이는지 확인

**위치별 필터:**
1. "위치"에서 "서울시 강남구" 체크
2. 1개만 보이는지 확인

### **6-2. 관리자 패널 테스트**

1. `http://localhost:3000/admin` 접속
2. "새 콘텐츠 추가" 버튼 클릭
3. 폼이 나타나는지 확인

**테스트 데이터 입력:**
```
제목: 테스트 운동
센터명: 테스트센터
위치: 서울시 종로구
센터 컨셉: 피트니스
활용 목적: ☑ 근력강화
미디어 타입: YouTube
SNS 링크: https://youtube.com/watch?v=dQw4w9WgXcQ
설명: 테스트용 콘텐츠입니다
태그: 테스트, 테스트용
```

4. "추가" 버튼 클릭
5. 다시 갤러리 페이지로 가서 새 콘텐츠가 추가되었는지 확인

### **6-3. 수정/삭제 테스트**

1. 관리자 패널에서 "테스트 운동" 오른쪽 연필 아이콘 클릭
2. 제목을 "테스트 운동 수정됨"으로 변경
3. "수정" 버튼 클릭
4. 갤러리에서 제목이 바뀌었는지 확인

5. 관리자 패널에서 휴지통 아이콘 클릭
6. "정말 삭제하시겠습니까?" 확인
7. 갤러리에서 사라졌는지 확인

✅ **모든 기능이 작동하면 성공!**

---

## 🔒 **Step 7: 실제 콘텐츠 추가 (50개)**

### **7-1. 한 번에 여러 개 추가하는 팁**

관리자 패널에서 순차적으로:
1. SNS 링크 준비
2. "새 콘텐츠 추가" 클릭
3. 정보 입력
4. "추가" 클릭
5. 반복...

### **7-2. 대량 입력하는 경우**

SQL로 직접 추가 가능:

Supabase → SQL Editor:
```sql
INSERT INTO contents (title, centerName, location, centerType, purpose, mediaType, mediaLink, description, tags)
VALUES
  ('제목1', '센터1', '서울', 'rehabilitation', ARRAY['rehabilitation'], 'youtube', 'https://...', '설명1', ARRAY['태그1']),
  ('제목2', '센터2', '부산', 'pilates', ARRAY['strength'], 'instagram', 'https://...', '설명2', ARRAY['태그2']),
  ...
;
```

---

## ⛔ **Step 8: 문제 해결**

### **문제 1: "Cannot find module '@supabase/supabase-js'"**
```bash
# 해결:
npm install @supabase/supabase-js
npm run dev
```

### **문제 2: ".env.local 파일을 찾을 수 없음"**
```bash
# 확인:
# - .env.local 파일이 프로젝트 루트에 있는가?
# - 파일명이 정확한가? (.env.local)
```

### **문제 3: "Supabase 연결 실패"**
```
원인: 환경변수가 잘못됨
해결:
1. .env.local 다시 확인
2. URL과 KEY 공백 없는지 확인
3. Supabase 대시보드에서 다시 복사
4. npm run dev 재실행
```

### **문제 4: "포트 3000이 이미 사용 중"**
```bash
# 다른 포트 사용:
npm run dev -- -p 3001
```

### **문제 5: 콘텐츠가 보이지 않음**
```
원인: 샘플 데이터 미추가
해결:
1. Supabase → SQL Editor
2. INSERT 쿼리 다시 실행
3. 갤러리 새로고침 (F5)
```

---

## 🎉 **Step 9: 배포 준비 (선택)**

로컬에서 완벽하게 작동하면 다음 선택:

### **옵션 A: 로컬에서만 사용**
- `npm run dev` 로 계속 사용
- 다른 팀원과 공유 필요 없으면 OK

### **옵션 B: 온라인에 배포 (무료)**
- Vercel에 배포 (README.md 참고)
- URL로 누구나 접속 가능

### **옵션 C: 회사 서버에 배포**
- 자체 서버에 배포
- 보안 강화 필요

---

## 📝 **체크리스트**

```
설치 및 설정:
[ ] Node.js 설치 확인
[ ] Git 설치 확인
[ ] 프로젝트 폴더 생성
[ ] 파일 복사/clone

Supabase:
[ ] 계정 생성
[ ] 프로젝트 생성
[ ] 테이블 생성 (SQL 실행)
[ ] API 키 복사
[ ] .env.local 파일 생성

로컬 설정:
[ ] npm install 완료
[ ] npm run dev 실행
[ ] http://localhost:3000 접속

테스트:
[ ] 갤러리 페이지 로드
[ ] 샘플 콘텐츠 3개 표시
[ ] 필터링 작동
[ ] 관리자 페이지 접속
[ ] 콘텐츠 추가 작동
[ ] 콘텐츠 수정 작동
[ ] 콘텐츠 삭제 작동

준비:
[ ] 실제 콘텐츠 50개 준비
[ ] 모든 SNS 링크 확인
[ ] 센터별 분류 정의
```

---

## 🚀 **최종 정리**

**로컬에서 작동하는 완전한 시스템이 준비됨:**
- ✅ 공개 갤러리 (필터링)
- ✅ 관리자 패널 (CRUD)
- ✅ Supabase 데이터베이스
- ✅ YouTube/Instagram 임베드

**다음 단계:**
1. 50개 콘텐츠 추가
2. 필요시 배포 (Vercel)
3. 추가 기능 (로그인, 통계 등)

---

**이제 준비됐습니다! 시작하세요! 💪**

궁금한 점이 있으면 각 스텝마다 물어봐주세요.
