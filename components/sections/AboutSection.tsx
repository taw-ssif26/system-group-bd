'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface Props {
  settings?: Record<string, string>
}

export default function AboutSection({ settings = {} }: Props) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  const description =
    settings.about_description ||
    'Established in 2009, System Group began as a real estate venture offering a distinctive blend of security and innovation. Now, we are transforming our real estate business into a dynamic powerhouse by diversifying into the IT sector, lifestyle, and tourism. Embrace smart city development, tech hubs, and wellness residences. A convergence of modern living, environmental consciousness, and technological advancement defines our unique approach.'

  return (
    <section id="about" className="py-32 bg-sg-deep" ref={ref}>
      <div className="sg-container">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <span className="sg-eyebrow block mb-6">
                About System Group
              </span>

              <h2 className="font-display font-light text-display-lg text-sg-white mb-8 leading-tight">
                From foundations
                <br />
                to future systems.
              </h2>

              <p className="font-sans text-sg-muted leading-relaxed mb-8">
                {description}
              </p>

              <div className="grid grid-cols-3 border-t border-sg-border pt-8 gap-6">
                <div>
                  <span className="block font-display text-3xl text-sg-white font-light">
                    {settings.stat_projects || '25+'}
                  </span>
                  <span className="sg-eyebrow block mt-2">
                    Projects
                  </span>
                </div>

                <div>
                  <span className="block font-display text-3xl text-sg-white font-light">
                    {settings.stat_employees || '200+'}
                  </span>
                  <span className="sg-eyebrow block mt-2">
                    Employees
                  </span>
                </div>

                <div>
                  <span className="block font-display text-3xl text-sg-white font-light">
                    {settings.stat_investment || '50+'}
                  </span>
                  <span className="sg-eyebrow block mt-2">
                    USD Investment
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute left-4 top-0 bottom-0 w-px bg-sg-border" />

            {[
              {
                year: '2009',
                title: 'Foundation',
                body: 'System Group established and entered the real estate sector with a vision built around security and innovation.',
              },
              {
                year: '2011',
                title: 'Construction',
                body: 'System Builders Limited expanded the group into construction and landmark development.',
              },
              {
                year: '2015+',
                title: 'Diversification',
                body: 'Expansion into trading, fisheries, telecommunications, electronics, lifestyle and allied businesses.',
              },
              {
                year: '2023',
                title: 'Technology Era',
                body: 'System Technologies and the System Imperial Complex strengthened the group’s technology and retail ecosystem.',
              },
              {
                year: '2024+',
                title: 'Future Expansion',
                body: 'Smart cities, technology hubs, wellness residences, ICT innovation and new ventures define the next horizon.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.1 * i + 0.3,
                }}
                className="relative pl-12 pb-10 last:pb-0"
              >
                <div className="absolute left-[13px] top-1 w-[6px] h-[6px] rounded-full bg-sg-gold" />

                <span className="sg-eyebrow block mb-1">
                  {item.year}
                </span>

                <h3 className="font-display text-xl font-light text-sg-white mb-2">
                  {item.title}
                </h3>

                <p className="font-sans text-sm text-sg-muted leading-relaxed">
                  {item.body}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}