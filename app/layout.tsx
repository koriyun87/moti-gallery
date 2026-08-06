import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Moti 콘텐츠 갤러리',
  description: '모티 장비의 활용 사례를 센터별, 목적별로 분류해서 보세요',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="flex flex-col min-h-screen">
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <a href="/" className="flex items-center gap-4 w-fit">
              <img src="/logos/abridge.png" alt="Abridge" className="h-7 w-auto" />
              <div className="w-px h-6 bg-gray-300" />
              <img src="/logos/moty.png" alt="Moty" className="h-6 w-auto" />
            </a>
          </div>
        </nav>

        <div className="flex-1">{children}</div>

        <footer className="bg-gray-900 text-gray-400 text-xs sm:text-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            {/* 에이브릿지 */}
            <div className="space-y-1.5">
              <p className="text-gray-200 font-bold text-sm sm:text-base">
                에이브릿지 (ACPR KOREA)
              </p>
              <p>
                대표. 김진용, 정혜정 &nbsp;|&nbsp; 사업자번호. 148-20-01901
                &nbsp;|&nbsp; 대표번호. 1577-9202 &nbsp;|&nbsp; TEL. 010-9312-8918
              </p>
              <p>
                사업장소재지. 부산광역시 부산진구 중앙대로 694, 9층 63호(부전동, 쥬디스태화)
              </p>
              <p>서울 사무실 주소. 서울특별시 송파구 올림픽로 424 스포츠360랩 201호</p>
              <p>
                E-mail. buzz@abridge.kr &nbsp;|&nbsp; 개인정보보호책임자. 김진용
              </p>
            </div>

            <div className="pt-6 border-t border-gray-800 flex justify-between items-center">
              <p className="text-gray-500">
                Copyright (c) {new Date().getFullYear()} 에이브릿지. All rights reserved.
              </p>
              <a
                href="/admin"
                className="text-gray-500 hover:text-gray-300 transition"
              >
                관리자
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
