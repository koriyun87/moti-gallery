'use client'

import { useCallback, useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FilterOption {
  id: string
  label: string
}

interface FilterPanelProps {
  filters: {
    centerType: string[]
    purpose: string[]
    location: string[]
    tags: string[]
  }
  onFilterChange: (filters: {
    centerType: string[]
    purpose: string[]
    location: string[]
    tags: string[]
  }) => void
  centerTypes: FilterOption[]
  purposes: FilterOption[]
  locations: string[]
  tags: string[]
}

const INITIAL_VISIBLE_COUNT = 6

export default function FilterPanel({
  filters,
  onFilterChange,
  centerTypes,
  purposes,
  locations,
  tags,
}: FilterPanelProps) {
  const [showAllLocations, setShowAllLocations] = useState(false)
  const [showAllTags, setShowAllTags] = useState(false)

  const handleToggleFilter = useCallback(
    (category: 'centerType' | 'purpose' | 'location' | 'tags', value: string) => {
      const currentFilters = filters[category]
      const newFilters = currentFilters.includes(value)
        ? currentFilters.filter(f => f !== value)
        : [...currentFilters, value]

      onFilterChange({
        ...filters,
        [category]: newFilters,
      })
    },
    [filters, onFilterChange]
  )

  const FilterCheckbox = ({
    id,
    label,
    checked,
    onChange,
  }: {
    id: string
    label: string
    checked: boolean
    onChange: () => void
  }) => (
    <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded -mx-2 px-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-moti-primary rounded border-gray-300 focus:ring-0"
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  )

  const ShowMoreButton = ({
    expanded,
    onClick,
    hiddenCount,
  }: {
    expanded: boolean
    onClick: () => void
    hiddenCount: number
  }) => (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1 text-sm text-moti-primary font-medium mt-1 hover:opacity-80"
    >
      <ChevronDown
        size={16}
        className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
      />
      {expanded ? '접기' : `더보기 (${hiddenCount})`}
    </button>
  )

  const visibleLocations = showAllLocations
    ? locations
    : locations.slice(0, INITIAL_VISIBLE_COUNT)
  const visibleTags = showAllTags ? tags : tags.slice(0, INITIAL_VISIBLE_COUNT)

  return (
    <div className="space-y-6">
      {/* 센터 타입 */}
      {centerTypes.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 text-sm">
            센터 컨셉
          </h4>
          <div className="space-y-2">
            {centerTypes.map(type => (
              <FilterCheckbox
                key={type.id}
                id={type.id}
                label={type.label}
                checked={filters.centerType.includes(type.id)}
                onChange={() => handleToggleFilter('centerType', type.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* 활용 목적 */}
      {purposes.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 text-sm">
            활용 목적
          </h4>
          <div className="space-y-2">
            {purposes.map(purpose => (
              <FilterCheckbox
                key={purpose.id}
                id={purpose.id}
                label={purpose.label}
                checked={filters.purpose.includes(purpose.id)}
                onChange={() => handleToggleFilter('purpose', purpose.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* 위치 */}
      {locations.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 text-sm">
            위치
          </h4>
          <div className="space-y-2">
            {visibleLocations.map(location => (
              <FilterCheckbox
                key={location}
                id={location}
                label={location}
                checked={filters.location.includes(location)}
                onChange={() => handleToggleFilter('location', location)}
              />
            ))}
          </div>
          {locations.length > INITIAL_VISIBLE_COUNT && (
            <ShowMoreButton
              expanded={showAllLocations}
              onClick={() => setShowAllLocations(prev => !prev)}
              hiddenCount={locations.length - INITIAL_VISIBLE_COUNT}
            />
          )}
        </div>
      )}

      {/* 태그 */}
      {tags.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 text-sm">
            태그
          </h4>
          <div className="space-y-2">
            {visibleTags.map(tag => (
              <FilterCheckbox
                key={tag}
                id={tag}
                label={'#' + tag}
                checked={filters.tags.includes(tag)}
                onChange={() => handleToggleFilter('tags', tag)}
              />
            ))}
          </div>
          {tags.length > INITIAL_VISIBLE_COUNT && (
            <ShowMoreButton
              expanded={showAllTags}
              onClick={() => setShowAllTags(prev => !prev)}
              hiddenCount={tags.length - INITIAL_VISIBLE_COUNT}
            />
          )}
        </div>
      )}
    </div>
  )
}
