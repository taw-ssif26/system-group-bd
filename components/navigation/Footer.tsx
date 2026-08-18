import Link from 'next/link'

const links = {
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Leadership', href: '/about#leadership' },
    { label: 'Businesses', href: '/businesses' },
    { label: 'Projects', href: '/projects' },
  ],
  Explore: [
    { label: 'News', href: '/news' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Careers', href: '/careers' },
    { label: 'Outlets', href: '/outlets' },
  ],
  Contact: [
    { label: 'Get in Touch', href: '/contact' },
    { label: 'Headquarters', href: '/contact#map' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-sg-deep border-t border-sg-border">
      <div className="sg-container py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <span className="font-display font-light text-lg tracking-[0.12em] text-sg-white uppercase">
                System Group
              </span>
              <br />
              <span className="font-mono text-[0.6rem] tracking-[0.3em] text-sg-gold uppercase">
                Bangladesh
              </span>
            </div>
            <p className="font-sans text-xs text-sg-muted leading-relaxed max-w-xs">
              Established 2009. A diversified business ecosystem building Bangladesh's future.
            </p>
            <p className="font-mono text-[0.65rem] tracking-[0.25em] text-sg-gold uppercase mt-4">
              Xplore Beyond!
            </p>
          </div>

          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <span className="sg-eyebrow block mb-6">{group}</span>
              <ul className="space-y-3">
                {items.map(item => (
                  <li key={item.href}>
                    <Link href={item.href}
                      className="font-sans text-sm text-sg-muted hover:text-sg-gold transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-sg-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-sg-muted">
            © {new Date().getFullYear()} System Group Bangladesh. All rights reserved.
          </p>
          <p className="font-mono text-xs text-sg-muted">
            153 Kapasgola Road, Chawkbazar, Chattogram 4203
          </p>
        </div>
      </div>
    </footer>
  )
}
