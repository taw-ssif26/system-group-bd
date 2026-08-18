'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const industryLabels: Record<string, string> = {
  REAL_ESTATE: 'Real Estate', CONSTRUCTION: 'Construction', ICT: 'Technology',
  TELECOM: 'Telecom', TRADING: 'Trading', LIFESTYLE: 'Lifestyle',
  AGRICULTURE: 'Agriculture', ELECTRONICS: 'Electronics', GROOMING: 'Grooming', INDUSTRIAL: 'Industrial',
}

interface Concern {
  id: string; name: string; slug: string; industry: string; shortDescription: string
}

interface Props { concerns: Concern[] }

export default function BusinessEcosystem({ concerns }: Props) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [active, setActive] = useState<Concern | null>(null)

  const byIndustry: Record<string, Concern[]> = {}
  for (const c of concerns) {
    if (!byIndustry[c.industry]) byIndustry[c.industry] = []
    byIndustry[c.industry].push(c)
  }
  const industries = Object.keys(byIndustry)

  return (
    <section id="businesses" className="py-32 bg-sg-black" ref={ref}>
      <div className="sg-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="mb-16">
          <span className="sg-eyebrow block mb-6">Business Ecosystem</span>
          <h2 className="font-display font-light text-display-lg text-sg-white leading-tight">Many horizons.<br />One vision.</h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-sg-border">
          {industries.map((industry, i) => (
            <motion.div key={industry} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: i * 0.05 + 0.2 }} className="bg-sg-black group">
              <button onClick={() => setActive(byIndustry[industry][0])} className="w-full text-left p-6 hover:bg-sg-deep transition-colors duration-200">
                <span className="block font-mono text-xs tracking-[0.2em] text-sg-gold mb-2 uppercase">{String(i + 1).padStart(2, '0')}</span>
                <span className="block font-display text-xl font-light text-sg-light group-hover:text-sg-white transition-colors">{industryLabels[industry]}</span>
                <span className="block font-sans text-xs text-sg-muted mt-1">
                  {byIndustry[industry].length} {byIndustry[industry].length === 1 ? 'entity' : 'entities'}
                </span>
              </button>
            </motion.div>
          ))}
        </div>

        {active && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-px bg-sg-deep border border-sg-border p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <span className="sg-eyebrow block mb-3">{industryLabels[active.industry]}</span>
                <h3 className="font-display text-2xl lg:text-3xl font-light text-sg-white mb-4">{active.name}</h3>
                <p className="font-sans text-sm text-sg-muted leading-relaxed">{active.shortDescription}</p>
              </div>
              <div className="flex items-end">
                <Link href={`/businesses/${active.slug}`} className="sg-btn-ghost text-sm">View Business <ArrowUpRight size={14} /></Link>
              </div>
            </div>
          </motion.div>
        )}

        <div className="mt-12 text-center">
          <Link href="/businesses" className="sg-btn-ghost">View All Businesses</Link>
        </div>
      </div>
    </section>
  )
}
