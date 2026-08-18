'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function AboutSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="about" className="py-32 bg-sg-deep" ref={ref}>
      <div className="sg-container">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left — text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <span className="sg-eyebrow block mb-6">About System Group</span>
              <h2 className="font-display font-light text-display-lg text-sg-white mb-8 leading-tight">
                From foundations
                <br />
                to future systems.
              </h2>
              <p className="font-sans text-sg-muted leading-relaxed mb-6">
                Established in 2009, System Group Bangladesh entered Bangladesh's construction and real
                estate landscape with a bold vision. Our debut project — System Sattar Tower — quickly
                became a symbol of excellence, establishing us as a rising force in the nation's real
                estate market.
              </p>
              <p className="font-sans text-sg-muted leading-relaxed mb-6">
                What sets System Group apart is our visionary approach to growth. Rather than focusing on
                a single sector, we have cultivated a robust network of business entities — each designed
                to harness modern technology for economic acceleration and job creation.
              </p>
              <p className="font-sans text-sg-muted leading-relaxed">
                Today, we operate across real estate, construction, ICT, telecommunications, trading,
                lifestyle, agriculture, and grooming — a true diversified business ecosystem serving
                Bangladesh's future.
              </p>
            </motion.div>
          </div>

          {/* Right — vertical timeline */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Vertical line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-sg-border" />

            {[
              { year: '2009', title: 'Foundation', body: 'System Group established. System Properties Limited launched. System Sattar Tower — first project.' },
              { year: '2011', title: 'Construction Arm', body: 'System Builders Limited launched, bringing construction capabilities in-house.' },
              { year: '2015+', title: 'Diversification', body: 'Expansion into trading, fisheries, telecom retail, and lifestyle businesses.' },
              { year: '2023', title: 'Technology Era', body: 'System Technologies launched. System Imperial Complex opened as Chattogram\'s tech hub.' },
              { year: '2024+', title: 'Future Expansion', body: 'Grooming, ICT innovation, and the Aziz Complex — shaping what comes next.' },
            ].map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 * i + 0.3 }}
                className="relative pl-12 pb-10 last:pb-0"
              >
                {/* Dot */}
                <div className="absolute left-[13px] top-1 w-[6px] h-[6px] rounded-full bg-sg-gold" />

                <span className="sg-eyebrow block mb-1">{item.year}</span>
                <h3 className="font-display text-xl font-light text-sg-white mb-2">{item.title}</h3>
                <p className="font-sans text-sm text-sg-muted leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
