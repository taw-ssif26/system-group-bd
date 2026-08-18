import type { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://systemgroupbd.com'
const SITE_NAME = 'System Group Bangladesh'

export function buildMetadata({
  title,
  description,
  image,
  noIndex = false,
  path = '',
}: {
  title: string
  description: string
  image?: string | null
  noIndex?: boolean
  path?: string
}): Metadata {
  const url = `${BASE_URL}${path}`
  const ogImage = image || `${BASE_URL}/og-default.jpg`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  }
}
