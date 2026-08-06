'use client'

import { useState } from 'react'
import { Content } from '@/lib/supabase'
import { MapPin, Tag } from 'lucide-react'

const CENTER_TYPE_LABEL: Record<string, string> = {
  rehabilitation: '재활센터',
  pilates: '필라테스',
  fitness: '일반피트니스',
  performance: '퍼포먼스',
}

const PURPOSE_LABEL: Record<string, string> = {
  rehabilitation: '재활훈련',
  bodyShape: '체형교정',
  strength: '근력강화',
  flexibility: '유연성',
  athleticism: '운동 능력 개발',
}

function InstagramThumbnail({ content }: { content: Content }) {
  const [failed, setFailed] = useState(false)
  const match = content.mediaLink.match(/\/p\/([^/?]+)/)
  const instagramId = match ? match[1] : ''

  if (!instagramId || failed) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 text-white p-3 sm:p-5 flex flex-col justify-center gap-2 sm:gap-3 overflow-hidden">
        <div>
          {content.tags.length > 0 && (
            <p className="text-[10px] sm:text-xs text-gray-400 mb-1 sm:mb-2 line-clamp-1">
              {content.tags.map((t) => '#' + t).join(' ')}
            </p>
          )}
          <h4 className="text-sm sm:text-xl font-bold leading-snug bg-gradient-to-r from-sky-300 to-emerald-300 bg-clip-text text-transparent line-clamp-3">
            {content.title}
          </h4>
        </div>
        <div>
          {content.description && (
            <p className="text-[10px] sm:text-xs text-gray-300 line-clamp-2 mb-1 sm:mb-2">
              {content.description}
            </p>
          )}
          <p className="text-[9px] sm:text-xs text-gray-500">
            {content.centerName} · {content.location}
          </p>
        </div>
      </div>
    )
  }

  return (
    <img
      src={'https://www.instagram.com/p/' + instagramId + '/media/?size=l'}
      alt={content.title}
      loading="lazy"
      onError={() => setFailed(true)}
      className="absolute inset-0 w-full h-full object-cover"
    />
  )
}

function MediaEmbed({ content }: { content: Content }) {
  if (content.mediaType === 'youtube') {
    const videoId =
      new URL(content.mediaLink).searchParams.get('v') ||
      content.mediaLink.split('/').pop()

    return (
      <iframe
        className="absolute inset-0 w-full h-full"
        src={'https://www.youtube.com/embed/' + videoId}
        title={content.title}
        allowFullScreen
      />
    )
  }

  if (content.mediaType === 'instagram') {
    return <InstagramThumbnail content={content} />
  }

  return null
}

export default function ContentCard({ content }: { content: Content }) {
  const aspectClass =
    content.mediaType === 'instagram' ? 'sm:aspect-[3/4]' : 'sm:aspect-video'

  return (
    <a
      href={content.mediaLink}
      target="_blank"
      rel="noopener noreferrer"
      className="flex sm:block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
    >
      {/* 미디어 */}
      <div
        className={
          'relative bg-gray-100 overflow-hidden shrink-0 w-28 h-28 sm:w-full sm:h-auto ' +
          aspectClass
        }
      >
        <MediaEmbed content={content} />
      </div>

      {/* 콘텐츠 정보 */}
      <div className="p-3 sm:p-6 flex-1 min-w-0">
        {/* 센터 정보 */}
        <div>
          <h3 className="text-sm sm:text-lg font-bold text-gray-900 mb-1 line-clamp-1 sm:line-clamp-none">
            {content.title}
          </h3>
          <div className="flex items-start gap-1 text-xs sm:text-sm text-gray-600">
            <MapPin size={14} className="mt-0.5 flex-shrink-0 hidden sm:block" />
            <p className="font-medium truncate">
              {content.centerName}
              {content.location && (
                <span className="text-gray-500"> ({content.location})</span>
              )}
            </p>
          </div>
        </div>

        {/* 센터컨셉 뱃지 */}
        <div className="mt-2 sm:mt-3">
          <span className="inline-block text-[10px] sm:text-xs font-medium bg-blue-100 text-blue-800 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full">
            {CENTER_TYPE_LABEL[content.centerType] || content.centerType}
          </span>
        </div>

        {/* 설명 (데스크톱만) */}
        {content.description && (
          <p className="hidden sm:block text-sm text-gray-700 mt-4 line-clamp-2">
            {content.description}
          </p>
        )}

        {/* 해시태그 */}
        {content.tags.length > 0 && (
          <div className="mt-2 sm:mt-4 flex flex-wrap gap-1 sm:pt-4 sm:border-t sm:border-gray-200">
            {content.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] sm:text-xs text-gray-500 bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </a>
  )
}
