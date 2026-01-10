"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import api from "@/lib/api"

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
    const loadUser = async () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token")
        const storedUser = localStorage.getItem("tabilinkUser")
        const isLoggedIn = localStorage.getItem("tabilinkDemoLoggedIn")
        
        // If we have a token but no user data, fetch from API
        if (token && (!storedUser || isLoggedIn !== "1")) {
          try {
            const response = await api.getMe() as { success: boolean; data: { user: any } }
            if (response.success && response.data.user) {
              const userData: User = {
                id: response.data.user.id.toString(),
                email: response.data.user.email,
                name: response.data.user.name,
                role: response.data.user.role,
                avatar: response.data.user.avatar,
                createdAt: response.data.user.createdAt || new Date().toISOString(),
                lastLogin: response.data.user.lastLogin,
              }
              setUserState(userData)
              localStorage.setItem("tabilinkUser", JSON.stringify(userData))
              localStorage.setItem("tabilinkDemoLoggedIn", "1")
            }
          } catch (error: any) {
            // Only log unexpected errors (not 401 which means token is invalid/expired)
            const errorStatus = error.status || error.response?.status;
            if (!errorStatus || errorStatus >= 500) {
              console.error("Error fetching user data:", error)
            }
            // Token might be invalid, clear everything
            localStorage.removeItem("token")
            localStorage.removeItem("tabilinkUser")
            localStorage.removeItem("tabilinkDemoLoggedIn")
          }
        } else if (isLoggedIn === "1" && storedUser) {
          // Load from localStorage if no token or if token exists with stored user
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
    }

    loadUser()
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
      localStorage.removeItem("token") // Also remove auth token
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














