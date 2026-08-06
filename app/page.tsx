'use client'

import { useEffect, useState } from 'react'
import { supabase, type Content } from '@/lib/supabase'
import ContentCard from '@/components/ContentCard'
import FilterPanel from '@/components/FilterPanel'
import { Filter, X } from 'lucide-react'

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

export default function GalleryPage() {
  const [contents, setContents] = useState<Content[]>([])
  const [filteredContents, setFilteredContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [locations, setLocations] = useState<string[]>([])

  const [filters, setFilters] = useState({
    centerType: [] as string[],
    purpose: [] as string[],
    location: [] as string[],
  })

  // Fetch 콘텐츠
  useEffect(() => {
    fetchContents()
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

      // 초기 필터링
      applyFilters(typedData, {
        centerType: [],
        purpose: [],
        location: [],
      })
    } catch (error) {
      console.error('Error fetching contents:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = (
    data: Content[],
    filterState: typeof filters
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

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
    applyFilters(contents, newFilters)
  }

  const hasActiveFilters =
    filters.centerType.length > 0 ||
    filters.purpose.length > 0 ||
    filters.location.length > 0

  const resetFilters = () => {
    const emptyFilters = { centerType: [], purpose: [], location: [] }
    setFilters(emptyFilters)
    applyFilters(contents, emptyFilters)
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
