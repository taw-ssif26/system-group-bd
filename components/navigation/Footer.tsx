import Link from 'next/link'
import Image from 'next/image'

const LOGO =
  'https://systemgroupbd.com/wp-content/uploads/2023/11/system-group-logo.png'

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
          <div>
            <div className="relative w-[180px] h-[60px] mb-5">
              <Image
                src={LOGO}
                alt="System Group Bangladesh"
                fill
                sizes="180px"
                className="object-contain object-left"
              />
            </div>

            <p className="font-sans text-xs text-sg-muted leading-relaxed max-w-xs">
              Established in 2009. A diversified business ecosystem
              building Bangladesh's future through real estate,
              construction, technology, telecommunications, trading,
              lifestyle and allied ventures.
            </p>

            <p className="font-mono text-[0.65rem] tracking-[0.25em] text-sg-gold uppercase mt-4">
              Xplore Beyond!
            </p>
          </div>

          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <span className="sg-eyebrow block mb-6">
                {group}
              </span>

              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="font-sans text-sm text-sg-muted hover:text-sg-gold transition-colors"
                    >
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
            © {new Date().getFullYear()} System Group Bangladesh.
            All rights reserved.
          </p>

          <p className="font-mono text-xs text-sg-muted">
            System Imperial Complex (6th Floor), Kapasgola Road,
            Chawkbazar, Chattogram
          </p>
        </div>
      </div>
    </footer>
  )
}
