"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

function SuperAdminPageContent() {
  const router = useRouter()

  useEffect(() => {
    router.push("/super-admin/dashboard")
  }, [router])

  return null
}

export default function SuperAdminPage() {
  return (
    <ProtectedRoute allowedRoles={["super_admin"]}>
      <SuperAdminPageContent />
    </ProtectedRoute>
  )
}
