"use client"

import { useState } from "react"
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
  Settings,
  Database,
  CreditCard,
  Bell,
  Key,
  Lock,
  UserCheck,
  Clock,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  Mail,
  FileText,
  Activity,
} from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"

export default function SettingsContent() {
  const [openDialog, setOpenDialog] = useState<string | null>(null)

  return (
    <div className="container space-y-8 py-12 page-content relative max-w-7xl">
      {/* Header */}
      <div className="flex flex-col gap-3 animate-fade-in-down">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-slate-600 dark:text-slate-400" />
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-primary">
                Super Admin Dashboard
              </p>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Configure system-wide settings and preferences</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="animate-fade-in-up">
        <div className="space-y-6">
          <Card className="hover-lift bg-card">
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure system-wide settings and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-lg border bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-start gap-3 flex-1">
                    <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm sm:text-base text-foreground">Security Settings</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Manage security policies, access controls, and authentication</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="hover-lift w-full sm:w-auto"
                    onClick={() => setOpenDialog("security")}
                  >
                    Configure
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-lg border bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-start gap-3 flex-1">
                    <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm sm:text-base text-foreground">System Preferences</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Configure system behavior, defaults, and general preferences</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="hover-lift w-full sm:w-auto"
                    onClick={() => setOpenDialog("system")}
                  >
                    Configure
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-lg border bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-start gap-3 flex-1">
                    <Database className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm sm:text-base text-foreground">Database Settings</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Manage database connections, backups, and maintenance</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="hover-lift w-full sm:w-auto"
                    onClick={() => setOpenDialog("database")}
                  >
                    Configure
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-lg border bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-start gap-3 flex-1">
                    <CreditCard className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm sm:text-base text-foreground">Payment Settings</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Configure payment gateways, methods, and processing</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="hover-lift w-full sm:w-auto"
                    onClick={() => setOpenDialog("payment")}
                  >
                    Configure
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-lg border bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-start gap-3 flex-1">
                    <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm sm:text-base text-foreground">Booking Rules</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Configure booking policies, restrictions, and cancellation rules</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="hover-lift w-full sm:w-auto"
                    onClick={() => setOpenDialog("booking")}
                  >
                    Configure
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-lg border bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-start gap-3 flex-1">
                    <Bell className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm sm:text-base text-foreground">Notification Settings</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Manage email, SMS, and push notification preferences</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="hover-lift w-full sm:w-auto"
                    onClick={() => setOpenDialog("notification")}
                  >
                    Configure
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-lg border bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-start gap-3 flex-1">
                    <Key className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm sm:text-base text-foreground">API & Integration Settings</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Manage API keys, webhooks, and third-party integrations</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="hover-lift w-full sm:w-auto"
                    onClick={() => setOpenDialog("api")}
                  >
                    Configure
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Configuration Dialogs */}
      {/* Security Settings Dialog */}
      <Dialog open={openDialog === "security"} onOpenChange={(open) => !open && setOpenDialog(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
          <DialogHeader className="space-y-3 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-900/20">
                <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">Security Settings</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground mt-1">
                  Manage access controls and security policies
            </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-8">
            {/* Password Requirements */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-base font-semibold text-foreground">Password Requirements</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-6">
                <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-border bg-card hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-all cursor-pointer group">
                  <input 
                    type="checkbox" 
                    id="pw-min-length" 
                    defaultChecked 
                    className="h-5 w-5 rounded-md border-2 border-border bg-background text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 cursor-pointer flex-shrink-0 transition-all" 
                  />
                  <span className="text-sm font-medium text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Minimum 8 characters</span>
                </label>
                <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-border bg-card hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-all cursor-pointer group">
                  <input 
                    type="checkbox" 
                    id="pw-uppercase" 
                    defaultChecked 
                    className="h-5 w-5 rounded-md border-2 border-border bg-background text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 cursor-pointer flex-shrink-0 transition-all" 
                  />
                  <span className="text-sm font-medium text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Require uppercase</span>
                </label>
                <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-border bg-card hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-all cursor-pointer group">
                  <input 
                    type="checkbox" 
                    id="pw-number" 
                    defaultChecked 
                    className="h-5 w-5 rounded-md border-2 border-border bg-background text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 cursor-pointer flex-shrink-0 transition-all" 
                  />
                  <span className="text-sm font-medium text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Require number</span>
                </label>
                <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-border bg-card hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-all cursor-pointer group">
                  <input 
                    type="checkbox" 
                    id="pw-special" 
                    className="h-5 w-5 rounded-md border-2 border-border bg-background text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 cursor-pointer flex-shrink-0 transition-all" 
                  />
                  <span className="text-sm font-medium text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Require special char</span>
                </label>
                </div>
              </div>

            <div className="border-t border-border"></div>

            {/* Authentication & Session Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <Label className="text-sm font-semibold text-foreground">Two-Factor Authentication</Label>
            </div>
              <Select defaultValue="optional" className="w-full">
                <option value="optional">Optional</option>
                <option value="required">Required for admins</option>
                <option value="all">Required for all users</option>
              </Select>
            </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <Label className="text-sm font-semibold text-foreground">Session Timeout (minutes)</Label>
                </div>
              <Input type="number" defaultValue="30" min="5" max="480" className="w-full" />
            </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <Label className="text-sm font-semibold text-foreground">Maximum Login Attempts</Label>
                </div>
              <Input type="number" defaultValue="5" min="3" max="10" className="w-full" />
            </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <Label className="text-sm font-semibold text-foreground">Lockout Duration (minutes)</Label>
                </div>
              <Input type="number" defaultValue="15" min="5" max="120" className="w-full" />
            </div>
            </div>

            <div className="border-t border-border"></div>

            {/* Advanced Security */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <Label className="text-sm font-semibold text-foreground">Advanced Security</Label>
              </div>
              <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-border bg-card hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-all cursor-pointer group pl-6">
              <input 
                type="checkbox" 
                id="ip-whitelist" 
                  className="h-5 w-5 rounded-md border-2 border-border bg-background text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 cursor-pointer flex-shrink-0 transition-all" 
              />
                <span className="text-sm font-medium text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Enable IP Whitelist</span>
              </label>
            </div>
            </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 mt-6 border-t border-border">
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => setOpenDialog(null)}>Cancel</Button>
            <Button className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700" onClick={() => {
                toast.success("Settings saved", { description: "Security settings have been updated" })
                setOpenDialog(null)
              }}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* System Preferences Dialog */}
      <Dialog open={openDialog === "system"} onOpenChange={(open) => !open && setOpenDialog(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
          <DialogHeader className="space-y-4 pb-8">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-200/50 dark:border-blue-800/50">
                <Settings className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-3xl font-bold mb-2">System Preferences</DialogTitle>
                <DialogDescription className="text-base text-muted-foreground">
                  Manage system-wide settings and defaults for your platform
            </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-10">
            {/* Regional Settings Card */}
            <div className="space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-border/50">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                  <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Regional Settings</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    Default Currency
                  </Label>
                  <Select defaultValue="USD" className="w-full h-11">
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="INR">INR - Indian Rupee</option>
              </Select>
            </div>
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Default Language
                  </Label>
                  <Select defaultValue="en" className="w-full h-11">
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </Select>
            </div>
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    Time Zone
                  </Label>
                  <Select defaultValue="UTC" className="w-full h-11">
                <option value="UTC">UTC</option>
                <option value="EST">EST - Eastern Time</option>
                <option value="PST">PST - Pacific Time</option>
                <option value="IST">IST - Indian Standard Time</option>
              </Select>
            </div>
              </div>
            </div>

            {/* System Configuration Card */}
            <div className="space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-border/50">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                  <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-foreground">System Configuration</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    Session Timeout (minutes)
                  </Label>
                  <Input type="number" defaultValue="30" min="5" max="480" className="w-full h-11" />
                  <p className="text-xs text-muted-foreground">Set the idle timeout before automatic logout</p>
            </div>
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    System Status
              </Label>
                  <div className="flex items-center gap-2 h-11 px-4 rounded-lg border border-border bg-muted/30">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium text-foreground">Operational</span>
                  </div>
                </div>
              </div>
            </div>

            {/* System Options Card */}
            <div className="space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-border/50">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-foreground">System Options</h3>
              </div>
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-5 rounded-xl border-2 border-border bg-card hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-all cursor-pointer group">
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors flex-shrink-0 mt-0.5">
                    <Settings className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
                  <div className="flex-1">
            <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Enable automatic backups</span>
                      <div className="relative flex items-center justify-center">
              <input 
                type="checkbox" 
                id="auto-backup" 
                defaultChecked 
                          className="peer h-7 w-9 appearance-none rounded-lg border-3 border-blue-400 dark:border-blue-500 bg-white dark:bg-gray-800 cursor-pointer transition-all duration-200 checked:bg-blue-600 checked:border-blue-600 hover:border-blue-500 dark:hover:border-blue-400 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm hover:shadow-md" 
                        />
                        <svg className="absolute h-5 w-5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground block mt-1">Automatically backup system data daily</span>
                  </div>
                </label>
              </div>
            </div>
            </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-8 mt-8 border-t border-border">
            <Button variant="outline" className="w-full sm:w-auto h-11" onClick={() => setOpenDialog(null)}>Cancel</Button>
            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 h-11" onClick={() => {
                toast.success("Settings saved", { description: "System preferences have been updated" })
                setOpenDialog(null)
              }}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Database Settings Dialog */}
      <Dialog open={openDialog === "database"} onOpenChange={(open) => !open && setOpenDialog(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Database Settings</DialogTitle>
            <DialogDescription>
              Manage database connections, backups, and maintenance
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Backup Configuration */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-foreground uppercase tracking-wide">Backup Configuration</Label>
              <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Backup Frequency</Label>
                  <Select defaultValue="daily" className="w-full">
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </Select>
            </div>
            <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Backup Retention (days)</Label>
                  <Input type="number" defaultValue="30" min="7" max="365" className="w-full" />
                </div>
              </div>
            </div>

            <div className="border-t border-border"></div>

            {/* Connection Settings */}
            <div className="space-y-3 pt-4 border-t">
              <Label className="text-sm font-semibold text-foreground uppercase tracking-wide">Connection Settings</Label>
            <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Database Connection Pool Size</Label>
                <Input type="number" defaultValue="20" min="5" max="100" className="w-full" />
              </div>
            </div>

            <div className="border-t border-border"></div>

            {/* Database Options */}
            <div className="space-y-3 pt-4 border-t">
              <Label className="text-sm font-semibold text-foreground uppercase tracking-wide">Database Options</Label>
              <label className="flex items-center gap-2 p-4 rounded-lg border bg-card cursor-pointer hover:bg-muted/50 transition-colors">
              <input 
                type="checkbox" 
                id="auto-optimize" 
                defaultChecked 
                className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer flex-shrink-0" 
              />
                <span className="text-sm font-medium text-foreground">Enable automatic optimization</span>
              </label>
              <label className="flex items-center gap-2 p-4 rounded-lg border bg-card cursor-pointer hover:bg-muted/50 transition-colors">
              <input 
                type="checkbox" 
                id="query-logging" 
                className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer flex-shrink-0" 
              />
                <span className="text-sm font-medium text-foreground">Enable query logging</span>
              </label>
            </div>
            </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setOpenDialog(null)}>Cancel</Button>
              <Button onClick={() => {
                toast.success("Settings saved", { description: "Database settings have been updated" })
                setOpenDialog(null)
              }}>Save Changes</Button>
            </div>
        </DialogContent>
      </Dialog>

      {/* Booking Rules Dialog */}
      <Dialog open={openDialog === "booking"} onOpenChange={(open) => !open && setOpenDialog(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
          <DialogHeader className="space-y-3 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-900/20">
                <BookOpen className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">Booking Rules</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground mt-1">
                  Configure booking policies and restrictions
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-8">
            {/* Booking Limits */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-base font-semibold text-foreground">Booking Limits</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Maximum Advance Booking (days)</Label>
                  <Input type="number" defaultValue="365" min="30" max="730" className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Minimum Booking Duration (nights)</Label>
                  <Input type="number" defaultValue="1" min="1" max="30" className="w-full" />
                </div>
              </div>
              <div className="space-y-2 pl-6">
                <Label className="text-sm font-medium text-foreground">Maximum Travelers per Booking</Label>
                <Input type="number" defaultValue="10" min="1" max="50" className="w-full" />
              </div>
            </div>

            <div className="border-t border-border"></div>

            {/* Cancellation & Deposit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <Label className="text-sm font-semibold text-foreground">Cancellation Policy</Label>
                </div>
                <Select defaultValue="flexible" className="w-full">
                  <option value="flexible">Flexible - Free cancellation</option>
                  <option value="moderate">Moderate - 50% refund</option>
                  <option value="strict">Strict - No refund</option>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <Label className="text-sm font-semibold text-foreground">Deposit Percentage</Label>
                </div>
                <Input type="number" defaultValue="20" min="0" max="100" className="w-full" />
              </div>
            </div>

            <div className="border-t border-border"></div>

            {/* Deposit Requirement */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-base font-semibold text-foreground">Deposit Settings</h3>
              </div>
              <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-border bg-card hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-all cursor-pointer group pl-6">
                <input 
                  type="checkbox" 
                  id="require-deposit" 
                  defaultChecked 
                  className="h-5 w-5 rounded-md border-2 border-border bg-background text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer flex-shrink-0 transition-all" 
                />
                <span className="text-sm font-medium text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Require deposit for bookings</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 mt-6 border-t border-border">
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => setOpenDialog(null)}>Cancel</Button>
            <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700" onClick={() => {
              toast.success("Settings saved", { description: "Booking rules have been updated" })
              setOpenDialog(null)
            }}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Settings Dialog */}
      <Dialog open={openDialog === "payment"} onOpenChange={(open) => !open && setOpenDialog(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
          <DialogHeader className="space-y-3 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-orange-100 dark:bg-orange-900/20">
                <CreditCard className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">Payment Settings</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground mt-1">
                  Manage payment gateways and processing methods
            </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-8">
            {/* Payment Gateway */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                <Label className="text-sm font-semibold text-foreground">Primary Payment Gateway</Label>
              </div>
              <div className="pl-6">
              <Select defaultValue="stripe" className="w-full">
                <option value="stripe">Stripe</option>
                <option value="paypal">PayPal</option>
                <option value="razorpay">Razorpay</option>
                <option value="square">Square</option>
              </Select>
            </div>
            </div>

            <div className="border-t border-border"></div>

            {/* Accepted Payment Methods */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                <h3 className="text-base font-semibold text-foreground">Accepted Payment Methods</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-6">
                <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-border bg-card hover:border-orange-300 dark:hover:border-orange-700 hover:bg-orange-50/50 dark:hover:bg-orange-950/20 transition-all cursor-pointer group">
                  <input 
                    type="checkbox" 
                    id="pm-credit" 
                    defaultChecked 
                    className="h-5 w-5 rounded-md border-2 border-border bg-background text-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 cursor-pointer flex-shrink-0 transition-all" 
                  />
                  <span className="text-sm font-medium text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">Credit Card</span>
                </label>
                <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-border bg-card hover:border-orange-300 dark:hover:border-orange-700 hover:bg-orange-50/50 dark:hover:bg-orange-950/20 transition-all cursor-pointer group">
                  <input 
                    type="checkbox" 
                    id="pm-debit" 
                    defaultChecked 
                    className="h-5 w-5 rounded-md border-2 border-border bg-background text-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 cursor-pointer flex-shrink-0 transition-all" 
                  />
                  <span className="text-sm font-medium text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">Debit Card</span>
                </label>
                <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-border bg-card hover:border-orange-300 dark:hover:border-orange-700 hover:bg-orange-50/50 dark:hover:bg-orange-950/20 transition-all cursor-pointer group">
                  <input 
                    type="checkbox" 
                    id="pm-paypal" 
                    defaultChecked 
                    className="h-5 w-5 rounded-md border-2 border-border bg-background text-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 cursor-pointer flex-shrink-0 transition-all" 
                  />
                  <span className="text-sm font-medium text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">PayPal</span>
                </label>
                <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-border bg-card hover:border-orange-300 dark:hover:border-orange-700 hover:bg-orange-50/50 dark:hover:bg-orange-950/20 transition-all cursor-pointer group">
                  <input 
                    type="checkbox" 
                    id="pm-bank" 
                    className="h-5 w-5 rounded-md border-2 border-border bg-background text-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 cursor-pointer flex-shrink-0 transition-all" 
                  />
                  <span className="text-sm font-medium text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">Bank Transfer</span>
                </label>
                </div>
              </div>

            <div className="border-t border-border"></div>

            {/* Refund Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <Label className="text-sm font-semibold text-foreground">Auto-refund on Cancellation</Label>
            </div>
              <Select defaultValue="enabled" className="w-full">
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </Select>
            </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <Label className="text-sm font-semibold text-foreground">Refund Processing Time (days)</Label>
                </div>
              <Input type="number" defaultValue="5" min="1" max="30" className="w-full" />
            </div>
            </div>

            <div className="border-t border-border"></div>

            {/* Invoice Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                <h3 className="text-base font-semibold text-foreground">Invoice Settings</h3>
              </div>
              <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-border bg-card hover:border-orange-300 dark:hover:border-orange-700 hover:bg-orange-50/50 dark:hover:bg-orange-950/20 transition-all cursor-pointer group pl-6">
              <input 
                type="checkbox" 
                id="enable-invoice" 
                defaultChecked 
                  className="h-5 w-5 rounded-md border-2 border-border bg-background text-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 cursor-pointer flex-shrink-0 transition-all" 
                />
                <span className="text-sm font-medium text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">Auto-generate invoices</span>
              </label>
            </div>
            </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 mt-6 border-t border-border">
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => setOpenDialog(null)}>Cancel</Button>
            <Button className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700" onClick={() => {
                toast.success("Settings saved", { description: "Payment settings have been updated" })
                setOpenDialog(null)
              }}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notification Settings Dialog */}
      <Dialog open={openDialog === "notification"} onOpenChange={(open) => !open && setOpenDialog(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
          <DialogHeader className="space-y-3 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-yellow-100 dark:bg-yellow-900/20">
                <Bell className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">Email Notifications</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground mt-1">
                  Configure email alert settings for important events
            </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-8">
            {/* Notification Types */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                <h3 className="text-base font-semibold text-foreground">Notification Types</h3>
              </div>
              <div className="space-y-2 pl-6">
                <label className="relative flex items-start gap-3 p-4 rounded-xl border-2 border-border bg-card hover:border-yellow-300 dark:hover:border-yellow-700 hover:bg-yellow-50/50 dark:hover:bg-yellow-950/20 transition-all cursor-pointer group">
                  <input 
                    type="checkbox" 
                    id="notif-booking-confirm" 
                    defaultChecked 
                    className="absolute top-4 left-4 h-5 w-5 rounded-md border-2 border-border bg-background text-yellow-600 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 cursor-pointer flex-shrink-0 transition-all" 
                  />
                  <span className="text-sm font-medium text-foreground group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors pl-7">New booking confirmations</span>
                </label>
                <label className="relative flex items-start gap-3 p-4 rounded-xl border-2 border-border bg-card hover:border-yellow-300 dark:hover:border-yellow-700 hover:bg-yellow-50/50 dark:hover:bg-yellow-950/20 transition-all cursor-pointer group">
                  <input 
                    type="checkbox" 
                    id="notif-booking-cancel" 
                    defaultChecked 
                    className="absolute top-4 left-4 h-5 w-5 rounded-md border-2 border-border bg-background text-yellow-600 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 cursor-pointer flex-shrink-0 transition-all" 
                  />
                  <span className="text-sm font-medium text-foreground group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors pl-7">Booking cancellations</span>
                </label>
                <label className="relative flex items-start gap-3 p-4 rounded-xl border-2 border-border bg-card hover:border-yellow-300 dark:hover:border-yellow-700 hover:bg-yellow-50/50 dark:hover:bg-yellow-950/20 transition-all cursor-pointer group">
                  <input 
                    type="checkbox" 
                    id="notif-payment-fail" 
                    defaultChecked 
                    className="absolute top-4 left-4 h-5 w-5 rounded-md border-2 border-border bg-background text-yellow-600 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 cursor-pointer flex-shrink-0 transition-all" 
                  />
                  <span className="text-sm font-medium text-foreground group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors pl-7">Payment failures</span>
                </label>
                <label className="relative flex items-start gap-3 p-4 rounded-xl border-2 border-border bg-card hover:border-yellow-300 dark:hover:border-yellow-700 hover:bg-yellow-50/50 dark:hover:bg-yellow-950/20 transition-all cursor-pointer group">
                  <input 
                    type="checkbox" 
                    id="notif-user-register" 
                    className="absolute top-4 left-4 h-5 w-5 rounded-md border-2 border-border bg-background text-yellow-600 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 cursor-pointer flex-shrink-0 transition-all" 
                  />
                  <span className="text-sm font-medium text-foreground group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors pl-7">New user registrations</span>
                </label>
                <label className="relative flex items-start gap-3 p-4 rounded-xl border-2 border-border bg-card hover:border-yellow-300 dark:hover:border-yellow-700 hover:bg-yellow-50/50 dark:hover:bg-yellow-950/20 transition-all cursor-pointer group">
                  <input 
                    type="checkbox" 
                    id="notif-system-alerts" 
                    defaultChecked 
                    className="absolute top-4 left-4 h-5 w-5 rounded-md border-2 border-border bg-background text-yellow-600 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 cursor-pointer flex-shrink-0 transition-all" 
                  />
                  <span className="text-sm font-medium text-foreground group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors pl-7">System alerts</span>
                </label>
                </div>
              </div>

            <div className="border-t border-border"></div>

            {/* Email Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  <Label className="text-sm font-semibold text-foreground">Email Frequency</Label>
            </div>
                <Select defaultValue="realtime" className="w-full">
                  <option value="realtime">Real-time</option>
                  <option value="daily">Daily digest</option>
                  <option value="weekly">Weekly digest</option>
              </Select>
            </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  <Label className="text-sm font-semibold text-foreground">Admin Email Address</Label>
                </div>
                <Input type="email" defaultValue="admin@tabilink.com" className="w-full" />
              </div>
            </div>
            </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 mt-6 border-t border-border">
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => setOpenDialog(null)}>Cancel</Button>
            <Button className="w-full sm:w-auto bg-yellow-600 hover:bg-yellow-700" onClick={() => {
                toast.success("Settings saved", { description: "Notification settings have been updated" })
                setOpenDialog(null)
              }}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* API & Integration Settings Dialog */}
      <Dialog open={openDialog === "api"} onOpenChange={(open) => !open && setOpenDialog(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">API & Integration Settings</DialogTitle>
            <DialogDescription>
              Manage API keys, webhooks, and third-party integrations
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* API Configuration */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-foreground uppercase tracking-wide">API Configuration</Label>
              <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">API Rate Limit</Label>
                  <Input type="number" defaultValue="1000" min="100" max="10000" className="w-full" placeholder="requests/min" />
            </div>
            <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Webhook Timeout (seconds)</Label>
                  <Input type="number" defaultValue="30" min="5" max="120" className="w-full" />
                </div>
              </div>
            </div>

            <div className="border-t border-border"></div>

            {/* API Options */}
            <div className="space-y-3 pt-4 border-t">
              <Label className="text-sm font-semibold text-foreground uppercase tracking-wide">API Options</Label>
              <label className="flex items-center gap-2 p-4 rounded-lg border bg-card cursor-pointer hover:bg-muted/50 transition-colors">
              <input 
                type="checkbox" 
                id="api-logging" 
                defaultChecked 
                className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer flex-shrink-0" 
              />
                <span className="text-sm font-medium text-foreground">Enable API request logging</span>
              </label>
              <label className="flex items-center gap-2 p-4 rounded-lg border bg-card cursor-pointer hover:bg-muted/50 transition-colors">
              <input 
                type="checkbox" 
                id="webhook-retry" 
                defaultChecked 
                className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer flex-shrink-0" 
              />
                <span className="text-sm font-medium text-foreground">Enable webhook retry on failure</span>
              </label>
            </div>

            <div className="border-t border-border"></div>

            {/* Third-party Integrations */}
            <div className="space-y-3 pt-4 border-t">
              <Label className="text-sm font-semibold text-foreground uppercase tracking-wide">Third-party Integrations</Label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 p-4 rounded-lg border bg-card cursor-pointer hover:bg-muted/50 transition-colors">
                  <input 
                    type="checkbox" 
                    id="int-google" 
                    defaultChecked 
                    className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer flex-shrink-0" 
                  />
                  <span className="text-sm font-medium text-foreground">Google Analytics</span>
                </label>
                <label className="flex items-center gap-2 p-4 rounded-lg border bg-card cursor-pointer hover:bg-muted/50 transition-colors">
                  <input 
                    type="checkbox" 
                    id="int-sentry" 
                    defaultChecked 
                    className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer flex-shrink-0" 
                  />
                  <span className="text-sm font-medium text-foreground">Sentry Error Tracking</span>
                </label>
                <label className="flex items-center gap-2 p-4 rounded-lg border bg-card cursor-pointer hover:bg-muted/50 transition-colors">
                  <input 
                    type="checkbox" 
                    id="int-slack" 
                    className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer flex-shrink-0" 
                  />
                  <span className="text-sm font-medium text-foreground">Slack Notifications</span>
                </label>
                </div>
              </div>
            </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setOpenDialog(null)}>Cancel</Button>
              <Button onClick={() => {
                toast.success("Settings saved", { description: "API & integration settings have been updated" })
                setOpenDialog(null)
              }}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}