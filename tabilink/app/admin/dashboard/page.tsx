"use client"

import { useState, Suspense, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useRole } from "@/contexts/RoleContext"
import { useTranslation } from "@/contexts/TranslationContext"
import { api } from "@/lib/api"
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
  Lock,
  UserCheck,
  AlertCircle,
  BookOpen,
  Mail,
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
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)

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

  // Users data from backend
  const [allUsers, setAllUsers] = useState<any[]>([])

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true)
      try {
        const response = await api.getUsers() as { success: boolean; data: { users: any[] } }
        if (response.success && response.data?.users) {
          // Transform backend user data to match frontend format
          const transformedUsers = response.data.users.map((user: any) => ({
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            bookings: user.totalTrips || 0,
            status: user.isActive ? "active" : "inactive",
            joined: user.memberSince ? new Date(user.memberSince).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            totalSpent: parseFloat(user.totalSpent || 0),
            lastLogin: user.lastLogin ? new Date(user.lastLogin).toISOString().split('T')[0] : "",
            phone: user.phone || "",
            membershipTier: user.membershipTier || "Silver",
          }))
          setAllUsers(transformedUsers)
        }
      } catch (error: any) {
        console.error("Error fetching users:", error)
        toast.error("Failed to load users", {
          description: error.message || "An error occurred while fetching users",
        })
      } finally {
        setIsLoadingUsers(false)
      }
    }

    if (activeTab === "users") {
      fetchUsers()
    }
  }, [activeTab])

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
                        <span className="text-sm font-semibold text-foreground">{count.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

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
            <h1 className="text-2xl sm:text-3xl font-bold">Welcome back, {user?.name}</h1>
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
                      id="email-booking" 
                      defaultChecked 
                    className="absolute top-4 left-4 h-5 w-5 rounded-md border-2 border-border bg-background text-yellow-600 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 cursor-pointer flex-shrink-0 transition-all" 
                  />
                  <span className="text-sm font-medium text-foreground group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors pl-7">New booking confirmations</span>
                </label>
                <label className="relative flex items-start gap-3 p-4 rounded-xl border-2 border-border bg-card hover:border-yellow-300 dark:hover:border-yellow-700 hover:bg-yellow-50/50 dark:hover:bg-yellow-950/20 transition-all cursor-pointer group">
                    <input 
                      type="checkbox" 
                      id="email-cancellation" 
                      defaultChecked 
                    className="absolute top-4 left-4 h-5 w-5 rounded-md border-2 border-border bg-background text-yellow-600 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 cursor-pointer flex-shrink-0 transition-all" 
                  />
                  <span className="text-sm font-medium text-foreground group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors pl-7">Booking cancellations</span>
                </label>
                <label className="relative flex items-start gap-3 p-4 rounded-xl border-2 border-border bg-card hover:border-yellow-300 dark:hover:border-yellow-700 hover:bg-yellow-50/50 dark:hover:bg-yellow-950/20 transition-all cursor-pointer group">
                    <input 
                      type="checkbox" 
                      id="email-payment" 
                      defaultChecked 
                    className="absolute top-4 left-4 h-5 w-5 rounded-md border-2 border-border bg-background text-yellow-600 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 cursor-pointer flex-shrink-0 transition-all" 
                  />
                  <span className="text-sm font-medium text-foreground group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors pl-7">Payment failures</span>
                </label>
                <label className="relative flex items-start gap-3 p-4 rounded-xl border-2 border-border bg-card hover:border-yellow-300 dark:hover:border-yellow-700 hover:bg-yellow-50/50 dark:hover:bg-yellow-950/20 transition-all cursor-pointer group">
                    <input 
                      type="checkbox" 
                      id="email-user" 
                    className="absolute top-4 left-4 h-5 w-5 rounded-md border-2 border-border bg-background text-yellow-600 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 cursor-pointer flex-shrink-0 transition-all" 
                    />
                  <span className="text-sm font-medium text-foreground group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors pl-7">New user registrations</span>
                </label>
                <label className="relative flex items-start gap-3 p-4 rounded-xl border-2 border-border bg-card hover:border-yellow-300 dark:hover:border-yellow-700 hover:bg-yellow-50/50 dark:hover:bg-yellow-950/20 transition-all cursor-pointer group">
                    <input 
                      type="checkbox" 
                      id="email-system" 
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
                <option value="hourly">Hourly digest</option>
                <option value="daily">Daily digest</option>
              </Select>
            </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  <Label className="text-sm font-semibold text-foreground">Admin Email Address</Label>
                </div>
              <Input 
                type="email" 
                placeholder="admin@tabilink.com" 
                defaultValue="admin@tabilink.com" 
                  className="w-full"
              />
            </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 mt-6 border-t border-border">
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => setOpenDialog(null)}>Cancel</Button>
            <Button className="w-full sm:w-auto bg-yellow-600 hover:bg-yellow-700" onClick={() => {
                toast.success("Settings saved", { description: "Email notification settings have been updated" })
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
                      <span className="text-sm font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Enable maintenance mode</span>
                      <div className="relative flex items-center justify-center">
              <input 
                type="checkbox" 
                id="maintenance-mode" 
                          className="peer h-7 w-9 appearance-none rounded-lg border-3 border-blue-400 dark:border-blue-500 bg-white dark:bg-gray-800 cursor-pointer transition-all duration-200 checked:bg-blue-600 checked:border-blue-600 hover:border-blue-500 dark:hover:border-blue-400 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm hover:shadow-md" 
              />
                        <svg className="absolute h-5 w-5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
            </div>
                    </div>
                    <span className="text-xs text-muted-foreground block mt-1">Temporarily disable access for system updates</span>
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

      {/* Booking Dialog */}
      <Dialog open={dialogType === "booking" && dialogAction !== null} onOpenChange={(open) => !open && (setDialogType(null), setDialogAction(null), setSelectedItem(null))}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl">
              {dialogAction === "add" ? "Add New Booking" : dialogAction === "view" ? "Booking Details" : "Edit Booking"}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              {dialogAction === "add" ? "Create a new booking entry" : dialogAction === "view" ? "View booking information" : "Update booking details"}
            </DialogDescription>
          </DialogHeader>
          {dialogAction === "view" ? (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input defaultValue={selectedItem?.name || ""} id="user-name" />
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input type="email" defaultValue={selectedItem?.email || ""} id="user-email" />
                </div>
                {dialogAction === "add" && (
                  <div className="space-y-2">
                    <Label>Password *</Label>
                    <Input type="password" placeholder="Minimum 8 characters" id="user-password" />
                  </div>
                )}
                {dialogAction === "edit" && (
                  <div className="space-y-2">
                    <Label>New Password (leave blank to keep current)</Label>
                    <Input type="password" placeholder="Minimum 8 characters" id="user-password" />
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input type="tel" defaultValue={selectedItem?.phone || ""} id="user-phone" />
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
                <Button onClick={async () => {
                  try {
                    const name = (document.getElementById("user-name") as HTMLInputElement)?.value
                    const email = (document.getElementById("user-email") as HTMLInputElement)?.value
                    const status = (document.getElementById("user-status") as HTMLSelectElement)?.value
                    const role = (document.getElementById("user-role") as HTMLSelectElement)?.value
                    const password = (document.getElementById("user-password") as HTMLInputElement)?.value
                    const phone = (document.getElementById("user-phone") as HTMLInputElement)?.value || ""

                    // Validation
                    if (!name || !email) {
                      toast.error("Validation Error", {
                        description: "Name and email are required fields",
                      })
                      return
                    }

                    if (dialogAction === "add") {
                      // Create new user via API
                      if (!password || password.length < 8) {
                        toast.error("Password Required", {
                          description: "Password must be at least 8 characters",
                        })
                        return
                      }

                      setIsLoadingUsers(true)
                      const response = await api.createUser({
                        name,
                        email,
                        password,
                        phone,
                        role: role as "user" | "admin" | "super_admin",
                      }) as { success: boolean; message: string; data: { user: any } }

                      if (response.success) {
                        toast.success("User added", { description: `New user ${name} has been created successfully` })
                        // Refresh users list
                        const usersResponse = await api.getUsers() as { success: boolean; data: { users: any[] } }
                        if (usersResponse.success && usersResponse.data?.users) {
                          const transformedUsers = usersResponse.data.users.map((user: any) => ({
                            id: user.id.toString(),
                            name: user.name,
                            email: user.email,
                            role: user.role,
                            bookings: user.totalTrips || 0,
                            status: user.isActive ? "active" : "inactive",
                            joined: user.memberSince ? new Date(user.memberSince).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                            totalSpent: parseFloat(user.totalSpent || 0),
                            lastLogin: user.lastLogin ? new Date(user.lastLogin).toISOString().split('T')[0] : "",
                            phone: user.phone || "",
                            membershipTier: user.membershipTier || "Silver",
                          }))
                          setAllUsers(transformedUsers)
                        }
                      }
                    } else {
                      // Update existing user via API
                      setIsLoadingUsers(true)
                      const response = await api.updateUser(selectedItem?.id, {
                        name,
                        email,
                        phone,
                        role: role as "user" | "admin" | "super_admin",
                        isActive: status === "active",
                        ...(password && password.length >= 8 && { password }),
                      }) as { success: boolean; message: string; data: { user: any } }

                      if (response.success) {
                        toast.success("User updated", { description: `User ${name} has been updated successfully` })
                        // Refresh users list
                        const usersResponse = await api.getUsers() as { success: boolean; data: { users: any[] } }
                        if (usersResponse.success && usersResponse.data?.users) {
                          const transformedUsers = usersResponse.data.users.map((user: any) => ({
                            id: user.id.toString(),
                            name: user.name,
                            email: user.email,
                            role: user.role,
                            bookings: user.totalTrips || 0,
                            status: user.isActive ? "active" : "inactive",
                            joined: user.memberSince ? new Date(user.memberSince).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                            totalSpent: parseFloat(user.totalSpent || 0),
                            lastLogin: user.lastLogin ? new Date(user.lastLogin).toISOString().split('T')[0] : "",
                            phone: user.phone || "",
                            membershipTier: user.membershipTier || "Silver",
                          }))
                          setAllUsers(transformedUsers)
                        }
                      }
                    }
                    setDialogType(null)
                    setDialogAction(null)
                    setSelectedItem(null)
                  } catch (error: any) {
                    console.error("Error saving user:", error)
                    toast.error("Failed to save user", {
                      description: error.message || "An error occurred while saving the user",
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

