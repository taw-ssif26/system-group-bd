'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const milestones = [
  { year: '2009', event: 'System Group founded. System Properties Limited established. System Sattar Tower launched.' },
  { year: '2011', event: 'System Builders Limited launched, strengthening in-house construction capabilities.' },
  { year: '2015', event: 'Diversification into trading, fisheries, and telecommunications retail.' },
  { year: '2021', event: 'A. Kashem Telecom and grooming sector entry — System Group enters lifestyle.' },
  { year: '2023', event: 'System Imperial Complex inaugurated as Chattogram\'s premier tech & mobile hub. System Dove Tower completed.' },
  { year: '2024', event: 'System Aziz Complex under development. System Technologies advances ICT and prop-tech vision.' },
]

export default function TimelineSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="py-32 bg-sg-black overflow-hidden" ref={ref}>
      <div className="sg-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="mb-16"
        >
          <span className="sg-eyebrow block mb-6">The Journey</span>
          <h2 className="font-display font-light text-display-lg text-sg-white">
            15 years of building.
          </h2>
        </motion.div>

        {/* Horizontal scroll timeline */}
        <div className="relative overflow-x-auto pb-8">
          <div className="flex gap-0 min-w-max">
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 + 0.2 }}
                className="relative w-72 border-r border-sg-border last:border-r-0 pr-8 mr-8 last:mr-0"
              >
                <div className="mb-4">
                  <span className="font-display text-5xl font-light text-sg-gold/30">{m.year}</span>
                </div>
                <div className="w-full h-px bg-sg-gold mb-4" />
                <p className="font-sans text-sm text-sg-muted leading-relaxed">{m.event}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
