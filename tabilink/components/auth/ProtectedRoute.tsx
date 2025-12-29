"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useRole, UserRole } from "@/contexts/RoleContext"
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

  useEffect(() => {
    if (requireAuth && !user) {
      toast.error("Authentication Required", {
        description: "Please log in to access this page",
      })
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
  }, [user, allowedRoles, requireAuth, hasRole, router])

  if (requireAuth && !user) {
    return null
  }

  if (requireAuth && allowedRoles && user && !hasRole(allowedRoles)) {
    return null
  }

  return <>{children}</>
}




