'use client'

import { useEffect, useState } from 'react'
import { supabase, type Content, type Banner } from '@/lib/supabase'
import AdminForm from '@/components/AdminForm'
import {
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Image as ImageIcon,
} from 'lucide-react'

function BannerManager() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', imageUrl: '', linkUrl: '' })

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('createdAt', { ascending: false })

      if (error) throw error
      setBanners((data || []) as unknown as Banner[])
    } catch (error) {
      console.error('Error fetching banners:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('banners')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('banners').getPublicUrl(fileName)
      setForm((prev) => ({ ...prev, imageUrl: data.publicUrl }))
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('이미지 업로드 실패')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const resetForm = () => {
    setForm({ title: '', imageUrl: '', linkUrl: '' })
    setEditingBannerId(null)
    setShowForm(false)
  }

  const startEdit = (banner: Banner) => {
    setForm({
      title: banner.title,
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl || '',
    })
    setEditingBannerId(banner.id)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.imageUrl) {
      alert('이미지를 업로드해주세요')
      return
    }
    setSaving(true)
    try {
      if (editingBannerId) {
        // 수정
        const { error } = await supabase
          .from('banners')
          .update({
            title: form.title,
            imageUrl: form.imageUrl,
            linkUrl: form.linkUrl || null,
          })
          .eq('id', editingBannerId)
        if (error) throw error
      } else {
        // 신규 추가
        const { error } = await supabase.from('banners').insert([
          {
            title: form.title,
            imageUrl: form.imageUrl,
            linkUrl: form.linkUrl || null,
          },
        ])
        if (error) throw error
      }
      resetForm()
      fetchBanners()
    } catch (error) {
      console.error('Error saving banner:', error)
      alert('배너 저장 실패')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('이 배너를 삭제할까요?')) return
    try {
      const { error } = await supabase.from('banners').delete().eq('id', id)
      if (error) throw error
      setBanners(banners.filter((b) => b.id !== id))
      if (editingBannerId === id) resetForm()
    } catch (error) {
      console.error('Error deleting banner:', error)
      alert('삭제 실패')
    }
  }

  const handleToggleActive = async (banner: Banner) => {
    const nextValue = !banner.isActive
    try {
      const { error } = await supabase
        .from('banners')
        .update({ isActive: nextValue })
        .eq('id', banner.id)
      if (error) throw error
      setBanners(
        banners.map((b) =>
          b.id === banner.id ? { ...b, isActive: nextValue } : b
        )
      )
    } catch (error) {
      console.error('Error toggling banner:', error)
      alert('상태 변경 실패')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ImageIcon size={20} />
            배너 관리
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            갤러리 상단에 새로고침마다 랜덤으로 1~3개씩 노출됩니다
          </p>
        </div>
        <button
          onClick={() => {
            if (showForm) {
              resetForm()
            } else {
              setShowForm(true)
            }
          }}
          className="bg-moti-primary text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-opacity-90"
        >
          <Plus size={18} />
          배너 추가
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 p-4 bg-gray-50 rounded-lg space-y-3"
        >
          <p className="text-sm font-medium text-gray-700">
            {editingBannerId ? '배너 수정' : '새 배너 추가'}
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              배너 제목 *
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="예: 8월 여름맞이 프로모션"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              배너 이미지 *
            </label>
            {form.imageUrl && (
              <img
                src={form.imageUrl}
                alt="미리보기"
                className="w-full aspect-video object-cover rounded-lg mb-2 bg-gray-100"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            />
            {uploading && (
              <p className="text-xs text-gray-500 mt-1">업로드 중...</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              클릭 시 이동할 링크 (선택)
            </label>
            <input
              type="url"
              value={form.linkUrl}
              onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
              placeholder="https://... (비워두면 클릭 안 됨)"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={saving || uploading}
              className="flex-1 bg-moti-primary text-white py-2 rounded-lg font-medium hover:bg-opacity-90 disabled:opacity-50"
            >
              {saving ? '저장 중...' : editingBannerId ? '수정 완료' : '추가'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 bg-gray-200 text-gray-900 py-2 rounded-lg font-medium hover:bg-gray-300"
            >
              취소
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">로딩 중...</p>
      ) : banners.length === 0 ? (
        <p className="text-sm text-gray-500">등록된 배너가 없습니다</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className={
                'border rounded-lg overflow-hidden ' +
                (banner.isActive ? '' : 'opacity-50') +
                (editingBannerId === banner.id ? ' ring-2 ring-moti-primary' : '')
              }
            >
              <div className="aspect-[16/9] bg-gray-100">
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <p className="font-medium text-sm text-gray-900 truncate">
                  {banner.title}
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleToggleActive(banner)}
                    className="flex-1 text-xs py-1.5 rounded border border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-1"
                  >
                    {banner.isActive ? (
                      <>
                        <Eye size={14} /> 노출중
                      </>
                    ) : (
                      <>
                        <EyeOff size={14} /> 숨김
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => startEdit(banner)}
                    className="text-xs py-1.5 px-3 rounded border border-gray-300 hover:bg-gray-50"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="text-xs py-1.5 px-3 rounded border border-gray-300 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

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

        {/* 배너 관리 */}
        <BannerManager />

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
