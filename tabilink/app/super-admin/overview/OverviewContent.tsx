"use client"

import { useRole } from "@/contexts/RoleContext"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Users,
  Shield,
  Database,
  Activity,
  CheckCircle2,
  Crown,
  DollarSign,
  Calendar,
} from "lucide-react"

export default function OverviewContent() {
  const { user } = useRole()

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

  const analyticsData = {
    revenueByMonth: [
      { month: "Jan", revenue: 125000, bookings: 1245 },
      { month: "Feb", revenue: 145000, bookings: 1450 },
      { month: "Mar", revenue: 165000, bookings: 1650 },
      { month: "Apr", revenue: 180000, bookings: 1800 },
      { month: "May", revenue: 195000, bookings: 1950 },
      { month: "Jun", revenue: 210000, bookings: 2100 },
    ],
    systemMetrics: {
      avgResponseTime: "120ms",
      uptime: "99.9%",
      activeUsers: 8456,
      apiCalls: 1250000,
    },
  }

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

  return (
    <div className="container space-y-8 py-12 page-content relative max-w-7xl">
      {/* Header */}
      <div className="flex flex-col gap-3 animate-fade-in-down">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600 dark:text-yellow-400" />
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-primary">
                Super Admin Dashboard
              </p>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">System Administration</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Full system control and management</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="animate-fade-in-up">
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

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Sessions</CardTitle>
                <Activity className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{analyticsData?.systemMetrics?.activeUsers ? analyticsData.systemMetrics.activeUsers.toLocaleString() : "0"}</div>
                <p className="text-xs text-muted-foreground mt-1">Currently online</p>
              </CardContent>
            </Card>
          </div>

          {/* System Status */}
          <Card className="hover-lift bg-card">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">System Status</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Real-time system health monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/50">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="font-semibold text-foreground">API Server</p>
                    <p className="text-xs text-muted-foreground">Operational • {analyticsData.systemMetrics.avgResponseTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/50">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="font-semibold text-foreground">Database</p>
                    <p className="text-xs text-muted-foreground">Connected • 2.4 GB</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/50">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="font-semibold text-foreground">Payment Gateway</p>
                    <p className="text-xs text-muted-foreground">Active • {analyticsData.systemMetrics.uptime}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
            <Card className="hover-lift bg-card">
              <CardHeader>
                <CardTitle>Recent System Logs</CardTitle>
                <CardDescription>Latest system events and activities</CardDescription>
              </CardHeader>
              <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {systemLogs.slice(0, 4).map((log) => (
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
                        <p className="text-sm text-foreground break-words">{log.message}</p>
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
    </div>
  )
}



