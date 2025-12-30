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
              <Settings className="h-6 w-6 text-slate-600 dark:text-slate-400" />
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                Super Admin Dashboard
              </p>
            </div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Configure system-wide settings and preferences</p>
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
    </div>
  )
}



