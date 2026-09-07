-- ============================================================
-- 관리자 로그인 도입에 맞춰 DB 쓰기 권한을 "로그인한 사용자"로 제한합니다.
-- 지금은 RLS가 꺼져 있어서, anon key만 있으면(=누구나) 콘텐츠/배너를
-- 추가·수정·삭제할 수 있는 상태입니다. /admin 화면에 로그인을 붙여도
-- 이 SQL을 같이 적용하지 않으면 데이터베이스는 여전히 그대로 열려 있습니다.
--
-- 적용 방법: Supabase 대시보드 → SQL Editor → New query → 이 파일 전체를
-- 붙여넣고 Run. (여러 번 실행해도 안전하도록 DROP POLICY IF EXISTS를 먼저 둠)
-- ============================================================

-- ---------- contents 테이블 ----------
ALTER TABLE contents ENABLE ROW LEVEL SECURITY;

-- 비로그인 방문자: 공개(isPublished=true) 콘텐츠만 조회 가능
DROP POLICY IF EXISTS "public_read_published_contents" ON contents;
CREATE POLICY "public_read_published_contents"
  ON contents FOR SELECT
  TO anon
  USING ("isPublished" = true);

-- 로그인한 관리자: 비공개 포함 전체 조회 가능 (관리자 패널용)
DROP POLICY IF EXISTS "authenticated_read_all_contents" ON contents;
CREATE POLICY "authenticated_read_all_contents"
  ON contents FOR SELECT
  TO authenticated
  USING (true);

-- 쓰기(추가/수정/삭제)는 로그인한 사용자만
DROP POLICY IF EXISTS "authenticated_insert_contents" ON contents;
CREATE POLICY "authenticated_insert_contents"
  ON contents FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_update_contents" ON contents;
CREATE POLICY "authenticated_update_contents"
  ON contents FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_delete_contents" ON contents;
CREATE POLICY "authenticated_delete_contents"
  ON contents FOR DELETE
  TO authenticated
  USING (true);


-- ---------- banners 테이블 ----------
-- (banners 테이블은 이 저장소의 SQL에는 없고 대시보드에서 직접 만드신 것으로
--  보여요. 테이블명이 다르면 아래 "banners"를 실제 테이블명으로 바꿔주세요.)
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_active_banners" ON banners;
CREATE POLICY "public_read_active_banners"
  ON banners FOR SELECT
  TO anon
  USING ("isActive" = true);

DROP POLICY IF EXISTS "authenticated_read_all_banners" ON banners;
CREATE POLICY "authenticated_read_all_banners"
  ON banners FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "authenticated_insert_banners" ON banners;
CREATE POLICY "authenticated_insert_banners"
  ON banners FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_update_banners" ON banners;
CREATE POLICY "authenticated_update_banners"
  ON banners FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_delete_banners" ON banners;
CREATE POLICY "authenticated_delete_banners"
  ON banners FOR DELETE
  TO authenticated
  USING (true);


-- ---------- storage: "banners" 버킷 (배너 이미지 파일) ----------
-- 배너 이미지는 갤러리에 공개로 노출되어야 하므로 읽기는 누구나,
-- 업로드/삭제는 로그인한 사용자만 가능하도록 설정합니다.
DROP POLICY IF EXISTS "public_read_banner_files" ON storage.objects;
CREATE POLICY "public_read_banner_files"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'banners');

DROP POLICY IF EXISTS "authenticated_upload_banner_files" ON storage.objects;
CREATE POLICY "authenticated_upload_banner_files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'banners');

DROP POLICY IF EXISTS "authenticated_update_banner_files" ON storage.objects;
CREATE POLICY "authenticated_update_banner_files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'banners');

DROP POLICY IF EXISTS "authenticated_delete_banner_files" ON storage.objects;
CREATE POLICY "authenticated_delete_banner_files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'banners');
