"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Plane, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const updateState = () => {
      const stored = localStorage.getItem("tabilinkDemoLoggedIn")
      setIsLoggedIn(stored === "1")
    }
    updateState()
    const onStorage = (event: StorageEvent) => {
      if (event.key === "tabilinkDemoLoggedIn") {
        updateState()
      }
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  // Re-check login flag on route change so the header updates after login redirect
  useEffect(() => {
    if (typeof window === "undefined") return
    const stored = localStorage.getItem("tabilinkDemoLoggedIn")
    setIsLoggedIn(stored === "1")
  }, [pathname])

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("tabilinkDemoLoggedIn")
    }
    setIsLoggedIn(false)
    setMobileMenuOpen(false)
  }

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/hotels", label: "Hotels" },
    { href: "/travel", label: "Travel Packages" },
    { href: "/about", label: "About" },
  ]

  // Hide header on dashboard and related pages when logged in
  const dashboardPages = ["/dashboard", "/hotels", "/travel"]
  const isDashboardPage = dashboardPages.some(page => pathname.startsWith(page))
  
  if (isDashboardPage && isLoggedIn) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-fade-in-down">
      <div className="container flex h-14 sm:h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 hover-scale transition-transform">
          <Plane className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          <span className="text-lg sm:text-xl font-bold">TabiLink</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-all duration-300 hover:text-primary hover-scale",
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          {!isLoggedIn ? (
            <Button asChild className="hidden md:inline-flex hover-lift">
              <Link href="/login">Login</Link>
            </Button>
          ) : (
            <Button
              variant="outline"
              className="hidden md:inline-flex hover-lift"
              onClick={handleSignOut}
            >
              Sign out
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover-scale transition-transform"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t animate-slide-up">
          <nav className="container flex flex-col space-y-4 p-4 animate-stagger">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-all duration-300 hover:text-primary hover-scale",
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
                onClick={() => setMobileMenuOpen(false)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {item.label}
              </Link>
            ))}
            {!isLoggedIn ? (
              <Button asChild className="w-full mt-4 hover-lift" style={{ animationDelay: `${navItems.length * 0.1}s` }}>
                <Link href="/login">Login</Link>
              </Button>
            ) : (
              <Button className="w-full mt-4 hover-lift" variant="outline" onClick={handleSignOut} style={{ animationDelay: `${navItems.length * 0.1}s` }}>
                Sign out
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}


