'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import slugify from 'slugify'

interface Article {
  id: string; title: string; slug: string; excerpt: string; content: string
  category: string; status: string; isFeatured: boolean; seoTitle?: string
  seoDescription?: string; featuredImage?: string
}

interface Props { article: Article | null; authorId: string }

const categories = [
  'PRESS_RELEASE', 'CORPORATE_ANNOUNCEMENT', 'PROJECT_LAUNCH',
  'MEDIA_COVERAGE', 'AWARD', 'INVESTMENT', 'CAMPAIGN',
]

export default function NewsEditor({ article, authorId }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState(article?.status || 'DRAFT')
  const [title, setTitle] = useState(article?.title || '')
  const [slug, setSlug] = useState(article?.slug || '')
  const [excerpt, setExcerpt] = useState(article?.excerpt || '')
  const [content, setContent] = useState(article?.content || '')
  const [category, setCategory] = useState(article?.category || 'CORPORATE_ANNOUNCEMENT')
  const [featured, setFeatured] = useState(article?.isFeatured || false)
  const [seoTitle, setSeoTitle] = useState(article?.seoTitle || '')
  const [seoDescription, setSeoDescription] = useState(article?.seoDescription || '')
  const [errorMsg, setErrorMsg] = useState('')

  function handleTitleChange(val: string) {
    setTitle(val)
    if (!article) {
      setSlug(slugify(val, { lower: true, strict: true }))
    }
  }

  async function save(publishStatus: string) {
    setSaving(true)
    setErrorMsg('')

    const body = {
      title, slug, excerpt, content, category, status: publishStatus,
      isFeatured: featured, seoTitle, seoDescription, authorId,
      ...(publishStatus === 'PUBLISHED' ? { publishedAt: new Date().toISOString() } : {}),
    }

    try {
      const url = article ? `/api/admin/news/${article.id}` : '/api/admin/news'
      const method = article ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save.')
      }
      router.push('/admin/news')
      router.refresh()
    } catch (err: any) {
      setErrorMsg(err.message)
      setSaving(false)
    }
  }

  const inputCls = 'w-full bg-[#0D0D0D] border border-[#222] px-4 py-2.5 text-sm text-white placeholder:text-[#444] focus:border-[#C9A84C] focus:outline-none transition-colors'
  const labelCls = 'block text-xs text-[#666] mb-1.5 font-mono uppercase tracking-wider'

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label className={labelCls}>Title *</label>
        <input value={title} onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Article title" required className={inputCls} />
      </div>

      {/* Slug */}
      <div>
        <label className={labelCls}>Slug *</label>
        <input value={slug} onChange={(e) => setSlug(e.target.value)}
          placeholder="article-slug" required className={inputCls} />
      </div>

      {/* Category + Featured row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Category *</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
            {categories.map((c) => (
              <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-3 pt-7">
          <input type="checkbox" id="featured" checked={featured} onChange={(e) => setFeatured(e.target.checked)}
            className="w-4 h-4 accent-[#C9A84C]" />
          <label htmlFor="featured" className="text-sm text-[#aaa]">Featured article</label>
        </div>
      </div>

      {/* Excerpt */}
      <div>
        <label className={labelCls}>Excerpt *</label>
        <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Short summary shown in listings" rows={3}
          className={`${inputCls} resize-none`} />
      </div>

      {/* Content */}
      <div>
        <label className={labelCls}>Content * (HTML supported)</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)}
          placeholder="Full article content. Use basic HTML: <p>, <h2>, <ul>, <li>, <strong>, <em>, <blockquote>"
          rows={16} className={`${inputCls} resize-y font-mono text-xs`} />
        <p className="text-xs text-[#444] mt-1">HTML is sanitized before display. No &lt;script&gt; tags.</p>
      </div>

      {/* SEO */}
      <div className="border-t border-[#222] pt-6">
        <h2 className="text-xs text-[#666] font-mono uppercase tracking-wider mb-4">SEO</h2>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>SEO Title</label>
            <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="Defaults to article title if blank" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>SEO Description</label>
            <textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="Defaults to excerpt if blank" rows={2} className={`${inputCls} resize-none`} />
          </div>
        </div>
      </div>

      {errorMsg && <p className="text-red-400 text-sm">{errorMsg}</p>}

      {/* Actions */}
      <div className="flex items-center gap-3 border-t border-[#222] pt-6">
        <button onClick={() => save('DRAFT')} disabled={saving}
          className="px-6 py-2.5 border border-[#333] text-sm text-[#aaa] hover:border-[#555] transition-colors disabled:opacity-50">
          Save Draft
        </button>
        <button onClick={() => save('PUBLISHED')} disabled={saving}
          className="px-6 py-2.5 bg-[#C9A84C] text-black text-sm font-medium hover:bg-[#E2C97A] transition-colors disabled:opacity-50">
          {saving ? 'Saving…' : article?.status === 'PUBLISHED' ? 'Update' : 'Publish'}
        </button>
        {article && article.status === 'PUBLISHED' && (
          <button onClick={() => save('ARCHIVED')} disabled={saving}
            className="px-6 py-2.5 border border-red-900 text-sm text-red-400 hover:border-red-700 transition-colors disabled:opacity-50">
            Archive
          </button>
        )}
        <a href={article ? `/news/${article.slug}` : '#'} target="_blank"
          className="ml-auto text-xs text-[#555] hover:text-[#aaa] transition-colors">
          {article?.status === 'PUBLISHED' ? '↗ View live' : 'Not published yet'}
        </a>
      </div>
    </div>
  )
}
