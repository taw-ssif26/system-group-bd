'use client'
import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])
  return (
    <div className="min-h-screen bg-sg-black flex flex-col items-center justify-center text-center px-6">
      <span className="font-mono text-xs tracking-[0.3em] text-sg-gold uppercase mb-6">Error</span>
      <h1 className="font-display font-light text-4xl text-sg-white mb-4">Something went wrong.</h1>
      <p className="font-sans text-sg-muted mb-10">Our systems couldn't complete that request. Please try again.</p>
      <button onClick={reset} className="sg-btn-primary">Try Again</button>
    </div>
  )
}
