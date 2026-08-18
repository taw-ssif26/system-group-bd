import { prisma } from '@/lib/db/prisma'
import { buildMetadata } from '@/lib/seo'
import ContactSection from '@/components/sections/ContactSection'

export const revalidate = 300

export async function generateMetadata() {
  return buildMetadata({
    title: 'Contact — System Group Bangladesh',
    description: 'Get in touch with System Group Bangladesh. Our headquarters are at System Imperial Complex, Chattogram.',
    path: '/contact',
  })
}

export default async function ContactPage() {
  const concerns = await prisma.sisterConcern.findMany({
    where: { isPublished: true },
    orderBy: { displayOrder: 'asc' },
  })

  return (
    <>
      <div className="pt-32 pb-0 bg-sg-black">
        <div className="sg-container pb-16">
          <span className="sg-eyebrow block mb-4">Contact</span>
          <h1 className="font-display font-light text-display-xl text-sg-white">Let's build beyond.</h1>
        </div>
      </div>
      <ContactSection concerns={concerns} />
    </>
  )
}
