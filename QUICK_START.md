# ⚡ 빠른 시작 (10분)

## 📦 최종 완성 구조

```
moti-gallery/
├── app/
│   ├── layout.tsx          # 루트 레이아웃
│   ├── page.tsx            # 공개 갤러리 페이지
│   ├── globals.css         # 전역 스타일
│   └── admin/
│       └── page.tsx        # 관리자 페이지
├── components/
│   ├── ContentCard.tsx     # 콘텐츠 카드
│   ├── FilterPanel.tsx     # 필터 패널
│   └── AdminForm.tsx       # 관리자 폼
├── lib/
│   └── supabase.ts         # Supabase 클라이언트
├── package.json            # 의존성
├── tailwind.config.ts      # Tailwind 설정
├── tsconfig.json           # TypeScript 설정
├── next.config.js          # Next.js 설정
├── supabase_init.sql       # DB 초기화 SQL
├── README.md               # 전체 가이드
└── .env.local.example      # 환경변수 템플릿
```

---

## 🚀 3단계 배포 (처음부터 끝까지)

### **1단계: Supabase 데이터베이스 설정 (3분)**

1. **Supabase 가입**
   - https://supabase.com 방문
   - "Sign Up" → 이메일로 가입

2. **새 프로젝트 생성**
   - "New Project" 클릭
   - 프로젝트명: `moti-gallery`
   - 암호 설정 (기억해두기)
   - Region: Asia Pacific (ap-southeast-1) 선택

3. **테이블 생성**
   - 대시보드 좌측 "SQL Editor" 클릭
   - "New Query" → `supabase_init.sql` 파일의 모든 SQL 복사
   - 붙여넣기 후 "Run" 클릭

4. **API 키 복사**
   - 좌측 "Settings" → "API" 클릭
   - **Project URL** 복사
   - **anon public** key 복사
   - 메모장에 저장 (다음 단계에서 필요)

---

### **2단계: GitHub에 업로드 (3분)**

#### **GitHub 계정 없으면:**
- https://github.com 가입

#### **새 저장소 생성:**
1. GitHub 로그인
2. "+" 메뉴 → "New repository"
3. 저장소명: `moti-gallery`
4. Public 선택
5. "Create repository" 클릭

#### **코드 업로드:**

**방법 A: 명령줄 (추천)**
```bash
git clone https://github.com/YOUR_USERNAME/moti-gallery.git
cd moti-gallery

# 모든 파일 추가
git add .
git commit -m "Initial commit"
git push origin main
```

**방법 B: GitHub 웹사이트**
1. "uploading an existing file" 클릭
2. 모든 폴더/파일 드래그앤드롭
3. "Commit changes" 클릭

---

### **3단계: Vercel 배포 (2분)**

1. **Vercel 가입**
   - https://vercel.com 접속
   - "Sign Up with GitHub" 클릭
   - GitHub 권한 승인

2. **프로젝트 배포**
   - Vercel 대시보드 → "Add New" → "Project"
   - GitHub에서 `moti-gallery` 저장소 선택
   - "Import" 클릭

3. **환경변수 설정**
   - "Environment Variables" 섹션
   - 다음 2개 추가:

   ```
   NEXT_PUBLIC_SUPABASE_URL
   ┗ [Supabase에서 복사한 Project URL]

   NEXT_PUBLIC_SUPABASE_ANON_KEY
   ┗ [Supabase에서 복사한 anon key]
   ```

4. **배포 시작**
   - "Deploy" 클릭
   - 1-2분 대기
   - ✅ 완료! Vercel이 제공하는 URL로 접속

---

## ✅ 작동 확인

### **공개 갤러리**
- 배포된 URL 방문 (예: `https://moti-gallery.vercel.app`)
- 샘플 콘텐츠 3개 보이는지 확인
- 필터링 작동 확인

### **관리자 패널**
- URL 끝에 `/admin` 추가 (예: `/admin`)
- "새 콘텐츠 추가" 버튼 클릭
- 폼 입력 가능한지 확인

---

## 📝 첫 콘텐츠 추가 방법

1. 사이트의 `/admin` 페이지로 이동
2. "새 콘텐츠 추가" 클릭
3. 다음 정보 입력:

   | 필드 | 예시 |
   |------|------|
   | **제목** | 척추 재활 훈련 |
   | **센터명** | OO 재활센터 |
   | **위치** | 서울시 강남구 |
   | **센터 컨셉** | 재활센터 |
   | **활용 목적** | 재활훈련, 근력강화 (체크) |
   | **미디어 타입** | YouTube 선택 |
   | **SNS 링크** | https://youtube.com/watch?v=ABC123 |
   | **설명** | 환자가 느낀 변화... |
   | **태그** | 척추, 근력, 회복 |

4. "추가" 버튼 클릭
5. 갤러리에서 바로 확인 가능 ✨

---

## 🎨 커스터마이징 (선택사항)

### **사이트 제목/설명 변경**
`app/layout.tsx` 수정:
```typescript
export const metadata: Metadata = {
  title: '내 사이트 제목',
  description: '설명 텍스트',
}
```

### **색상 변경**
`tailwind.config.ts` 수정:
```typescript
moti: {
  primary: '#FF6B35',      // 오렌지 → 원하는 색으로 변경
  secondary: '#004E89',    // 파랑 → 원하는 색으로 변경
}
```

### **필터 옵션 변경**
`app/page.tsx` 수정:
```javascript
const CENTER_TYPES = [
  { id: 'rehabilitation', label: '재활센터' },
  { id: 'newType', label: '새로운 유형' }, // 추가
]
```

---

## 🔄 변경사항 반영하는 방법

코드 수정 후:
```bash
git add .
git commit -m "변경 설명"
git push origin main
```
→ Vercel이 자동으로 배포 (1-2분)

---

## 🆘 문제 해결

| 문제 | 해결 방법 |
|------|---------|
| 갤러리가 비어있음 | Supabase SQL 실행했는지 확인 |
| "Supabase 연결 실패" | 환경변수 URL/KEY 확인 (공백, 오타) |
| 배포가 실패함 | Vercel Dashboard → "Build Logs" 확인 |
| 필터가 작동 안함 | 브라우저 새로고침 (Ctrl+Shift+Del) |

---

## 📱 완성된 사이트 기능

✅ 갤러리 페이지
- YouTube / Instagram 임베드
- 센터별 필터
- 목적별 필터
- 위치별 필터
- 반응형 디자인 (모바일 OK)

✅ 관리자 페이지
- 콘텐츠 추가
- 콘텐츠 수정
- 콘텐츠 삭제
- 목록 관리

---

## 🎯 다음 단계 (선택)

1. **더 많은 샘플 데이터 추가** → 갤러리 채우기
2. **관리자 로그인 추가** → 보안 강화 (별도 가이드)
3. **도메인 연결** → moti-gallery.com 같은 도메인 (Vercel 제공)
4. **분석 추가** → Google Analytics 연동

---

**축하합니다! 🎉 Moti 콘텐츠 갤러리가 완성되었습니다!**
