'use client'

import { useEffect, useState } from 'react'
import { supabase, type Banner } from '@/lib/supabase'

function pickRandom(arr: Banner[], min: number, max: number): Banner[] {
  if (arr.length === 0) return []
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  const count = Math.min(
    arr.length,
    Math.floor(Math.random() * (max - min + 1)) + min
  )
  return shuffled.slice(0, count)
}

export default function BannerStrip() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data, error } = await supabase
          .from('banners')
          .select('*')
          .eq('isActive', true)

        if (error) throw error

        const active = (data || []) as unknown as Banner[]
        setBanners(pickRandom(active, 1, 3))
      } catch (error) {
        console.error('Error fetching banners:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBanners()
  }, [])

  if (loading || banners.length === 0) return null

  return (
    <div
      className={
        'mb-6 grid gap-3 sm:gap-4 grid-cols-1 ' +
        (banners.length === 1
          ? ''
          : banners.length === 2
          ? 'sm:grid-cols-2'
          : 'sm:grid-cols-3')
      }
    >
      {banners.map((banner) => {
        const inner = (
          <div className="relative rounded-lg overflow-hidden shadow-md aspect-[21/9] sm:aspect-[16/9] group bg-gray-200">
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="absolute inset-0 w-full h-full object-cover transition group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
            <p className="absolute bottom-3 left-4 right-4 text-white font-semibold text-sm sm:text-base line-clamp-1">
              {banner.title}
            </p>
          </div>
        )

        return banner.linkUrl ? (
          <a
            key={banner.id}
            href={banner.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {inner}
          </a>
        ) : (
          <div key={banner.id}>{inner}</div>
        )
      })}
    </div>
  )
}
