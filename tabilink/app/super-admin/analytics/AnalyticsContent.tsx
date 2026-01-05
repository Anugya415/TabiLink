"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DollarSign,
  Calendar,
  Users,
  Activity,
  MapPin,
} from "lucide-react"

export default function AnalyticsContent() {
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
      uptime: "99.9%",
      activeUsers: 8456,
    },
  }

  return (
    <div className="container space-y-8 py-12 page-content relative max-w-7xl">
      {/* Header */}
      <div className="flex flex-col gap-3 animate-fade-in-down">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                Super Admin Dashboard
              </p>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">Comprehensive system metrics</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="animate-fade-in-up">
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
                            className="w-full bg-primary rounded-t transition-all hover:opacity-80 cursor-pointer"
                            style={{ height: `${height}%`, minHeight: "8px" }}
                            title={`${data.month}: $${data.revenue ? data.revenue.toLocaleString() : "0"}`}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground font-medium">{data.month}</span>
                        <span className="text-xs font-semibold text-foreground">${data.revenue ? (data.revenue / 1000).toFixed(0) : "0"}k</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bookings by Status */}
            <Card className="hover-lift bg-card h-full flex flex-col">
              <CardHeader>
                <CardTitle>Bookings by Status</CardTitle>
                <CardDescription>Current booking distribution</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
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
            <Card className="hover-lift bg-card h-full flex flex-col">
              <CardHeader>
                <CardTitle>Top Destinations</CardTitle>
                <CardDescription>Most popular destinations</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-2">
                  {analyticsData.topDestinations.slice(0, 4).map((dest, index) => (
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
                            className="w-full bg-blue-500 rounded-t transition-all hover:opacity-80 cursor-pointer"
                            style={{ height: `${height}%`, minHeight: "8px" }}
                            title={`${data.month}: ${data.users ? data.users.toLocaleString() : "0"} users`}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground font-medium">{data.month}</span>
                        <span className="text-xs font-semibold text-foreground">{data.users ? (data.users / 1000).toFixed(1) : "0"}k</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}



