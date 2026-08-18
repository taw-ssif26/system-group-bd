'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function CareersTeaser({ openJobs }: { openJobs: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="py-32 bg-sg-deep" ref={ref}>
      <div className="sg-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          className="max-w-3xl">
          <span className="sg-eyebrow block mb-6">Careers</span>
          <h2 className="font-display font-light text-display-lg text-sg-white mb-6 leading-tight">
            Build what comes next.
          </h2>
          <p className="font-sans text-sg-muted leading-relaxed mb-10 max-w-xl">
            System Group is growing across every sector. We're looking for ambitious people who want to
            shape the future of Bangladesh's business landscape.
          </p>
          <div className="flex items-center gap-8">
            <Link href="/careers" className="sg-btn-primary">
              {openJobs > 0 ? `${openJobs} Open Position${openJobs > 1 ? 's' : ''}` : 'View Opportunities'}
              <ArrowRight size={14} />
            </Link>
            {openJobs > 0 && (
              <span className="font-mono text-xs text-sg-muted">
                Across all divisions
              </span>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
