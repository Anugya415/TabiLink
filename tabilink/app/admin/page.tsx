"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useRole } from "@/contexts/RoleContext"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

function AdminPageContent() {
  const router = useRouter()

  useEffect(() => {
    router.push("/admin/dashboard")
  }, [router])

  return null
}

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
      <AdminPageContent />
    </ProtectedRoute>
  )
}

