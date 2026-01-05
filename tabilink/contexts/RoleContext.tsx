"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"

export type UserRole = "user" | "admin" | "super_admin"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  createdAt: string
  lastLogin?: string
}

interface RoleContextType {
  user: User | null
  role: UserRole | null
  setUser: (user: User | null) => void
  hasRole: (roles: UserRole[]) => boolean
  hasPermission: (permission: string) => boolean
  logout: () => void
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

// Role-based permissions
const rolePermissions: Record<UserRole, string[]> = {
  user: [
    "view_dashboard",
    "view_bookings",
    "create_booking",
    "view_profile",
    "edit_profile",
    "view_hotels",
    "view_travel_packages",
  ],
  admin: [
    "view_dashboard",
    "view_bookings",
    "create_booking",
    "view_profile",
    "edit_profile",
    "view_hotels",
    "view_travel_packages",
    "view_admin_dashboard",
    "manage_bookings",
    "manage_users",
    "view_analytics",
    "manage_content",
  ],
  super_admin: [
    "view_dashboard",
    "view_bookings",
    "create_booking",
    "view_profile",
    "edit_profile",
    "view_hotels",
    "view_travel_packages",
    "view_admin_dashboard",
    "manage_bookings",
    "manage_users",
    "view_analytics",
    "manage_content",
    "view_super_admin_dashboard",
    "manage_admins",
    "manage_roles",
    "system_settings",
    "view_all_analytics",
    "manage_system",
  ],
}

export function RoleProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("tabilinkUser")
      const isLoggedIn = localStorage.getItem("tabilinkDemoLoggedIn")
      
      if (isLoggedIn === "1" && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          setUserState(parsedUser)
        } catch (error) {
          console.error("Error parsing user data:", error)
          localStorage.removeItem("tabilinkUser")
          localStorage.removeItem("tabilinkDemoLoggedIn")
        }
      }
    }
  }, [])

  const setUser = (newUser: User | null) => {
    setUserState(newUser)
    if (typeof window !== "undefined") {
      if (newUser) {
        localStorage.setItem("tabilinkUser", JSON.stringify(newUser))
        localStorage.setItem("tabilinkDemoLoggedIn", "1")
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: "tabilinkUser",
            newValue: JSON.stringify(newUser),
          })
        )
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: "tabilinkDemoLoggedIn",
            newValue: "1",
          })
        )
      } else {
        localStorage.removeItem("tabilinkUser")
        localStorage.removeItem("tabilinkDemoLoggedIn")
      }
    }
  }

  const hasRole = (roles: UserRole[]): boolean => {
    if (!user) return false
    return roles.includes(user.role)
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    return rolePermissions[user.role]?.includes(permission) || false
  }

  const logout = () => {
    setUser(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("tabilinkUser")
      localStorage.removeItem("tabilinkDemoLoggedIn")
    }
  }

  return (
    <RoleContext.Provider
      value={{
        user,
        role: user?.role || null,
        setUser,
        hasRole,
        hasPermission,
        logout,
      }}
    >
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const context = useContext(RoleContext)
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider")
  }
  return context
}














