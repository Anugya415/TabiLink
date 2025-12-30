"use client"

import { Suspense } from "react"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import UsersContent from "./UsersContent"

export default function UsersPage() {
  return (
    <ProtectedRoute allowedRoles={["super_admin"]}>
      <Suspense fallback={
        <div className="container space-y-8 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        </div>
      }>
        <UsersContent />
      </Suspense>
    </ProtectedRoute>
  )
}



