import type { Metadata } from 'next'
import { Inter, Cormorant_Garamond, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['300','400','500','600'], variable: '--font-cormorant', display: 'swap' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' })

export const metadata: Metadata = {
  title: { default: 'System Group Bangladesh — Xplore Beyond!', template: '%s | System Group Bangladesh' },
  description: 'System Group Bangladesh is a diversified business group established in 2009, operating across real estate, construction, ICT, telecommunications, trading, lifestyle, agriculture, and grooming.',
  keywords: ['System Group', 'Bangladesh', 'real estate', 'Chattogram', 'construction', 'ICT'],
  openGraph: { type: 'website', locale: 'en_US', url: 'https://systemgroupbd.com', siteName: 'System Group Bangladesh' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} ${jetbrains.variable}`}>
      <body className="bg-sg-black text-sg-light antialiased">{children}</body>
    </html>
  )
}
