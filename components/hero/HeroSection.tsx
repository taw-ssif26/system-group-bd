'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface HeroProps {
  settings: Record<string, string>
}

const stats = [
  { key: 'established', label: 'Established' },
  { key: 'stat_projects', label: 'Key Projects' },
  { key: 'stat_employees', label: 'Team Members' },
  { key: 'stat_investment', label: 'Investment' },
]

export default function HeroSection({ settings }: HeroProps) {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-sg-black">
      {/* Background texture grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(var(--sg-gold) 1px, transparent 1px),
                            linear-gradient(90deg, var(--sg-gold) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Vertical gold accent line */}
      <motion.div
        className="absolute left-[10%] top-0 bottom-0 w-px bg-sg-gold/20"
        initial={{ scaleY: 0, transformOrigin: 'top' }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      />

      <div className="sg-container relative z-10 pt-32 pb-20">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center gap-4 mb-12"
        >
          <div className="w-8 h-px bg-sg-gold" />
          <span className="sg-eyebrow">Established 2009 · Chattogram, Bangladesh</span>
        </motion.div>

        {/* Main headline */}
        <div className="overflow-hidden mb-4">
          <motion.h1
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="font-display font-light text-display-2xl text-sg-white"
          >
            Xplore
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-10">
          <motion.h1
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
            className="font-display font-light text-display-2xl text-sg-gold"
          >
            Beyond.
          </motion.h1>
        </div>

        {/* Sub copy */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85 }}
          className="font-sans text-sg-muted text-base lg:text-lg max-w-xl mb-12 leading-relaxed"
        >
          Building businesses. Creating possibilities.
          <br />
          Shaping what comes next.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="flex flex-wrap gap-4 mb-24"
        >
          <Link href="/businesses" className="sg-btn-primary">
            Explore the Group
            <ArrowRight size={14} />
          </Link>
          <Link href="/about" className="sg-btn-ghost">
            Our Story
          </Link>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="border-t border-sg-border pt-8 grid grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat) => (
            <div key={stat.key} className="flex flex-col gap-1">
              <span className="font-display text-3xl lg:text-4xl font-light text-sg-white">
                {settings[stat.key] || '—'}
              </span>
              <span className="font-mono text-xs tracking-[0.2em] text-sg-muted uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        <motion.div
          className="w-px h-12 bg-sg-gold/40"
          animate={{ scaleY: [1, 0.3, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}
