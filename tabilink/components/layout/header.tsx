"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Plane, Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/contexts/TranslationContext"

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { language, setLanguage, t } = useTranslation()
  const [selectorOpen, setSelectorOpen] = useState(false)

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

  // Close selector when clicking outside
  useEffect(() => {
    if (!selectorOpen) return
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.currency-language-selector')) {
        setSelectorOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [selectorOpen])

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("tabilinkDemoLoggedIn")
    }
    setIsLoggedIn(false)
    setMobileMenuOpen(false)
  }

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/hotels", label: t("hotels") },
    { href: "/travel", label: t("travelPackages") },
    { href: "/about", label: t("about") },
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
          {/* Language Selector */}
          <div className="relative hidden md:block currency-language-selector">
            <button
              onClick={() => setSelectorOpen(!selectorOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-200 text-gray-900 hover:bg-gray-300 transition-colors shadow-md"
            >
              <span className="font-semibold text-sm">{language}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            
            {selectorOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-100 rounded-lg shadow-xl border border-gray-300 overflow-hidden z-50">
                <div className="p-2">
                  <div>
                    <p className="text-xs text-gray-600 px-2 py-1 mb-1">Language</p>
                    <button
                      onClick={() => { setLanguage("English"); setSelectorOpen(false); }}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                        language === "English" ? "bg-gray-300 text-gray-900" : "text-gray-700 hover:bg-gray-200"
                      )}
                    >
                      English
                    </button>
                    <button
                      onClick={() => { setLanguage("Hindi"); setSelectorOpen(false); }}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                        language === "Hindi" ? "bg-gray-300 text-gray-900" : "text-gray-700 hover:bg-gray-200"
                      )}
                    >
                      Hindi
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {!isLoggedIn ? (
            <Button asChild className="hidden md:inline-flex hover-lift">
              <Link href="/login">{t("login")}</Link>
            </Button>
          ) : (
            <Button
              variant="outline"
              className="hidden md:inline-flex hover-lift"
              onClick={handleSignOut}
            >
              {t("signOut")}
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
            {/* Language Selector - Mobile */}
            <div className="relative currency-language-selector" style={{ animationDelay: `${navItems.length * 0.1}s` }}>
              <button
                onClick={() => setSelectorOpen(!selectorOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-200 text-gray-900 hover:bg-gray-300 transition-colors shadow-md w-full justify-between"
              >
                <span className="font-semibold text-sm">{language}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {selectorOpen && (
                <div className="mt-2 w-full bg-gray-100 rounded-lg shadow-xl border border-gray-300 overflow-hidden z-50">
                  <div className="p-2">
                    <div>
                      <p className="text-xs text-gray-600 px-2 py-1 mb-1">Language</p>
                      <button
                        onClick={() => { setLanguage("English"); setSelectorOpen(false); }}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                          language === "English" ? "bg-gray-300 text-gray-900" : "text-gray-700 hover:bg-gray-200"
                        )}
                      >
                        English
                      </button>
                      <button
                        onClick={() => { setLanguage("Hindi"); setSelectorOpen(false); }}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                          language === "Hindi" ? "bg-gray-300 text-gray-900" : "text-gray-700 hover:bg-gray-200"
                        )}
                      >
                        Hindi
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {!isLoggedIn ? (
              <Button asChild className="w-full mt-4 hover-lift" style={{ animationDelay: `${(navItems.length + 1) * 0.1}s` }}>
                <Link href="/login">{t("login")}</Link>
              </Button>
            ) : (
              <Button className="w-full mt-4 hover-lift" variant="outline" onClick={handleSignOut} style={{ animationDelay: `${(navItems.length + 1) * 0.1}s` }}>
                {t("signOut")}
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}


