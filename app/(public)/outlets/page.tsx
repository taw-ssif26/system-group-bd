import { prisma } from '@/lib/db/prisma'
import { buildMetadata } from '@/lib/seo'
import { MapPin, Phone, Clock } from 'lucide-react'

export const revalidate = 300

export async function generateMetadata() {
  return buildMetadata({
    title: 'Outlets & Offices — System Group Bangladesh',
    description: 'Find System Group Bangladesh offices and retail outlets across Chattogram and Bangladesh.',
    path: '/outlets',
  })
}

export default async function OutletsPage() {
  const outlets = await prisma.outlet.findMany({
    where: { isActive: true },
    orderBy: { city: 'asc' },
    include: { sisterConcern: { select: { name: true } } },
  })

  const byCity: Record<string, typeof outlets> = {}
  for (const o of outlets) {
    if (!byCity[o.city]) byCity[o.city] = []
    byCity[o.city].push(o)
  }

  return (
    <>
      <div className="pt-32 pb-16 bg-sg-black border-b border-sg-border">
        <div className="sg-container">
          <span className="sg-eyebrow block mb-4">Locations</span>
          <h1 className="font-display font-light text-display-xl text-sg-white">Find Us.</h1>
        </div>
      </div>

      <section className="py-16 bg-sg-black">
        <div className="sg-container">
          {outlets.length === 0 ? (
            <p className="text-sg-muted font-sans text-sm py-16 text-center">Location information coming soon.</p>
          ) : (
            Object.entries(byCity).map(([city, cityOutlets]) => (
              <div key={city} className="mb-16">
                <h2 className="font-display text-2xl font-light text-sg-white mb-8 pb-4 border-b border-sg-border">{city}</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cityOutlets.map((outlet) => (
                    <div key={outlet.id} className="sg-card p-6">
                      <div className="mb-4">
                        <h3 className="font-display text-lg font-light text-sg-white mb-1">{outlet.name}</h3>
                        {outlet.sisterConcern && (
                          <span className="sg-eyebrow text-[10px]">{outlet.sisterConcern.name}</span>
                        )}
                      </div>
                      <div className="space-y-3 font-sans text-sm text-sg-muted">
                        <div className="flex items-start gap-2">
                          <MapPin size={14} className="text-sg-gold mt-0.5 shrink-0" />
                          <span>{outlet.address}</span>
                        </div>
                        {outlet.phone && (
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="text-sg-gold shrink-0" />
                            <a href={`tel:${outlet.phone}`} className="hover:text-sg-gold transition-colors">{outlet.phone}</a>
                          </div>
                        )}
                        {outlet.openingHours && (
                          <div className="flex items-start gap-2">
                            <Clock size={14} className="text-sg-gold mt-0.5 shrink-0" />
                            <span>{outlet.openingHours}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  )
}
