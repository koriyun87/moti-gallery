-- ============================================================
-- 콘텐츠 클릭 기록 (어떤 게시글을 몇 번 눌렀는지)
--
-- 적용 방법: Supabase 대시보드 → SQL Editor → New query →
-- 이 파일 전체를 붙여넣고 Run. 여러 번 실행해도 안전합니다.
-- ============================================================

-- 1) 클릭 기록 테이블
CREATE TABLE IF NOT EXISTS content_clicks (
  id BIGSERIAL PRIMARY KEY,
  content_id UUID NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
  action TEXT NOT NULL DEFAULT 'open',   -- open: 카드 클릭 / play: 유튜브 재생
  clicked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_clicks_clicked_at
  ON content_clicks (clicked_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_clicks_content_id
  ON content_clicks (content_id);

-- 2) 권한: 방문자는 "기록 남기기"만, 조회는 로그인한 관리자만
ALTER TABLE content_clicks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anyone_insert_clicks" ON content_clicks;
CREATE POLICY "anyone_insert_clicks"
  ON content_clicks FOR INSERT
  TO anon, authenticated
  WITH CHECK (action IN ('open', 'play'));

DROP POLICY IF EXISTS "authenticated_read_clicks" ON content_clicks;
CREATE POLICY "authenticated_read_clicks"
  ON content_clicks FOR SELECT
  TO authenticated
  USING (true);

-- 3) 관리자 화면용 집계 함수 (기간 내 콘텐츠별 클릭 수)
--    SECURITY INVOKER라서 위 권한이 그대로 적용됩니다(관리자만 결과가 보임).
CREATE OR REPLACE FUNCTION content_click_counts(since TIMESTAMPTZ)
RETURNS TABLE (content_id UUID, opens BIGINT, plays BIGINT)
LANGUAGE sql
STABLE
SECURITY INVOKER
AS $$
  SELECT
    content_id,
    COUNT(*) FILTER (WHERE action = 'open') AS opens,
    COUNT(*) FILTER (WHERE action = 'play') AS plays
  FROM content_clicks
  WHERE clicked_at >= since
  GROUP BY content_id;
$$;
