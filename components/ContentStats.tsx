'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase, type Content } from '@/lib/supabase'
import { BarChart3, X } from 'lucide-react'

type Count = { content_id: string; opens: number; plays: number }

const PERIODS = [
  { key: '7', label: '최근 7일', days: 7 },
  { key: '30', label: '최근 30일', days: 30 },
  { key: 'all', label: '전체', days: null },
] as const

type PeriodKey = (typeof PERIODS)[number]['key']

// 보기 방식: 콘텐츠별 / 센터별 / 종목별 / 태그별
type View = 'content' | 'center' | 'sport' | 'tag'

const VIEWS: { key: View; label: string }[] = [
  { key: 'content', label: '콘텐츠별' },
  { key: 'center', label: '센터별' },
  { key: 'sport', label: '종목별' },
  { key: 'tag', label: '태그별' },
]

const GROUP_LABEL: Record<Exclude<View, 'content'>, string> = {
  center: '센터',
  sport: '종목',
  tag: '태그',
}

type Row = { content: Content; opens: number; plays: number; total: number }
type GroupRow = { name: string; total: number; items: number }

// 콘텐츠 하나가 어떤 그룹(센터/종목/태그)에 속하는지 꺼내는 함수
function groupKeys(content: Content, view: Exclude<View, 'content'>): string[] {
  if (view === 'center') return content.centerName ? [content.centerName] : []
  if (view === 'sport') return (content.sports || []).filter(Boolean)
  return (content.tags || []).filter(Boolean)
}

function Bar({ value, max }: { value: number; max: number }) {
  return (
    <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-moti-primary rounded-full"
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
  )
}

export default function ContentStats({ contents }: { contents: Content[] }) {
  const [period, setPeriod] = useState<PeriodKey>('30')
  const [counts, setCounts] = useState<Count[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<View>('content')
  // 센터/종목/태그를 눌렀을 때, 그 그룹의 콘텐츠만 보기
  const [focus, setFocus] = useState<{ view: Exclude<View, 'content'>; name: string } | null>(null)

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

  const contentRows: Row[] = useMemo(() => {
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

  const groupRows: GroupRow[] = useMemo(() => {
    if (view === 'content') return []
    const map = new Map<string, GroupRow>()
    for (const r of contentRows) {
      for (const name of groupKeys(r.content, view)) {
        const cur = map.get(name) || { name, total: 0, items: 0 }
        cur.total += r.total
        cur.items += 1
        map.set(name, cur)
      }
    }
    return Array.from(map.values()).sort((a, b) => b.total - a.total)
  }, [contentRows, view])

  const visibleContentRows = focus
    ? contentRows.filter((r) => groupKeys(r.content, focus.view).includes(focus.name))
    : contentRows

  const grandTotal = contentRows.reduce((sum, r) => sum + r.total, 0)
  const shownTotal =
    view === 'content'
      ? visibleContentRows.reduce((sum, r) => sum + r.total, 0)
      : grandTotal
  const max = Math.max(
    1,
    ...(view === 'content'
      ? visibleContentRows.map((r) => r.total)
      : groupRows.map((r) => r.total))
  )

  const changeView = (v: View) => {
    setView(v)
    if (v !== 'content') setFocus(null)
  }

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

      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex gap-4 text-sm">
          {VIEWS.map((v) => (
            <button
              key={v.key}
              onClick={() => changeView(v.key)}
              className={
                'pb-1 border-b-2 ' +
                (view === v.key
                  ? 'border-gray-900 text-gray-900 font-medium'
                  : 'border-transparent text-gray-500 hover:text-gray-900')
              }
            >
              {v.label}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-600">
          총 <span className="font-bold text-gray-900">{shownTotal}</span>회
        </p>
      </div>

      {view === 'content' && focus && (
        <div className="mb-3">
          <button
            onClick={() => setFocus(null)}
            className="inline-flex items-center gap-1 text-xs bg-gray-900 text-white px-2.5 py-1 rounded-full hover:bg-gray-700"
          >
            {GROUP_LABEL[focus.view]}: {focus.name}
            <X size={12} />
          </button>
        </div>
      )}

      {view !== 'content' && view !== 'center' && (
        <p className="text-xs text-gray-400 mb-3">
          콘텐츠 하나에 {GROUP_LABEL[view]}이(가) 여러 개면 각각에 모두 더해집니다. 항목을 누르면 해당 콘텐츠 순위를 볼 수 있어요.
        </p>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">로딩 중...</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : grandTotal === 0 ? (
        <p className="text-sm text-gray-500">이 기간에는 아직 클릭 기록이 없습니다</p>
      ) : view === 'content' ? (
        <ol className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {visibleContentRows.map((r, i) => (
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
                <Bar value={r.total} max={max} />
              </div>
            </li>
          ))}
        </ol>
      ) : groupRows.length === 0 ? (
        <p className="text-sm text-gray-500">
          클릭된 콘텐츠에 {GROUP_LABEL[view]} 정보가 없습니다
        </p>
      ) : (
        <ol className="space-y-1 max-h-96 overflow-y-auto pr-1">
          {groupRows.map((r, i) => (
            <li key={r.name}>
              <button
                onClick={() => {
                  setFocus({ view: view as Exclude<View, 'content'>, name: r.name })
                  setView('content')
                }}
                className="w-full flex items-center gap-3 text-sm text-left rounded-md px-1 py-1 hover:bg-gray-50"
              >
                <span className="w-6 text-right text-gray-400 tabular-nums">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2">
                    <p className="truncate text-gray-900">
                      {view === 'tag' ? '#' + r.name : r.name}
                      <span className="text-gray-500"> · 콘텐츠 {r.items}개</span>
                    </p>
                    <p className="shrink-0 tabular-nums text-gray-900 font-medium">
                      {r.total}
                    </p>
                  </div>
                  <Bar value={r.total} max={max} />
                </div>
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
