"use client"

import { useEffect, useState } from "react"
import { ParticlesBackground } from "@/components/particles"

export function BackgroundAnimations() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Particles with enhanced visibility */}
      <ParticlesBackground variant="stars" className="opacity-40" />
      
      {/* Animated gradient background - more vibrant */}
      <div className="absolute inset-0 animated-gradient-soft opacity-30" />
      
      {/* Animated mesh gradient - more visible */}
      <div className="absolute inset-0 animated-mesh opacity-25" />
      
      {/* Enhanced floating orbs with more colors and better positioning */}
      <div className="floating-orb w-[700px] h-[700px] bg-gradient-to-br from-indigo-500/15 to-purple-500/15 -top-48 -left-48 blur-3xl" style={{ animationDelay: '0s', animationDuration: '20s' }} />
      <div className="floating-orb w-[600px] h-[600px] bg-gradient-to-br from-purple-500/15 to-pink-500/15 top-1/4 -right-48 blur-3xl" style={{ animationDelay: '5s', animationDuration: '25s' }} />
      <div className="floating-orb w-[550px] h-[550px] bg-gradient-to-br from-pink-500/15 to-rose-500/15 bottom-1/4 left-1/4 blur-3xl" style={{ animationDelay: '10s', animationDuration: '22s' }} />
      <div className="floating-orb w-[500px] h-[500px] bg-gradient-to-br from-cyan-500/12 to-blue-500/12 top-1/2 right-1/3 blur-3xl" style={{ animationDelay: '3s', animationDuration: '28s' }} />
      <div className="floating-orb w-[450px] h-[450px] bg-gradient-to-br from-emerald-500/12 to-teal-500/12 bottom-1/3 left-1/2 blur-3xl" style={{ animationDelay: '7s', animationDuration: '24s' }} />
      <div className="floating-orb w-[480px] h-[480px] bg-gradient-to-br from-amber-500/12 to-orange-500/12 top-1/3 left-1/3 blur-3xl" style={{ animationDelay: '12s', animationDuration: '26s' }} />
      <div className="floating-orb w-[520px] h-[520px] bg-gradient-to-br from-rose-500/12 to-red-500/12 bottom-1/4 right-1/4 blur-3xl" style={{ animationDelay: '8s', animationDuration: '23s' }} />
      <div className="floating-orb w-[460px] h-[460px] bg-gradient-to-br from-violet-500/12 to-purple-600/12 top-2/3 right-1/5 blur-3xl" style={{ animationDelay: '15s', animationDuration: '27s' }} />
      <div className="floating-orb w-[580px] h-[580px] bg-gradient-to-br from-blue-500/10 to-indigo-600/10 bottom-10 left-1/3 blur-3xl" style={{ animationDelay: '18s', animationDuration: '29s' }} />
      
      {/* Wave animation - more visible */}
      <div className="wave-background opacity-15" />
      
      {/* Shimmer effect - enhanced */}
      <div className="absolute inset-0 shimmer-bg opacity-20" />
      
      {/* Radial gradient overlays for depth */}
      <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-gradient-radial from-primary/5 via-transparent to-transparent blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-gradient-radial from-secondary/5 via-transparent to-transparent blur-3xl animate-pulse-slow" style={{ animationDelay: '10s' }} />
    </div>
  )
}

