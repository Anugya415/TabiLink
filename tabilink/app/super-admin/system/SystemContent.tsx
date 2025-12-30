"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Server,
  Database,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Key,
  BarChart3,
  FileText,
  Settings,
} from "lucide-react"
import { toast } from "sonner"

export default function SystemContent() {
  // Mock server metrics
  const serverMetrics = [
    { name: "Web Server 01", cpu: 45, memory: 62, disk: 78, status: "operational", location: "US-East", uptime: "99.9%" },
    { name: "Web Server 02", cpu: 52, memory: 58, disk: 65, status: "operational", location: "US-West", uptime: "99.8%" },
    { name: "Database Server", cpu: 38, memory: 72, disk: 45, status: "operational", location: "US-East", uptime: "99.95%" },
    { name: "Cache Server", cpu: 28, memory: 35, disk: 82, status: "operational", location: "EU-Central", uptime: "99.7%" },
    { name: "API Gateway", cpu: 35, memory: 48, disk: 25, status: "operational", location: "US-East", uptime: "99.9%" },
    { name: "File Storage", cpu: 22, memory: 55, disk: 68, status: "operational", location: "US-West", uptime: "99.85%" },
  ]

  // Mock database tables info
  const databaseTables = [
    { name: "users", rows: 12458, size: "245 MB", lastBackup: "2024-01-17 10:00:00" },
    { name: "bookings", rows: 6234, size: "189 MB", lastBackup: "2024-01-17 10:00:00" },
    { name: "hotels", rows: 1245, size: "45 MB", lastBackup: "2024-01-17 10:00:00" },
    { name: "packages", rows: 856, size: "32 MB", lastBackup: "2024-01-17 10:00:00" },
    { name: "payments", rows: 5234, size: "156 MB", lastBackup: "2024-01-17 10:00:00" },
    { name: "logs", rows: 125000, size: "892 MB", lastBackup: "2024-01-17 10:00:00" },
  ]

  // Mock backup history
  const backupHistory = [
    { id: "backup-1", date: "2024-01-17T10:00:00Z", type: "Full", size: "2.4 GB", status: "completed" },
    { id: "backup-2", date: "2024-01-16T10:00:00Z", type: "Full", size: "2.3 GB", status: "completed" },
    { id: "backup-3", date: "2024-01-15T10:00:00Z", type: "Incremental", size: "145 MB", status: "completed" },
    { id: "backup-4", date: "2024-01-14T10:00:00Z", type: "Full", size: "2.2 GB", status: "completed" },
    { id: "backup-5", date: "2024-01-13T10:00:00Z", type: "Incremental", size: "128 MB", status: "completed" },
  ]

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
    {
      id: "log-6",
      timestamp: "2024-01-17T05:45:00Z",
      level: "info",
      message: "API rate limit threshold reached: 95%",
      category: "performance",
    },
    {
      id: "log-7",
      timestamp: "2024-01-17T04:30:00Z",
      level: "warning",
      message: "Disk space usage above 80% on cache server",
      category: "storage",
    },
    {
      id: "log-8",
      timestamp: "2024-01-17T03:15:00Z",
      level: "info",
      message: "Security audit completed - no issues found",
      category: "security",
    },
    {
      id: "log-9",
      timestamp: "2024-01-17T02:00:00Z",
      level: "info",
      message: "Email service queue processed: 1,245 messages",
      category: "email",
    },
    {
      id: "log-10",
      timestamp: "2024-01-17T01:30:00Z",
      level: "error",
      message: "Failed to connect to external API: timeout after 30s",
      category: "integration",
    },
  ]

  const analyticsData = {
    systemMetrics: {
      avgResponseTime: "120ms",
      uptime: "99.9%",
      apiCalls: 1250000,
    },
  }

  return (
    <div className="container space-y-8 py-12 page-content relative max-w-7xl">
      {/* Header */}
      <div className="flex flex-col gap-3 animate-fade-in-down">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Server className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                Super Admin Dashboard
              </p>
            </div>
            <h1 className="text-3xl font-bold">System Management</h1>
            <p className="text-muted-foreground">Critical system operations</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="animate-fade-in-up">
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
                    <p className="text-2xl font-bold text-foreground">{analyticsData.systemMetrics.uptime}</p>
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
                    <p className="text-2xl font-bold text-foreground">{analyticsData.systemMetrics.avgResponseTime}</p>
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
                    <p className="text-2xl font-bold text-foreground">{(analyticsData.systemMetrics.apiCalls / 1000000).toFixed(2)}M</p>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Server Metrics */}
          <Card className="hover-lift bg-card">
            <CardHeader>
              <CardTitle>Server Metrics</CardTitle>
              <CardDescription>Real-time server resource utilization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {serverMetrics.map((server) => (
                  <div key={server.name} className="p-4 rounded-lg border bg-muted/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Server className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold text-foreground">{server.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          server.status === "operational" 
                            ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                        }`}>
                          {server.status}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>CPU Usage</span>
                          <span>{server.cpu}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              server.cpu > 80 ? "bg-red-500" : server.cpu > 60 ? "bg-yellow-500" : "bg-green-500"
                            }`}
                            style={{ width: `${server.cpu}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Memory Usage</span>
                          <span>{server.memory}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              server.memory > 80 ? "bg-red-500" : server.memory > 60 ? "bg-yellow-500" : "bg-blue-500"
                            }`}
                            style={{ width: `${server.memory}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Disk Usage</span>
                          <span>{server.disk}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              server.disk > 80 ? "bg-red-500" : server.disk > 60 ? "bg-yellow-500" : "bg-orange-500"
                            }`}
                            style={{ width: `${server.disk}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

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

            {/* Database Information */}
            <Card className="hover-lift bg-card">
              <CardHeader>
                <CardTitle>Database Information</CardTitle>
                <CardDescription>Database tables and statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {databaseTables.map((table) => (
                    <div key={table.name} className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground capitalize truncate">{table.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {table.rows.toLocaleString()} rows • {table.size}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-muted-foreground">Last backup</p>
                        <p className="text-xs font-medium text-foreground">{table.lastBackup}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Logs */}
            <Card className="hover-lift bg-card">
              <CardHeader>
                <CardTitle>Recent System Logs</CardTitle>
                <CardDescription>Latest system events and activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
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

          {/* Backup History */}
          <Card className="hover-lift bg-card">
            <CardHeader>
              <CardTitle>Backup History</CardTitle>
              <CardDescription>Recent database backup records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {backupHistory.map((backup) => (
                  <div
                    key={backup.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        backup.status === "completed" 
                          ? "bg-green-100 dark:bg-green-500/20" 
                          : "bg-yellow-100 dark:bg-yellow-500/20"
                      }`}>
                        <Database className={`h-5 w-5 ${
                          backup.status === "completed" 
                            ? "text-green-600 dark:text-green-400" 
                            : "text-yellow-600 dark:text-yellow-400"
                        }`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-foreground truncate">{backup.type} Backup</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(backup.date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-foreground">{backup.size}</p>
                      <span className={`text-xs px-2 py-1 rounded ${
                        backup.status === "completed"
                          ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400"
                      }`}>
                        {backup.status}
                      </span>
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



