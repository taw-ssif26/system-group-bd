'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

interface Article {
  id: string; title: string; slug: string; excerpt: string
  featuredImage: string | null; category: string; publishedAt: Date | null
}

export default function NewsSection({ articles }: { articles: Article[] }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="py-32 bg-sg-black" ref={ref}>
      <div className="sg-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          className="flex items-end justify-between mb-16 gap-8">
          <div>
            <span className="sg-eyebrow block mb-6">What's Moving</span>
            <h2 className="font-display font-light text-display-lg text-sg-white">Latest news.</h2>
          </div>
          <Link href="/news" className="sg-btn-ghost shrink-0">All News <ArrowUpRight size={14} /></Link>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-px bg-sg-border">
          {articles.map((article, i) => (
            <motion.div key={article.id}
              initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }} className="bg-sg-black">
              <Link href={`/news/${article.slug}`} className="group block p-8 hover:bg-sg-deep transition-colors">
                <span className="sg-eyebrow block mb-4">
                  {article.category.replace(/_/g, ' ')}
                </span>
                <h3 className="font-display text-xl font-light text-sg-white mb-3 group-hover:text-sg-gold transition-colors leading-snug">
                  {article.title}
                </h3>
                <p className="font-sans text-sm text-sg-muted leading-relaxed mb-6 line-clamp-3">{article.excerpt}</p>
                <span className="font-mono text-xs text-sg-muted">
                  {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
