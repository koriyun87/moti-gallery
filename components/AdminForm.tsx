'use client'

import { useState, useEffect } from 'react'
import { supabase, type Content } from '@/lib/supabase'
import { Loader } from 'lucide-react'

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

interface AdminFormProps {
  initialData?: Content
  onSuccess: () => void
  onCancel: () => void
}

export default function AdminForm({
  initialData,
  onSuccess,
  onCancel,
}: AdminFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<{
    title: string
    centerName: string
    location: string
    centerType: Content['centerType']
    purpose: string[]
    mediaType: Content['mediaType']
    mediaLink: string
    description: string
    tags: string
  }>({
    title: '',
    centerName: '',
    location: '',
    centerType: 'rehabilitation',
    purpose: [],
    mediaType: 'youtube',
    mediaLink: '',
    description: '',
    tags: '',
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        centerName: initialData.centerName,
        location: initialData.location,
        centerType: initialData.centerType,
        purpose: initialData.purpose,
        mediaType: initialData.mediaType,
        mediaLink: initialData.mediaLink,
        description: initialData.description,
        tags: initialData.tags.join(', '),
      })
    }
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const parsedTags = formData.tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t)

      const payload = {
        title: formData.title,
        centerName: formData.centerName,
        location: formData.location,
        centerType: formData.centerType,
        purpose: formData.purpose,
        mediaType: formData.mediaType,
        mediaLink: formData.mediaLink,
        description: formData.description,
        tags: parsedTags,
      }

      if (initialData) {
        // 편집
        const { error } = await supabase
          .from('contents')
          .update(payload)
          .eq('id', initialData.id)

        if (error) throw error
      } else {
        // 새로 생성
        const { error } = await supabase.from('contents').insert([payload])

        if (error) throw error
      }

      onSuccess()
    } catch (error) {
      console.error('Error saving content:', error)
      alert('저장 실패')
    } finally {
      setLoading(false)
    }
  }

  const togglePurpose = (purposeId: string) => {
    setFormData(prev => ({
      ...prev,
      purpose: prev.purpose.includes(purposeId)
        ? prev.purpose.filter(p => p !== purposeId)
        : [...prev.purpose, purposeId],
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 제목 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          제목 *
        </label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-moti-primary focus:border-transparent"
          placeholder="예: 척추 재활훈련"
        />
      </div>

      {/* 센터명 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          센터명 *
        </label>
        <input
          type="text"
          required
          value={formData.centerName}
          onChange={e =>
            setFormData({ ...formData, centerName: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-moti-primary focus:border-transparent"
          placeholder="예: OO 재활센터"
        />
      </div>

      {/* 위치 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          위치 *
        </label>
        <input
          type="text"
          required
          value={formData.location}
          onChange={e => setFormData({ ...formData, location: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-moti-primary focus:border-transparent"
          placeholder="예: 서울시 강남구"
        />
      </div>

      {/* 센터 컨셉 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          센터 컨셉 *
        </label>
        <select
          value={formData.centerType}
          onChange={e =>
            setFormData({
              ...formData,
              centerType: e.target.value as any,
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-moti-primary focus:border-transparent"
        >
          {CENTER_TYPES.map(type => (
            <option key={type.id} value={type.id}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* 활용 목적 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          활용 목적 (복수 선택 가능) *
        </label>
        <div className="space-y-2">
          {PURPOSES.map(purpose => (
            <label key={purpose.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.purpose.includes(purpose.id)}
                onChange={() => togglePurpose(purpose.id)}
                className="w-4 h-4 rounded border-gray-300 text-moti-primary focus:ring-0"
              />
              <span className="text-sm text-gray-700">{purpose.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 미디어 타입 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          미디어 타입 *
        </label>
        <select
          value={formData.mediaType}
          onChange={e =>
            setFormData({ ...formData, mediaType: e.target.value as any })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-moti-primary focus:border-transparent"
        >
          <option value="youtube">YouTube</option>
          <option value="instagram">Instagram</option>
        </select>
      </div>

      {/* SNS 링크 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {formData.mediaType === 'youtube' ? 'YouTube' : 'Instagram'} 링크 *
        </label>
        <input
          type="url"
          required
          value={formData.mediaLink}
          onChange={e =>
            setFormData({ ...formData, mediaLink: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-moti-primary focus:border-transparent text-xs"
          placeholder={
            formData.mediaType === 'youtube'
              ? 'https://youtube.com/watch?v=...'
              : 'https://instagram.com/p/...'
          }
        />
      </div>

      {/* 설명 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          설명
        </label>
        <textarea
          value={formData.description}
          onChange={e =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-moti-primary focus:border-transparent"
          rows={3}
          placeholder="활용 사례에 대한 설명..."
        />
      </div>

      {/* 태그 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          태그 (쉼표로 구분)
        </label>
        <input
          type="text"
          value={formData.tags}
          onChange={e => setFormData({ ...formData, tags: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-moti-primary focus:border-transparent"
          placeholder="척추, 근력, 회복"
        />
      </div>

      {/* 버튼 */}
      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-moti-primary text-white py-2 rounded-lg font-medium hover:bg-opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && <Loader size={18} className="animate-spin" />}
          {initialData ? '수정' : '추가'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-900 py-2 rounded-lg font-medium hover:bg-gray-300"
        >
          취소
        </button>
      </div>
    </form>
  )
}
