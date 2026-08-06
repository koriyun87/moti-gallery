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

-- 인덱스 생성 (검색 성능 최적화)
CREATE INDEX idx_contents_centerType ON contents(centerType);
CREATE INDEX idx_contents_location ON contents(location);
CREATE INDEX idx_contents_purpose ON contents USING GIN(purpose);
CREATE INDEX idx_contents_createdAt ON contents(createdAt DESC);

-- RLS (Row Level Security) 비활성화 (공개 읽기, 모든 쓰기 허용)
-- 프로덕션에서는 반드시 보안을 강화하세요
ALTER TABLE contents DISABLE ROW LEVEL SECURITY;

-- 샘플 데이터 (선택사항)
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
