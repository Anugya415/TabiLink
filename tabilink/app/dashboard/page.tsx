"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import {
  Bus,
  CreditCard,
  MapPin,
  Plane,
  ShieldCheck,
  Train,
  User,
  Settings,
  Bell,
  Heart,
  Calendar,
  Edit,
  Trash2,
  Plus,
  Check,
  X,
  Star,
  Clock,
  Mail,
  Phone,
  Globe,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Hotel,
  Package,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  mockUserProfile,
  mockBookings,
  mockSavedTrips,
  mockPaymentMethods,
  mockNotifications,
  type Booking,
  type SavedTrip,
  type PaymentMethod,
  type Notification,
} from "@/lib/mock-data"

const visitedDiscounts = [
  {
    place: "Kyoto, Japan",
    visitedOn: "Jun 2024",
    discount: 18,
    description: "Return guest rate at Machiya stays",
    savings: "$148 saved on a 4-night booking",
  },
  {
    place: "Barcelona, Spain",
    visitedOn: "Sep 2024",
    discount: 22,
    description: "Member price + late checkout",
    savings: "$96 saved on weekend stay",
  },
  {
    place: "Banff, Canada",
    visitedOn: "Feb 2024",
    discount: 15,
    description: "Resort credit on ski lodges",
    savings: "$120 resort credit applied",
  },
]

const transportDeals = [
  {
    mode: "Flights",
    provider: "SkyJet Airways",
    icon: Plane,
    discount: 20,
    perk: "Carry-on included | Code: SKY20",
  },
  {
    mode: "High-speed rail",
    provider: "EuroRail Plus",
    icon: Train,
    discount: 15,
    perk: "Flexible seat change",
  },
  {
    mode: "Intercity bus",
    provider: "RoadLink",
    icon: Bus,
    discount: 12,
    perk: "Priority boarding",
  },
  {
    mode: "Travel insurance",
    provider: "SafeTrip Shield",
    icon: ShieldCheck,
    discount: 18,
    perk: "Medical + baggage included",
  },
]

const getStatusColor = (status: Booking["status"]) => {
  switch (status) {
    case "confirmed":
      return "bg-green-500/10 text-green-700 dark:text-green-400"
    case "pending":
      return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
    case "cancelled":
      return "bg-red-500/10 text-red-700 dark:text-red-400"
    case "completed":
      return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
    default:
      return "bg-muted text-muted-foreground"
  }
}

const getStatusIcon = (status: Booking["status"]) => {
  switch (status) {
    case "confirmed":
      return <Check className="h-4 w-4" />
    case "pending":
      return <Clock className="h-4 w-4" />
    case "cancelled":
      return <X className="h-4 w-4" />
    case "completed":
      return <Check className="h-4 w-4" />
    default:
      return null
  }
}

function DashboardContent() {
  const searchParams = useSearchParams()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState<"discounts" | "history">("discounts")
  const [sidebarTab, setSidebarTab] = useState<string | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods)

  useEffect(() => {
    if (typeof window === "undefined") return
    const stored = localStorage.getItem("tabilinkDemoLoggedIn")
    setIsLoggedIn(stored === "1")
  }, [])

  useEffect(() => {
    const tab = searchParams.get("tab")
    setSidebarTab(tab)
  }, [searchParams])

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const setDefaultPayment = (id: string) => {
    setPaymentMethods((prev) =>
      prev.map((pm) => ({ ...pm, isDefault: pm.id === id }))
    )
  }

  const deletePaymentMethod = (id: string) => {
    setPaymentMethods((prev) => prev.filter((pm) => pm.id !== id))
  }

  // Render content based on sidebar tab
  if (sidebarTab === "bookings") {
    return (
      <div className="container space-y-8 py-12 page-content relative">
        <div className="flex flex-col gap-3 animate-fade-in-down">
          <div className="space-y-1">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              My Bookings
            </p>
            <h1 className="text-3xl font-bold">Your Reservations</h1>
            <p className="text-muted-foreground">
              Manage and view all your upcoming and past bookings.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {mockBookings.map((booking, index) => (
            <Card key={booking.id} className="hover-lift animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="relative h-48 w-full md:w-64 rounded-lg overflow-hidden">
                    <Image
                      src={booking.image}
                      alt={booking.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {booking.type === "hotel" ? (
                            <Hotel className="h-5 w-5 text-primary" />
                          ) : (
                            <Package className="h-5 w-5 text-primary" />
                          )}
                          <h3 className="text-xl font-semibold">{booking.title}</h3>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{booking.destination}</span>
                        </div>
                        {booking.checkIn && booking.checkOut && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        {booking.travelers && (
                          <p className="text-sm text-muted-foreground">
                            {booking.travelers} {booking.travelers === 1 ? "Traveler" : "Travelers"}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                        <p className="text-2xl font-bold">${booking.amount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">
                          Booked {new Date(booking.bookingDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="hover-lift">
                        View Details
                      </Button>
                      {booking.status === "confirmed" && (
                        <Button variant="outline" size="sm" className="hover-lift">
                          Modify Booking
                        </Button>
                      )}
                      {booking.status === "pending" && (
                        <Button variant="outline" size="sm" className="hover-lift">
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (sidebarTab === "saved") {
    return (
      <div className="container space-y-8 py-12 page-content relative">
        <div className="flex flex-col gap-3 animate-fade-in-down">
          <div className="space-y-1">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Saved Trips
            </p>
            <h1 className="text-3xl font-bold">Your Wishlist</h1>
            <p className="text-muted-foreground">
              Trips you've saved for later. Book them when you're ready!
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-stagger">
          {mockSavedTrips.map((trip, index) => (
            <Card key={trip.id} className="hover-lift overflow-hidden" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="relative h-48 w-full">
                <Image
                  src={trip.image}
                  alt={trip.destination}
                  fill
                  className="object-cover"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                >
                  <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                </Button>
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{trip.destination}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {trip.location}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold">{trip.rating}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">{trip.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    {trip.originalPrice && (
                      <p className="text-sm text-muted-foreground line-through">
                        ${trip.originalPrice}
                      </p>
                    )}
                    <p className="text-xl font-bold">${trip.price}</p>
                  </div>
                  <Button className="hover-lift">
                    <Link href={trip.type === "hotel" ? `/hotels/${trip.id}` : `/travel/${trip.id}`}>
                      Book Now
                    </Link>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Saved on {new Date(trip.savedDate).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (sidebarTab === "profile") {
    return (
      <div className="container space-y-8 py-12 page-content relative max-w-4xl">
        <div className="flex flex-col gap-3 animate-fade-in-down">
          <div className="space-y-1">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Profile
            </p>
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-muted-foreground">
              Manage your personal information and preferences.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 items-start">
          <Card className="md:col-span-1 hover-lift">
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-6">
                <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-primary/20">
                  <Image
                    src={mockUserProfile.avatar}
                    alt={mockUserProfile.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-center space-y-2 w-full">
                  <h3 className="font-semibold text-lg">{mockUserProfile.name}</h3>
                  <p className="text-sm text-muted-foreground break-words">{mockUserProfile.email}</p>
                  <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mt-2">
                    {mockUserProfile.membershipTier} Member
                  </span>
                </div>
                <div className="w-full space-y-3 text-sm pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Trips</span>
                    <span className="font-semibold">{mockUserProfile.totalTrips}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Loyalty Points</span>
                    <span className="font-semibold">{mockUserProfile.loyaltyPoints.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Member Since</span>
                    <span className="font-semibold text-right">{mockUserProfile.memberSince}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 hover-lift">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={mockUserProfile.name} className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={mockUserProfile.email} className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue={mockUserProfile.phone} className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="memberSince">Member Since</Label>
                  <Input id="memberSince" defaultValue={mockUserProfile.memberSince} disabled className="w-full" />
                </div>
              </div>
              <div className="flex justify-end pt-2 border-t">
                <Button className="hover-lift">
                  <Edit className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (sidebarTab === "settings") {
    return (
      <div className="container space-y-8 py-12 page-content relative max-w-4xl">
        <div className="flex flex-col gap-3 animate-fade-in-down">
          <div className="space-y-1">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Settings
            </p>
            <h1 className="text-3xl font-bold">Account Settings</h1>
            <p className="text-muted-foreground">
              Customize your account preferences and preferences.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Currency</Label>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="JPY">JPY - Japanese Yen</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Language</Label>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="flex items-center gap-4">
                  <Button variant="outline" className="hover-lift">
                    <Sun className="h-4 w-4 mr-2" />
                    Light
                  </Button>
                  <Button variant="outline" className="hover-lift">
                    <Moon className="h-4 w-4 mr-2" />
                    Dark
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="hover-lift">
                  {mockUserProfile.preferences.notifications.email ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive text message alerts</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="hover-lift">
                  {mockUserProfile.preferences.notifications.sms ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">Browser and app notifications</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="hover-lift">
                  {mockUserProfile.preferences.notifications.push ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (sidebarTab === "notifications") {
    const unreadCount = notifications.filter((n) => !n.read).length

    return (
      <div className="container space-y-8 py-12 page-content relative max-w-4xl">
        <div className="flex flex-col gap-3 animate-fade-in-down">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                Notifications
              </p>
              <h1 className="text-3xl font-bold">Your Notifications</h1>
              <p className="text-muted-foreground">
                Stay updated with your bookings and special offers.
              </p>
            </div>
            {unreadCount > 0 && (
              <span className="rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">
                {unreadCount} New
              </span>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {notifications.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No notifications yet</p>
              </CardContent>
            </Card>
          ) : (
            notifications.map((notification, index) => (
              <Card
                key={notification.id}
                className={`hover-lift animate-fade-in-up ${!notification.read ? "border-primary/50 bg-primary/5" : ""}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{notification.title}</h3>
                        {!notification.read && (
                          <span className="h-2 w-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notification.date).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markNotificationAsRead(notification.id)}
                          className="hover-lift"
                        >
                          Mark as read
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteNotification(notification.id)}
                        className="hover-lift text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    )
  }

  if (sidebarTab === "payments") {
    return (
      <div className="container space-y-8 py-12 page-content relative max-w-4xl">
        <div className="flex flex-col gap-3 animate-fade-in-down">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                Payment Methods
              </p>
              <h1 className="text-3xl font-bold">Your Payment Methods</h1>
              <p className="text-muted-foreground">
                Manage your saved payment methods for faster checkout.
              </p>
            </div>
            <Button className="hover-lift">
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {paymentMethods.map((method, index) => (
            <Card key={method.id} className="hover-lift animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      {method.type === "card" ? (
                        <CreditCard className="h-6 w-6 text-primary" />
                      ) : (
                        <div className="h-6 w-6 rounded bg-blue-500" />
                      )}
                    </div>
                    <div className="space-y-1">
                      {method.type === "card" ? (
                        <>
                          <p className="font-semibold">
                            {method.brand} •••• {method.last4}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Expires {method.expiryMonth}/{method.expiryYear} • {method.name}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="font-semibold">PayPal</p>
                          <p className="text-sm text-muted-foreground">{method.name}</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {method.isDefault ? (
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        Default
                      </span>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDefaultPayment(method.id)}
                        className="hover-lift"
                      >
                        Set as Default
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deletePaymentMethod(method.id)}
                      className="hover-lift text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Default dashboard view (discounts/history tabs)
  return (
    <div className="container space-y-8 py-12 page-content relative">
      <div className="flex flex-col gap-3 animate-fade-in-down">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary animate-fade-in">
              Dashboard
            </p>
            <h1 className="text-3xl font-bold animate-fade-in-up">Your travel savings</h1>
            <p className="text-muted-foreground animate-fade-in-up">
              View discounts for places you have visited and current transport
              offers. This section unlocks after you sign in.
            </p>
          </div>
          {!isLoggedIn ? (
            <Button asChild className="hidden sm:inline-flex hover-lift">
              <Link href="/login">Go to login</Link>
            </Button>
          ) : (
            <div className="hidden sm:flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
              <CreditCard className="h-4 w-4" />
              Discounts unlocked
            </div>
          )}
        </div>
      </div>

      {!isLoggedIn ? (
        <Card className="border-dashed animate-scale-in hover-lift">
          <CardHeader>
            <CardTitle>Sign in to unlock discounts</CardTitle>
            <CardDescription>
              Connect your account to see loyalty pricing for places you have
              visited and exclusive transport savings.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                We&apos;ll show your personalized discounts once you sign in.
              </p>
              <p className="text-xs text-muted-foreground">
                Hook this gate to your auth provider when backend is ready.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="hover-lift">
                <Link href="/login">Login to view discounts</Link>
              </Button>
              <Button variant="outline" onClick={() => setIsLoggedIn(true)} className="hover-lift">
                Preview as logged in
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 animate-fade-in-up">
          <div className="inline-flex rounded-full border bg-muted/40 p-1 text-sm animate-scale-in">
            <button
              className={`rounded-full px-4 py-2 transition-all duration-300 hover-scale ${
                activeTab === "discounts"
                  ? "bg-background shadow-sm font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("discounts")}
            >
              Discounts
            </button>
            <button
              className={`rounded-full px-4 py-2 transition-all duration-300 hover-scale ${
                activeTab === "history"
                  ? "bg-background shadow-sm font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("history")}
            >
              Travel history
            </button>
          </div>

          {activeTab === "discounts" ? (
            <div className="grid gap-6 lg:grid-cols-2 animate-stagger">
              <Card className="shadow-sm hover-lift animate-fade-in-left">
                <CardHeader className="space-y-1">
                  <CardTitle>Discounts on places you visited</CardTitle>
                  <CardDescription>
                    Loyalty pricing and perks applied to your recent stays.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {visitedDiscounts.map((item, index) => (
                    <div
                      key={item.place}
                      className="flex flex-col gap-2 rounded-lg border bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between hover-lift transition-all duration-300"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <p className="font-semibold">{item.place}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Visited {item.visitedOn} • {item.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.savings}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary hover-scale">
                          {item.discount}% off
                        </span>
                        <Button variant="outline" size="sm" className="hover-lift">
                          Apply deal
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="shadow-sm hover-lift animate-fade-in-right">
                <CardHeader className="space-y-1">
                  <CardTitle>Transport discounts</CardTitle>
                  <CardDescription>
                    Savings on your preferred ways to get around.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  {transportDeals.map((deal, index) => (
                    <div
                      key={deal.provider}
                      className="flex items-start justify-between gap-3 rounded-lg border bg-muted/40 p-4 hover-lift transition-all duration-300"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary hover-scale transition-transform">
                          <deal.icon className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-semibold">{deal.provider}</p>
                          <p className="text-sm text-muted-foreground">
                            {deal.mode} • {deal.perk}
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary hover-scale">
                        {deal.discount}% off
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="shadow-sm hover-lift animate-scale-in">
              <CardHeader className="space-y-1">
                <CardTitle>Your travel history</CardTitle>
                <CardDescription>Previously completed trips.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 animate-stagger">
                {mockBookings.filter((b) => b.status === "completed").map((trip, index) => (
                  <div
                    key={trip.id}
                    className="flex flex-col gap-2 rounded-lg border bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between hover-lift transition-all duration-300"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="space-y-1">
                      <p className="font-semibold">{trip.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {trip.checkIn && trip.checkOut
                          ? `${new Date(trip.checkIn).toLocaleDateString()} - ${new Date(trip.checkOut).toLocaleDateString()}`
                          : trip.destination}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {trip.type} • {trip.destination}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary hover-scale">
                        ${trip.amount.toLocaleString()}
                      </span>
                      <Button variant="outline" size="sm" className="hover-lift">
                        View details
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="container space-y-8 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}
