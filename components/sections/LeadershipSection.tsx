'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'

interface Member {
  id: string
  name: string
  position: string
  biography: string
  portrait: string | null
  quote: string | null
}

interface Props {
  members: Member[]
}

export default function LeadershipSection({ members }: Props) {
  const ref = useRef(null)
  const inView = useInView(ref, {
    once: true,
    margin: '-80px',
  })

  return (
    <section
      id="leadership"
      className="py-32 bg-sg-deep"
      ref={ref}
    >
      <div className="sg-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="mb-16"
        >
          <span className="sg-eyebrow block mb-6">
            Executive Management
          </span>

          <h2 className="font-display font-light text-display-lg text-sg-white">
            The people behind
            <br />
            the vision.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-px bg-sg-border">
          {members.map((member, i) => (
            <motion.article
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 + 0.2 }}
              className="bg-sg-deep"
            >
              <div className="relative aspect-[4/5] bg-sg-surface overflow-hidden">
                {member.portrait ? (
                  <Image
                    src={member.portrait}
                    alt={`${member.name}, ${member.position}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display text-7xl text-sg-gold font-light">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-8">
                <h3 className="font-display text-xl font-light text-sg-white mb-1">
                  {member.name}
                </h3>

                <span className="sg-eyebrow block mb-5">
                  {member.position}
                </span>

                {member.biography && (
                  <p className="font-sans text-sm text-sg-muted leading-relaxed mb-5">
                    {member.biography}
                  </p>
                )}

                {member.quote && (
                  <blockquote className="font-display text-sm italic text-sg-muted border-l-2 border-sg-gold pl-4 leading-relaxed">
                    "{member.quote}"
                  </blockquote>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
