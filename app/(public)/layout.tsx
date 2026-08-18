import Navigation from '@/components/navigation/Navigation'
import Footer from '@/components/navigation/Footer'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      <main>{children}</main>
      <Footer />
    </>
  )
}
