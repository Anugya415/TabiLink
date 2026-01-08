"use client"

import { useState, useEffect } from "react"
import { useRole, User, UserRole } from "@/contexts/RoleContext"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Users,
  Activity,
  TrendingUp,
  Search,
  XCircle,
} from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api"

export default function UsersContent() {
  const { user } = useRole()
  const [users, setUsers] = useState<User[]>([])
  const [userSearch, setUserSearch] = useState("")
  const [dialogType, setDialogType] = useState<string | null>(null)
  const [dialogAction, setDialogAction] = useState<"add" | "view" | "edit" | null>(null)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true)
      try {
        const response = await api.getUsers({ search: userSearch }) as { success: boolean; data: { users: any[] } }
        if (response.success && response.data.users) {
          setUsers(response.data.users.map((u: any) => ({
            id: u.id.toString(),
            name: u.name,
            email: u.email,
            role: u.role,
            createdAt: u.createdAt || u.memberSince || new Date().toISOString(),
            lastLogin: u.lastLogin || null,
          })))
        }
      } catch (error: any) {
        console.error("Error fetching users:", error)
        toast.error("Failed to load users", {
          description: error.message || "An error occurred while fetching users",
        })
      } finally {
        setIsLoadingUsers(false)
      }
    }
    fetchUsers()
  }, [userSearch])


  const allRegularUsers = users.filter(u => u.role === "user")
  const filteredUsers = allRegularUsers.filter((u) =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  )

  const roleColors: Record<UserRole, string> = {
    user: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
    admin: "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400",
    super_admin: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400",
  }

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      const user = users.find(u => u.id === userId)
      if (!user) return

      await api.updateUser(userId, { role: newRole }) as { success: boolean; message: string }
      toast.success("Role updated", {
        description: `User role has been changed to ${newRole}`,
      })
      // Refresh users list
      const usersResponse = await api.getUsers() as { success: boolean; data: { users: any[] } }
      if (usersResponse.success && usersResponse.data.users) {
        setUsers(usersResponse.data.users.map((u: any) => ({
          id: u.id.toString(),
          name: u.name,
          email: u.email,
          role: u.role,
          createdAt: u.createdAt || u.memberSince || new Date().toISOString(),
          lastLogin: u.lastLogin || null,
        })))
      }
    } catch (error: any) {
      console.error("Error updating role:", error)
      toast.error("Failed to update role", {
        description: error.message || "An error occurred while updating the role",
      })
    }
  }

  return (
    <div className="container space-y-8 py-12 page-content relative max-w-7xl">
      {/* Header */}
      <div className="flex flex-col gap-3 animate-fade-in-down">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                Super Admin Dashboard
              </p>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">Manage user roles and permissions</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="animate-fade-in-up">
        <div className="space-y-6">
          {/* User Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover-lift bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{allRegularUsers.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Active accounts</p>
              </CardContent>
            </Card>
            <Card className="hover-lift bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">New This Month</CardTitle>
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">+458</div>
                <p className="text-xs text-muted-foreground mt-1">+12.5% from last month</p>
              </CardContent>
            </Card>
            <Card className="hover-lift bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Today</CardTitle>
                <Activity className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">8,456</div>
                <p className="text-xs text-muted-foreground mt-1">Logged in today</p>
              </CardContent>
            </Card>
          </div>

          <Card className="hover-lift bg-card">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage user roles and permissions ({filteredUsers.length} users)</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      className="w-64 pl-10"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                    />
                  </div>
                  <Button
                    className="hover-lift"
                    onClick={() => {
                      setSelectedItem(null)
                      setDialogType("user")
                      setDialogAction("add")
                    }}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No users found</p>
                  </div>
                ) : (
                  filteredUsers.map((u) => (
                    <div
                      key={u.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">{u.name}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[u.role]}`}>
                            {u.role.replace("_", " ").toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{u.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Created: {new Date(u.createdAt).toLocaleDateString()} • Last login: {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : "Never"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                          className="w-36"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                          <option value="super_admin">Super Admin</option>
                        </Select>
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover-lift"
                          onClick={() => {
                            setSelectedItem(u)
                            setDialogType("user")
                            setDialogAction("view")
                          }}
                        >
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover-lift"
                          onClick={() => {
                            setSelectedItem(u)
                            setDialogType("user")
                            setDialogAction("edit")
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={async () => {
                            try {
                              await api.deleteUser(u.id) as { success: boolean; message: string }
                              toast.success("User deleted", {
                                description: `${u.name} has been removed from the system`,
                              })
                              // Refresh users list
                              const usersResponse = await api.getUsers() as { success: boolean; data: { users: any[] } }
                              if (usersResponse.success && usersResponse.data.users) {
                                setUsers(usersResponse.data.users.map((user: any) => ({
                                  id: user.id.toString(),
                                  name: user.name,
                                  email: user.email,
                                  role: user.role,
                                  createdAt: user.createdAt || user.memberSince || new Date().toISOString(),
                                  lastLogin: user.lastLogin || null,
                                })))
                              }
                            } catch (error: any) {
                              console.error("Error deleting user:", error)
                              toast.error("Failed to delete user", {
                                description: error.message || "An error occurred while deleting the user",
                              })
                            }
                          }}
                          className="text-destructive hover:text-destructive"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* User Dialog */}
      <Dialog open={dialogType === "user" && dialogAction !== null} onOpenChange={(open) => !open && (setDialogType(null), setDialogAction(null), setSelectedItem(null))}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl">
              {dialogAction === "add" ? "Add New User" : dialogAction === "view" ? "User Details" : "Edit User"}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              {dialogAction === "add" ? "Create a new user account" : dialogAction === "view" ? "View user information" : "Update user details"}
            </DialogDescription>
          </DialogHeader>
          {dialogAction === "view" ? (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>User ID</Label>
                  <p className="text-sm font-medium text-foreground">{selectedItem?.id}</p>
                </div>
                <div>
                  <Label>Role</Label>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    selectedItem?.role === "super_admin" ? "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400" :
                    selectedItem?.role === "admin" ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400" :
                    "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400"
                  }`}>
                    {selectedItem?.role}
                  </span>
                </div>
                <div>
                  <Label>Name</Label>
                  <p className="text-sm font-medium text-foreground">{selectedItem?.name}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="text-sm text-foreground">{selectedItem?.email}</p>
                </div>
                <div>
                  <Label>Created At</Label>
                  <p className="text-sm text-foreground">{selectedItem?.createdAt ? new Date(selectedItem.createdAt).toLocaleString() : "N/A"}</p>
                </div>
                <div>
                  <Label>Last Login</Label>
                  <p className="text-sm text-foreground">{selectedItem?.lastLogin ? new Date(selectedItem.lastLogin).toLocaleString() : "N/A"}</p>
                </div>
              </div>
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4">
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => (setDialogType(null), setDialogAction(null), setSelectedItem(null))}>Close</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input defaultValue={selectedItem?.name || ""} id="user-name" />
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input type="email" defaultValue={selectedItem?.email || ""} id="user-email" />
                </div>
                <div className="space-y-2">
                  <Label>Password {dialogAction === "add" ? "*" : "(leave blank to keep current)"}</Label>
                  <Input type="password" id="user-password" placeholder={dialogAction === "add" ? "Minimum 8 characters" : "Leave blank to keep current"} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input type="tel" defaultValue={selectedItem?.phone || ""} id="user-phone" placeholder="Optional" />
                </div>
                <div className="space-y-2">
                  <Label>Role *</Label>
                  <Select defaultValue={selectedItem?.role || "user"} id="user-role">
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </Select>
                </div>
              </div>
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4">
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => (setDialogType(null), setDialogAction(null), setSelectedItem(null))}>Cancel</Button>
                <Button className="w-full sm:w-auto" onClick={async () => {
                  try {
                    const name = (document.getElementById("user-name") as HTMLInputElement)?.value
                    const email = (document.getElementById("user-email") as HTMLInputElement)?.value
                    const password = (document.getElementById("user-password") as HTMLInputElement)?.value
                    const phone = (document.getElementById("user-phone") as HTMLInputElement)?.value || ""
                    const role = (document.getElementById("user-role") as HTMLSelectElement)?.value as "user" | "admin" | "super_admin"

                    // Validation
                    if (!name || !email) {
                      toast.error("Validation Error", {
                        description: "Name and email are required fields",
                      })
                      return
                    }
                    if (dialogAction === "add" && (!password || password.length < 8)) {
                      toast.error("Validation Error", {
                        description: "Password must be at least 8 characters for new users",
                      })
                      return
                    }

                    setIsLoadingUsers(true)

                    if (dialogAction === "add") {
                      // Create new user via API
                      console.log("Creating user with data:", { name, email, phone, role, passwordLength: password?.length })
                      const response = await api.createUser({
                        name,
                        email,
                        password,
                        phone,
                        role,
                      }) as { success?: boolean; message?: string; data?: { user: any } }
                      console.log("Create user response:", response)

                      if (response && (response.success !== false)) {
                        toast.success("User added", {
                          description: `New user ${name} has been created successfully`,
                        })
                        // Refresh users list
                        try {
                          const usersResponse = await api.getUsers({ search: userSearch }) as { success?: boolean; data?: { users: any[] } }
                          if (usersResponse && usersResponse.data && usersResponse.data.users) {
                            setUsers(usersResponse.data.users.map((u: any) => ({
                              id: u.id.toString(),
                              name: u.name,
                              email: u.email,
                              role: u.role,
                              createdAt: u.createdAt || u.memberSince || new Date().toISOString(),
                              lastLogin: u.lastLogin || null,
                            })))
                          }
                        } catch (refreshError: any) {
                          console.error("Error refreshing users list:", refreshError)
                          // Don't show error for refresh failure, user was still created
                        }
                      } else {
                        throw new Error(response?.message || "Failed to create user")
                      }
                    } else {
                      // Update existing user via API
                      const updateData: any = {
                        name,
                        email,
                        phone,
                        role,
                      }
                      if (password && password.length >= 8) {
                        updateData.password = password
                      }
                      const response = await api.updateUser(selectedItem?.id, updateData) as { success: boolean; message: string; data: { user: any } }

                      if (response.success) {
                        toast.success("User updated", {
                          description: `User ${name} has been updated successfully`,
                        })
                        // Refresh users list
                        const usersResponse = await api.getUsers() as { success: boolean; data: { users: any[] } }
                        if (usersResponse.success && usersResponse.data.users) {
                          setUsers(usersResponse.data.users.map((u: any) => ({
                            id: u.id.toString(),
                            name: u.name,
                            email: u.email,
                            role: u.role,
                            createdAt: u.createdAt || u.memberSince || new Date().toISOString(),
                            lastLogin: u.lastLogin || null,
                          })))
                        }
                      }
                    }
                    setDialogType(null)
                    setDialogAction(null)
                    setSelectedItem(null)
                  } catch (error: any) {
                    console.error("Error saving user:", error)
                    toast.error("Failed to save user", {
                      description: error.message || "An error occurred while saving the user",
                    })
                  } finally {
                    setIsLoadingUsers(false)
                  }
                }} disabled={isLoadingUsers}>Save</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
