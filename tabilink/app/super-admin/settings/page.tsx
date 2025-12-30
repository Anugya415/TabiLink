"use client"

import { Suspense } from "react"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import SettingsContent from "./SettingsContent"

export default function SettingsPage() {
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
        <SettingsContent />
      </Suspense>
    </ProtectedRoute>
  )
}



