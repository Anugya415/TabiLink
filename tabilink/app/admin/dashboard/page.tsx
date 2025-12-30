"use client"

import { useState, Suspense, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useRole } from "@/contexts/RoleContext"
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
  Calendar,
  TrendingUp,
  DollarSign,
  Hotel,
  Plane,
  Shield,
  BarChart3,
  Settings,
  Bell,
  FileText,
  CreditCard,
  MapPin,
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Star,
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

function AdminDashboardContent() {
  const { user } = useRole()
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<string>(
    searchParams.get("tab") || "overview"
  )
  const [openDialog, setOpenDialog] = useState<string | null>(null)

  // Update URL when tab changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (activeTab === "overview") {
      params.delete("tab")
    } else {
      params.set("tab", activeTab)
    }
    router.replace(`/admin/dashboard?${params.toString()}`, { scroll: false })
  }, [activeTab, router, searchParams])

  // State for filters and search
  const [bookingSearch, setBookingSearch] = useState("")
  const [bookingFilter, setBookingFilter] = useState("all")
  const [userSearch, setUserSearch] = useState("")
  const [hotelSearch, setHotelSearch] = useState("")
  const [packageSearch, setPackageSearch] = useState("")

  // State for dialogs and editing
  const [dialogType, setDialogType] = useState<string | null>(null)
  const [dialogAction, setDialogAction] = useState<"add" | "view" | "edit" | null>(null)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  // Mock admin data
  const stats = [
    {
      title: "Total Users",
      value: "12,458",
      change: "+12.5%",
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-500/20",
    },
    {
      title: "Active Bookings",
      value: "3,247",
      change: "+8.2%",
      icon: Calendar,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-500/20",
    },
    {
      title: "Revenue",
      value: "$245,890",
      change: "+15.3%",
      icon: DollarSign,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-500/20",
    },
    {
      title: "Hotels Listed",
      value: "1,234",
      change: "+5.1%",
      icon: Hotel,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-500/20",
    },
  ]

  // State for managing data
  const [allBookings, setAllBookings] = useState([
    {
      id: "BK-2024-001",
      customer: "John Doe",
      customerEmail: "john.doe@example.com",
      hotel: "Grand Luxury Hotel",
      destination: "Paris, France",
      checkIn: "2024-03-15",
      checkOut: "2024-03-20",
      amount: 1495,
      status: "confirmed",
      travelers: 2,
      bookingDate: "2024-02-10",
    },
    {
      id: "BK-2024-002",
      customer: "Jane Smith",
      customerEmail: "jane.smith@example.com",
      hotel: "Beach Resort",
      destination: "Barcelona, Spain",
      checkIn: "2024-01-18",
      checkOut: "2024-01-25",
      amount: 2100,
      status: "pending",
      travelers: 2,
      bookingDate: "2024-01-15",
    },
    {
      id: "BK-2024-003",
      customer: "Mike Johnson",
      customerEmail: "mike.j@example.com",
      hotel: "City Center Hotel",
      destination: "New York, USA",
      checkIn: "2024-01-20",
      checkOut: "2024-01-22",
      amount: 450,
      status: "confirmed",
      travelers: 1,
      bookingDate: "2024-01-18",
    },
    {
      id: "BK-2024-004",
      customer: "Sarah Williams",
      customerEmail: "sarah.w@example.com",
      hotel: "Mountain View Lodge",
      destination: "Banff, Canada",
      checkIn: "2024-01-22",
      checkOut: "2024-01-28",
      amount: 1800,
      status: "pending",
      travelers: 2,
      bookingDate: "2024-01-20",
    },
    {
      id: "BK-2024-005",
      customer: "David Brown",
      customerEmail: "david.b@example.com",
      hotel: "Seaside Paradise",
      destination: "Maldives",
      checkIn: "2024-02-10",
      checkOut: "2024-02-17",
      amount: 3200,
      status: "confirmed",
      travelers: 2,
      bookingDate: "2024-01-25",
    },
    {
      id: "BK-2024-006",
      customer: "Emily Davis",
      customerEmail: "emily.d@example.com",
      hotel: "Tokyo Grand",
      destination: "Tokyo, Japan",
      checkIn: "2024-02-15",
      checkOut: "2024-02-20",
      amount: 1650,
      status: "cancelled",
      travelers: 1,
      bookingDate: "2024-01-30",
    },
    {
      id: "BK-2024-007",
      customer: "Robert Wilson",
      customerEmail: "robert.w@example.com",
      hotel: "Dubai Marina",
      destination: "Dubai, UAE",
      checkIn: "2024-02-20",
      checkOut: "2024-02-25",
      amount: 2400,
      status: "confirmed",
      travelers: 3,
      bookingDate: "2024-02-05",
    },
    {
      id: "BK-2024-008",
      customer: "Lisa Anderson",
      customerEmail: "lisa.a@example.com",
      hotel: "Santorini Sunset",
      destination: "Santorini, Greece",
      checkIn: "2024-03-01",
      checkOut: "2024-03-08",
      amount: 2750,
      status: "pending",
      travelers: 2,
      bookingDate: "2024-02-15",
    },
  ])

  // Comprehensive mock users data
  const [allUsers, setAllUsers] = useState([
    {
      id: "user-1",
      name: "John Traveler",
      email: "john@example.com",
      role: "user",
      bookings: 12,
      status: "active",
      joined: "2024-01-01",
      totalSpent: 12500,
      lastLogin: "2024-01-15",
    },
    {
      id: "user-2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "user",
      bookings: 8,
      status: "active",
      joined: "2024-01-05",
      totalSpent: 8900,
      lastLogin: "2024-01-14",
    },
    {
      id: "user-3",
      name: "Mike Johnson",
      email: "mike@example.com",
      role: "user",
      bookings: 5,
      status: "inactive",
      joined: "2024-01-10",
      totalSpent: 3200,
      lastLogin: "2024-01-08",
    },
    {
      id: "user-4",
      name: "Sarah Williams",
      email: "sarah@example.com",
      role: "user",
      bookings: 15,
      status: "active",
      joined: "2023-12-15",
      totalSpent: 18900,
      lastLogin: "2024-01-16",
    },
    {
      id: "user-5",
      name: "David Brown",
      email: "david@example.com",
      role: "user",
      bookings: 3,
      status: "active",
      joined: "2024-01-20",
      totalSpent: 2100,
      lastLogin: "2024-01-17",
    },
    {
      id: "user-6",
      name: "Emily Davis",
      email: "emily@example.com",
      role: "user",
      bookings: 20,
      status: "active",
      joined: "2023-11-10",
      totalSpent: 24500,
      lastLogin: "2024-01-16",
    },
  ])

  // Mock hotels data
  const [allHotels, setAllHotels] = useState([
    {
      id: "hotel-1",
      name: "Grand Luxury Hotel",
      location: "Paris, France",
      rating: 4.8,
      price: 299,
      rooms: 150,
      status: "active",
      bookings: 1245,
      revenue: 372255,
    },
    {
      id: "hotel-2",
      name: "Beach Resort",
      location: "Barcelona, Spain",
      rating: 4.6,
      price: 189,
      rooms: 200,
      status: "active",
      bookings: 1890,
      revenue: 357210,
    },
    {
      id: "hotel-3",
      name: "City Center Hotel",
      location: "New York, USA",
      rating: 4.7,
      price: 225,
      rooms: 120,
      status: "active",
      bookings: 980,
      revenue: 220500,
    },
    {
      id: "hotel-4",
      name: "Mountain View Lodge",
      location: "Banff, Canada",
      rating: 4.9,
      price: 320,
      rooms: 80,
      status: "active",
      bookings: 650,
      revenue: 208000,
    },
    {
      id: "hotel-5",
      name: "Seaside Paradise",
      location: "Maldives",
      rating: 4.9,
      price: 450,
      rooms: 50,
      status: "active",
      bookings: 420,
      revenue: 189000,
    },
    {
      id: "hotel-6",
      name: "Tokyo Grand",
      location: "Tokyo, Japan",
      rating: 4.8,
      price: 280,
      rooms: 180,
      status: "active",
      bookings: 1120,
      revenue: 313600,
    },
    {
      id: "hotel-7",
      name: "Dubai Marina",
      location: "Dubai, UAE",
      rating: 4.7,
      price: 350,
      rooms: 100,
      status: "active",
      bookings: 780,
      revenue: 273000,
    },
    {
      id: "hotel-8",
      name: "Santorini Sunset",
      location: "Santorini, Greece",
      rating: 4.9,
      price: 380,
      rooms: 60,
      status: "active",
      bookings: 520,
      revenue: 197600,
    },
  ])

  // Mock packages data
  const [allPackages, setAllPackages] = useState([
    {
      id: "pkg-1",
      name: "European Adventure",
      destination: "Paris, Rome, Barcelona",
      duration: "7 days",
      price: 1899,
      bookings: 245,
      status: "active",
      revenue: 465255,
    },
    {
      id: "pkg-2",
      name: "Asian Discovery",
      destination: "Tokyo, Kyoto, Seoul",
      duration: "10 days",
      price: 2499,
      bookings: 180,
      status: "active",
      revenue: 449820,
    },
    {
      id: "pkg-3",
      name: "Tropical Paradise",
      destination: "Maldives, Seychelles",
      duration: "8 days",
      price: 3299,
      bookings: 120,
      status: "active",
      revenue: 395880,
    },
    {
      id: "pkg-4",
      name: "Northern Lights",
      destination: "Iceland, Norway",
      duration: "6 days",
      price: 2199,
      bookings: 95,
      status: "active",
      revenue: 208905,
    },
    {
      id: "pkg-5",
      name: "Mediterranean Cruise",
      destination: "Greece, Italy, Spain",
      duration: "12 days",
      price: 3899,
      bookings: 150,
      status: "active",
      revenue: 584850,
    },
  ])

  // Filter bookings
  const filteredBookings = allBookings.filter((booking) => {
    const matchesSearch = booking.customer.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      booking.hotel.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      booking.id.toLowerCase().includes(bookingSearch.toLowerCase())
    const matchesFilter = bookingFilter === "all" || booking.status === bookingFilter
    return matchesSearch && matchesFilter
  })

  // Filter users
  const filteredUsers = allUsers.filter((u) =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  )

  // Filter hotels
  const filteredHotels = allHotels.filter((h) =>
    h.name.toLowerCase().includes(hotelSearch.toLowerCase()) ||
    h.location.toLowerCase().includes(hotelSearch.toLowerCase())
  )

  // Filter packages
  const filteredPackages = allPackages.filter((p) =>
    p.name.toLowerCase().includes(packageSearch.toLowerCase()) ||
    p.destination.toLowerCase().includes(packageSearch.toLowerCase())
  )

  // Analytics data
  const analyticsData = {
    revenueByMonth: [
      { month: "Jan", revenue: 125000 },
      { month: "Feb", revenue: 145000 },
      { month: "Mar", revenue: 165000 },
      { month: "Apr", revenue: 180000 },
      { month: "May", revenue: 195000 },
      { month: "Jun", revenue: 210000 },
    ],
    bookingsByStatus: {
      confirmed: 3247,
      pending: 856,
      cancelled: 234,
      completed: 1890,
    },
    topDestinations: [
      { destination: "Paris, France", bookings: 1245 },
      { destination: "Barcelona, Spain", bookings: 980 },
      { destination: "Tokyo, Japan", bookings: 890 },
      { destination: "Dubai, UAE", bookings: 780 },
      { destination: "New York, USA", bookings: 650 },
    ],
  }

  // Update activeTab when URL changes
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab) {
      setActiveTab(tab)
    } else {
      setActiveTab("overview")
    }
  }, [searchParams])

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
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
                      <p className="text-xs text-muted-foreground mt-1">
                        <span className="text-green-600 dark:text-green-400">{stat.change}</span> from last month
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Recent Bookings */}
            <Card className="hover-lift bg-card">
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Latest booking activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allBookings.slice(0, 5).map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">{booking.id}</span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              booking.status === "confirmed"
                                ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                                : booking.status === "pending"
                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400"
                                : booking.status === "cancelled"
                                ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                                : "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>
                        <p className="text-sm text-foreground font-medium">{booking.customer}</p>
                        <p className="text-xs text-muted-foreground">{booking.hotel} • {booking.destination}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="font-semibold text-foreground">${booking.amount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">
                          {booking.checkIn} - {booking.checkOut}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "bookings":
        return (
          <div className="space-y-6">
            <Card className="hover-lift bg-card">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <CardTitle>All Bookings</CardTitle>
                    <CardDescription>Manage and monitor all bookings ({filteredBookings.length} total)</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search bookings..."
                        className="w-64 pl-10"
                        value={bookingSearch}
                        onChange={(e) => setBookingSearch(e.target.value)}
                      />
                    </div>
                    <Select
                      value={bookingFilter}
                      onChange={(e) => setBookingFilter(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredBookings.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No bookings found</p>
                    </div>
                  ) : (
                    filteredBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-4 rounded-lg border bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">{booking.id}</span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                booking.status === "confirmed"
                                  ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                                  : booking.status === "pending"
                                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400"
                                  : booking.status === "cancelled"
                                  ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                                  : "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-foreground">{booking.customer}</p>
                          <p className="text-xs text-muted-foreground">{booking.customerEmail}</p>
                          <p className="text-xs text-muted-foreground">{booking.hotel} • {booking.destination}</p>
                          <p className="text-xs text-muted-foreground">
                            {booking.travelers} {booking.travelers === 1 ? "traveler" : "travelers"}
                          </p>
                        </div>
                        <div className="text-right space-y-1 mr-4">
                          <p className="font-semibold text-foreground">${booking.amount.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">
                            {booking.checkIn} - {booking.checkOut}
                          </p>
                          <p className="text-xs text-muted-foreground">Booked: {booking.bookingDate}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover-lift"
                            onClick={() => {
                              setSelectedItem(booking)
                              setDialogType("booking")
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
                              setSelectedItem(booking)
                              setDialogType("booking")
                              setDialogAction("edit")
                            }}
                          >
                            Edit
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

      case "users":
        return (
          <div className="space-y-6">
            <Card className="hover-lift bg-card">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage all users and their accounts ({filteredUsers.length} total)</CardDescription>
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
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                u.status === "active"
                                  ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                                  : "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400"
                              }`}
                            >
                              {u.status}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{u.email}</p>
                          <p className="text-xs text-muted-foreground">
                            {u.bookings || 0} bookings • ${u.totalSpent ? u.totalSpent.toLocaleString() : "0"} spent • Joined {u.joined}
                          </p>
                          {u.lastLogin && (
                            <p className="text-xs text-muted-foreground">
                              Last login: {u.lastLogin}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
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
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "hotels":
        return (
          <div className="space-y-6">
            <Card className="hover-lift bg-card">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <CardTitle>Hotel Management</CardTitle>
                    <CardDescription>Manage hotel listings and availability ({filteredHotels.length} hotels)</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search hotels..."
                        className="w-64 pl-10"
                        value={hotelSearch}
                        onChange={(e) => setHotelSearch(e.target.value)}
                      />
                    </div>
                    <Button
                      className="hover-lift"
                      onClick={() => {
                        setSelectedItem(null)
                        setDialogType("hotel")
                        setDialogAction("add")
                      }}
                    >
                      <Hotel className="h-4 w-4 mr-2" />
                      Add Hotel
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredHotels.map((hotel) => (
                    <div
                      key={hotel.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">{hotel.name}</span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400">
                            {hotel.status}
                          </span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-medium">{hotel.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{hotel.location}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {hotel.rooms || 0} rooms • {hotel.bookings ? hotel.bookings.toLocaleString() : "0"} bookings • ${hotel.revenue ? hotel.revenue.toLocaleString() : "0"} revenue
                        </p>
                      </div>
                      <div className="text-right space-y-1 mr-4">
                        <p className="font-semibold text-foreground">${hotel.price}/night</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover-lift"
                          onClick={() => {
                            setSelectedItem(hotel)
                            setDialogType("hotel")
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
                            setSelectedItem(hotel)
                            setDialogType("hotel")
                            setDialogAction("edit")
                          }}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "packages":
        return (
          <div className="space-y-6">
            <Card className="hover-lift bg-card">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <CardTitle>Travel Package Management</CardTitle>
                    <CardDescription>Manage travel packages and deals ({filteredPackages.length} packages)</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search packages..."
                        className="w-64 pl-10"
                        value={packageSearch}
                        onChange={(e) => setPackageSearch(e.target.value)}
                      />
                    </div>
                    <Button
                      className="hover-lift"
                      onClick={() => {
                        setSelectedItem(null)
                        setDialogType("package")
                        setDialogAction("add")
                      }}
                    >
                      <Plane className="h-4 w-4 mr-2" />
                      Add Package
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">{pkg.name}</span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400">
                            {pkg.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{pkg.destination}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {pkg.duration} • {pkg.bookings || 0} bookings • ${pkg.revenue ? pkg.revenue.toLocaleString() : "0"} revenue
                        </p>
                      </div>
                      <div className="text-right space-y-1 mr-4">
                        <p className="font-semibold text-foreground">${pkg.price ? pkg.price.toLocaleString() : "0"}</p>
                        <p className="text-xs text-muted-foreground">per person</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover-lift"
                          onClick={() => {
                            setSelectedItem(pkg)
                            setDialogType("package")
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
                            setSelectedItem(pkg)
                            setDialogType("package")
                            setDialogAction("edit")
                          }}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "analytics":
        return (
          <div className="space-y-6">
            {/* Revenue Chart */}
            <Card className="hover-lift bg-card">
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>Monthly revenue over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-end justify-between h-48 gap-2">
                    {analyticsData.revenueByMonth.map((data, index) => {
                      const maxRevenue = Math.max(...analyticsData.revenueByMonth.map(d => d.revenue))
                      const height = (data.revenue / maxRevenue) * 100
                      return (
                        <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                          <div className="w-full flex items-end justify-center" style={{ height: "160px" }}>
                            <div
                              className="w-full bg-primary rounded-t transition-all hover:opacity-80"
                              style={{ height: `${height}%`, minHeight: "8px" }}
                              title={`${data.month}: $${data.revenue.toLocaleString()}`}
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

            {/* Bookings by Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <span className="text-sm font-semibold text-foreground">{count.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

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
                        <span className="text-sm font-semibold text-foreground">{dest.bookings ? dest.bookings.toLocaleString() : "0"}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "settings":
        return (
          <div className="space-y-6">
            <Card className="hover-lift bg-card">
              <CardHeader>
                <CardTitle>Admin Settings</CardTitle>
                <CardDescription>Configure admin panel settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50 hover:bg-muted transition-colors">
                    <div>
                      <p className="font-semibold text-foreground">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive email alerts for important events</p>
                    </div>
                    <Button
                      variant="outline"
                      className="hover-lift"
                      onClick={() => setOpenDialog("email")}
                    >
                      Configure
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50 hover:bg-muted transition-colors">
                    <div>
                      <p className="font-semibold text-foreground">System Preferences</p>
                      <p className="text-sm text-muted-foreground">Manage system-wide settings</p>
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
                    <div>
                      <p className="font-semibold text-foreground">Booking Rules</p>
                      <p className="text-sm text-muted-foreground">Configure booking policies and restrictions</p>
                    </div>
                    <Button
                      variant="outline"
                      className="hover-lift"
                      onClick={() => setOpenDialog("booking")}
                    >
                      Configure
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50 hover:bg-muted transition-colors">
                    <div>
                      <p className="font-semibold text-foreground">Payment Settings</p>
                      <p className="text-sm text-muted-foreground">Manage payment gateways and methods</p>
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
                    <div>
                      <p className="font-semibold text-foreground">Security Settings</p>
                      <p className="text-sm text-muted-foreground">Manage access controls and security policies</p>
                    </div>
                    <Button
                      variant="outline"
                      className="hover-lift"
                      onClick={() => setOpenDialog("security")}
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
        return null
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
                Admin Dashboard
              </p>
            </div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.name}</h1>
            <p className="text-muted-foreground">
              Manage your platform and monitor activities
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="animate-fade-in-up">
        {renderTabContent()}
      </div>

      {/* Configuration Dialogs */}
      {/* Email Notifications Dialog */}
      <Dialog open={openDialog === "email"} onOpenChange={(open) => !open && setOpenDialog(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Email Notifications</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Configure email alert settings for important events
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4 overflow-x-hidden">
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-foreground">Notification Types</Label>
              <div className="grid gap-3">
                <div className="flex items-center justify-between p-5 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <input 
                      type="checkbox" 
                      id="email-booking" 
                      defaultChecked 
                      className="h-5 w-5 rounded border-2 border-border bg-background text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer flex-shrink-0" 
                    />
                    <Label htmlFor="email-booking" className="text-base font-medium text-foreground cursor-pointer">
                      New booking confirmations
                    </Label>
                  </div>
                </div>
                <div className="flex items-center justify-between p-5 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <input 
                      type="checkbox" 
                      id="email-cancellation" 
                      defaultChecked 
                      className="h-5 w-5 rounded border-2 border-border bg-background text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer flex-shrink-0" 
                    />
                    <Label htmlFor="email-cancellation" className="text-base font-medium text-foreground cursor-pointer">
                      Booking cancellations
                    </Label>
                  </div>
                </div>
                <div className="flex items-center justify-between p-5 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <input 
                      type="checkbox" 
                      id="email-payment" 
                      defaultChecked 
                      className="h-5 w-5 rounded border-2 border-border bg-background text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer flex-shrink-0" 
                    />
                    <Label htmlFor="email-payment" className="text-base font-medium text-foreground cursor-pointer">
                      Payment failures
                    </Label>
                  </div>
                </div>
                <div className="flex items-center justify-between p-5 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <input 
                      type="checkbox" 
                      id="email-user" 
                      className="h-5 w-5 rounded border-2 border-border bg-background text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer flex-shrink-0" 
                    />
                    <Label htmlFor="email-user" className="text-base font-medium text-foreground cursor-pointer">
                      New user registrations
                    </Label>
                  </div>
                </div>
                <div className="flex items-center justify-between p-5 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <input 
                      type="checkbox" 
                      id="email-system" 
                      defaultChecked 
                      className="h-5 w-5 rounded border-2 border-border bg-background text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer flex-shrink-0" 
                    />
                    <Label htmlFor="email-system" className="text-base font-medium text-foreground cursor-pointer">
                      System alerts
                    </Label>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Email Frequency</Label>
              <Select defaultValue="realtime" className="w-full min-w-0">
                <option value="realtime">Real-time</option>
                <option value="hourly">Hourly digest</option>
                <option value="daily">Daily digest</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Admin Email Address</Label>
              <Input 
                type="email" 
                placeholder="admin@tabilink.com" 
                defaultValue="admin@tabilink.com" 
                className="w-full min-w-0"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setOpenDialog(null)}>Cancel</Button>
              <Button onClick={() => {
                toast.success("Settings saved", { description: "Email notification settings have been updated" })
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
              Manage system-wide settings and defaults
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
            <div className="flex items-start gap-3">
              <input 
                type="checkbox" 
                id="maintenance-mode" 
                className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer flex-shrink-0 mt-0.5" 
              />
              <Label htmlFor="maintenance-mode" className="text-sm font-normal text-foreground cursor-pointer leading-5 break-words flex-1">
                Enable maintenance mode
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

      {/* Booking Rules Dialog */}
      <Dialog open={openDialog === "booking"} onOpenChange={(open) => !open && setOpenDialog(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Booking Rules</DialogTitle>
            <DialogDescription>
              Configure booking policies and restrictions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Maximum Advance Booking (days)</Label>
              <Input type="number" defaultValue="365" min="30" max="730" />
            </div>
            <div className="space-y-2">
              <Label>Minimum Booking Duration (nights)</Label>
              <Input type="number" defaultValue="1" min="1" max="30" />
            </div>
            <div className="space-y-2">
              <Label>Maximum Travelers per Booking</Label>
              <Input type="number" defaultValue="10" min="1" max="50" />
            </div>
            <div className="space-y-2">
              <Label>Cancellation Policy</Label>
              <Select defaultValue="flexible">
                <option value="flexible">Flexible - Free cancellation</option>
                <option value="moderate">Moderate - 50% refund</option>
                <option value="strict">Strict - No refund</option>
              </Select>
            </div>
            <div className="flex items-start gap-3">
              <input 
                type="checkbox" 
                id="require-deposit" 
                defaultChecked 
                className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer flex-shrink-0 mt-0.5" 
              />
              <Label htmlFor="require-deposit" className="text-sm font-normal text-foreground cursor-pointer leading-5 break-words flex-1">
                Require deposit for bookings
              </Label>
            </div>
            <div className="space-y-2">
              <Label>Deposit Percentage</Label>
              <Input type="number" defaultValue="20" min="0" max="100" />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setOpenDialog(null)}>Cancel</Button>
              <Button onClick={() => {
                toast.success("Settings saved", { description: "Booking rules have been updated" })
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
              Manage payment gateways and processing methods
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4 overflow-x-hidden">
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
            <div className="flex items-start gap-3">
              <input 
                type="checkbox" 
                id="enable-invoice" 
                defaultChecked 
                className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer flex-shrink-0 mt-0.5" 
              />
              <Label htmlFor="enable-invoice" className="text-sm font-normal text-foreground cursor-pointer leading-5 break-words flex-1">
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

      {/* Security Settings Dialog */}
      <Dialog open={openDialog === "security"} onOpenChange={(open) => !open && setOpenDialog(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Security Settings</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Manage access controls and security policies
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4 overflow-x-hidden">
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
              <Label htmlFor="ip-whitelist" className="text-sm font-normal text-foreground cursor-pointer leading-5 break-words flex-1">
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

      {/* Booking Dialog */}
      <Dialog open={dialogType === "booking" && dialogAction !== null} onOpenChange={(open) => !open && (setDialogType(null), setDialogAction(null), setSelectedItem(null))}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {dialogAction === "add" ? "Add New Booking" : dialogAction === "view" ? "Booking Details" : "Edit Booking"}
            </DialogTitle>
            <DialogDescription>
              {dialogAction === "add" ? "Create a new booking entry" : dialogAction === "view" ? "View booking information" : "Update booking details"}
            </DialogDescription>
          </DialogHeader>
          {dialogAction === "view" ? (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Booking ID</Label>
                  <p className="text-sm font-medium text-foreground">{selectedItem?.id}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    selectedItem?.status === "confirmed" ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400" :
                    selectedItem?.status === "pending" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400" :
                    "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                  }`}>
                    {selectedItem?.status}
                  </span>
                </div>
                <div>
                  <Label>Customer Name</Label>
                  <p className="text-sm font-medium text-foreground">{selectedItem?.customer}</p>
                </div>
                <div>
                  <Label>Customer Email</Label>
                  <p className="text-sm text-foreground">{selectedItem?.customerEmail}</p>
                </div>
                <div>
                  <Label>Hotel</Label>
                  <p className="text-sm text-foreground">{selectedItem?.hotel}</p>
                </div>
                <div>
                  <Label>Destination</Label>
                  <p className="text-sm text-foreground">{selectedItem?.destination}</p>
                </div>
                <div>
                  <Label>Check-in Date</Label>
                  <p className="text-sm text-foreground">{selectedItem?.checkIn}</p>
                </div>
                <div>
                  <Label>Check-out Date</Label>
                  <p className="text-sm text-foreground">{selectedItem?.checkOut}</p>
                </div>
                <div>
                  <Label>Travelers</Label>
                  <p className="text-sm text-foreground">{selectedItem?.travelers}</p>
                </div>
                <div>
                  <Label>Amount</Label>
                  <p className="text-sm font-semibold text-foreground">${selectedItem?.amount ? selectedItem.amount.toLocaleString() : "0"}</p>
                </div>
                <div>
                  <Label>Booking Date</Label>
                  <p className="text-sm text-foreground">{selectedItem?.bookingDate}</p>
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
                  <Label>Customer Name *</Label>
                  <Input defaultValue={selectedItem?.customer || ""} id="booking-customer" />
                </div>
                <div className="space-y-2">
                  <Label>Customer Email *</Label>
                  <Input type="email" defaultValue={selectedItem?.customerEmail || ""} id="booking-email" />
                </div>
                <div className="space-y-2">
                  <Label>Hotel Name *</Label>
                  <Input defaultValue={selectedItem?.hotel || ""} id="booking-hotel" />
                </div>
                <div className="space-y-2">
                  <Label>Destination *</Label>
                  <Input defaultValue={selectedItem?.destination || ""} id="booking-destination" />
                </div>
                <div className="space-y-2">
                  <Label>Check-in Date *</Label>
                  <Input type="date" defaultValue={selectedItem?.checkIn || ""} id="booking-checkin" />
                </div>
                <div className="space-y-2">
                  <Label>Check-out Date *</Label>
                  <Input type="date" defaultValue={selectedItem?.checkOut || ""} id="booking-checkout" />
                </div>
                <div className="space-y-2">
                  <Label>Travelers *</Label>
                  <Input type="number" defaultValue={selectedItem?.travelers || 1} min="1" id="booking-travelers" />
                </div>
                <div className="space-y-2">
                  <Label>Amount ($) *</Label>
                  <Input type="number" defaultValue={selectedItem?.amount || 0} min="0" id="booking-amount" />
                </div>
                <div className="space-y-2">
                  <Label>Status *</Label>
                  <Select defaultValue={selectedItem?.status || "pending"} id="booking-status">
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Booking Date *</Label>
                  <Input type="date" defaultValue={selectedItem?.bookingDate || ""} id="booking-date" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => (setDialogType(null), setDialogAction(null), setSelectedItem(null))}>Cancel</Button>
                <Button onClick={() => {
                  const customer = (document.getElementById("booking-customer") as HTMLInputElement)?.value
                  const email = (document.getElementById("booking-email") as HTMLInputElement)?.value
                  const hotel = (document.getElementById("booking-hotel") as HTMLInputElement)?.value
                  const destination = (document.getElementById("booking-destination") as HTMLInputElement)?.value
                  const checkIn = (document.getElementById("booking-checkin") as HTMLInputElement)?.value
                  const checkOut = (document.getElementById("booking-checkout") as HTMLInputElement)?.value
                  const travelers = parseInt((document.getElementById("booking-travelers") as HTMLInputElement)?.value || "1")
                  const amount = parseFloat((document.getElementById("booking-amount") as HTMLInputElement)?.value || "0")
                  const status = (document.getElementById("booking-status") as HTMLSelectElement)?.value
                  const bookingDate = (document.getElementById("booking-date") as HTMLInputElement)?.value

                  if (dialogAction === "add") {
                    const newId = `BK-2024-${String(allBookings.length + 1).padStart(3, "0")}`
                    setAllBookings([...allBookings, { id: newId, customer, customerEmail: email, hotel, destination, checkIn, checkOut, travelers, amount, status, bookingDate }])
                    toast.success("Booking added", { description: `New booking ${newId} has been created` })
                  } else {
                    setAllBookings(allBookings.map(b => b.id === selectedItem?.id ? { ...b, customer, customerEmail: email, hotel, destination, checkIn, checkOut, travelers, amount, status, bookingDate } : b))
                    toast.success("Booking updated", { description: `Booking ${selectedItem?.id} has been updated` })
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
                  <Label>Status</Label>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    selectedItem?.status === "active" ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400" :
                    "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400"
                  }`}>
                    {selectedItem?.status}
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
                  <Label>Role</Label>
                  <p className="text-sm text-foreground">{selectedItem?.role}</p>
                </div>
                <div>
                  <Label>Total Bookings</Label>
                  <p className="text-sm text-foreground">{selectedItem?.bookings}</p>
                </div>
                <div>
                  <Label>Total Spent</Label>
                  <p className="text-sm font-semibold text-foreground">${selectedItem?.totalSpent ? selectedItem.totalSpent.toLocaleString() : "0"}</p>
                </div>
                <div>
                  <Label>Joined Date</Label>
                  <p className="text-sm text-foreground">{selectedItem?.joined}</p>
                </div>
                <div>
                  <Label>Last Login</Label>
                  <p className="text-sm text-foreground">{selectedItem?.lastLogin}</p>
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
                  <Label>Status *</Label>
                  <Select defaultValue={selectedItem?.status || "active"} id="user-status">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Role *</Label>
                  <Select defaultValue={selectedItem?.role || "user"} id="user-role">
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Total Bookings</Label>
                  <Input type="number" defaultValue={selectedItem?.bookings || 0} min="0" id="user-bookings" />
                </div>
                <div className="space-y-2">
                  <Label>Total Spent ($)</Label>
                  <Input type="number" defaultValue={selectedItem?.totalSpent || 0} min="0" id="user-spent" />
                </div>
                <div className="space-y-2">
                  <Label>Joined Date</Label>
                  <Input type="date" defaultValue={selectedItem?.joined || ""} id="user-joined" />
                </div>
                <div className="space-y-2">
                  <Label>Last Login</Label>
                  <Input type="date" defaultValue={selectedItem?.lastLogin || ""} id="user-login" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => (setDialogType(null), setDialogAction(null), setSelectedItem(null))}>Cancel</Button>
                <Button onClick={() => {
                  const name = (document.getElementById("user-name") as HTMLInputElement)?.value
                  const email = (document.getElementById("user-email") as HTMLInputElement)?.value
                  const status = (document.getElementById("user-status") as HTMLSelectElement)?.value
                  const role = (document.getElementById("user-role") as HTMLSelectElement)?.value
                  const bookings = parseInt((document.getElementById("user-bookings") as HTMLInputElement)?.value || "0")
                  const totalSpent = parseFloat((document.getElementById("user-spent") as HTMLInputElement)?.value || "0")
                  const joined = (document.getElementById("user-joined") as HTMLInputElement)?.value
                  const lastLogin = (document.getElementById("user-login") as HTMLInputElement)?.value

                  if (dialogAction === "add") {
                    const newId = `user-${allUsers.length + 1}`
                    setAllUsers([...allUsers, { id: newId, name, email, role, status, bookings, totalSpent, joined, lastLogin }])
                    toast.success("User added", { description: `New user ${name} has been created` })
                  } else {
                    setAllUsers(allUsers.map(u => u.id === selectedItem?.id ? { ...u, name, email, role, status, bookings, totalSpent, joined, lastLogin } : u))
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

      {/* Hotel Dialog */}
      <Dialog open={dialogType === "hotel" && dialogAction !== null} onOpenChange={(open) => !open && (setDialogType(null), setDialogAction(null), setSelectedItem(null))}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {dialogAction === "add" ? "Add New Hotel" : dialogAction === "view" ? "Hotel Details" : "Edit Hotel"}
            </DialogTitle>
            <DialogDescription>
              {dialogAction === "add" ? "Create a new hotel listing" : dialogAction === "view" ? "View hotel information" : "Update hotel details"}
            </DialogDescription>
          </DialogHeader>
          {dialogAction === "view" ? (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Hotel ID</Label>
                  <p className="text-sm font-medium text-foreground">{selectedItem?.id}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    selectedItem?.status === "active" ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400" :
                    "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400"
                  }`}>
                    {selectedItem?.status}
                  </span>
                </div>
                <div>
                  <Label>Hotel Name</Label>
                  <p className="text-sm font-medium text-foreground">{selectedItem?.name}</p>
                </div>
                <div>
                  <Label>Location</Label>
                  <p className="text-sm text-foreground">{selectedItem?.location}</p>
                </div>
                <div>
                  <Label>Rating</Label>
                  <p className="text-sm text-foreground">{selectedItem?.rating} ⭐</p>
                </div>
                <div>
                  <Label>Price per Night</Label>
                  <p className="text-sm font-semibold text-foreground">${selectedItem?.price}</p>
                </div>
                <div>
                  <Label>Total Rooms</Label>
                  <p className="text-sm text-foreground">{selectedItem?.rooms}</p>
                </div>
                <div>
                  <Label>Total Bookings</Label>
                  <p className="text-sm text-foreground">{selectedItem?.bookings}</p>
                </div>
                <div>
                  <Label>Total Revenue</Label>
                  <p className="text-sm font-semibold text-foreground">${selectedItem?.revenue ? selectedItem.revenue.toLocaleString() : "0"}</p>
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
                  <Label>Hotel Name *</Label>
                  <Input defaultValue={selectedItem?.name || ""} id="hotel-name" />
                </div>
                <div className="space-y-2">
                  <Label>Location *</Label>
                  <Input defaultValue={selectedItem?.location || ""} id="hotel-location" />
                </div>
                <div className="space-y-2">
                  <Label>Rating *</Label>
                  <Input type="number" step="0.1" min="0" max="5" defaultValue={selectedItem?.rating || 0} id="hotel-rating" />
                </div>
                <div className="space-y-2">
                  <Label>Price per Night ($) *</Label>
                  <Input type="number" defaultValue={selectedItem?.price || 0} min="0" id="hotel-price" />
                </div>
                <div className="space-y-2">
                  <Label>Total Rooms *</Label>
                  <Input type="number" defaultValue={selectedItem?.rooms || 0} min="0" id="hotel-rooms" />
                </div>
                <div className="space-y-2">
                  <Label>Status *</Label>
                  <Select defaultValue={selectedItem?.status || "active"} id="hotel-status">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Total Bookings</Label>
                  <Input type="number" defaultValue={selectedItem?.bookings || 0} min="0" id="hotel-bookings" />
                </div>
                <div className="space-y-2">
                  <Label>Total Revenue ($)</Label>
                  <Input type="number" defaultValue={selectedItem?.revenue || 0} min="0" id="hotel-revenue" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => (setDialogType(null), setDialogAction(null), setSelectedItem(null))}>Cancel</Button>
                <Button onClick={() => {
                  const name = (document.getElementById("hotel-name") as HTMLInputElement)?.value
                  const location = (document.getElementById("hotel-location") as HTMLInputElement)?.value
                  const rating = parseFloat((document.getElementById("hotel-rating") as HTMLInputElement)?.value || "0")
                  const price = parseFloat((document.getElementById("hotel-price") as HTMLInputElement)?.value || "0")
                  const rooms = parseInt((document.getElementById("hotel-rooms") as HTMLInputElement)?.value || "0")
                  const status = (document.getElementById("hotel-status") as HTMLSelectElement)?.value
                  const bookings = parseInt((document.getElementById("hotel-bookings") as HTMLInputElement)?.value || "0")
                  const revenue = parseFloat((document.getElementById("hotel-revenue") as HTMLInputElement)?.value || "0")

                  if (dialogAction === "add") {
                    const newId = `hotel-${allHotels.length + 1}`
                    setAllHotels([...allHotels, { id: newId, name, location, rating, price, rooms, status, bookings, revenue }])
                    toast.success("Hotel added", { description: `New hotel ${name} has been created` })
                  } else {
                    setAllHotels(allHotels.map(h => h.id === selectedItem?.id ? { ...h, name, location, rating, price, rooms, status, bookings, revenue } : h))
                    toast.success("Hotel updated", { description: `Hotel ${name} has been updated` })
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

      {/* Package Dialog */}
      <Dialog open={dialogType === "package" && dialogAction !== null} onOpenChange={(open) => !open && (setDialogType(null), setDialogAction(null), setSelectedItem(null))}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {dialogAction === "add" ? "Add New Package" : dialogAction === "view" ? "Package Details" : "Edit Package"}
            </DialogTitle>
            <DialogDescription>
              {dialogAction === "add" ? "Create a new travel package" : dialogAction === "view" ? "View package information" : "Update package details"}
            </DialogDescription>
          </DialogHeader>
          {dialogAction === "view" ? (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Package ID</Label>
                  <p className="text-sm font-medium text-foreground">{selectedItem?.id}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    selectedItem?.status === "active" ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400" :
                    "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400"
                  }`}>
                    {selectedItem?.status}
                  </span>
                </div>
                <div>
                  <Label>Package Name</Label>
                  <p className="text-sm font-medium text-foreground">{selectedItem?.name}</p>
                </div>
                <div>
                  <Label>Destination</Label>
                  <p className="text-sm text-foreground">{selectedItem?.destination}</p>
                </div>
                <div>
                  <Label>Duration</Label>
                  <p className="text-sm text-foreground">{selectedItem?.duration}</p>
                </div>
                <div>
                  <Label>Price per Person</Label>
                  <p className="text-sm font-semibold text-foreground">${selectedItem?.price ? selectedItem.price.toLocaleString() : "0"}</p>
                </div>
                <div>
                  <Label>Total Bookings</Label>
                  <p className="text-sm text-foreground">{selectedItem?.bookings || "0"}</p>
                </div>
                <div>
                  <Label>Total Revenue</Label>
                  <p className="text-sm font-semibold text-foreground">${selectedItem?.revenue ? selectedItem.revenue.toLocaleString() : "0"}</p>
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
                  <Label>Package Name *</Label>
                  <Input defaultValue={selectedItem?.name || ""} id="package-name" />
                </div>
                <div className="space-y-2">
                  <Label>Destination *</Label>
                  <Input defaultValue={selectedItem?.destination || ""} id="package-destination" />
                </div>
                <div className="space-y-2">
                  <Label>Duration *</Label>
                  <Input defaultValue={selectedItem?.duration || ""} id="package-duration" placeholder="e.g., 7 days" />
                </div>
                <div className="space-y-2">
                  <Label>Price per Person ($) *</Label>
                  <Input type="number" defaultValue={selectedItem?.price || 0} min="0" id="package-price" />
                </div>
                <div className="space-y-2">
                  <Label>Status *</Label>
                  <Select defaultValue={selectedItem?.status || "active"} id="package-status">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Total Bookings</Label>
                  <Input type="number" defaultValue={selectedItem?.bookings || 0} min="0" id="package-bookings" />
                </div>
                <div className="space-y-2">
                  <Label>Total Revenue ($)</Label>
                  <Input type="number" defaultValue={selectedItem?.revenue || 0} min="0" id="package-revenue" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => (setDialogType(null), setDialogAction(null), setSelectedItem(null))}>Cancel</Button>
                <Button onClick={() => {
                  const name = (document.getElementById("package-name") as HTMLInputElement)?.value
                  const destination = (document.getElementById("package-destination") as HTMLInputElement)?.value
                  const duration = (document.getElementById("package-duration") as HTMLInputElement)?.value
                  const price = parseFloat((document.getElementById("package-price") as HTMLInputElement)?.value || "0")
                  const status = (document.getElementById("package-status") as HTMLSelectElement)?.value
                  const bookings = parseInt((document.getElementById("package-bookings") as HTMLInputElement)?.value || "0")
                  const revenue = parseFloat((document.getElementById("package-revenue") as HTMLInputElement)?.value || "0")

                  if (dialogAction === "add") {
                    const newId = `pkg-${allPackages.length + 1}`
                    setAllPackages([...allPackages, { id: newId, name, destination, duration, price, status, bookings, revenue }])
                    toast.success("Package added", { description: `New package ${name} has been created` })
                  } else {
                    setAllPackages(allPackages.map(p => p.id === selectedItem?.id ? { ...p, name, destination, duration, price, status, bookings, revenue } : p))
                    toast.success("Package updated", { description: `Package ${name} has been updated` })
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

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
      <Suspense fallback={
        <div className="container space-y-8 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        </div>
      }>
        <AdminDashboardContent />
      </Suspense>
    </ProtectedRoute>
  )
}

