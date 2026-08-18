'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
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

interface Project {
  id: string
  name: string
  slug: string
  location: string
  status: string
  investment: string | null
  featuredImage: string | null
}

interface Props {
  projects: Project[]
}

export default function ProjectsSection({ projects }: Props) {
  const ref = useRef(null)
  const inView = useInView(ref, {
    once: true,
    margin: '-80px',
  })

  return (
    <section
      id="projects"
      className="py-32 bg-sg-deep"
      ref={ref}
    >
      <div className="sg-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8"
        >
          <div>
            <span className="sg-eyebrow block mb-6">
              Portfolio
            </span>

            <h2 className="font-display font-light text-display-lg text-sg-white leading-tight">
              Built to become
              <br />
              landmarks.
            </h2>
          </div>

          <Link
            href="/projects"
            className="sg-btn-ghost shrink-0"
          >
            All Projects
            <ArrowUpRight size={14} />
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-px bg-sg-border">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: i * 0.08 + 0.1,
              }}
              className="bg-sg-deep"
            >
              <Link
                href={`/projects/${project.slug}`}
                className="group block"
              >
                <div className="relative aspect-[16/9] bg-sg-surface overflow-hidden">
                  {project.featuredImage ? (
                    <Image
                      src={project.featuredImage}
                      alt={project.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="sg-eyebrow">
                        System Group
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <span className="font-mono text-xs text-sg-muted">
                        {String(i + 1).padStart(2, '0')}
                      </span>

                      <h3 className="font-display text-xl font-light text-sg-white mt-2 group-hover:text-sg-gold transition-colors">
                        {project.name}
                      </h3>

                      <span className="font-sans text-xs text-sg-muted">
                        {project.location}
                      </span>
                    </div>

                    <ArrowUpRight
                      size={18}
                      className="text-sg-muted group-hover:text-sg-gold transition-colors shrink-0"
                    />
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-sg-border">
                    {project.investment ? (
                      <span className="font-mono text-xs text-sg-light">
                        {project.investment}
                      </span>
                    ) : (
                      <span />
                    )}

                    <span
                      className={`font-mono text-xs ${
                        statusColor[project.status] || 'text-sg-muted'
                      }`}
                    >
                      {statusLabel[project.status] || project.status}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
