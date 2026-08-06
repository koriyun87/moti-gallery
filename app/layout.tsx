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
      <body>
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img src="/logos/abridge.png" alt="Abridge" className="h-7 w-auto" />
              <div className="w-px h-6 bg-gray-300" />
              <img src="/logos/moty.png" alt="Moty" className="h-6 w-auto" />
            </div>
            <div className="space-x-4">
              <a href="/" className="text-gray-600 hover:text-moti-primary font-medium">
                갤러리
              </a>
              <a href="/admin" className="text-gray-600 hover:text-moti-primary font-medium">
                관리자
              </a>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
