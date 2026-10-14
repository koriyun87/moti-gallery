import { supabase } from '@/lib/supabase'

// 방문자가 콘텐츠를 눌렀을 때 Supabase(content_clicks 표)에 한 줄 기록합니다.
// 기록이 실패해도 방문자 화면에는 아무 영향이 없도록 오류는 조용히 무시합니다.
export function trackContentClick(contentId: string, action: 'open' | 'play') {
  supabase
    .from('content_clicks')
    .insert({ content_id: contentId, action })
    .then(({ error }) => {
      if (error) console.warn('click tracking failed:', error.message)
    })
}
