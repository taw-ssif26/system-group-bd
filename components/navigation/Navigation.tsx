'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const LOGO =
  'https://systemgroupbd.com/wp-content/uploads/2023/11/system-group-logo.png'

const navLinks = [
  { label: 'About', href: '/about' },
  { label: 'Businesses', href: '/businesses' },
  { label: 'Projects', href: '/projects' },
  { label: 'News', href: '/news' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/contact' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)

    window.addEventListener('scroll', handler, {
      passive: true,
    })

    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-sg-black/95 backdrop-blur-sm border-b border-sg-border'
            : 'bg-transparent'
        }`}
      >
        <div className="sg-container flex items-center justify-between h-16 lg:h-20">
          <Link
            href="/"
            className="relative block w-[150px] h-[46px]"
          >
            <Image
              src={LOGO}
              alt="System Group Bangladesh"
              fill
              priority
              sizes="150px"
              className="object-contain object-left"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-sans text-xs tracking-[0.15em] uppercase text-sg-muted hover:text-sg-gold transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 text-sg-light hover:text-sg-gold transition-colors"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-sg-black flex flex-col items-center justify-center lg:hidden"
          >
            <div className="absolute top-5 left-6">
              <Image
                src={LOGO}
                alt="System Group Bangladesh"
                width={150}
                height={46}
                className="object-contain"
              />
            </div>

            <nav className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="font-display text-3xl font-light text-sg-light hover:text-sg-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="absolute bottom-12 left-0 right-0 text-center">
              <p className="font-mono text-xs tracking-[0.3em] text-sg-muted uppercase">
                Xplore Beyond!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
