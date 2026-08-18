'use client'
import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { MapPin, Clock, Send } from 'lucide-react'


interface Props { concerns: any[] }

export default function ContactSection({ concerns }: Props) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    const formData = new FormData(e.currentTarget)
    const body = Object.fromEntries(formData)

    try {
      const res = await fetch('/api/inquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="py-32 bg-sg-black" ref={ref}>
      <div className="sg-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="mb-16">
          <span className="sg-eyebrow block mb-6">Contact</span>
          <h2 className="font-display font-light text-display-lg text-sg-white leading-tight">
            Let's build beyond.
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Info */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.2 }}>
            <div className="flex items-start gap-4 mb-8">
              <MapPin size={16} className="text-sg-gold mt-1 shrink-0" />
              <div>
                <span className="sg-eyebrow block mb-1">Headquarters</span>
                <p className="font-sans text-sm text-sg-muted leading-relaxed">
                  System Imperial Complex (6th Floor)<br />
                  153 Kapasgola Road, Chawkbazar<br />
                  Chattogram 4203, Bangladesh
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Clock size={16} className="text-sg-gold mt-1 shrink-0" />
              <div>
                <span className="sg-eyebrow block mb-1">Office Hours</span>
                <p className="font-sans text-sm text-sg-muted">10:01 AM – 08:00 PM, Saturday–Thursday</p>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.3 }}>
            {status === 'sent' ? (
              <div className="p-8 border border-sg-gold/30 bg-sg-deep">
                <h3 className="font-display text-xl text-sg-white mb-2">Message received.</h3>
                <p className="font-sans text-sm text-sg-muted">We'll be in touch shortly. Thank you.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input name="name" placeholder="Full Name" required
                    className="bg-sg-deep border border-sg-border px-4 py-3 text-sm text-sg-light placeholder:text-sg-muted focus:border-sg-gold focus:outline-none transition-colors" />
                  <input name="email" type="email" placeholder="Email Address" required
                    className="bg-sg-deep border border-sg-border px-4 py-3 text-sm text-sg-light placeholder:text-sg-muted focus:border-sg-gold focus:outline-none transition-colors" />
                </div>
                <input name="phone" placeholder="Phone (optional)"
                  className="w-full bg-sg-deep border border-sg-border px-4 py-3 text-sm text-sg-light placeholder:text-sg-muted focus:border-sg-gold focus:outline-none transition-colors" />
                <select name="concernId"
                  className="w-full bg-sg-deep border border-sg-border px-4 py-3 text-sm text-sg-muted focus:border-sg-gold focus:outline-none transition-colors">
                  <option value="">Select Business (optional)</option>
                  {concerns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <input name="subject" placeholder="Subject" required
                  className="w-full bg-sg-deep border border-sg-border px-4 py-3 text-sm text-sg-light placeholder:text-sg-muted focus:border-sg-gold focus:outline-none transition-colors" />
                <textarea name="message" placeholder="Your message" rows={4} required
                  className="w-full bg-sg-deep border border-sg-border px-4 py-3 text-sm text-sg-light placeholder:text-sg-muted focus:border-sg-gold focus:outline-none transition-colors resize-none" />
                <button type="submit" disabled={status === 'sending'} className="sg-btn-primary w-full justify-center">
                  {status === 'sending' ? 'Sending…' : 'Send Message'}
                  <Send size={14} />
                </button>
                {status === 'error' && (
                  <p className="font-sans text-xs text-red-400">Something went wrong. Please try again.</p>
                )}
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
