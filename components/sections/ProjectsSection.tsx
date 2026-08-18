'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'


const statusLabel: Record<string, string> = {
  UPCOMING: 'Upcoming',
  ONGOING: 'Under Construction',
  COMPLETED: 'Completed',
  AVAILABLE: 'Available',
}

const statusColor: Record<string, string> = {
  UPCOMING: 'text-blue-400',
  ONGOING: 'text-yellow-500',
  COMPLETED: 'text-sg-gold',
  AVAILABLE: 'text-green-400',
}

interface Props {
  projects: any[]
}

export default function ProjectsSection({ projects }: Props) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="projects" className="py-32 bg-sg-deep" ref={ref}>
      <div className="sg-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8"
        >
          <div>
            <span className="sg-eyebrow block mb-6">Portfolio</span>
            <h2 className="font-display font-light text-display-lg text-sg-white leading-tight">
              Built to become
              <br />
              landmarks.
            </h2>
          </div>
          <Link href="/projects" className="sg-btn-ghost shrink-0">
            All Projects <ArrowUpRight size={14} />
          </Link>
        </motion.div>

        {/* Project list — editorial table style */}
        <div className="divide-y divide-sg-border border-t border-sg-border">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08 + 0.1 }}
            >
              <Link
                href={`/projects/${project.slug}`}
                className="group flex flex-col sm:flex-row sm:items-center justify-between py-6 gap-4 hover:bg-sg-surface -mx-6 px-6 transition-colors duration-200"
              >
                <div className="flex items-start gap-6">
                  <span className="font-mono text-xs text-sg-muted mt-1 shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-light text-sg-white group-hover:text-sg-gold transition-colors">
                      {project.name}
                    </h3>
                    <span className="font-sans text-xs text-sg-muted">{project.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-6 sm:gap-12 pl-10 sm:pl-0">
                  {project.investment && (
                    <span className="font-mono text-xs text-sg-light">{project.investment}</span>
                  )}
                  <span className={`font-mono text-xs ${statusColor[project.status]}`}>
                    {statusLabel[project.status]}
                  </span>
                  <ArrowUpRight size={16} className="text-sg-muted group-hover:text-sg-gold transition-colors" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
