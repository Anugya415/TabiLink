"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useRole, User, UserRole } from "@/contexts/RoleContext"
import { useTranslation } from "@/contexts/TranslationContext"
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
  Shield,
  Settings,
  Database,
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Crown,
  Key,
  BarChart3,
  Server,
  Calendar,
  TrendingUp,
  DollarSign,
  Hotel,
  Plane,
  Search,
  FileText,
  Bell,
  CreditCard,
  MapPin,
} from "lucide-react"
import { toast } from "sonner"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
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

function SuperAdminDashboardContent() {
  const { user } = useRole()
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<string>(
    searchParams.get("tab") || "overview"
  )
  const [users, setUsers] = useState<User[]>([])
  const [userSearch, setUserSearch] = useState("")
  const [adminSearch, setAdminSearch] = useState("")
  const [openDialog, setOpenDialog] = useState<string | null>(null)
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
        id: "admin-1",
        email: "admin@tabilink.com",
        name: "Admin Manager",
        role: "admin",
        createdAt: "2024-01-01T00:00:00Z",
        lastLogin: "2024-01-15T09:15:00Z",
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
        id: "admin-2",
        email: "admin2@tabilink.com",
        name: "Support Admin",
        role: "admin",
        createdAt: "2023-11-10T00:00:00Z",
        lastLogin: "2024-01-15T14:45:00Z",
      },
      {
        id: "user-6",
        email: "emily@tabilink.com",
        name: "Emily Davis",
        role: "user",
        createdAt: "2023-11-05T00:00:00Z",
        lastLogin: "2024-01-16T09:15:00Z",
      },
    ])
  }, [])

  // Mock admin data
  const allAdmins = users.filter(u => u.role === "admin" || u.role === "super_admin")
  const allRegularUsers = users.filter(u => u.role === "user")

  // Filter users
  const filteredUsers = allRegularUsers.filter((u) =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  )

  // Filter admins
  const filteredAdmins = allAdmins.filter((a) =>
    a.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
    a.email.toLowerCase().includes(adminSearch.toLowerCase())
  )

  // Mock system logs
  const systemLogs = [
    {
      id: "log-1",
      timestamp: "2024-01-17T10:30:00Z",
      level: "info",
      message: "Database backup completed successfully",
      category: "backup",
    },
    {
      id: "log-2",
      timestamp: "2024-01-17T09:15:00Z",
      level: "warning",
      message: "High CPU usage detected on server-02",
      category: "performance",
    },
    {
      id: "log-3",
      timestamp: "2024-01-17T08:45:00Z",
      level: "info",
      message: "New admin user created: admin2@tabilink.com",
      category: "user",
    },
    {
      id: "log-4",
      timestamp: "2024-01-17T07:20:00Z",
      level: "error",
      message: "Payment gateway connection timeout",
      category: "payment",
    },
    {
      id: "log-5",
      timestamp: "2024-01-17T06:10:00Z",
      level: "info",
      message: "Scheduled maintenance completed",
      category: "maintenance",
    },
  ]

  // Mock analytics data
  const analyticsData = {
    revenueByMonth: [
      { month: "Jan", revenue: 125000, bookings: 1245 },
      { month: "Feb", revenue: 145000, bookings: 1450 },
      { month: "Mar", revenue: 165000, bookings: 1650 },
      { month: "Apr", revenue: 180000, bookings: 1800 },
      { month: "May", revenue: 195000, bookings: 1950 },
      { month: "Jun", revenue: 210000, bookings: 2100 },
    ],
    userGrowth: [
      { month: "Jan", users: 10000 },
      { month: "Feb", users: 10500 },
      { month: "Mar", users: 11000 },
      { month: "Apr", users: 11500 },
      { month: "May", users: 12000 },
      { month: "Jun", users: 12458 },
    ],
    bookingsByStatus: {
      confirmed: 3247,
      pending: 856,
      cancelled: 234,
      completed: 1890,
    },
    topDestinations: [
      { destination: "Paris, France", bookings: 1245, revenue: 186750 },
      { destination: "Barcelona, Spain", bookings: 980, revenue: 185220 },
      { destination: "Tokyo, Japan", bookings: 890, revenue: 249200 },
      { destination: "Dubai, UAE", bookings: 780, revenue: 273000 },
      { destination: "New York, USA", bookings: 650, revenue: 146250 },
    ],
    systemMetrics: {
      avgResponseTime: "120ms",
      uptime: "99.9%",
      activeUsers: 8456,
      apiCalls: 1250000,
    },
  }

  const systemStats = [
    {
      title: "Total Users",
      value: "12,458",
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-500/20",
    },
    {
      title: "Admins",
      value: "24",
      icon: Shield,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-500/20",
    },
    {
      title: "System Health",
      value: "99.9%",
      icon: Activity,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-500/20",
    },
    {
      title: "Database Size",
      value: "2.4 GB",
      icon: Database,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-500/20",
    },
  ]

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


  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* System Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {systemStats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <Card
                    key={stat.title}
                    className="hover-lift animate-fade-in-up bg-card"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </CardTitle>
                      <div className={`h-10 w-10 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                        <Icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* System Status */}
            <Card className="hover-lift bg-card">
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Real-time system health monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/50">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="font-semibold text-foreground">API Server</p>
                      <p className="text-xs text-muted-foreground">Operational</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/50">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="font-semibold text-foreground">Database</p>
                      <p className="text-xs text-muted-foreground">Connected</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/50">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="font-semibold text-foreground">Payment Gateway</p>
                      <p className="text-xs text-muted-foreground">Active</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "users":
        return (
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
        )

      case "admins":
        return (
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
                  <div className="text-2xl font-bold text-foreground">1</div>
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
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <CardTitle>Admin Management</CardTitle>
                    <CardDescription>Manage admin accounts and permissions ({filteredAdmins.length} admins)</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search admins..."
                        className="w-64 pl-10"
                        value={adminSearch}
                        onChange={(e) => setAdminSearch(e.target.value)}
                      />
                    </div>
                    <Button
                      className="hover-lift"
                      onClick={() => {
                        toast.success("Create Admin", {
                          description: "Admin creation form would open here",
                        })
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
                        className="flex items-center justify-between p-4 rounded-lg border bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            {admin.role === "super_admin" ? (
                              <Crown className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                            ) : (
                              <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            )}
                            <span className="font-semibold text-foreground">{admin.name}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[admin.role]}`}>
                              {admin.role.replace("_", " ").toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{admin.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Created: {new Date(admin.createdAt).toLocaleDateString()} • Last login: {admin.lastLogin ? new Date(admin.lastLogin).toLocaleString() : "Never"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select
                            value={admin.role}
                            onChange={(e) => handleRoleChange(admin.id, e.target.value as UserRole)}
                            className="w-36"
                            disabled={admin.role === "super_admin" && admin.id === user?.id}
                          >
                            <option value="admin">Admin</option>
                            <option value="super_admin">Super Admin</option>
                          </Select>
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover-lift"
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
                            className="hover-lift"
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
        )

      case "system":
        return (
          <div className="space-y-6">
            {/* System Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover-lift bg-card">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">System Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">99.9%</p>
                      <p className="text-xs text-muted-foreground">Uptime</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover-lift bg-card">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">Response Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                      <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">120ms</p>
                      <p className="text-xs text-muted-foreground">Average</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover-lift bg-card">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">API Calls</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center">
                      <Server className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">1.25M</p>
                      <p className="text-xs text-muted-foreground">This month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Actions */}
              <Card className="hover-lift bg-card">
                <CardHeader>
                  <CardTitle>System Actions</CardTitle>
                  <CardDescription>Critical system operations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start hover-lift"
                    onClick={() => {
                      toast.success("Backup initiated", {
                        description: "Database backup started. You will be notified when complete.",
                      })
                    }}
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Backup Database
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start hover-lift"
                    onClick={() => {
                      toast.info("API Keys", {
                        description: "API key management panel would open here",
                      })
                    }}
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Manage API Keys
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start hover-lift"
                    onClick={() => {
                      toast.info("System Analytics", {
                        description: "Detailed system analytics would open here",
                      })
                    }}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    System Analytics
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start hover-lift"
                    onClick={() => {
                      toast.info("System Logs", {
                        description: "System log viewer would open here",
                      })
                    }}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Logs
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start hover-lift"
                    onClick={() => {
                      toast.info("System Configuration", {
                        description: "System configuration panel would open here",
                      })
                    }}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    System Configuration
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full justify-start hover-lift"
                    onClick={() => {
                      toast.error("Emergency Shutdown", {
                        description: "This action requires confirmation",
                      })
                    }}
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Emergency Shutdown
                  </Button>
                </CardContent>
              </Card>

              {/* System Logs */}
              <Card className="hover-lift bg-card">
                <CardHeader>
                  <CardTitle>Recent System Logs</CardTitle>
                  <CardDescription>Latest system events and activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {systemLogs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-start gap-3 p-3 rounded-lg border bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div
                          className={`h-2 w-2 rounded-full mt-2 flex-shrink-0 ${
                            log.level === "error"
                              ? "bg-red-500"
                              : log.level === "warning"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                        />
                        <div className="flex-1 space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-muted-foreground uppercase">{log.category}</span>
                            <span
                              className={`text-xs px-2 py-0.5 rounded ${
                                log.level === "error"
                                  ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                                  : log.level === "warning"
                                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400"
                                  : "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                              }`}
                            >
                              {log.level}
                            </span>
                          </div>
                          <p className="text-sm text-foreground">{log.message}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "analytics":
        return (
          <div className="space-y-6">
            {/* Analytics Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="hover-lift bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                  <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">${analyticsData?.revenueByMonth?.reduce((sum, m) => sum + (m?.revenue || 0), 0).toLocaleString() || "0"}</div>
                  <p className="text-xs text-muted-foreground mt-1">Last 6 months</p>
                </CardContent>
              </Card>
              <Card className="hover-lift bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
                  <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{analyticsData?.revenueByMonth?.reduce((sum, m) => sum + (m?.bookings || 0), 0).toLocaleString() || "0"}</div>
                  <p className="text-xs text-muted-foreground mt-1">Last 6 months</p>
                </CardContent>
              </Card>
              <Card className="hover-lift bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
                  <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{analyticsData?.systemMetrics?.activeUsers ? analyticsData.systemMetrics.activeUsers.toLocaleString() : "0"}</div>
                  <p className="text-xs text-muted-foreground mt-1">Currently online</p>
                </CardContent>
              </Card>
              <Card className="hover-lift bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">System Uptime</CardTitle>
                  <Activity className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{analyticsData.systemMetrics.uptime}</div>
                  <p className="text-xs text-muted-foreground mt-1">Reliability</p>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Chart */}
            <Card className="hover-lift bg-card">
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>Monthly revenue over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-end justify-between h-48 gap-2">
                    {analyticsData.revenueByMonth.map((data) => {
                      const maxRevenue = Math.max(...analyticsData.revenueByMonth.map(d => d.revenue))
                      const height = (data.revenue / maxRevenue) * 100
                      return (
                        <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                          <div className="w-full flex items-end justify-center" style={{ height: "160px" }}>
                            <div
                              className="w-full bg-primary rounded-t transition-all hover:opacity-80"
                              style={{ height: `${height}%`, minHeight: "8px" }}
                              title={`${data.month}: $${data.revenue ? data.revenue.toLocaleString() : "0"}`}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground font-medium">{data.month}</span>
                          <span className="text-xs font-semibold text-foreground">${(data.revenue / 1000).toFixed(0)}k</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bookings by Status */}
              <Card className="hover-lift bg-card">
                <CardHeader>
                  <CardTitle>Bookings by Status</CardTitle>
                  <CardDescription>Current booking distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(analyticsData.bookingsByStatus).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-3 w-3 rounded-full ${
                              status === "confirmed"
                                ? "bg-green-500"
                                : status === "pending"
                                ? "bg-yellow-500"
                                : status === "cancelled"
                                ? "bg-red-500"
                                : "bg-blue-500"
                            }`}
                          />
                          <span className="text-sm font-medium text-foreground capitalize">{status}</span>
                        </div>
                        <span className="text-sm font-semibold text-foreground">{count ? count.toLocaleString() : "0"}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Destinations */}
              <Card className="hover-lift bg-card">
                <CardHeader>
                  <CardTitle>Top Destinations</CardTitle>
                  <CardDescription>Most popular destinations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analyticsData.topDestinations.map((dest, index) => (
                      <div key={dest.destination} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-muted-foreground w-6">#{index + 1}</span>
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">{dest.destination}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-semibold text-foreground">{dest.bookings ? dest.bookings.toLocaleString() : "0"}</span>
                          <p className="text-xs text-muted-foreground">${dest.revenue ? dest.revenue.toLocaleString() : "0"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* User Growth Chart */}
            <Card className="hover-lift bg-card">
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>Monthly user growth over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-end justify-between h-48 gap-2">
                    {analyticsData.userGrowth.map((data) => {
                      const maxUsers = Math.max(...analyticsData.userGrowth.map(d => d.users))
                      const height = (data.users / maxUsers) * 100
                      return (
                        <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                          <div className="w-full flex items-end justify-center" style={{ height: "160px" }}>
                            <div
                              className="w-full bg-blue-500 rounded-t transition-all hover:opacity-80"
                              style={{ height: `${height}%`, minHeight: "8px" }}
                              title={`${data.month}: ${data.users ? data.users.toLocaleString() : "0"} users`}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground font-medium">{data.month}</span>
                          <span className="text-xs font-semibold text-foreground">{(data.users / 1000).toFixed(1)}k</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "settings":
        return (
          <div className="space-y-6">
            <Card className="hover-lift bg-card">
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure system-wide settings and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground">Security Settings</p>
                        <p className="text-sm text-muted-foreground">Manage security policies, access controls, and authentication</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="hover-lift"
                      onClick={() => setOpenDialog("security")}
                    >
                      Configure
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-start gap-3">
                      <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground">System Preferences</p>
                        <p className="text-sm text-muted-foreground">Configure system behavior, defaults, and general preferences</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="hover-lift"
                      onClick={() => setOpenDialog("system")}
                    >
                      Configure
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-start gap-3">
                      <Database className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground">Database Settings</p>
                        <p className="text-sm text-muted-foreground">Manage database connections, backups, and maintenance</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="hover-lift"
                      onClick={() => setOpenDialog("database")}
                    >
                      Configure
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-start gap-3">
                      <CreditCard className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground">Payment Settings</p>
                        <p className="text-sm text-muted-foreground">Configure payment gateways, methods, and processing</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="hover-lift"
                      onClick={() => setOpenDialog("payment")}
                    >
                      Configure
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-start gap-3">
                      <Bell className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground">Notification Settings</p>
                        <p className="text-sm text-muted-foreground">Manage email, SMS, and push notification preferences</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="hover-lift"
                      onClick={() => setOpenDialog("notification")}
                    >
                      Configure
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-start gap-3">
                      <Key className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground">API & Integration Settings</p>
                        <p className="text-sm text-muted-foreground">Manage API keys, webhooks, and third-party integrations</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="hover-lift"
                      onClick={() => setOpenDialog("api")}
                    >
                      Configure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        // Default to overview if no tab or invalid tab
        return (
          <div className="space-y-6">
            {/* System Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {systemStats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <Card
                    key={stat.title}
                    className="hover-lift animate-fade-in-up bg-card"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </CardTitle>
                      <div className={`h-10 w-10 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                        <Icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* System Status */}
            <Card className="hover-lift bg-card">
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Real-time system health monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/50">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="font-semibold text-foreground">API Server</p>
                      <p className="text-xs text-muted-foreground">Operational</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/50">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="font-semibold text-foreground">Database</p>
                      <p className="text-xs text-muted-foreground">Connected</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/50">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="font-semibold text-foreground">Payment Gateway</p>
                      <p className="text-xs text-muted-foreground">Active</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
    }
  }

  return (
    <div className="container space-y-8 py-12 page-content relative max-w-7xl">
      {/* Header */}
      <div className="flex flex-col gap-3 animate-fade-in-down">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Crown className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                Super Admin Dashboard
              </p>
            </div>
            <h1 className="text-3xl font-bold">
              {activeTab === "overview" || !activeTab
                ? "System Administration"
                : activeTab === "users"
                ? "User Management"
                : activeTab === "admins"
                ? "Admin Management"
                : activeTab === "system"
                ? "System Management"
                : activeTab === "analytics"
                ? "Analytics"
                : activeTab === "settings"
                ? "Settings"
                : "System Administration"}
            </h1>
            <p className="text-muted-foreground">
              {activeTab === "overview" || !activeTab
                ? "Full system control and management"
                : activeTab === "users"
                ? "Manage user roles and permissions"
                : activeTab === "admins"
                ? "Manage admin accounts and permissions"
                : activeTab === "system"
                ? "Critical system operations"
                : activeTab === "analytics"
                ? "Comprehensive system metrics"
                : activeTab === "settings"
                ? "Configure system-wide settings"
                : "Full system control and management"}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="animate-fade-in-up">
        {renderTabContent()}
      </div>

      {/* Configuration Dialogs */}
      {/* Security Settings Dialog */}
      <Dialog open={openDialog === "security"} onOpenChange={(open) => !open && setOpenDialog(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Security Settings</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Manage security policies, access controls, and authentication
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium text-foreground">Password Requirements</Label>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    id="pw-min-length" 
                    defaultChecked 
                    className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer flex-shrink-0 mt-0.5" 
                  />
                  <Label htmlFor="pw-min-length" className="text-sm font-normal text-foreground cursor-pointer leading-5 break-words flex-1">
                    Minimum 8 characters
                  </Label>
                </div>
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    id="pw-uppercase" 
                    defaultChecked 
                    className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer flex-shrink-0 mt-0.5" 
                  />
                  <Label htmlFor="pw-uppercase" className="text-sm font-normal text-foreground cursor-pointer leading-5 break-words flex-1">
                    Require uppercase letter
                  </Label>
                </div>
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    id="pw-number" 
                    defaultChecked 
                    className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer flex-shrink-0 mt-0.5" 
                  />
                  <Label htmlFor="pw-number" className="text-sm font-normal text-foreground cursor-pointer leading-5 break-words flex-1">
                    Require number
                  </Label>
                </div>
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    id="pw-special" 
                    className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer flex-shrink-0 mt-0.5" 
                  />
                  <Label htmlFor="pw-special" className="text-sm font-normal text-foreground cursor-pointer leading-5 break-words flex-1">
                    Require special character
                  </Label>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Two-Factor Authentication</Label>
              <Select defaultValue="optional" className="w-full">
                <option value="optional">Optional</option>
                <option value="required">Required for admins</option>
                <option value="all">Required for all users</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Session Timeout (minutes)</Label>
              <Input type="number" defaultValue="30" min="5" max="480" className="w-full" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Maximum Login Attempts</Label>
              <Input type="number" defaultValue="5" min="3" max="10" className="w-full" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Lockout Duration (minutes)</Label>
              <Input type="number" defaultValue="15" min="5" max="120" className="w-full" />
            </div>
            <div className="flex items-start gap-3">
              <input 
                type="checkbox" 
                id="ip-whitelist" 
                className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer flex-shrink-0 mt-0.5" 
              />
              <Label htmlFor="ip-whitelist" className="text-sm font-normal text-foreground cursor-pointer leading-5">
                Enable IP whitelist
              </Label>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setOpenDialog(null)}>Cancel</Button>
              <Button onClick={() => {
                toast.success("Settings saved", { description: "Security settings have been updated" })
                setOpenDialog(null)
              }}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* System Preferences Dialog */}
      <Dialog open={openDialog === "system"} onOpenChange={(open) => !open && setOpenDialog(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>System Preferences</DialogTitle>
            <DialogDescription>
              Configure system behavior, defaults, and general preferences
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Default Currency</Label>
              <Select defaultValue="USD">
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="INR">INR - Indian Rupee</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Default Language</Label>
              <Select defaultValue="en">
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Time Zone</Label>
              <Select defaultValue="UTC">
                <option value="UTC">UTC</option>
                <option value="EST">EST - Eastern Time</option>
                <option value="PST">PST - Pacific Time</option>
                <option value="IST">IST - Indian Standard Time</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Session Timeout (minutes)</Label>
              <Input type="number" defaultValue="30" min="5" max="480" />
            </div>
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="maintenance-mode" 
                className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer flex-shrink-0" 
              />
              <Label htmlFor="maintenance-mode" className="text-sm font-normal text-foreground cursor-pointer">
                Enable maintenance mode
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="auto-backup" 
                defaultChecked 
                className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer flex-shrink-0" 
              />
              <Label htmlFor="auto-backup" className="text-sm font-normal text-foreground cursor-pointer">
                Enable automatic backups
              </Label>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setOpenDialog(null)}>Cancel</Button>
              <Button onClick={() => {
                toast.success("Settings saved", { description: "System preferences have been updated" })
                setOpenDialog(null)
              }}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Database Settings Dialog */}
      <Dialog open={openDialog === "database"} onOpenChange={(open) => !open && setOpenDialog(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Database Settings</DialogTitle>
            <DialogDescription>
              Manage database connections, backups, and maintenance
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Backup Frequency</Label>
              <Select defaultValue="daily">
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Backup Retention (days)</Label>
              <Input type="number" defaultValue="30" min="7" max="365" />
            </div>
            <div className="space-y-2">
              <Label>Database Connection Pool Size</Label>
              <Input type="number" defaultValue="20" min="5" max="100" />
            </div>
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="auto-optimize" 
                defaultChecked 
                className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer flex-shrink-0" 
              />
              <Label htmlFor="auto-optimize" className="text-sm font-normal text-foreground cursor-pointer">
                Enable automatic optimization
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="query-logging" 
                className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer flex-shrink-0" 
              />
              <Label htmlFor="query-logging" className="text-sm font-normal text-foreground cursor-pointer">
                Enable query logging
              </Label>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setOpenDialog(null)}>Cancel</Button>
              <Button onClick={() => {
                toast.success("Settings saved", { description: "Database settings have been updated" })
                setOpenDialog(null)
              }}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Settings Dialog */}
      <Dialog open={openDialog === "payment"} onOpenChange={(open) => !open && setOpenDialog(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Payment Settings</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Configure payment gateways, methods, and processing
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Primary Payment Gateway</Label>
              <Select defaultValue="stripe" className="w-full">
                <option value="stripe">Stripe</option>
                <option value="paypal">PayPal</option>
                <option value="razorpay">Razorpay</option>
                <option value="square">Square</option>
              </Select>
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-medium text-foreground">Accepted Payment Methods</Label>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    id="pm-credit" 
                    defaultChecked 
                    className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer flex-shrink-0 mt-0.5" 
                  />
                  <Label htmlFor="pm-credit" className="text-sm font-normal text-foreground cursor-pointer leading-5 break-words flex-1">
                    Credit Card
                  </Label>
                </div>
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    id="pm-debit" 
                    defaultChecked 
                    className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer flex-shrink-0 mt-0.5" 
                  />
                  <Label htmlFor="pm-debit" className="text-sm font-normal text-foreground cursor-pointer leading-5 break-words flex-1">
                    Debit Card
                  </Label>
                </div>
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    id="pm-paypal" 
                    defaultChecked 
                    className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer flex-shrink-0 mt-0.5" 
                  />
                  <Label htmlFor="pm-paypal" className="text-sm font-normal text-foreground cursor-pointer leading-5 break-words flex-1">
                    PayPal
                  </Label>
                </div>
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    id="pm-bank" 
                    className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer flex-shrink-0 mt-0.5" 
                  />
                  <Label htmlFor="pm-bank" className="text-sm font-normal text-foreground cursor-pointer leading-5 break-words flex-1">
                    Bank Transfer
                  </Label>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Auto-refund on Cancellation</Label>
              <Select defaultValue="enabled" className="w-full">
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Refund Processing Time (days)</Label>
              <Input type="number" defaultValue="5" min="1" max="30" className="w-full" />
            </div>
            <div className="flex items-center space-x-3 pl-1">
              <input 
                type="checkbox" 
                id="enable-invoice" 
                defaultChecked 
                className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer" 
              />
              <Label htmlFor="enable-invoice" className="text-sm font-normal text-foreground cursor-pointer">
                Auto-generate invoices
              </Label>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setOpenDialog(null)}>Cancel</Button>
              <Button onClick={() => {
                toast.success("Settings saved", { description: "Payment settings have been updated" })
                setOpenDialog(null)
              }}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notification Settings Dialog */}
      <Dialog open={openDialog === "notification"} onOpenChange={(open) => !open && setOpenDialog(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Notification Settings</DialogTitle>
            <DialogDescription>
              Manage email, SMS, and push notification preferences
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Email Notifications</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="notif-email-system" 
                    defaultChecked 
                    className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer flex-shrink-0" 
                  />
                  <Label htmlFor="notif-email-system" className="text-sm font-normal text-foreground cursor-pointer">
                    System alerts
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="notif-email-security" 
                    defaultChecked 
                    className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer flex-shrink-0" 
                  />
                  <Label htmlFor="notif-email-security" className="text-sm font-normal text-foreground cursor-pointer">
                    Security alerts
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="notif-email-backup" 
                    defaultChecked 
                    className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer flex-shrink-0" 
                  />
                  <Label htmlFor="notif-email-backup" className="text-sm font-normal text-foreground cursor-pointer">
                    Backup completion
                  </Label>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>SMS Notifications</Label>
              <Select defaultValue="disabled">
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Push Notifications</Label>
              <Select defaultValue="enabled">
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setOpenDialog(null)}>Cancel</Button>
              <Button onClick={() => {
                toast.success("Settings saved", { description: "Notification settings have been updated" })
                setOpenDialog(null)
              }}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* API & Integration Settings Dialog */}
      <Dialog open={openDialog === "api"} onOpenChange={(open) => !open && setOpenDialog(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>API & Integration Settings</DialogTitle>
            <DialogDescription>
              Manage API keys, webhooks, and third-party integrations
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>API Rate Limit (requests per minute)</Label>
              <Input type="number" defaultValue="1000" min="100" max="10000" />
            </div>
            <div className="space-y-2">
              <Label>Webhook Timeout (seconds)</Label>
              <Input type="number" defaultValue="30" min="5" max="120" />
            </div>
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="api-logging" 
                defaultChecked 
                className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer flex-shrink-0" 
              />
              <Label htmlFor="api-logging" className="text-sm font-normal text-foreground cursor-pointer">
                Enable API request logging
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="webhook-retry" 
                defaultChecked 
                className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer flex-shrink-0" 
              />
              <Label htmlFor="webhook-retry" className="text-sm font-normal text-foreground cursor-pointer">
                Enable webhook retry on failure
              </Label>
            </div>
            <div className="space-y-2">
              <Label>Third-party Integrations</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="int-google" 
                    defaultChecked 
                    className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer flex-shrink-0" 
                  />
                  <Label htmlFor="int-google" className="text-sm font-normal text-foreground cursor-pointer">
                    Google Analytics
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="int-sentry" 
                    defaultChecked 
                    className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer flex-shrink-0" 
                  />
                  <Label htmlFor="int-sentry" className="text-sm font-normal text-foreground cursor-pointer">
                    Sentry Error Tracking
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="int-slack" 
                    className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer flex-shrink-0" 
                  />
                  <Label htmlFor="int-slack" className="text-sm font-normal text-foreground cursor-pointer">
                    Slack Notifications
                  </Label>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setOpenDialog(null)}>Cancel</Button>
              <Button onClick={() => {
                toast.success("Settings saved", { description: "API & integration settings have been updated" })
                setOpenDialog(null)
              }}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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

      {/* Admin Dialog */}
      <Dialog open={dialogType === "admin" && dialogAction !== null} onOpenChange={(open) => !open && (setDialogType(null), setDialogAction(null), setSelectedItem(null))}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {dialogAction === "view" ? "Admin Details" : "Edit Admin"}
            </DialogTitle>
            <DialogDescription>
              {dialogAction === "view" ? "View admin information" : "Update admin details"}
            </DialogDescription>
          </DialogHeader>
          {dialogAction === "view" ? (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
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
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => (setDialogType(null), setDialogAction(null), setSelectedItem(null))}>Close</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input defaultValue={selectedItem?.name || ""} id="admin-name" />
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input type="email" defaultValue={selectedItem?.email || ""} id="admin-email" />
                </div>
                <div className="space-y-2">
                  <Label>Role *</Label>
                  <Select defaultValue={selectedItem?.role || "admin"} id="admin-role">
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Created At</Label>
                  <Input type="datetime-local" defaultValue={selectedItem?.createdAt ? new Date(selectedItem.createdAt).toISOString().slice(0, 16) : ""} id="admin-created" />
                </div>
                <div className="space-y-2">
                  <Label>Last Login</Label>
                  <Input type="datetime-local" defaultValue={selectedItem?.lastLogin ? new Date(selectedItem.lastLogin).toISOString().slice(0, 16) : ""} id="admin-login" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => (setDialogType(null), setDialogAction(null), setSelectedItem(null))}>Cancel</Button>
                <Button onClick={() => {
                  const name = (document.getElementById("admin-name") as HTMLInputElement)?.value
                  const email = (document.getElementById("admin-email") as HTMLInputElement)?.value
                  const role = (document.getElementById("admin-role") as HTMLSelectElement)?.value as "admin" | "super_admin"
                  const createdAt = (document.getElementById("admin-created") as HTMLInputElement)?.value
                  const lastLogin = (document.getElementById("admin-login") as HTMLInputElement)?.value

                  setUsers(users.map(u => u.id === selectedItem?.id ? { ...u, name, email, role, createdAt: createdAt ? new Date(createdAt).toISOString() : u.createdAt, lastLogin: lastLogin ? new Date(lastLogin).toISOString() : u.lastLogin } : u))
                  toast.success("Admin updated", { description: `Admin ${name} has been updated` })
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

export default function SuperAdminDashboardPage() {
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
        <SuperAdminDashboardContent />
      </Suspense>
    </ProtectedRoute>
  )
}

