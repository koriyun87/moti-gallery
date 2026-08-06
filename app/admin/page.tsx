'use client'

import { useEffect, useState } from 'react'
import { supabase, type Content } from '@/lib/supabase'
import AdminForm from '@/components/AdminForm'
import { Plus, Trash2, Edit2, Eye, EyeOff } from 'lucide-react'

export default function AdminPage() {
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchContents()
  }, [])

  const fetchContents = async () => {
    try {
      const { data, error } = await supabase
        .from('contents')
        .select('*')
        .order('createdAt', { ascending: false })

      if (error) throw error
      setContents((data || []) as unknown as Content[])
    } catch (error) {
      console.error('Error fetching contents:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddSuccess = () => {
    setShowForm(false)
    setEditingId(null)
    fetchContents()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      const { error } = await supabase.from('contents').delete().eq('id', id)

      if (error) throw error
      setContents(contents.filter((c) => c.id !== id))
    } catch (error) {
      console.error('Error deleting content:', error)
      alert('삭제 실패')
    }
  }

  const handleTogglePublish = async (content: Content) => {
    const nextValue = !content.isPublished

    try {
      const { error } = await supabase
        .from('contents')
        .update({ isPublished: nextValue })
        .eq('id', content.id)

      if (error) throw error

      setContents(
        contents.map((c) =>
          c.id === content.id ? { ...c, isPublished: nextValue } : c
        )
      )
    } catch (error) {
      console.error('Error toggling publish state:', error)
      alert('상태 변경 실패')
    }
  }

  const handleEdit = (id: string) => {
    setEditingId(id)
    setShowForm(true)
  }

  const editingContent = editingId
    ? contents.find((c) => c.id === editingId)
    : undefined

  const publishedCount = contents.filter((c) => c.isPublished).length
  const hiddenCount = contents.length - publishedCount

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">관리자 패널</h1>
          <p className="text-gray-600">
            총 {contents.length}개의 콘텐츠 (공개 {publishedCount} · 비공개{' '}
            {hiddenCount})
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 폼 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingId ? '편집' : '새 콘텐츠 추가'}
                </h2>
                {editingId && (
                  <button
                    onClick={() => {
                      setEditingId(null)
                      setShowForm(false)
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                )}
              </div>

              {!showForm && !editingId ? (
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full bg-moti-primary text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-opacity-90"
                >
                  <Plus size={20} />
                  새 콘텐츠 추가
                </button>
              ) : (
                <AdminForm
                  initialData={editingContent}
                  onSuccess={handleAddSuccess}
                  onCancel={() => {
                    setShowForm(false)
                    setEditingId(null)
                  }}
                />
              )}
            </div>
          </div>

          {/* 콘텐츠 목록 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="inline-block animate-spin">
                    <div className="w-8 h-8 border-4 border-moti-primary border-t-transparent rounded-full"></div>
                  </div>
                  <p className="mt-4 text-gray-600">로딩 중...</p>
                </div>
              ) : contents.length === 0 ? (
                <div className="p-8 text-center text-gray-600">
                  아직 콘텐츠가 없습니다
                </div>
              ) : (
                <div className="divide-y">
                  {contents.map((content) => (
                    <div
                      key={content.id}
                      className={
                        'p-4 hover:bg-gray-50 transition ' +
                        (content.isPublished ? '' : 'bg-gray-50 opacity-60')
                      }
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">
                              {content.title}
                            </h3>
                            {!content.isPublished && (
                              <span className="inline-block text-xs font-medium bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                                비공개
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {content.centerName} • {content.location}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            <span className="inline-block text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {content.centerType}
                            </span>
                            {content.purpose.map((p) => (
                              <span
                                key={p}
                                className="inline-block text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
                              >
                                {p}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleTogglePublish(content)}
                            title={content.isPublished ? '비공개로 전환' : '공개로 전환'}
                            className="p-2 text-gray-600 hover:text-moti-primary hover:bg-gray-100 rounded"
                          >
                            {content.isPublished ? (
                              <Eye size={18} />
                            ) : (
                              <EyeOff size={18} />
                            )}
                          </button>
                          <button
                            onClick={() => handleEdit(content.id)}
                            className="p-2 text-gray-600 hover:text-moti-primary hover:bg-gray-100 rounded"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(content.id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
