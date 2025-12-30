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

export default function UsersContent() {
  const { user } = useRole()
  const [users, setUsers] = useState<User[]>([])
  const [userSearch, setUserSearch] = useState("")
  const [dialogType, setDialogType] = useState<string | null>(null)
  const [dialogAction, setDialogAction] = useState<"add" | "view" | "edit" | null>(null)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  // Load comprehensive mock users
  useEffect(() => {
    setUsers([
      {
        id: "user-1",
        email: "user@tabilink.com",
        name: "John Traveler",
        role: "user",
        createdAt: "2024-01-01T00:00:00Z",
        lastLogin: "2024-01-15T10:30:00Z",
      },
      {
        id: "user-2",
        email: "jane@tabilink.com",
        name: "Jane Smith",
        role: "user",
        createdAt: "2024-01-05T00:00:00Z",
        lastLogin: "2024-01-14T14:20:00Z",
      },
      {
        id: "user-3",
        email: "mike@tabilink.com",
        name: "Mike Johnson",
        role: "user",
        createdAt: "2024-01-10T00:00:00Z",
        lastLogin: "2024-01-13T16:45:00Z",
      },
      {
        id: "user-4",
        email: "sarah@tabilink.com",
        name: "Sarah Williams",
        role: "user",
        createdAt: "2023-12-15T00:00:00Z",
        lastLogin: "2024-01-16T08:20:00Z",
      },
      {
        id: "user-5",
        email: "david@tabilink.com",
        name: "David Brown",
        role: "user",
        createdAt: "2024-01-20T00:00:00Z",
        lastLogin: "2024-01-17T11:30:00Z",
      },
      {
        id: "user-6",
        email: "emily@tabilink.com",
        name: "Emily Davis",
        role: "user",
        createdAt: "2023-11-05T00:00:00Z",
        lastLogin: "2024-01-16T09:15:00Z",
      },
      {
        id: "user-7",
        email: "robert@tabilink.com",
        name: "Robert Wilson",
        role: "user",
        createdAt: "2024-01-08T00:00:00Z",
        lastLogin: "2024-01-17T15:22:00Z",
      },
      {
        id: "user-8",
        email: "lisa@tabilink.com",
        name: "Lisa Anderson",
        role: "user",
        createdAt: "2024-01-12T00:00:00Z",
        lastLogin: "2024-01-16T12:10:00Z",
      },
      {
        id: "user-9",
        email: "james@tabilink.com",
        name: "James Martinez",
        role: "user",
        createdAt: "2023-12-20T00:00:00Z",
        lastLogin: "2024-01-15T09:45:00Z",
      },
      {
        id: "user-10",
        email: "maria@tabilink.com",
        name: "Maria Garcia",
        role: "user",
        createdAt: "2024-01-03T00:00:00Z",
        lastLogin: "2024-01-17T14:30:00Z",
      },
    ])
  }, [])

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

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)))
    toast.success("Role updated", {
      description: `User role has been changed to ${newRole}`,
    })
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
            <h1 className="text-3xl font-bold">User Management</h1>
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
                          onClick={() => {
                            toast.success("User deleted", {
                              description: `${u.name} has been removed from the system`,
                            })
                            setUsers(users.filter((user) => user.id !== u.id))
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {dialogAction === "add" ? "Add New User" : dialogAction === "view" ? "User Details" : "Edit User"}
            </DialogTitle>
            <DialogDescription>
              {dialogAction === "add" ? "Create a new user account" : dialogAction === "view" ? "View user information" : "Update user details"}
            </DialogDescription>
          </DialogHeader>
          {dialogAction === "view" ? (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
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
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => (setDialogType(null), setDialogAction(null), setSelectedItem(null))}>Close</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input defaultValue={selectedItem?.name || ""} id="user-name" />
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input type="email" defaultValue={selectedItem?.email || ""} id="user-email" />
                </div>
                <div className="space-y-2">
                  <Label>Role *</Label>
                  <Select defaultValue={selectedItem?.role || "user"} id="user-role">
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Created At</Label>
                  <Input type="datetime-local" defaultValue={selectedItem?.createdAt ? new Date(selectedItem.createdAt).toISOString().slice(0, 16) : ""} id="user-created" />
                </div>
                <div className="space-y-2">
                  <Label>Last Login</Label>
                  <Input type="datetime-local" defaultValue={selectedItem?.lastLogin ? new Date(selectedItem.lastLogin).toISOString().slice(0, 16) : ""} id="user-login" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => (setDialogType(null), setDialogAction(null), setSelectedItem(null))}>Cancel</Button>
                <Button onClick={() => {
                  const name = (document.getElementById("user-name") as HTMLInputElement)?.value
                  const email = (document.getElementById("user-email") as HTMLInputElement)?.value
                  const role = (document.getElementById("user-role") as HTMLSelectElement)?.value as "user" | "admin" | "super_admin"
                  const createdAt = (document.getElementById("user-created") as HTMLInputElement)?.value
                  const lastLogin = (document.getElementById("user-login") as HTMLInputElement)?.value

                  if (dialogAction === "add") {
                    const newId = `user-${users.length + 1}`
                    setUsers([...users, { id: newId, name, email, role, createdAt: createdAt ? new Date(createdAt).toISOString() : new Date().toISOString(), lastLogin: lastLogin ? new Date(lastLogin).toISOString() : new Date().toISOString() }])
                    toast.success("User added", { description: `New user ${name} has been created` })
                  } else {
                    setUsers(users.map(u => u.id === selectedItem?.id ? { ...u, name, email, role, createdAt: createdAt ? new Date(createdAt).toISOString() : u.createdAt, lastLogin: lastLogin ? new Date(lastLogin).toISOString() : u.lastLogin } : u))
                    toast.success("User updated", { description: `User ${name} has been updated` })
                  }
                  setDialogType(null)
                  setDialogAction(null)
                  setSelectedItem(null)
                }}>Save</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
