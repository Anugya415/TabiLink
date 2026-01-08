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
  Shield,
  Crown,
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

export default function AdminsContent() {
  const { user } = useRole()
  const [users, setUsers] = useState<User[]>([])
  const [adminSearch, setAdminSearch] = useState("")
  const [dialogType, setDialogType] = useState<string | null>(null)
  const [dialogAction, setDialogAction] = useState<"add" | "view" | "edit" | null>(null)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)

  // Fetch admins from backend
  useEffect(() => {
    const fetchAdmins = async () => {
      setIsLoadingUsers(true)
      try {
        const response = await api.getUsers({ search: adminSearch }) as { success: boolean; data: { users: any[] } }
        if (response.success && response.data.users) {
          // Filter to only admins and super admins
          const admins = response.data.users.filter((u: any) => u.role === "admin" || u.role === "super_admin")
          setUsers(admins.map((u: any) => ({
            id: u.id.toString(),
            name: u.name,
            email: u.email,
            role: u.role,
            createdAt: u.createdAt || u.memberSince || new Date().toISOString(),
            lastLogin: u.lastLogin || null,
          })))
        }
      } catch (error: any) {
        console.error("Error fetching admins:", error)
        toast.error("Failed to load admins", {
          description: error.message || "An error occurred while fetching admins",
        })
      } finally {
        setIsLoadingUsers(false)
      }
    }
    fetchAdmins()
  }, [adminSearch])

  const allAdmins = users.filter(u => u.role === "admin" || u.role === "super_admin")
  const filteredAdmins = allAdmins.filter((a) =>
    a.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
    a.email.toLowerCase().includes(adminSearch.toLowerCase())
  )

  const roleColors: Record<UserRole, string> = {
    user: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
    admin: "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400",
    super_admin: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400",
  }

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await api.updateUser(userId, { role: newRole }) as { success: boolean; message: string }
      toast.success("Role updated", {
        description: `Admin role has been changed to ${newRole}`,
      })
      // Refresh admins list
      const response = await api.getUsers({ search: adminSearch }) as { success: boolean; data: { users: any[] } }
      if (response.success && response.data.users) {
        const admins = response.data.users.filter((u: any) => u.role === "admin" || u.role === "super_admin")
        setUsers(admins.map((u: any) => ({
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
              <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                Super Admin Dashboard
              </p>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">Admin Management</h1>
            <p className="text-muted-foreground">Manage admin accounts and permissions</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="animate-fade-in-up">
        <div className="space-y-6">
          {/* Admin Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover-lift bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Admins</CardTitle>
                <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{allAdmins.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Active admin accounts</p>
              </CardContent>
            </Card>
            <Card className="hover-lift bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Super Admins</CardTitle>
                <Crown className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{allAdmins.filter(a => a.role === "super_admin").length}</div>
                <p className="text-xs text-muted-foreground mt-1">Full system access</p>
              </CardContent>
            </Card>
            <Card className="hover-lift bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Regular Admins</CardTitle>
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{allAdmins.filter(a => a.role === "admin").length}</div>
                <p className="text-xs text-muted-foreground mt-1">Platform management</p>
              </CardContent>
            </Card>
          </div>

          <Card className="hover-lift bg-card">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl sm:text-2xl">Admin Management</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Manage admin accounts and permissions ({filteredAdmins.length} admins)</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search admins..."
                      className="w-full pl-10"
                      value={adminSearch}
                      onChange={(e) => setAdminSearch(e.target.value)}
                    />
                  </div>
                  <Button
                    className="hover-lift w-full sm:w-auto"
                    onClick={() => {
                      setSelectedItem(null)
                      setDialogType("admin")
                      setDialogAction("add")
                    }}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Create Admin
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredAdmins.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Shield className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No admins found</p>
                  </div>
                ) : (
                  filteredAdmins.map((admin) => (
                    <div
                      key={admin.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg border bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="space-y-1 flex-1 w-full sm:w-auto">
                        <div className="flex flex-wrap items-center gap-2">
                          {admin.role === "super_admin" ? (
                            <Crown className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                          ) : (
                            <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          )}
                          <span className="font-semibold text-foreground text-sm sm:text-base">{admin.name}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[admin.role]}`}>
                            {admin.role.replace("_", " ").toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground break-words">{admin.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Created: {new Date(admin.createdAt).toLocaleDateString()} • Last login: {admin.lastLogin ? new Date(admin.lastLogin).toLocaleString() : "Never"}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                        <Select
                          value={admin.role}
                          onChange={(e) => handleRoleChange(admin.id, e.target.value as UserRole)}
                          className="w-full sm:w-36"
                          disabled={admin.role === "super_admin" && admin.id === user?.id}
                        >
                          <option value="admin">Admin</option>
                          <option value="super_admin">Super Admin</option>
                        </Select>
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover-lift flex-1 sm:flex-initial"
                          onClick={() => {
                            setSelectedItem(admin)
                            setDialogType("admin")
                            setDialogAction("view")
                          }}
                        >
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover-lift flex-1 sm:flex-initial"
                          onClick={() => {
                            setSelectedItem(admin)
                            setDialogType("admin")
                            setDialogAction("edit")
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover-lift"
                          onClick={() => {
                            if (admin.id === user?.id) {
                              toast.error("Cannot delete", {
                                description: "You cannot delete your own account",
                              })
                              return
                            }
                            toast.success("Admin removed", {
                              description: `${admin.name} has been removed from admin role`,
                            })
                            setUsers(users.filter((u) => u.id !== admin.id))
                          }}
                          className="text-destructive hover:text-destructive"
                          disabled={admin.id === user?.id}
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

      {/* Admin Dialog */}
      <Dialog open={dialogType === "admin" && dialogAction !== null} onOpenChange={(open) => !open && (setDialogType(null), setDialogAction(null), setSelectedItem(null))}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl">
              {dialogAction === "view" ? "Admin Details" : dialogAction === "add" ? "Create New Admin" : "Edit Admin"}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              {dialogAction === "view" ? "View admin information" : dialogAction === "add" ? "Create a new admin account" : "Update admin details"}
            </DialogDescription>
          </DialogHeader>
          {dialogAction === "view" ? (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Admin ID</Label>
                  <p className="text-sm font-medium text-foreground">{selectedItem?.id}</p>
                </div>
                <div>
                  <Label>Role</Label>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    selectedItem?.role === "super_admin" ? "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400" :
                    "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
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
                  <Input defaultValue={selectedItem?.name || ""} id="admin-name" placeholder="Enter admin name" />
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input type="email" defaultValue={selectedItem?.email || ""} id="admin-email" placeholder="admin@example.com" />
                </div>
                <div className="space-y-2">
                  <Label>Password {dialogAction === "add" ? "*" : "(leave blank to keep current)"}</Label>
                  <Input type="password" id="admin-password" placeholder={dialogAction === "add" ? "Minimum 8 characters" : "Leave blank to keep current"} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input type="tel" defaultValue={selectedItem?.phone || ""} id="admin-phone" placeholder="Optional" />
                </div>
                <div className="space-y-2">
                  <Label>Role *</Label>
                  <Select defaultValue={selectedItem?.role || "admin"} id="admin-role">
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </Select>
                </div>
                {dialogAction === "edit" && (
                  <>
                <div className="space-y-2">
                  <Label>Created At</Label>
                  <Input type="datetime-local" defaultValue={selectedItem?.createdAt ? new Date(selectedItem.createdAt).toISOString().slice(0, 16) : ""} id="admin-created" />
                </div>
                <div className="space-y-2">
                  <Label>Last Login</Label>
                  <Input type="datetime-local" defaultValue={selectedItem?.lastLogin ? new Date(selectedItem.lastLogin).toISOString().slice(0, 16) : ""} id="admin-login" />
                </div>
                  </>
                )}
              </div>
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4">
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => (setDialogType(null), setDialogAction(null), setSelectedItem(null))}>Cancel</Button>
                <Button className="w-full sm:w-auto" onClick={async () => {
                  try {
                    const name = (document.getElementById("admin-name") as HTMLInputElement)?.value
                    const email = (document.getElementById("admin-email") as HTMLInputElement)?.value
                    const password = (document.getElementById("admin-password") as HTMLInputElement)?.value
                    const phone = (document.getElementById("admin-phone") as HTMLInputElement)?.value || ""
                    const role = (document.getElementById("admin-role") as HTMLSelectElement)?.value as "admin" | "super_admin"
                    
                    // Validation
                    if (!name || !email) {
                      toast.error("Validation Error", {
                        description: "Name and email are required fields",
                      })
                      return
                    }
                    if (dialogAction === "add" && (!password || password.length < 8)) {
                      toast.error("Validation Error", {
                        description: "Password must be at least 8 characters for new admins",
                      })
                      return
                    }

                    setIsLoadingUsers(true)

                    if (dialogAction === "add") {
                      // Create new admin via API
                      console.log("Creating admin with data:", { name, email, phone, role, passwordLength: password?.length })
                      const response = await api.createUser({
                        name,
                        email,
                        password,
                        phone,
                        role,
                      }) as { success?: boolean; message?: string; data?: { user: any } }
                      console.log("Create admin response:", response)

                      if (response && (response.success !== false)) {
                        toast.success("Admin created", { 
                          description: `New admin ${name} has been created successfully` 
                        })
                        // Refresh admins list
                        try {
                          const usersResponse = await api.getUsers({ search: adminSearch }) as { success?: boolean; data?: { users: any[] } }
                          if (usersResponse && usersResponse.data && usersResponse.data.users) {
                            const admins = usersResponse.data.users.filter((u: any) => u.role === "admin" || u.role === "super_admin")
                            setUsers(admins.map((u: any) => ({
                              id: u.id.toString(),
                              name: u.name,
                              email: u.email,
                              role: u.role,
                              createdAt: u.createdAt || u.memberSince || new Date().toISOString(),
                              lastLogin: u.lastLogin || null,
                            })))
                          }
                        } catch (refreshError: any) {
                          console.error("Error refreshing admins list:", refreshError)
                          // Don't show error for refresh failure, admin was still created
                        }
                      } else {
                        throw new Error(response.message || "Failed to create admin")
                      }
                    } else {
                      // Update existing admin via API
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
                        toast.success("Admin updated", { 
                          description: `Admin ${name} has been updated successfully` 
                        })
                        // Refresh admins list
                        const usersResponse = await api.getUsers({ search: adminSearch }) as { success: boolean; data: { users: any[] } }
                        if (usersResponse.success && usersResponse.data.users) {
                          const admins = usersResponse.data.users.filter((u: any) => u.role === "admin" || u.role === "super_admin")
                          setUsers(admins.map((u: any) => ({
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
                    console.error("Error saving admin:", error)
                    toast.error("Failed to save admin", {
                      description: error.message || "An error occurred while saving the admin",
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



