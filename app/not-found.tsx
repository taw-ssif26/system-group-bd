import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-sg-black flex flex-col items-center justify-center text-center px-6">
      <span className="font-mono text-xs tracking-[0.3em] text-sg-gold uppercase mb-6">404</span>
      <h1 className="font-display font-light text-5xl text-sg-white mb-4">Page not found.</h1>
      <p className="font-sans text-sg-muted mb-10">The page you're looking for doesn't exist or has moved.</p>
      <Link href="/" className="sg-btn-primary">Return Home</Link>
    </div>
  )
}
