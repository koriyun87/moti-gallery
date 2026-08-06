'use client'

import { useCallback } from 'react'
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
  }
  onFilterChange: (filters: {
    centerType: string[]
    purpose: string[]
    location: string[]
  }) => void
  centerTypes: FilterOption[]
  purposes: FilterOption[]
  locations: string[]
}

export default function FilterPanel({
  filters,
  onFilterChange,
  centerTypes,
  purposes,
  locations,
}: FilterPanelProps) {
  const handleToggleFilter = useCallback(
    (category: 'centerType' | 'purpose' | 'location', value: string) => {
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
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {locations.map(location => (
              <FilterCheckbox
                key={location}
                id={location}
                label={location}
                checked={filters.location.includes(location)}
                onChange={() => handleToggleFilter('location', location)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
