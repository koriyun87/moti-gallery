'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { supabase, type Content } from '@/lib/supabase'
import ContentCard from '@/components/ContentCard'
import FilterPanel from '@/components/FilterPanel'
import { Filter, X, Link as LinkIcon } from 'lucide-react'

const CENTER_TYPES = [
  { id: 'rehabilitation', label: '재활센터' },
  { id: 'pilates', label: '필라테스' },
  { id: 'fitness', label: '일반피트니스' },
  { id: 'performance', label: '퍼포먼스' },
]

const PURPOSES = [
  { id: 'rehabilitation', label: '재활훈련' },
  { id: 'bodyShape', label: '체형교정' },
  { id: 'strength', label: '근력강화' },
  { id: 'flexibility', label: '유연성' },
  { id: 'athleticism', label: '운동 능력 개발' },
]

type FilterState = {
  centerType: string[]
  purpose: string[]
  location: string[]
}

// 센터컨셉/활용목적은 고정된 값 목록이라 짧은 숫자 코드로 압축 (URL 단축용)
// ⚠️ 이 코드는 한번 정해지면 순서를 바꾸면 안 됨 (기존에 공유된 링크가 깨짐)
const CENTER_TYPE_CODE: Record<string, string> = {
  rehabilitation: '0',
  pilates: '1',
  fitness: '2',
  performance: '3',
}
const CENTER_TYPE_CODE_REVERSE = Object.fromEntries(
  Object.entries(CENTER_TYPE_CODE).map(([k, v]) => [v, k])
)

const PURPOSE_CODE: Record<string, string> = {
  rehabilitation: '0',
  bodyShape: '1',
  strength: '2',
  flexibility: '3',
  athleticism: '4',
}
const PURPOSE_CODE_REVERSE = Object.fromEntries(
  Object.entries(PURPOSE_CODE).map(([k, v]) => [v, k])
)

// URL 쿼리 파라미터 ↔ 필터 객체 변환 유틸
function filtersFromParams(params: URLSearchParams): FilterState {
  const centerCodes = params.get('c')?.split(',').filter(Boolean) || []
  const purposeCodes = params.get('p')?.split(',').filter(Boolean) || []
  const location = params.get('l')?.split(',').filter(Boolean) || []

  return {
    centerType: centerCodes.map(c => CENTER_TYPE_CODE_REVERSE[c]).filter(Boolean),
    purpose: purposeCodes.map(c => PURPOSE_CODE_REVERSE[c]).filter(Boolean),
    location,
  }
}

function paramsFromFilters(filters: FilterState): string {
  const params = new URLSearchParams()
  if (filters.centerType.length) {
    params.set('c', filters.centerType.map(id => CENTER_TYPE_CODE[id]).join(','))
  }
  if (filters.purpose.length) {
    params.set('p', filters.purpose.map(id => PURPOSE_CODE[id]).join(','))
  }
  if (filters.location.length) {
    params.set('l', filters.location.join(','))
  }
  return params.toString()
}

function GalleryContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [contents, setContents] = useState<Content[]>([])
  const [filteredContents, setFilteredContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [locations, setLocations] = useState<string[]>([])
  const [linkCopied, setLinkCopied] = useState(false)

  // 초기 필터 상태를 URL에서 읽어옴
  const [filters, setFilters] = useState<FilterState>(() =>
    filtersFromParams(searchParams)
  )

  // Fetch 콘텐츠
  useEffect(() => {
    fetchContents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchContents = async () => {
    try {
      const { data, error } = await supabase
        .from('contents')
        .select('*')
        .eq('isPublished', true)
        .order('createdAt', { ascending: false })

      if (error) throw error

      const typedData = (data || []) as unknown as Content[]
      setContents(typedData)

      // 위치 추출
      const uniqueLocations = [...new Set(typedData.map(c => c.location))]
      setLocations(uniqueLocations.sort())

      // URL에 있던 필터를 그대로 적용해서 초기 렌더링
      applyFilters(typedData, filtersFromParams(searchParams))
    } catch (error) {
      console.error('Error fetching contents:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = (
    data: Content[],
    filterState: FilterState
  ) => {
    let filtered = data

    if (filterState.centerType.length > 0) {
      filtered = filtered.filter(c => filterState.centerType.includes(c.centerType))
    }

    if (filterState.purpose.length > 0) {
      filtered = filtered.filter(c =>
        c.purpose.some(p => filterState.purpose.includes(p))
      )
    }

    if (filterState.location.length > 0) {
      filtered = filtered.filter(c => filterState.location.includes(c.location))
    }

    setFilteredContents(filtered)
  }

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    applyFilters(contents, newFilters)

    // URL 업데이트 (주소창에 필터 조건이 반영됨 → 링크 공유 가능)
    const query = paramsFromFilters(newFilters)
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  const hasActiveFilters =
    filters.centerType.length > 0 ||
    filters.purpose.length > 0 ||
    filters.location.length > 0

  const resetFilters = () => {
    const emptyFilters = { centerType: [], purpose: [], location: [] }
    setFilters(emptyFilters)
    applyFilters(contents, emptyFilters)
    router.replace(pathname, { scroll: false })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                모티 활용 사례
              </h2>
              <p className="text-gray-600">
                {filteredContents.length}개의 콘텐츠
              </p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden bg-moti-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-opacity-90"
            >
              <Filter size={20} />
              필터
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-5 gap-8">
          {/* 필터 패널 */}
          <div
            className={`${
              showFilters ? 'block' : 'hidden'
            } lg:block lg:col-span-1 mb-8 lg:mb-0`}
          >
            <div className="sticky top-20">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900">필터</h3>
                  {hasActiveFilters && (
                    <button
                      onClick={resetFilters}
                      className="text-sm text-moti-primary hover:underline"
                    >
                      초기화
                    </button>
                  )}
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href)
                      setLinkCopied(true)
                      setTimeout(() => setLinkCopied(false), 2000)
                    }}
                    className="w-full mb-6 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg flex items-center justify-center gap-2 transition"
                  >
                    <LinkIcon size={16} />
                    {linkCopied ? '복사됨!' : '이 필터 링크 복사'}
                  </button>
                )}

                <FilterPanel
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  centerTypes={CENTER_TYPES}
                  purposes={PURPOSES}
                  locations={locations}
                />
              </div>
            </div>
          </div>

          {/* 콘텐츠 그리드 */}
          <div className="lg:col-span-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin">
                  <div className="w-8 h-8 border-4 border-moti-primary border-t-transparent rounded-full"></div>
                </div>
                <p className="mt-4 text-gray-600">로딩 중...</p>
              </div>
            ) : filteredContents.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-lg text-gray-600 mb-4">
                  해당하는 콘텐츠가 없습니다
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="text-moti-primary hover:underline font-medium"
                  >
                    필터 초기화
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                {filteredContents.map(content => (
                  <ContentCard key={content.id} content={content} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function GalleryPage() {
  return (
    <Suspense fallback={null}>
      <GalleryContent />
    </Suspense>
  )
}
