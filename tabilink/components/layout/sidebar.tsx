"use client"

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import {
  LayoutDashboard,
  Calendar,
  Heart,
  User,
  Settings,
  LogOut,
  Plane,
  CreditCard,
  MapPin,
  Bell,
  X,
  ChevronLeft,
  Navigation,
  Compass,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function SidebarContent() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isOpen, setIsOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const checkLogin = () => {
      const stored = localStorage.getItem("tabilinkDemoLoggedIn")
      setIsLoggedIn(stored === "1")
    }
    checkLogin()

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "tabilinkDemoLoggedIn") {
        checkLogin()
      }
    }
    window.addEventListener("storage", handleStorage)

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setIsOpen(false)
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("storage", handleStorage)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("tabilinkDemoLoggedIn")
      setIsLoggedIn(false)
      setIsOpen(false)
      router.push("/")
    }
  }

  // Only render sidebar if logged in
  if (!isLoggedIn) {
    return null
  }

  const menuItems = [
    {
      title: "Main",
      items: [
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: LayoutDashboard,
        },
        {
          href: "/dashboard?tab=bookings",
          label: "My Bookings",
          icon: Calendar,
        },
        {
          href: "/dashboard?tab=saved",
          label: "Saved Trips",
          icon: Heart,
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          href: "/dashboard?tab=profile",
          label: "Profile",
          icon: User,
        },
        {
          href: "/dashboard?tab=settings",
          label: "Settings",
          icon: Settings,
        },
        {
          href: "/dashboard?tab=notifications",
          label: "Notifications",
          icon: Bell,
        },
      ],
    },
    {
      title: "Travel",
      items: [
        {
          href: "/dashboard?tab=transportation",
          label: "Book Transportation",
          icon: Navigation,
        },
        {
          href: "/dashboard?tab=plan-trip",
          label: "Plan Your Trip",
          icon: Compass,
        },
        {
          href: "/hotels",
          label: "Browse Hotels",
          icon: MapPin,
        },
        {
          href: "/travel",
          label: "Travel Packages",
          icon: Plane,
        },
        {
          href: "/dashboard?tab=payments",
          label: "Payment Methods",
          icon: CreditCard,
        },
      ],
    },
  ]

  // Check if we're on a dashboard-related page (header will be hidden)
  const dashboardPages = ["/dashboard", "/hotels", "/travel"]
  const isDashboardPage = dashboardPages.some(page => pathname.startsWith(page))

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 bg-background/95 backdrop-blur border-r z-40 transition-all duration-300 ease-in-out shadow-lg",
          isDashboardPage ? "top-0 h-screen" : "top-16 h-[calc(100vh-4rem)]",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isOpen && !isMobile ? "w-72" : "w-0 lg:w-20"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={cn(
            "flex items-center border-b transition-all duration-300",
            isOpen && !isMobile ? "justify-between p-4" : "justify-center p-3"
          )}>
            {isOpen && !isMobile && (
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                  <User className="h-5 w-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold truncate">My Account</span>
                  <span className="text-xs text-muted-foreground truncate">Member</span>
                </div>
              </div>
            )}
            {!isOpen && !isMobile && (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User className="h-5 w-5" />
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "flex-shrink-0",
                isOpen && !isMobile ? "ml-auto" : "ml-0"
              )}
              onClick={() => setIsOpen(!isOpen)}
            >
              {isMobile ? (
                <X className="h-5 w-5" />
              ) : (
                <ChevronLeft
                  className={cn(
                    "h-5 w-5 transition-transform",
                    !isOpen && "rotate-180"
                  )}
                />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <nav className={cn(
            "flex-1 overflow-y-auto space-y-6 transition-all duration-300",
            isOpen && !isMobile ? "p-4" : "p-3"
          )}>
            {menuItems.map((section, sectionIndex) => (
              <div key={section.title}>
                {isOpen && !isMobile && (
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                    {section.title}
                  </h3>
                )}
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon
                    const itemPath = item.href.split("?")[0]
                    const itemTab = item.href.split("tab=")[1]
                    const currentTab = searchParams.get("tab")
                    const isActive = pathname === itemPath && (
                      !itemTab || (itemTab && currentTab === itemTab) || (itemPath === "/dashboard" && !currentTab && item.label === "Dashboard")
                    )

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center rounded-lg text-sm font-medium transition-all duration-200 hover-lift",
                          isOpen && !isMobile ? "gap-3 px-3 py-2.5" : "justify-center p-2.5",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                        onClick={() => isMobile && setIsOpen(false)}
                        title={!isOpen && !isMobile ? item.label : undefined}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        {isOpen && !isMobile && (
                          <span className="animate-fade-in-right truncate">{item.label}</span>
                        )}
                        {!isOpen && !isMobile && (
                          <span className="sr-only">{item.label}</span>
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className={cn(
            "border-t transition-all duration-300",
            isOpen && !isMobile ? "p-4" : "p-3"
          )}>
            <Button
              variant="ghost"
              className={cn(
                "w-full text-muted-foreground hover:text-destructive transition-all duration-200",
                isOpen && !isMobile ? "justify-start gap-3 px-3 py-2.5" : "justify-center p-2.5"
              )}
              onClick={handleSignOut}
              title={!isOpen && !isMobile ? "Sign Out" : undefined}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {isOpen && !isMobile && (
                <span className="animate-fade-in-right">Sign Out</span>
              )}
            </Button>
          </div>
        </div>
      </aside>

      {/* Toggle button for mobile */}
      {isMobile && !isOpen && (
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 left-4 z-50 lg:hidden shadow-lg hover-lift"
          onClick={() => setIsOpen(true)}
        >
          <LayoutDashboard className="h-5 w-5" />
        </Button>
      )}
    </>
  )
}

export function Sidebar() {
  return (
    <Suspense fallback={null}>
      <SidebarContent />
    </Suspense>
  )
}

