"use client"

import { useCallback, useMemo, useState, useEffect } from "react"
import Particles from "@tsparticles/react"
import type { Container, ISourceOptions } from "@tsparticles/engine"

interface ParticlesBackgroundProps {
  className?: string
  variant?: "default" | "stars" | "bubbles" | "snow"
}

let idCounter = 0

export function ParticlesBackground({ 
  className = "", 
  variant = "default" 
}: ParticlesBackgroundProps) {
  const [mounted, setMounted] = useState(false)
  const [particlesId] = useState(() => {
    // Generate ID only once on mount, not during render
    if (typeof window !== "undefined") {
      return `tsparticles-${variant}-${++idCounter}`
    }
    return `tsparticles-${variant}-ssr`
  })
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const particlesInit = useCallback(async (container: Container | undefined) => {
    // Container is already initialized by Particles component
    // This callback is just for notification that particles are loaded
    if (container) {
      // Particles are ready
    }
  }, [])

  const options: ISourceOptions = useMemo(() => {
    const baseOptions: ISourceOptions = {
      background: {
        color: {
          value: "transparent",
        },
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: "push",
          },
          onHover: {
            enable: true,
            mode: "repulse",
          },
          resize: {
            enable: true,
          },
        },
        modes: {
          push: {
            quantity: 4,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
          attract: {
            distance: 200,
            duration: 0.4,
            speed: 1,
          },
        },
      },
      particles: {
        color: {
          value: ["#6366f1", "#8b5cf6", "#a855f7", "#ec4899", "#f59e0b", "#10b981", "#06b6d4", "#3b82f6", "#ef4444", "#f97316"],
        },
        links: {
          color: "#6366f1",
          distance: 150,
          enable: true,
          opacity: 0.3,
          width: 1.5,
          triangles: {
            enable: true,
            opacity: 0.1,
          },
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "bounce",
          },
          random: true,
          speed: 1.5,
          straight: false,
          attract: {
            enable: true,
            distance: 200,
          },
        },
        number: {
          density: {
            enable: true,
          },
          value: 100,
        },
        opacity: {
          value: { min: 0.2, max: 0.5 },
          animation: {
            enable: true,
            speed: 1,
            sync: false,
          },
        },
        shape: {
          type: ["circle", "triangle"],
        },
        size: {
          value: { min: 1, max: 4 },
          animation: {
            enable: true,
            speed: 2,
            sync: false,
            destroy: "none",
            startValue: "random",
          },
        },
        rotate: {
          animation: {
            enable: true,
            speed: 5,
            sync: false,
          },
        },
        twinkle: {
          particles: {
            enable: true,
            frequency: 0.05,
            opacity: 1,
          },
        },
      },
      detectRetina: true,
      smooth: true,
    }

    switch (variant) {
      case "stars":
        return {
          ...baseOptions,
          particles: {
            ...baseOptions.particles,
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 150,
            },
            links: {
              enable: false,
            },
            move: {
              ...baseOptions.particles?.move,
              speed: 0.3,
              attract: {
                enable: true,
                distance: 200,
                duration: 0.4,
                speed: 1,
              },
            },
            opacity: {
              value: { min: 0.3, max: 0.8 },
              animation: {
                enable: true,
                speed: 0.5,
                sync: false,
              },
            },
            size: {
              value: { min: 1, max: 3 },
              animation: {
                enable: true,
                speed: 3,
                sync: false,
              },
            },
            twinkle: {
              particles: {
                enable: true,
                frequency: 0.1,
                opacity: 1,
              },
            },
          },
        }
      
      case "bubbles":
        return {
          ...baseOptions,
          particles: {
            ...baseOptions.particles,
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 60,
            },
            links: {
              enable: false,
            },
            move: {
              ...baseOptions.particles?.move,
              speed: 1.5,
              direction: "none",
              outModes: {
                default: "bounce",
              },
              attract: {
                enable: true,
                distance: 200,
                duration: 0.4,
                speed: 1,
              },
            },
            opacity: {
              value: { min: 0.2, max: 0.6 },
              animation: {
                enable: true,
                speed: 1,
                sync: false,
              },
            },
            size: {
              value: { min: 4, max: 12 },
              animation: {
                enable: true,
                speed: 2,
                sync: false,
                destroy: "none",
                startValue: "random",
              },
            },
            shape: {
              type: "circle",
            },
          },
        }
      
      case "snow":
        return {
          ...baseOptions,
          particles: {
            ...baseOptions.particles,
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 200,
            },
            links: {
              enable: false,
            },
            move: {
              ...baseOptions.particles?.move,
              direction: "bottom",
              speed: 1.5,
              straight: false,
              outModes: {
                default: "out",
                bottom: "out",
              },
            },
            opacity: {
              value: { min: 0.4, max: 0.8 },
              animation: {
                enable: true,
                speed: 0.5,
                sync: false,
              },
            },
            size: {
              value: { min: 1, max: 4 },
              animation: {
                enable: true,
                speed: 1,
                sync: false,
              },
            },
            rotate: {
              animation: {
                enable: true,
                speed: 5,
                sync: false,
              },
            },
          },
        }
      
      default:
        return baseOptions
    }
  }, [variant])

  // Only render particles on client to avoid hydration mismatch
  if (!mounted) {
    return <div className={`absolute inset-0 -z-10 ${className}`} />
  }

  return (
    <div className={`absolute inset-0 -z-10 ${className}`}>
      <Particles
        id={particlesId}
        particlesLoaded={particlesInit}
        options={options}
      />
    </div>
  )
}

