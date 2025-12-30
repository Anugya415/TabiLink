"use client"

import { useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useRole, UserRole, User } from "@/contexts/RoleContext"
import { toast } from "sonner"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
  requireAuth?: boolean
}

export function ProtectedRoute({
  children,
  allowedRoles,
  requireAuth = true,
}: ProtectedRouteProps) {
  const { user, hasRole } = useRole()
  const router = useRouter()
  const pathname = usePathname()
  const previousUserRef = useRef<User | null>(null)
  const isLoggingOutRef = useRef(false)

  // List of public routes where we don't want to show auth toast
  const publicRoutes = ["/", "/login", "/signup", "/about", "/contact"]
  
  // Admin/super-admin routes where we don't want to show toast on logout
  const adminRoutes = ["/admin", "/super-admin"]

  useEffect(() => {
    // Track if user was logged in and now is null (likely a logout)
    if (previousUserRef.current && !user) {
      isLoggingOutRef.current = true
      // Reset after a short delay
      setTimeout(() => {
        isLoggingOutRef.current = false
      }, 1000)
    }
    previousUserRef.current = user

    // Don't show toast if we're on a public route (likely navigating away after logout)
    if (publicRoutes.includes(pathname)) {
      return
    }

    // Don't show toast if we're logging out from admin/super-admin routes
    if (isLoggingOutRef.current && adminRoutes.some(route => pathname.startsWith(route))) {
      router.push("/")
      return
    }

    if (requireAuth && !user) {
      // Only show toast if we're still on a protected route and not logging out
      if (!publicRoutes.includes(pathname) && !isLoggingOutRef.current) {
        toast.error("Authentication Required", {
          description: "Please log in to access this page",
        })
      }
      router.push("/login")
      return
    }

    if (requireAuth && allowedRoles && user && !hasRole(allowedRoles)) {
      toast.error("Access Denied", {
        description: "You don't have permission to access this page",
      })
      router.push("/dashboard")
      return
    }
  }, [user, allowedRoles, requireAuth, hasRole, router, pathname])

  if (requireAuth && !user) {
    return null
  }

  if (requireAuth && allowedRoles && user && !hasRole(allowedRoles)) {
    return null
  }

  return <>{children}</>
}





