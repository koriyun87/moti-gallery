'use client'

import { usePathname } from 'next/navigation'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'

// 방문자 분석 도구 2가지를 한곳에서 관리합니다.
// 1) Vercel Web Analytics : 방문자 수, 많이 본 페이지, 유입 경로, 기기
// 2) Microsoft Clarity    : 히트맵, 세션 녹화(방문자 화면 움직임 재생)
//
// 관리자 페이지(/admin)는 직원만 쓰는 곳이라 통계를 흐리지 않도록 제외합니다.

const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID

export default function SiteAnalytics() {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')
  return (
    <>
      <Analytics
        beforeSend={(event) =>
          new URL(event.url).pathname.startsWith('/admin') ? null : event
        }
      />

      {CLARITY_ID && !isAdmin && (
        <Script id="ms-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${CLARITY_ID}");`}
        </Script>
      )}
    </>
  )
}
