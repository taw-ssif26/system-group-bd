'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'


interface Props { members: any[] }

export default function LeadershipSection({ members }: Props) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="py-32 bg-sg-deep" ref={ref}>
      <div className="sg-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="mb-16">
          <span className="sg-eyebrow block mb-6">Leadership</span>
          <h2 className="font-display font-light text-display-lg text-sg-white">
            The people behind
            <br />
            the vision.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-px bg-sg-border">
          {members.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 + 0.2 }}
              className="bg-sg-deep p-8"
            >
              {/* Portrait placeholder */}
              <div className="w-16 h-16 bg-sg-surface border border-sg-border mb-6 flex items-center justify-center">
                <span className="font-display text-2xl text-sg-gold font-light">
                  {member.name.charAt(0)}
                </span>
              </div>
              <h3 className="font-display text-xl font-light text-sg-white mb-1">{member.name}</h3>
              <span className="sg-eyebrow block mb-4">{member.position}</span>
              {member.quote && (
                <blockquote className="font-display text-sm italic text-sg-muted border-l-2 border-sg-gold pl-4 leading-relaxed">
                  "{member.quote}"
                </blockquote>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
