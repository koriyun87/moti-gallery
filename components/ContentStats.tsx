'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase, type Content } from '@/lib/supabase'
import { BarChart3 } from 'lucide-react'

type Count = { content_id: string; opens: number; plays: number }

const PERIODS = [
  { key: '7', label: '최근 7일', days: 7 },
  { key: '30', label: '최근 30일', days: 30 },
  { key: 'all', label: '전체', days: null },
] as const

type PeriodKey = (typeof PERIODS)[number]['key']

export default function ContentStats({ contents }: { contents: Content[] }) {
  const [period, setPeriod] = useState<PeriodKey>('30')
  const [counts, setCounts] = useState<Count[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<'content' | 'center'>('content')

  useEffect(() => {
    const p = PERIODS.find((x) => x.key === period)!
    const since = p.days
      ? new Date(Date.now() - p.days * 24 * 60 * 60 * 1000).toISOString()
      : '2000-01-01T00:00:00Z'

    setLoading(true)
    setError(null)
    supabase
      .rpc('content_click_counts', { since })
      .then(({ data, error }) => {
        if (error) {
          console.error('Error fetching click stats:', error)
          setError('클릭 통계를 불러오지 못했습니다. SQL 적용 여부를 확인해 주세요.')
          setCounts([])
        } else {
          setCounts(
            ((data || []) as Count[]).map((c) => ({
              content_id: c.content_id,
              opens: Number(c.opens),
              plays: Number(c.plays),
            }))
          )
        }
        setLoading(false)
      })
  }, [period])

  const contentRows = useMemo(() => {
    const byId = new Map(counts.map((c) => [c.content_id, c]))
    return contents
      .map((content) => {
        const c = byId.get(content.id)
        const opens = c?.opens || 0
        const plays = c?.plays || 0
        return { content, opens, plays, total: opens + plays }
      })
      .filter((r) => r.total > 0)
      .sort((a, b) => b.total - a.total)
  }, [contents, counts])

  const centerRows = useMemo(() => {
    const map = new Map<string, { center: string; total: number; items: number }>()
    for (const r of contentRows) {
      const key = r.content.centerName
      const cur = map.get(key) || { center: key, total: 0, items: 0 }
      cur.total += r.total
      cur.items += 1
      map.set(key, cur)
    }
    return Array.from(map.values()).sort((a, b) => b.total - a.total)
  }, [contentRows])

  const grandTotal = contentRows.reduce((sum, r) => sum + r.total, 0)
  const max = Math.max(
    1,
    ...(view === 'content'
      ? contentRows.map((r) => r.total)
      : centerRows.map((r) => r.total))
  )

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 size={20} />
            콘텐츠 클릭 통계
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            방문자가 카드를 눌러 원본(인스타그램 등)으로 이동하거나 유튜브를 재생한 횟수
          </p>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={
                'text-xs sm:text-sm px-3 py-1.5 rounded-md transition ' +
                (period === p.key
                  ? 'bg-white shadow text-gray-900 font-medium'
                  : 'text-gray-600 hover:text-gray-900')
              }
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-4 text-sm">
          <button
            onClick={() => setView('content')}
            className={
              'pb-1 border-b-2 ' +
              (view === 'content'
                ? 'border-gray-900 text-gray-900 font-medium'
                : 'border-transparent text-gray-500')
            }
          >
            콘텐츠별
          </button>
          <button
            onClick={() => setView('center')}
            className={
              'pb-1 border-b-2 ' +
              (view === 'center'
                ? 'border-gray-900 text-gray-900 font-medium'
                : 'border-transparent text-gray-500')
            }
          >
            센터별
          </button>
        </div>
        <p className="text-sm text-gray-600">
          총 <span className="font-bold text-gray-900">{grandTotal}</span>회
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">로딩 중...</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : grandTotal === 0 ? (
        <p className="text-sm text-gray-500">이 기간에는 아직 클릭 기록이 없습니다</p>
      ) : view === 'content' ? (
        <ol className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {contentRows.map((r, i) => (
            <li key={r.content.id} className="flex items-center gap-3 text-sm">
              <span className="w-6 text-right text-gray-400 tabular-nums">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <p className="truncate text-gray-900">
                    {r.content.title}
                    <span className="text-gray-500"> · {r.content.centerName}</span>
                  </p>
                  <p className="shrink-0 tabular-nums text-gray-900 font-medium">
                    {r.total}
                    {r.plays > 0 && (
                      <span className="text-xs text-gray-500 font-normal">
                        {' '}(재생 {r.plays})
                      </span>
                    )}
                  </p>
                </div>
                <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-moti-primary rounded-full"
                    style={{ width: `${(r.total / max) * 100}%` }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <ol className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {centerRows.map((r, i) => (
            <li key={r.center} className="flex items-center gap-3 text-sm">
              <span className="w-6 text-right text-gray-400 tabular-nums">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <p className="truncate text-gray-900">
                    {r.center}
                    <span className="text-gray-500"> · 콘텐츠 {r.items}개</span>
                  </p>
                  <p className="shrink-0 tabular-nums text-gray-900 font-medium">
                    {r.total}
                  </p>
                </div>
                <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-moti-primary rounded-full"
                    style={{ width: `${(r.total / max) * 100}%` }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
