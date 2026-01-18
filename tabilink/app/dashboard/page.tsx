"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { toast } from "sonner"
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
  Car,
  Navigation,
  Compass,
  Building2,
  UtensilsCrossed,
  Camera,
  ShoppingBag,
  Activity,
  Search,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"
import { useTranslation } from "@/contexts/TranslationContext"
import { useTheme } from "@/contexts/ThemeContext"
import { useRole } from "@/contexts/RoleContext"
import {
  type Booking,
  type SavedTrip,
  type PaymentMethod,
  type Notification,
} from "@/lib/mock-data"
import api from "@/lib/api"

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
      return "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    case "pending":
      return "bg-gray-300 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
    case "cancelled":
      return "bg-gray-400 text-gray-900 dark:bg-gray-600 dark:text-gray-100"
    case "completed":
      return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300"
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

interface ModifyBookingFormProps {
  booking: Booking
  onSave: (changes: { checkIn?: string; checkOut?: string; travelers?: number; hotelRoomType?: string }) => void
  onCancel: () => void
  t: ReturnType<typeof useTranslation>['t']
}

function ModifyBookingForm({ booking, onSave, onCancel, t }: ModifyBookingFormProps) {
  const [checkIn, setCheckIn] = useState<Date | undefined>(
    booking.checkIn ? new Date(booking.checkIn) : undefined
  )
  const [checkOut, setCheckOut] = useState<Date | undefined>(
    booking.checkOut ? new Date(booking.checkOut) : undefined
  )
  const [travelers, setTravelers] = useState<string>(
    booking.travelers?.toString() || "1"
  )
  const [hotelRoomType, setHotelRoomType] = useState<string>(
    (booking as any).hotelRoomType || "Standard"
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      checkIn: checkIn?.toISOString().split('T')[0],
      checkOut: checkOut?.toISOString().split('T')[0],
      travelers: parseInt(travelers) || 1,
      hotelRoomType: booking.type === 'hotel' ? hotelRoomType : undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {booking.checkIn && booking.checkOut && (
        <>
          <div className="space-y-2">
            <Label>{t("checkIn")}</Label>
            <DatePicker
              date={checkIn}
              onSelect={setCheckIn}
              placeholder={t("chooseDate")}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label>{t("checkOut")}</Label>
            <DatePicker
              date={checkOut}
              onSelect={setCheckOut}
              placeholder={t("chooseDate")}
              className="w-full"
            />
          </div>
        </>
      )}
      {booking.travelers !== undefined && (
        <div className="space-y-2">
          <Label>{t("travelers")}</Label>
          <Input
            type="number"
            min="1"
            value={travelers || "1"}
            onChange={(e) => setTravelers(e.target.value)}
            className="w-full"
          />
        </div>
      )}
      {booking.type === 'hotel' && (
        <div className="space-y-2">
          <Label>{t("roomType") || "Room Type"}</Label>
          <select
            value={hotelRoomType}
            onChange={(e) => setHotelRoomType(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="Standard">Standard Room</option>
            <option value="Deluxe">Deluxe Room</option>
            <option value="Suite">Executive Suite</option>
            <option value="Ocean View Suite">Ocean View Suite</option>
          </select>
        </div>
      )}
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t("cancel")}
        </Button>
        <Button type="submit">
          {t("saveChanges")}
        </Button>
      </div>
    </form>
  )
}

function DashboardContent() {
  const searchParams = useSearchParams()
  const { t } = useTranslation()
  const { user, hasRole } = useRole()
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Redirect admin/super admin to their own dashboards
  useEffect(() => {
    if (user) {
      if (hasRole(["super_admin"])) {
        router.push("/super-admin/dashboard")
        return
      } else if (hasRole(["admin"])) {
        router.push("/admin/dashboard")
        return
      }
    }
  }, [user, hasRole, router])
  const [activeTab, setActiveTab] = useState<"discounts" | "history">("discounts")
  const [sidebarTab, setSidebarTab] = useState<string | null>(null)

  // User profile data from API
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)

  // Notifications, payment methods, saved trips - empty for now
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])

  // Hooks for bookings section
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoadingBookings, setIsLoadingBookings] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("date")
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isModifyDialogOpen, setIsModifyDialogOpen] = useState(false)

  // Hooks for saved trips section
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([])

  // Hooks for settings section
  const [currency, setCurrency] = useState("USD")
  const [language, setLanguage] = useState("English")
  const { theme, setTheme } = useTheme()
  const [emailNotif, setEmailNotif] = useState(true)
  const [smsNotif, setSmsNotif] = useState(false)
  const [pushNotif, setPushNotif] = useState(true)

  // Profile form state
  const [profileName, setProfileName] = useState("")
  const [profilePhone, setProfilePhone] = useState("")
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  // Hooks for notifications section
  const [filterType, setFilterType] = useState<"all" | "unread">("all")

  // Hooks for transportation booking
  const [selectedTransport, setSelectedTransport] = useState<string | null>(null)
  const [flightFrom, setFlightFrom] = useState("")
  const [flightTo, setFlightTo] = useState("")
  const [flightDate, setFlightDate] = useState<Date>()
  const [flightReturnDate, setFlightReturnDate] = useState<Date>()
  const [flightType, setFlightType] = useState<"one-way" | "round-trip">("one-way")
  const [trainFrom, setTrainFrom] = useState("")
  const [trainTo, setTrainTo] = useState("")
  const [trainDate, setTrainDate] = useState<Date>()
  const [busFrom, setBusFrom] = useState("")
  const [busTo, setBusTo] = useState("")
  const [busDate, setBusDate] = useState<Date>()
  const [cabFrom, setCabFrom] = useState("")
  const [cabTo, setCabTo] = useState("")
  const [cabDate, setCabDate] = useState<Date>()
  const [cabTime, setCabTime] = useState("")
  const [passengers, setPassengers] = useState("1")

  // Fetch user profile and bookings on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
        if (!token) {
          setIsLoggedIn(false)
          setIsLoadingProfile(false)
          setIsLoadingBookings(false)
          return
        }

        setIsLoggedIn(true)

        // Fetch user profile
        try {
          const profileResponse = await api.getMe() as { success: boolean; data: { user: any } }
          if (profileResponse.success && profileResponse.data.user) {
            const profile = profileResponse.data.user
            setUserProfile(profile)
            // Initialize form state with profile data
            setProfileName(profile?.name || user?.name || "")
            setProfilePhone(profile?.phone || "")
            // Set preferences if available
            if (profile.preferences) {
              setCurrency(profile.preferences.currency || "USD")
              setLanguage(profile.preferences.language || "English")
              if (profile.preferences.notifications) {
                setEmailNotif(profile.preferences.notifications.email ?? true)
                setSmsNotif(profile.preferences.notifications.sms ?? false)
                setPushNotif(profile.preferences.notifications.push ?? true)
              }
            }
          }
        } catch (error) {
          console.error("Error fetching user profile:", error)
        } finally {
          setIsLoadingProfile(false)
        }

        // Fetch bookings
        try {
          const bookingsResponse = await api.getBookings() as { success: boolean; data: { bookings: any[] } }
          if (bookingsResponse.success && bookingsResponse.data.bookings) {
            // Transform backend bookings to frontend format
            const transformedBookings: Booking[] = bookingsResponse.data.bookings.map((b: any) => ({
              id: b.bookingId || b.id.toString(),
              type: b.type === 'hotel' ? 'hotel' : 'travel',
              title: b.hotel?.name || b.travelPackage?.title || 'Booking',
              destination: b.hotel
                ? `${b.hotel.locationCity}, ${b.hotel.locationCountry}`
                : b.travelPackage?.destination?.join(', ') || 'Unknown',
              checkIn: b.checkIn ? new Date(b.checkIn).toISOString().split('T')[0] : undefined,
              checkOut: b.checkOut ? new Date(b.checkOut).toISOString().split('T')[0] : undefined,
              travelers: b.travelers || 1,
              status: b.status === 'confirmed' ? 'confirmed' :
                b.status === 'pending' ? 'pending' :
                  b.status === 'cancelled' ? 'cancelled' :
                    b.status === 'completed' ? 'completed' : 'pending',
              amount: parseFloat(b.total?.toString() || '0'),
              bookingDate: b.bookingDate ? new Date(b.bookingDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              image: b.hotel?.images?.[0] || b.travelPackage?.images?.[0] || 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80',
              details: {
                hotelName: b.hotel?.name,
                packageName: b.travelPackage?.title,
              },
            }))
            setBookings(transformedBookings)
          }
        } catch (error) {
          console.error("Error fetching bookings:", error)
        } finally {
          setIsLoadingBookings(false)
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        setIsLoadingProfile(false)
        setIsLoadingBookings(false)
      }
    }

    fetchUserData()
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    const stored = localStorage.getItem("tabilinkDemoLoggedIn")
    const token = localStorage.getItem("token")
    setIsLoggedIn(stored === "1" || !!token)
  }, [user])

  useEffect(() => {
    const tab = searchParams.get("tab")
    setSidebarTab(tab)
  }, [searchParams])

  // Calculate stats from bookings - defined early so they can be used throughout the component
  const totalBookings = bookings.length
  const upcomingBookings = bookings.filter(b => b.status === "confirmed" || b.status === "pending").length
  const totalSaved = savedTrips.length
  const totalSpent = bookings.reduce((sum, b) => sum + b.amount, 0)

  // User stats from API - computed values that depend on userProfile and bookings
  const userTotalTrips = userProfile?.totalTrips || totalBookings
  const userTotalSpent = userProfile?.totalSpent ? parseFloat(userProfile.totalSpent.toString()) : totalSpent
  const userLoyaltyPoints = userProfile?.loyaltyPoints || 0
  const userMembershipTier = userProfile?.membershipTier || "Silver"
  const userMemberSince = userProfile?.memberSince
    ? new Date(userProfile.memberSince).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : userProfile?.createdAt
      ? new Date(userProfile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      : "N/A"

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

  // Handler for updating profile
  const handleUpdateProfile = async () => {
    if (!profileName.trim()) {
      toast.error("Name is required")
      return
    }

    setIsUpdatingProfile(true)
    try {
      const updateData: { name?: string; phone?: string } = {}
      if (profileName.trim()) updateData.name = profileName.trim()
      if (profilePhone.trim()) updateData.phone = profilePhone.trim()

      const response = await api.updateProfile(updateData) as { success: boolean; message?: string; data?: { user: any } }

      if (response.success) {
        // Update local state
        if (response.data?.user) {
          setUserProfile(response.data.user)
        }
        toast.success("Profile updated successfully", {
          description: "Your personal information has been saved.",
        })
      } else {
        throw new Error(response.message || "Failed to update profile")
      }
    } catch (error: any) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile", {
        description: error.message || "Please try again later.",
      })
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  // Handler for changing password
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required")
      return
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters")
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    setIsUpdatingPassword(true)
    try {
      const response = await api.changePassword({
        currentPassword,
        newPassword,
      }) as { success: boolean; message?: string }

      if (response.success) {
        // Clear password fields
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        toast.success("Password updated successfully", {
          description: "Your password has been changed.",
        })
      } else {
        throw new Error(response.message || "Failed to change password")
      }
    } catch (error: any) {
      console.error("Error changing password:", error)
      toast.error("Failed to change password", {
        description: error.message || "Please check your current password and try again.",
      })
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  // Hooks for plan your trip section
  const [selectedPlanOption, setSelectedPlanOption] = useState<string | null>(null)

  // Mock Data for each subsection
  const mockTripItineraries = [
    {
      id: 1,
      title: "European Adventure",
      duration: "7 Days",
      cities: ["Paris", "Rome", "Barcelona"],
      budget: "$2,500",
      travelers: 2,
      status: "Draft",
    },
    {
      id: 2,
      title: "Tokyo Discovery",
      duration: "5 Days",
      cities: ["Tokyo"],
      budget: "$1,800",
      travelers: 1,
      status: "Active",
    },
    {
      id: 3,
      title: "Bali Paradise",
      duration: "10 Days",
      cities: ["Bali"],
      budget: "$1,200",
      travelers: 2,
      status: "Completed",
    },
  ]

  const mockDestinations = [
    {
      id: 1,
      name: "Paris, France",
      rating: 4.8,
      reviews: 12500,
      bestTime: "April - June",
      priceRange: "$$$",
      highlights: ["Eiffel Tower", "Louvre Museum", "Notre-Dame"],
    },
    {
      id: 2,
      name: "Tokyo, Japan",
      rating: 4.9,
      reviews: 9800,
      bestTime: "March - May",
      priceRange: "$$$$",
      highlights: ["Shibuya", "Tokyo Skytree", "Senso-ji Temple"],
    },
    {
      id: 3,
      name: "Bali, Indonesia",
      rating: 4.7,
      reviews: 15200,
      bestTime: "April - October",
      priceRange: "$$",
      highlights: ["Ubud", "Tanah Lot", "Rice Terraces"],
    },
    {
      id: 4,
      name: "New York, USA",
      rating: 4.6,
      reviews: 18900,
      bestTime: "May - September",
      priceRange: "$$$$",
      highlights: ["Times Square", "Central Park", "Statue of Liberty"],
    },
  ]

  const mockRestaurants = [
    {
      id: 1,
      name: "Le Comptoir du Relais",
      cuisine: "French",
      rating: 4.8,
      priceRange: "$$$$",
      location: "Paris, France",
      specialty: "Traditional French cuisine",
    },
    {
      id: 2,
      name: "Sukiyabashi Jiro",
      cuisine: "Japanese",
      rating: 4.9,
      priceRange: "$$$$$",
      location: "Tokyo, Japan",
      specialty: "Sushi omakase",
    },
    {
      id: 3,
      name: "Locavore",
      cuisine: "Indonesian",
      rating: 4.7,
      priceRange: "$$$",
      location: "Ubud, Bali",
      specialty: "Modern Indonesian",
    },
    {
      id: 4,
      name: "Eleven Madison Park",
      cuisine: "American",
      rating: 4.9,
      priceRange: "$$$$$",
      location: "New York, USA",
      specialty: "Fine dining",
    },
  ]

  const mockActivities = [
    {
      id: 1,
      name: "Eiffel Tower Skip-the-Line",
      category: "Attractions",
      duration: "2 hours",
      price: "$45",
      rating: 4.8,
      location: "Paris, France",
    },
    {
      id: 2,
      name: "Tokyo Food Tour",
      category: "Food & Drink",
      duration: "3 hours",
      price: "$85",
      rating: 4.9,
      location: "Tokyo, Japan",
    },
    {
      id: 3,
      name: "Bali Waterfall Hiking",
      category: "Adventure",
      duration: "4 hours",
      price: "$65",
      rating: 4.7,
      location: "Bali, Indonesia",
    },
    {
      id: 4,
      name: "Central Park Bike Tour",
      category: "Outdoor",
      duration: "2.5 hours",
      price: "$55",
      rating: 4.6,
      location: "New York, USA",
    },
  ]

  const mockShopping = [
    {
      id: 1,
      name: "Champs-Élysées",
      type: "Shopping District",
      location: "Paris, France",
      highlights: ["Luxury brands", "Department stores", "Boutiques"],
    },
    {
      id: 2,
      name: "Ginza District",
      type: "Shopping District",
      location: "Tokyo, Japan",
      highlights: ["Electronics", "Luxury goods", "Traditional crafts"],
    },
    {
      id: 3,
      name: "Ubud Art Market",
      type: "Local Market",
      location: "Ubud, Bali",
      highlights: ["Handicrafts", "Artwork", "Local souvenirs"],
    },
    {
      id: 4,
      name: "Fifth Avenue",
      type: "Shopping District",
      location: "New York, USA",
      highlights: ["Designer stores", "Flagship stores", "Luxury brands"],
    },
  ]

  const mockAttractions = [
    {
      id: 1,
      name: "Eiffel Tower",
      type: "Landmark",
      location: "Paris, France",
      rating: 4.8,
      price: "From $28",
      skipLine: true,
    },
    {
      id: 2,
      name: "Tokyo Skytree",
      type: "Observation Deck",
      location: "Tokyo, Japan",
      rating: 4.7,
      price: "From $18",
      skipLine: true,
    },
    {
      id: 3,
      name: "Tanah Lot Temple",
      type: "Temple",
      location: "Bali, Indonesia",
      rating: 4.6,
      price: "From $12",
      skipLine: false,
    },
    {
      id: 4,
      name: "Statue of Liberty",
      type: "Monument",
      location: "New York, USA",
      rating: 4.9,
      price: "From $24",
      skipLine: true,
    },
  ]

  const mockBestSellingDestinations = [
    {
      id: 1,
      name: "Bali, Indonesia",
      image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&h=600&fit=crop",
      price: "From $899",
      originalPrice: "$1,299",
      discount: 31,
      rating: 4.8,
      reviews: 12450,
      duration: "7 days",
      highlights: ["Beaches", "Temples", "Rice Terraces"],
      icon: Globe,
      iconColor: "from-blue-500 to-cyan-500",
    },
    {
      id: 2,
      name: "Tokyo, Japan",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop",
      price: "From $1,299",
      originalPrice: "$1,799",
      discount: 28,
      rating: 4.9,
      reviews: 18920,
      duration: "5 days",
      highlights: ["Culture", "Food", "Technology"],
      icon: Camera,
      iconColor: "from-purple-500 to-pink-500",
    },
    {
      id: 3,
      name: "Paris, France",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop",
      price: "From $1,199",
      originalPrice: "$1,599",
      discount: 25,
      rating: 4.7,
      reviews: 15680,
      duration: "6 days",
      highlights: ["Art", "History", "Cuisine"],
      icon: Star,
      iconColor: "from-amber-500 to-orange-500",
    },
    {
      id: 4,
      name: "Santorini, Greece",
      image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&h=600&fit=crop",
      price: "From $1,499",
      originalPrice: "$1,999",
      discount: 25,
      rating: 4.9,
      reviews: 11230,
      duration: "5 days",
      highlights: ["Sunsets", "Beaches", "Wine"],
      icon: Heart,
      iconColor: "from-rose-500 to-red-500",
    },
    {
      id: 5,
      name: "Dubai, UAE",
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop",
      price: "From $1,399",
      originalPrice: "$1,899",
      discount: 26,
      rating: 4.6,
      reviews: 9870,
      duration: "4 days",
      highlights: ["Luxury", "Shopping", "Desert"],
      icon: Building2,
      iconColor: "from-indigo-500 to-purple-500",
    },
    {
      id: 6,
      name: "New York, USA",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop",
      price: "From $1,099",
      originalPrice: "$1,499",
      discount: 27,
      rating: 4.8,
      reviews: 20340,
      duration: "5 days",
      highlights: ["Broadway", "Museums", "Shopping"],
      icon: MapPin,
      iconColor: "from-green-500 to-emerald-500",
    },
  ]

  // Render content based on sidebar tab
  if (sidebarTab === "plan-trip") {
    const planOptions = [
      {
        id: "trip-planner",
        title: "Trip Planner",
        description: "Create your complete itinerary with day-by-day plans",
        icon: Navigation,
        color: "from-violet-500 to-purple-600",
        data: mockTripItineraries,
      },
      {
        id: "explore-destinations",
        title: "Explore Destinations",
        description: "Discover amazing places around the world",
        icon: Compass,
        color: "from-cyan-500 to-blue-600",
        data: mockDestinations,
      },
      {
        id: "restaurants",
        title: "Restaurants",
        description: "Find the best dining options and local cuisine",
        icon: UtensilsCrossed,
        color: "from-amber-500 to-orange-600",
        data: mockRestaurants,
      },
      {
        id: "activities",
        title: "Activities",
        description: "Things to do, experiences, and adventure tours",
        icon: Activity,
        color: "from-emerald-500 to-teal-600",
        data: mockActivities,
      },
      {
        id: "shopping",
        title: "Shopping",
        description: "Best shopping destinations and local markets",
        icon: ShoppingBag,
        color: "from-rose-500 to-pink-600",
        data: mockShopping,
      },
      {
        id: "attractions",
        title: "Attractions",
        description: "Tourist spots, landmarks, and must-visit places",
        icon: Camera,
        color: "from-blue-500 to-indigo-600",
        data: mockAttractions,
      },
    ]

    return (
      <div className="min-h-screen bg-background">
        <div className="container space-y-12 py-16 page-content relative">
          {/* Hero Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-sm font-semibold text-secondary-foreground mb-4 border border-border">
              <Compass className="h-4 w-4 text-secondary-foreground" />
              <span>Plan Your Trip</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">
              {t("planYourPerfectTrip")}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("everythingYouNeed")}
            </p>
          </div>

          {!selectedPlanOption ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {planOptions.map((option, index) => {
                const Icon = option.icon
                return (
                  <Card
                    key={option.id}
                    className="group relative overflow-hidden border-2 border-border hover:border-primary transition-all duration-300 cursor-pointer bg-card h-full shadow-sm hover:shadow-xl"
                    onClick={() => setSelectedPlanOption(option.id)}
                  >
                    <CardContent className="p-5">
                      <div className="space-y-4">
                        {/* Icon Section */}
                        <div className="flex items-center justify-between">
                          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${option.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className="h-7 w-7" />
                          </div>
                          <div className="h-8 w-8 rounded-full bg-muted group-hover:bg-muted/80 transition-colors"></div>
                        </div>

                        {/* Content */}
                        <div className="space-y-2">
                          <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                            {option.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed text-sm">
                            {option.description}
                          </p>
                        </div>

                        {/* Data Count */}
                        <div className="pt-3 border-t border-border">
                          <p className="text-xs font-semibold text-muted-foreground">
                            {option.data.length} {option.data.length === 1 ? t("item") : t("items")} {t("itemsAvailable")}
                          </p>
                        </div>

                        {/* CTA */}
                        <div className="pt-3">
                          <Button
                            variant="ghost"
                            className="w-full justify-start p-0 h-auto hover:bg-transparent text-foreground font-semibold text-sm group-hover:gap-3 transition-all"
                            onClick={() => {
                              toast.success(`Exploring ${option.title}`, {
                                description: `Discover ${option.data.length} ${option.data.length === 1 ? "item" : "items"} available`,
                              })
                              setSelectedPlanOption(option.id)
                            }}
                          >
                            <span>Explore Now</span>
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="max-w-6xl mx-auto">
              {(() => {
                const option = planOptions.find(o => o.id === selectedPlanOption)
                if (!option) return null
                const Icon = option.icon

                // Render different content based on option type
                const renderContent = () => {
                  if (option.id === "trip-planner") {
                    return (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-2xl font-bold text-foreground">Your Itineraries</h2>
                          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                            <Plus className="h-4 w-4 mr-2" />
                            Create New
                          </Button>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {mockTripItineraries.map((item) => (
                            <Card key={item.id} className="border-2 border-border hover:border-primary transition-all">
                              <CardHeader>
                                <div className="flex items-start justify-between">
                                  <CardTitle className="text-lg text-foreground">{item.title}</CardTitle>
                                  <span className={`text-xs px-2 py-1 rounded-full ${item.status === 'Active' ? 'bg-primary text-primary-foreground' :
                                    item.status === 'Completed' ? 'bg-secondary text-secondary-foreground' :
                                      'bg-muted text-muted-foreground'
                                    }`}>
                                    {item.status}
                                  </span>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Calendar className="h-4 w-4" />
                                  <span>{item.duration}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <MapPin className="h-4 w-4" />
                                  <span>{item.cities.join(", ")}</span>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-border">
                                  <span className="text-sm text-muted-foreground">Budget</span>
                                  <span className="font-bold text-foreground">{item.budget}</span>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )
                  }

                  if (option.id === "explore-destinations") {
                    return (
                      <div className="space-y-8">
                        {/* Best Selling Destinations Section */}
                        <div className="space-y-6">
                          <div className="text-center">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                              Best Selling Destinations
                            </h2>
                          </div>

                          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch">
                            {mockBestSellingDestinations.map((destination) => {
                              const Icon = destination.icon
                              return (
                                <Card
                                  key={destination.id}
                                  className="group relative overflow-hidden border-2 border-border hover:border-primary transition-all duration-300 bg-card shadow-sm hover:shadow-xl h-full flex flex-col"
                                >
                                  <div className="relative h-48 w-full overflow-hidden flex-shrink-0">
                                    <Image
                                      src={destination.image}
                                      alt={destination.name}
                                      fill
                                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute top-4 right-4 flex items-center gap-2">
                                      <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${destination.iconColor} text-white shadow-lg flex-shrink-0`}>
                                        <Icon className="h-5 w-5" />
                                      </div>
                                      <div className="bg-card/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex-shrink-0">
                                        <span className="text-sm font-bold text-foreground">{destination.discount}% OFF</span>
                                      </div>
                                    </div>
                                  </div>
                                  <CardContent className="p-6 flex flex-col flex-1">
                                    <div className="space-y-2 flex-shrink-0">
                                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                        {destination.name}
                                      </h3>
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <div className="flex items-center gap-1 flex-shrink-0">
                                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                          <span className="text-sm font-semibold text-foreground">{destination.rating}</span>
                                        </div>
                                        <span className="text-muted-foreground/50 flex-shrink-0">•</span>
                                        <span className="text-sm text-muted-foreground">{destination.reviews ? destination.reviews.toLocaleString() : "0"} reviews</span>
                                        <span className="text-muted-foreground/50 flex-shrink-0">•</span>
                                        <span className="text-sm text-muted-foreground">{destination.duration}</span>
                                      </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 my-4 min-h-[2.5rem]">
                                      {destination.highlights.map((highlight, idx) => (
                                        <span
                                          key={idx}
                                          className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full border border-border"
                                        >
                                          {highlight}
                                        </span>
                                      ))}
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-border mt-auto">
                                      <div className="space-y-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <span className="text-2xl font-bold text-foreground">{destination.price}</span>
                                          <span className="text-sm text-muted-foreground line-through">{destination.originalPrice}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">per person</p>
                                      </div>
                                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto whitespace-nowrap">
                                        <ArrowRight className="h-4 w-4 mr-2" />
                                        Book Now
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              )
                            })}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-2xl font-bold text-foreground">Popular Destinations</h2>
                          <Button variant="outline" className="border-2 border-primary text-foreground hover:bg-primary hover:text-primary-foreground">
                            <Search className="h-4 w-4 mr-2" />
                            Search
                          </Button>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          {mockDestinations.map((item) => (
                            <Card key={item.id} className="border-2 border-border hover:border-primary transition-all">
                              <CardHeader>
                                <div className="flex items-start justify-between">
                                  <div>
                                    <CardTitle className="text-xl text-gray-900 mb-1">{item.name}</CardTitle>
                                    <div className="flex items-center gap-2">
                                      <Star className="h-4 w-4 fill-gray-900 text-gray-900" />
                                      <span className="text-sm font-semibold text-gray-700">{item.rating}</span>
                                      <span className="text-sm text-gray-500">({item.reviews ? item.reviews.toLocaleString() : "0"} reviews)</span>
                                    </div>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <div className="flex items-center gap-4 text-sm">
                                  <span className="text-gray-600">Best Time:</span>
                                  <span className="font-medium text-gray-900">{item.bestTime}</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                  <span className="text-gray-600">Price Range:</span>
                                  <span className="font-medium text-gray-900">{item.priceRange}</span>
                                </div>
                                <div className="pt-2 border-t border-gray-200">
                                  <p className="text-xs text-gray-600 mb-2">Highlights:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {item.highlights.map((highlight, idx) => (
                                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                                        {highlight}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )
                  }

                  if (option.id === "restaurants") {
                    return (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-2xl font-bold text-gray-900">{t("topRestaurants")}</h2>
                          <Button variant="outline" className="border-2 border-gray-900 text-gray-900">
                            <Search className="h-4 w-4 mr-2" />
                            Filter
                          </Button>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          {mockRestaurants.map((item) => (
                            <Card key={item.id} className="border-2 border-border hover:border-primary transition-all">
                              <CardHeader>
                                <div className="flex items-start justify-between">
                                  <div>
                                    <CardTitle className="text-xl text-gray-900 mb-1">{item.name}</CardTitle>
                                    <div className="flex items-center gap-3 text-sm">
                                      <span className="text-gray-600">{item.cuisine}</span>
                                      <span className="text-gray-400">•</span>
                                      <span className="text-gray-600">{item.location}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-gray-900 text-gray-900" />
                                    <span className="text-sm font-semibold text-gray-700">{item.rating}</span>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <div className="flex items-center gap-4 text-sm">
                                  <span className="text-gray-600">Price:</span>
                                  <span className="font-medium text-gray-900">{item.priceRange}</span>
                                </div>
                                <div className="pt-2 border-t border-gray-200">
                                  <p className="text-sm text-gray-700">
                                    <span className="font-medium">Specialty:</span> {item.specialty}
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )
                  }

                  if (option.id === "activities") {
                    return (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-2xl font-bold text-gray-900">{t("popularActivities")}</h2>
                          <Button
                            variant="outline"
                            className="border-2 border-gray-900 text-gray-900 hover-lift"
                            onClick={() => {
                              toast.success("Browsing all activities", {
                                description: "Explore our complete activity list",
                              })
                              router.push("/dashboard?tab=activities")
                            }}
                          >
                            <Search className="h-4 w-4 mr-2" />
                            {t("browseAll")}
                          </Button>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          {mockActivities.map((item) => (
                            <Card key={item.id} className="border-2 border-border hover:border-primary transition-all">
                              <CardHeader>
                                <div className="flex items-start justify-between">
                                  <div>
                                    <CardTitle className="text-xl text-gray-900 mb-1">{item.name}</CardTitle>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <span>{item.category}</span>
                                      <span>•</span>
                                      <span>{item.duration}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-gray-900 text-gray-900" />
                                    <span className="text-sm font-semibold text-gray-700">{item.rating}</span>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <MapPin className="h-4 w-4" />
                                  <span>{item.location}</span>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-border">
                                  <span className="text-sm text-muted-foreground">Price</span>
                                  <span className="font-bold text-foreground">{item.price}</span>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )
                  }

                  if (option.id === "shopping") {
                    return (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-2xl font-bold text-gray-900">{t("shoppingDestinations")}</h2>
                          <Button
                            variant="outline"
                            className="border-2 border-gray-900 text-gray-900 hover-lift"
                            onClick={() => {
                              toast.success("Exploring shopping destinations", {
                                description: "Browse our curated shopping locations",
                              })
                              router.push("/dashboard?tab=shopping")
                            }}
                          >
                            <Search className="h-4 w-4 mr-2" />
                            Explore
                          </Button>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          {mockShopping.map((item) => (
                            <Card key={item.id} className="border-2 border-border hover:border-primary transition-all">
                              <CardHeader>
                                <div className="flex items-start justify-between">
                                  <div>
                                    <CardTitle className="text-xl text-gray-900 mb-1">{item.name}</CardTitle>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <span>{item.type}</span>
                                      <span>•</span>
                                      <MapPin className="h-4 w-4" />
                                      <span>{item.location}</span>
                                    </div>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="pt-2">
                                  <p className="text-xs text-gray-600 mb-2">Highlights:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {item.highlights.map((highlight, idx) => (
                                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                                        {highlight}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )
                  }

                  if (option.id === "attractions") {
                    return (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-2xl font-bold text-gray-900">{t("mustVisitAttractions")}</h2>
                          <Button
                            variant="outline"
                            className="border-2 border-gray-900 text-gray-900 hover-lift"
                            onClick={() => {
                              toast.success("Viewing all attractions", {
                                description: "Explore our complete list of attractions",
                              })
                              router.push("/dashboard?tab=attractions")
                            }}
                          >
                            <Search className="h-4 w-4 mr-2" />
                            {t("viewAll")}
                          </Button>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          {mockAttractions.map((item) => (
                            <Card key={item.id} className="border-2 border-border hover:border-primary transition-all">
                              <CardHeader>
                                <div className="flex items-start justify-between">
                                  <div>
                                    <CardTitle className="text-xl text-gray-900 mb-1">{item.name}</CardTitle>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <span>{item.type}</span>
                                      <span>•</span>
                                      <MapPin className="h-4 w-4" />
                                      <span>{item.location}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-gray-900 text-gray-900" />
                                    <span className="text-sm font-semibold text-gray-700">{item.rating}</span>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                  <div>
                                    <span className="text-sm text-gray-600">Price</span>
                                    <p className="font-bold text-gray-900">{item.price}</p>
                                  </div>
                                  {item.skipLine && (
                                    <span className="px-3 py-1 bg-gray-900 text-white text-xs font-semibold rounded-full">
                                      Skip-the-Line
                                    </span>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )
                  }

                  return null
                }

                return (
                  <div className="space-y-8">
                    {/* Header Section */}
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedPlanOption(null)}
                        className="hover-lift h-12 w-12 rounded-full border-2 border-border"
                      >
                        <ArrowRight className="h-5 w-5 rotate-180 text-foreground" />
                      </Button>
                      <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${option.color} text-white shadow-lg`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <div className="flex-1">
                        <h1 className="text-4xl font-bold mb-2 text-foreground">{option.title}</h1>
                        <p className="text-lg text-muted-foreground">{option.description}</p>
                      </div>
                    </div>

                    {/* Content Section */}
                    {renderContent()}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
                      <Button
                        className="hover-lift flex-1 h-14 text-lg bg-primary text-primary-foreground hover:bg-primary/90"
                        size="lg"
                        onClick={() => {
                          toast.success("Planning started", {
                            description: "Let's plan your perfect trip!",
                          })
                          setSelectedPlanOption(null)
                          setSidebarTab("planning")
                        }}
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Start Planning
                      </Button>
                      <Button variant="outline" className="hover-lift h-14 text-lg border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white" size="lg" asChild>
                        <Link href="/travel">
                          <Search className="h-5 w-5 mr-2" />
                          Browse More
                        </Link>
                      </Button>
                    </div>
                  </div>
                )
              })()}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Transportation booking handlers
  const handleBookFlight = () => {
    if (!flightFrom || !flightTo || !flightDate) {
      toast.error("Please fill all required fields", {
        description: "From, To, and Departure Date are required",
      })
      return
    }

    const newBookingId = `BK-${new Date().getFullYear()}-${String(bookings.length + 1).padStart(3, '0')}`
    const baseAmount = flightType === "round-trip" ? 450 : 250
    const totalAmount = baseAmount * parseInt(passengers || "1")

    const newBooking: Booking = {
      id: newBookingId,
      type: "flight",
      title: `Flight: ${flightFrom} to ${flightTo}`,
      destination: `${flightFrom} → ${flightTo}`,
      checkIn: flightDate.toISOString().split('T')[0],
      checkOut: flightReturnDate?.toISOString().split('T')[0],
      travelers: parseInt(passengers || "1"),
      status: "pending",
      amount: totalAmount,
      bookingDate: new Date().toISOString().split('T')[0],
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80",
      details: {
        flightNumber: `FL-${Math.floor(Math.random() * 10000)}`,
      },
    }

    setBookings(prev => [newBooking, ...prev])
    toast.success("Flight booking created", {
      description: `${flightFrom} to ${flightTo} - ${flightType === "round-trip" ? "Round Trip" : "One Way"}`,
    })

    // Clear form
    setFlightFrom("")
    setFlightTo("")
    setFlightDate(undefined)
    setFlightReturnDate(undefined)
    setSelectedTransport(null)
    setSidebarTab("bookings")
  }

  const handleBookTrain = () => {
    if (!trainFrom || !trainTo || !trainDate) {
      toast.error("Please fill all required fields", {
        description: "From Station, To Station, and Journey Date are required",
      })
      return
    }

    const newBookingId = `BK-${new Date().getFullYear()}-${String(bookings.length + 1).padStart(3, '0')}`
    const totalAmount = 120 * parseInt(passengers || "1")

    const newBooking: Booking = {
      id: newBookingId,
      type: "flight",
      title: `Train: ${trainFrom} to ${trainTo}`,
      destination: `${trainFrom} → ${trainTo}`,
      checkIn: trainDate.toISOString().split('T')[0],
      travelers: parseInt(passengers || "1"),
      status: "pending",
      amount: totalAmount,
      bookingDate: new Date().toISOString().split('T')[0],
      image: "https://images.unsplash.com/photo-1556438064-2d7646166914?w=800&q=80",
      details: {
        flightNumber: `TR-${Math.floor(Math.random() * 10000)}`,
      },
    }

    setBookings(prev => [newBooking, ...prev])
    toast.success("Train booking created", {
      description: `${trainFrom} to ${trainTo}`,
    })

    // Clear form
    setTrainFrom("")
    setTrainTo("")
    setTrainDate(undefined)
    setSelectedTransport(null)
    setSidebarTab("bookings")
  }

  const handleBookBus = () => {
    if (!busFrom || !busTo || !busDate) {
      toast.error("Please fill all required fields", {
        description: "From City, To City, and Travel Date are required",
      })
      return
    }

    const newBookingId = `BK-${new Date().getFullYear()}-${String(bookings.length + 1).padStart(3, '0')}`
    const totalAmount = 80 * parseInt(passengers || "1")

    const newBooking: Booking = {
      id: newBookingId,
      type: "flight",
      title: `Bus: ${busFrom} to ${busTo}`,
      destination: `${busFrom} → ${busTo}`,
      checkIn: busDate.toISOString().split('T')[0],
      travelers: parseInt(passengers || "1"),
      status: "pending",
      amount: totalAmount,
      bookingDate: new Date().toISOString().split('T')[0],
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80",
      details: {
        flightNumber: `BS-${Math.floor(Math.random() * 10000)}`,
      },
    }

    setBookings(prev => [newBooking, ...prev])
    toast.success("Bus booking created", {
      description: `${busFrom} to ${busTo}`,
    })

    // Clear form
    setBusFrom("")
    setBusTo("")
    setBusDate(undefined)
    setSelectedTransport(null)
    setSidebarTab("bookings")
  }

  const handleBookCab = () => {
    if (!cabFrom || !cabTo || !cabDate || !cabTime) {
      toast.error("Please fill all required fields", {
        description: "Pickup Location, Drop Location, Date, and Time are required",
      })
      return
    }

    const newBookingId = `BK-${new Date().getFullYear()}-${String(bookings.length + 1).padStart(3, '0')}`
    const baseAmount = 50
    const distance = Math.floor(Math.random() * 30) + 10 // Mock distance
    const totalAmount = baseAmount + (distance * 2)

    const newBooking: Booking = {
      id: newBookingId,
      type: "flight",
      title: `Cab: ${cabFrom} to ${cabTo}`,
      destination: `${cabFrom} → ${cabTo}`,
      checkIn: cabDate.toISOString().split('T')[0],
      travelers: 1,
      status: "pending",
      amount: totalAmount,
      bookingDate: new Date().toISOString().split('T')[0],
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80",
      details: {
        flightNumber: `CB-${Math.floor(Math.random() * 10000)}`,
      },
    }

    setBookings(prev => [newBooking, ...prev])
    toast.success("Cab booking created", {
      description: `${cabFrom} to ${cabTo} at ${cabTime}`,
    })

    // Clear form
    setCabFrom("")
    setCabTo("")
    setCabDate(undefined)
    setCabTime("")
    setSelectedTransport(null)
    setSidebarTab("bookings")
  }

  // Render content based on sidebar tab
  if (sidebarTab === "transportation") {
    const transportOptions = [
      {
        id: "flights",
        title: t("flights"),
        description: t("bookDomesticInternational"),
        icon: Plane,
        iconColor: "text-blue-600",
        iconColorSelected: "text-blue-600",
        bgColor: "bg-blue-100",
        bgColorSelected: "bg-blue-200",
        borderColor: "border-blue-500",
      },
      {
        id: "trains",
        title: t("trains"),
        description: t("railwayTicketBooking"),
        icon: Train,
        iconColor: "text-green-600",
        iconColorSelected: "text-green-600",
        bgColor: "bg-green-100",
        bgColorSelected: "bg-green-200",
        borderColor: "border-green-500",
      },
      {
        id: "buses",
        title: t("buses"),
        description: t("intercityInterstateBuses"),
        icon: Bus,
        iconColor: "text-orange-600",
        iconColorSelected: "text-orange-600",
        bgColor: "bg-orange-100",
        bgColorSelected: "bg-orange-200",
        borderColor: "border-orange-500",
      },
      {
        id: "cabs",
        title: t("cabs"),
        description: t("taxiCarRentalsAirport"),
        icon: Car,
        iconColor: "text-purple-600",
        iconColorSelected: "text-purple-600",
        bgColor: "bg-purple-100",
        bgColorSelected: "bg-purple-200",
        borderColor: "border-purple-500",
      },
    ]

    return (
      <div className="container space-y-8 py-12 page-content relative max-w-5xl">
        <div className="flex flex-col gap-3 animate-fade-in-down">
          <div className="space-y-1">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Book Transportation
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold">{t("bookYourTransportation")}</h1>
            <p className="text-muted-foreground">
              {t("selectPreferredMode")}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {transportOptions.map((transport, index) => {
            const Icon = transport.icon
            const isSelected = selectedTransport === transport.id
            return (
              <Card
                key={transport.id}
                className={`hover-lift animate-fade-in-up transition-all cursor-pointer ${isSelected
                  ? `border-l-4 ${transport.borderColor} bg-primary/5 shadow-md`
                  : "border-l-4 border-l-transparent"
                  }`}
                onClick={() => setSelectedTransport(transport.id)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center transition-all ${isSelected ? transport.bgColorSelected : transport.bgColor
                        }`}>
                        <Icon className={`h-6 w-6 ${transport.iconColor}`} />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-semibold ${isSelected ? "text-primary" : ""}`}>
                            {transport.title}
                          </h3>
                          {isSelected && (
                            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{transport.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isSelected ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedTransport(null)
                            setFlightFrom("")
                            setFlightTo("")
                            setFlightDate(undefined)
                            setFlightReturnDate(undefined)
                            setTrainFrom("")
                            setTrainTo("")
                            setTrainDate(undefined)
                            setBusFrom("")
                            setBusTo("")
                            setBusDate(undefined)
                            setCabFrom("")
                            setCabTo("")
                            setCabDate(undefined)
                            setCabTime("")
                          }}
                          className="hover-lift"
                        >
                          Cancel
                        </Button>
                      ) : (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedTransport(transport.id)
                          }}
                          className="hover-lift"
                        >
                          Book Now
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Booking Forms */}
        {selectedTransport && (
          <Card className="border-l-4 border-l-primary bg-primary/5 shadow-md animate-fade-in-up">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {selectedTransport === "flights" && <Plane className="h-5 w-5 text-blue-500" />}
                  {selectedTransport === "trains" && <Train className="h-5 w-5 text-green-500" />}
                  {selectedTransport === "buses" && <Bus className="h-5 w-5 text-orange-500" />}
                  {selectedTransport === "cabs" && <Car className="h-5 w-5 text-red-500" />}
                  Book {selectedTransport === "flights" ? "Flight" : selectedTransport === "trains" ? "Train" : selectedTransport === "buses" ? "Bus" : "Cab"}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedTransport(null)
                    setFlightFrom("")
                    setFlightTo("")
                    setFlightDate(undefined)
                    setFlightReturnDate(undefined)
                    setTrainFrom("")
                    setTrainTo("")
                    setTrainDate(undefined)
                    setBusFrom("")
                    setBusTo("")
                    setBusDate(undefined)
                    setCabFrom("")
                    setCabTo("")
                    setCabDate(undefined)
                    setCabTime("")
                  }}
                  className="hover-lift"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {selectedTransport === "flights" && (
                <div className="space-y-4">
                  <div className="flex gap-2 mb-4">
                    <Button
                      variant={flightType === "one-way" ? "default" : "outline"}
                      onClick={() => setFlightType("one-way")}
                      className="hover-lift"
                    >
                      One Way
                    </Button>
                    <Button
                      variant={flightType === "round-trip" ? "default" : "outline"}
                      onClick={() => setFlightType("round-trip")}
                      className="hover-lift"
                    >
                      Round Trip
                    </Button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2">
                      <Label>From</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
                        <Input
                          placeholder="City or Airport"
                          value={flightFrom || ""}
                          onChange={(e) => setFlightFrom(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>To</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
                        <Input
                          placeholder="City or Airport"
                          value={flightTo || ""}
                          onChange={(e) => setFlightTo(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Departure Date</Label>
                      <DatePicker
                        date={flightDate}
                        onSelect={setFlightDate}
                        placeholder="Select date"
                        className="w-full"
                      />
                    </div>
                    {flightType === "round-trip" && (
                      <div className="space-y-2">
                        <Label>Return Date</Label>
                        <DatePicker
                          date={flightReturnDate}
                          onSelect={setFlightReturnDate}
                          placeholder="Select date"
                          className="w-full"
                        />
                      </div>
                    )}
                    {flightType === "one-way" && (
                      <div className="space-y-2">
                        <Label>Passengers</Label>
                        <Input
                          type="number"
                          min="1"
                          value={passengers || "1"}
                          onChange={(e) => setPassengers(e.target.value)}
                          placeholder="1"
                        />
                      </div>
                    )}
                  </div>
                  {flightType === "round-trip" && (
                    <div className="space-y-2">
                      <Label>Passengers</Label>
                      <Input
                        type="number"
                        min="1"
                        value={passengers}
                        onChange={(e) => setPassengers(e.target.value)}
                        placeholder="1"
                        className="w-full md:w-48"
                      />
                    </div>
                  )}
                  <Button className="w-full hover-lift" size="lg" onClick={handleBookFlight}>
                    <Search className="h-4 w-4 mr-2" />
                    Search Flights
                  </Button>
                </div>
              )}

              {selectedTransport === "trains" && (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2">
                      <Label>From Station</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
                        <Input
                          placeholder="Enter station"
                          value={trainFrom || ""}
                          onChange={(e) => setTrainFrom(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>To Station</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
                        <Input
                          placeholder="Enter station"
                          value={trainTo || ""}
                          onChange={(e) => setTrainTo(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Journey Date</Label>
                      <DatePicker
                        date={trainDate}
                        onSelect={setTrainDate}
                        placeholder="Select date"
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Passengers</Label>
                      <Input
                        type="number"
                        min="1"
                        value={passengers}
                        onChange={(e) => setPassengers(e.target.value)}
                        placeholder="1"
                      />
                    </div>
                  </div>
                  <Button className="w-full hover-lift" size="lg" onClick={handleBookTrain}>
                    <Search className="h-4 w-4 mr-2" />
                    Search Trains
                  </Button>
                </div>
              )}

              {selectedTransport === "buses" && (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2">
                      <Label>From City</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
                        <Input
                          placeholder="Enter city"
                          value={busFrom || ""}
                          onChange={(e) => setBusFrom(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>To City</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
                        <Input
                          placeholder="Enter city"
                          value={busTo || ""}
                          onChange={(e) => setBusTo(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Travel Date</Label>
                      <DatePicker
                        date={busDate}
                        onSelect={setBusDate}
                        placeholder="Select date"
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Passengers</Label>
                      <Input
                        type="number"
                        min="1"
                        value={passengers}
                        onChange={(e) => setPassengers(e.target.value)}
                        placeholder="1"
                      />
                    </div>
                  </div>
                  <Button className="w-full hover-lift" size="lg" onClick={handleBookBus}>
                    <Search className="h-4 w-4 mr-2" />
                    Search Buses
                  </Button>
                </div>
              )}

              {selectedTransport === "cabs" && (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2">
                      <Label>Pickup Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
                        <Input
                          placeholder="Enter pickup location"
                          value={cabFrom || ""}
                          onChange={(e) => setCabFrom(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Drop Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
                        <Input
                          placeholder="Enter drop location"
                          value={cabTo || ""}
                          onChange={(e) => setCabTo(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Pickup Date</Label>
                      <DatePicker
                        date={cabDate}
                        onSelect={setCabDate}
                        placeholder="Select date"
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Pickup Time</Label>
                      <Input
                        type="time"
                        value={cabTime || ""}
                        onChange={(e) => setCabTime(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button className="w-full hover-lift" size="lg" onClick={handleBookCab}>
                    <Search className="h-4 w-4 mr-2" />
                    Search Cabs
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  // Booking handlers
  const handleNewBooking = () => {
    router.push("/hotels")
    toast.success("Redirecting to hotels", {
      description: "You can now search and book your next trip",
    })
  }

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsDetailsDialogOpen(true)
  }

  const handleCancelBooking = (booking: Booking) => {
    setBookings(prev => prev.map(b =>
      b.id === booking.id ? { ...b, status: "cancelled" as const } : b
    ))
    toast.success("Booking cancelled", {
      description: `${booking.title} has been cancelled successfully`,
    })
  }

  const handleModifyBooking = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsModifyDialogOpen(true)
  }

  const handleSaveModification = async (booking: Booking, changes: { checkIn?: string; checkOut?: string; travelers?: number; hotelRoomType?: string }) => {
    try {
      const response = await api.modifyBooking(booking.id, changes) as { success: boolean; data: { booking: any } }
      if (response.success && response.data.booking) {
        const b = response.data.booking
        const transformed: Booking = {
          id: b.bookingId || b.id.toString(),
          type: b.type === 'hotel' ? 'hotel' : 'travel',
          title: b.hotel?.name || b.travelPackage?.title || 'Booking',
          destination: b.hotel
            ? `${b.hotel.locationCity}, ${b.hotel.locationCountry}`
            : b.travelPackage?.destination?.join(', ') || 'Unknown',
          checkIn: b.checkIn ? new Date(b.checkIn).toISOString().split('T')[0] : undefined,
          checkOut: b.checkOut ? new Date(b.checkOut).toISOString().split('T')[0] : undefined,
          travelers: b.travelers || 1,
          status: b.status === 'confirmed' ? 'confirmed' :
            b.status === 'pending' ? 'pending' :
              b.status === 'cancelled' ? 'cancelled' :
                b.status === 'completed' ? 'completed' : 'pending',
          amount: parseFloat(b.total?.toString() || '0'),
          bookingDate: b.bookingDate ? new Date(b.bookingDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          image: b.hotel?.images?.[0] || b.travelPackage?.images?.[0] || 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80',
          details: {
            hotelName: b.hotel?.name,
            packageName: b.travelPackage?.title,
          },
        };

        setBookings(prev => prev.map(item =>
          item.id === booking.id ? transformed : item
        ))

        toast.success("Booking modified", {
          description: `${booking.title} has been updated successfully. New total: $${transformed.amount.toLocaleString()}`,
        })
        setIsModifyDialogOpen(false)
        setSelectedBooking(null)
      }
    } catch (error: any) {
      console.error("Error modifying booking:", error)
      toast.error("Failed to modify booking", {
        description: error.message || "Please try again later.",
      })
    }
  }

  const handleBookNow = (trip: SavedTrip) => {
    // Generate a new booking ID
    const newBookingId = `BK-${new Date().getFullYear()}-${String(bookings.length + 1).padStart(3, '0')}`

    // Create a new booking from the saved trip
    const newBooking: Booking = {
      id: newBookingId,
      type: trip.type === "hotel" ? "hotel" : "travel",
      title: trip.destination,
      destination: trip.location,
      checkIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
      checkOut: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days from now
      travelers: 2,
      status: "pending",
      amount: trip.price,
      bookingDate: new Date().toISOString().split('T')[0],
      image: trip.image,
      details: trip.type === "hotel"
        ? { hotelName: trip.destination }
        : { packageName: trip.destination },
    }

    // Add the booking to bookings
    setBookings(prev => [newBooking, ...prev])

    // Remove from saved trips
    setSavedTrips(prev => prev.filter(t => t.id !== trip.id))

    // Show success toast
    toast.success("Booking created", {
      description: `${trip.destination} has been booked successfully`,
    })

    // Switch to bookings tab
    setSidebarTab("bookings")
  }

  if (sidebarTab === "bookings") {
    const filteredBookings = bookings.filter(booking => {
      if (filterStatus === "all") return true
      return booking.status === filterStatus
    })

    const sortedBookings = [...filteredBookings].sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()
      }
      if (sortBy === "amount") {
        return b.amount - a.amount
      }
      return 0
    })

    return (
      <div className="container space-y-8 py-12 page-content relative">
        <div className="flex flex-col gap-3 animate-fade-in-down">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                {t("myBookings")}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold">{t("yourReservations")}</h1>
              <p className="text-muted-foreground">
                {t("manageViewBookings")}
              </p>
            </div>
            <Button className="hover-lift" onClick={handleNewBooking}>
              <Plus className="h-4 w-4 mr-2" />
              {t("newBooking")}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="hover-lift">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">{t("filter")}:</label>
                <select
                  value={filterStatus || "all"}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                >
                  <option value="all">{t("allStatus")}</option>
                  <option value="confirmed">{t("confirmed")}</option>
                  <option value="pending">{t("pending")}</option>
                  <option value="completed">{t("completed")}</option>
                  <option value="cancelled">{t("cancelled")}</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">{t("sortBy")}:</label>
                <select
                  value={sortBy || "date"}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                >
                  <option value="date">{t("date")}</option>
                  <option value="amount">{t("amount")}</option>
                </select>
              </div>
              <div className="ml-auto text-sm text-muted-foreground">
                {t("showing")} {sortedBookings.length} {t("of")} {bookings.length} {t("bookings")}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {sortedBookings.length === 0 ? (
            <Card className="hover-lift">
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">{t("noBookingsFound")}</p>
              </CardContent>
            </Card>
          ) : (
            sortedBookings.map((booking, index) => (
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
                              <Hotel className="h-5 w-5 text-blue-500" />
                            ) : (
                              <Package className="h-5 w-5 text-purple-500" />
                            )}
                            <h3 className="text-xl font-semibold">{booking.title}</h3>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4 text-blue-500" />
                            <span>{booking.destination}</span>
                          </div>
                          {booking.checkIn && booking.checkOut && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-4 w-4 text-blue-500" />
                              <span>
                                {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          {booking.travelers && (
                            <p className="text-sm text-muted-foreground">
                              {booking.travelers} {booking.travelers === 1 ? t("traveler") : t("travelers")}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                          <p className="text-2xl font-bold">${booking.amount ? booking.amount.toLocaleString() : "0"}</p>
                          <p className="text-xs text-muted-foreground">
                            {t("booked")} {new Date(booking.bookingDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover-lift"
                          onClick={() => handleViewDetails(booking)}
                        >
                          {t("viewDetails")}
                        </Button>
                        {booking.status === "confirmed" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover-lift"
                            onClick={() => handleModifyBooking(booking)}
                          >
                            {t("modifyBooking")}
                          </Button>
                        )}
                        {booking.status === "pending" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover-lift"
                            onClick={() => handleCancelBooking(booking)}
                          >
                            {t("cancel")}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Booking Details Dialog */}
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedBooking?.title}</DialogTitle>
              <DialogDescription>
                {t("viewDetails")} - {selectedBooking?.id}
              </DialogDescription>
            </DialogHeader>
            {selectedBooking && (
              <div className="space-y-4">
                <div className="relative h-64 w-full rounded-lg overflow-hidden">
                  <Image
                    src={selectedBooking.image}
                    alt={selectedBooking.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">{t("destination")}:</span>
                      <span>{selectedBooking.destination}</span>
                    </div>
                    {selectedBooking.checkIn && selectedBooking.checkOut && (
                      <>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">{t("checkIn")}:</span>
                          <span>{new Date(selectedBooking.checkIn).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">{t("checkOut")}:</span>
                          <span>{new Date(selectedBooking.checkOut).toLocaleDateString()}</span>
                        </div>
                      </>
                    )}
                    {selectedBooking.travelers && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">{t("travelers")}:</span>
                        <span>{selectedBooking.travelers}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Status:</span>
                      <span className={`ml-2 rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(selectedBooking.status)}`}>
                        {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">{t("amount")}:</span>
                      <span className="ml-2 text-xl font-bold">${selectedBooking?.amount ? selectedBooking.amount.toLocaleString() : "0"}</span>
                    </div>
                    <div>
                      <span className="font-medium">{t("booked")}:</span>
                      <span className="ml-2">{new Date(selectedBooking.bookingDate).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="font-medium">Type:</span>
                      <span className="ml-2 capitalize">{selectedBooking.type}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Modify Booking Dialog */}
        <Dialog open={isModifyDialogOpen} onOpenChange={setIsModifyDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{t("modifyBooking")}</DialogTitle>
              <DialogDescription>
                {selectedBooking?.title}
              </DialogDescription>
            </DialogHeader>
            {selectedBooking && (
              <ModifyBookingForm
                booking={selectedBooking}
                onSave={(changes) => handleSaveModification(selectedBooking, changes)}
                onCancel={() => {
                  setIsModifyDialogOpen(false)
                  setSelectedBooking(null)
                }}
                t={t}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  if (sidebarTab === "saved") {
    return (
      <div className="container space-y-8 py-12 page-content relative">
        <div className="flex flex-col gap-3 animate-fade-in-down">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                {t("savedTrips")}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold">{t("yourWishlist")}</h1>
              <p className="text-muted-foreground">
                {savedTrips.length} {t("tripsSavedForLater")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="hover-lift"
              >
                {t("grid")}
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="hover-lift"
              >
                {t("list")}
              </Button>
            </div>
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-stagger">
            {savedTrips.map((trip, index) => (
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
                        <MapPin className="h-3 w-3 text-blue-500" />
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
                    <Button
                      className="hover-lift"
                      onClick={() => handleBookNow(trip)}
                    >
                      {t("bookNow")}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Saved on {new Date(trip.savedDate).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4 animate-stagger">
            {savedTrips.map((trip, index) => (
              <Card key={trip.id} className="hover-lift" style={{ animationDelay: `${index * 0.05}s` }}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="relative h-48 w-full md:w-64 rounded-lg overflow-hidden">
                      <Image
                        src={trip.image}
                        alt={trip.destination}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-semibold">{trip.destination}</h3>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-semibold">{trip.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4 text-blue-500" />
                            <span>{trip.location}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{trip.description}</p>
                        </div>
                        <div className="text-right">
                          {trip.originalPrice && (
                            <p className="text-sm text-muted-foreground line-through">
                              ${trip.originalPrice}
                            </p>
                          )}
                          <p className="text-2xl font-bold">${trip.price}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Saved on {new Date(trip.savedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          className="hover-lift flex-1"
                          onClick={() => handleBookNow(trip)}
                        >
                          {t("bookNow")}
                        </Button>
                        <Button variant="outline" size="icon" className="hover-lift">
                          <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    )
  }

  if (sidebarTab === "profile") {
    return (
      <div className="container space-y-8 py-12 page-content relative max-w-5xl">
        <div className="flex flex-col gap-3 animate-fade-in-down">
          <div className="space-y-1">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              {t("profile")}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold">{t("myProfile")}</h1>
            <p className="text-muted-foreground">
              {t("managePersonalInfo")}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 items-stretch">
          <Card className="lg:col-span-1 hover-lift border-2 h-full flex flex-col">
            <CardContent className="p-4 flex-1 flex flex-col">
              <div className="flex flex-col items-center space-y-5 flex-1">
                <div className="relative group">
                  <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
                    <Image
                      src={userProfile?.avatar || user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (userProfile?.name || user?.name || "User")}
                      alt={userProfile?.name || user?.name || "User"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button
                    size="icon"
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow-md hover-lift"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-center space-y-2 w-full">
                  <h3 className="font-bold text-xl">{userProfile?.name || user?.name || "User"}</h3>
                  <p className="text-sm text-muted-foreground break-words">{userProfile?.email || user?.email || ""}</p>
                  <span className="inline-block rounded-full bg-gradient-to-r from-primary to-primary/80 px-4 py-1.5 text-xs font-semibold text-primary-foreground mt-2 shadow-sm">
                    {userMembershipTier} {t("member")}
                  </span>
                </div>
                <div className="w-full space-y-3 pt-4 border-t">
                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-muted-foreground">Total Trips</span>
                    </div>
                    <span className="font-bold text-lg">{userTotalTrips}</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-muted-foreground">Loyalty Points</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">{userLoyaltyPoints.toLocaleString()}</span>
                      {userLoyaltyPoints > 0 && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          asChild
                        >
                          <Link href="/rewards">
                            Redeem
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-muted-foreground">Member Since</span>
                    </div>
                    <span className="font-semibold text-sm text-right">{userMemberSince}</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-muted-foreground">Total Spent</span>
                    </div>
                    <span className="font-bold text-lg">${userTotalSpent.toLocaleString()}</span>
                  </div>
                </div>
                <div className="w-full pt-4 border-t space-y-2.5">
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-muted-foreground">Email Verified</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <ShieldCheck className="h-4 w-4 text-green-500" />
                    <span className="text-muted-foreground">Account Secured</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-muted-foreground">Premium Member</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6 flex flex-col">
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-500" />
                  {t("personalInformation")}
                </CardTitle>
                <CardDescription>{t("updateProfileDetails")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      <Label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {t("fullName")}
                      </Label>
                    </div>
                    <Input
                      id="name"
                      value={profileName || ""}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      <Label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {t("emailAddress")}
                      </Label>
                    </div>
                    <Input id="email" type="email" defaultValue={userProfile?.email || user?.email || ""} disabled className="w-full h-10" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <Label htmlFor="phone" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {t("phoneNumber")}
                      </Label>
                    </div>
                    <Input
                      id="phone"
                      value={profilePhone || ""}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="w-full h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      <Label htmlFor="memberSince" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {t("memberSince")}
                      </Label>
                    </div>
                    <Input id="memberSince" defaultValue={userMemberSince || "N/A"} disabled className="w-full h-10" />
                  </div>
                </div>
                <div className="flex justify-end pt-4 border-t">
                  <Button
                    className="hover-lift"
                    size="lg"
                    onClick={handleUpdateProfile}
                    disabled={isUpdatingProfile}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {isUpdatingProfile ? "Saving..." : t("saveChanges")}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-green-500" />
                  Account Security
                </CardTitle>
                <CardDescription>{t("managePasswordSecurity")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">{t("currentPassword")}</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder={t("enterCurrentPassword")}
                    value={currentPassword || ""}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full h-10"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">{t("newPassword")}</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder={t("enterNewPassword")}
                      value={newPassword || ""}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder={t("confirmNewPassword")}
                      value={confirmPassword || ""}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-10"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button
                    variant="outline"
                    className="hover-lift"
                    onClick={handleChangePassword}
                    disabled={isUpdatingPassword}
                  >
                    {isUpdatingPassword ? "Updating..." : t("updatePassword")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (sidebarTab === "settings") {
    return (
      <div className="container space-y-8 py-12 page-content relative max-w-5xl">
        <div className="flex flex-col gap-3 animate-fade-in-down">
          <div className="space-y-1">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              {t("settings")}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold">{t("accountSettings")}</h1>
            <p className="text-muted-foreground">
              {t("customizeAccountPreferences")}
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 items-stretch">
          <Card className="hover-lift h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-500" />
                {t("generalPreferences")}
              </CardTitle>
              <CardDescription>{t("manageLanguageCurrency")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 flex-1 flex flex-col">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-blue-500" />
                  {t("currency")}
                </Label>
                <select
                  value={currency || "USD"}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-blue-500" />
                  {t("language")}
                </Label>
                <select
                  value={language || "English"}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>{t("theme")}</Label>
                <div className="flex items-center gap-3">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    className="flex-1 hover-lift"
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="h-4 w-4 mr-2" />
                    {t("light")}
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    className="flex-1 hover-lift"
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="h-4 w-4 mr-2" />
                    {t("dark")}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-purple-500" />
                {t("notificationPreferences")}
              </CardTitle>
              <CardDescription>{t("chooseHowNotified")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 flex flex-col">
              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">{t("emailNotifications")}</p>
                    <p className="text-sm text-muted-foreground">{t("receiveUpdatesEmail")}</p>
                  </div>
                </div>
                <Button
                  variant={emailNotif ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEmailNotif(!emailNotif)}
                  className="hover-lift"
                >
                  {emailNotif ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">{t("smsNotifications")}</p>
                    <p className="text-sm text-muted-foreground">{t("receiveTextAlerts")}</p>
                  </div>
                </div>
                <Button
                  variant={smsNotif ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSmsNotif(!smsNotif)}
                  className="hover-lift"
                >
                  {smsNotif ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="font-medium">{t("pushNotifications")}</p>
                    <p className="text-sm text-muted-foreground">{t("browserAppNotifications")}</p>
                  </div>
                </div>
                <Button
                  variant={pushNotif ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPushNotif(!pushNotif)}
                  className="hover-lift"
                >
                  {pushNotif ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
              </div>
              <div className="flex justify-end pt-4 border-t">
                <Button className="hover-lift">
                  <Bell className="h-4 w-4 mr-2" />
                  {t("saveNotifications")}
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

    const filteredNotifications = filterType === "unread"
      ? notifications.filter(n => !n.read)
      : notifications

    return (
      <div className="container space-y-8 py-12 page-content relative max-w-5xl">
        <div className="flex flex-col gap-3 animate-fade-in-down">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                {t("notifications")}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold">{t("yourNotifications")}</h1>
              <p className="text-muted-foreground">
                {t("stayUpdatedBookings")}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <span className="rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground shadow-sm">
                  {unreadCount} New
                </span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setNotifications(prev => prev.map(n => ({ ...n, read: true })))
                }}
                className="hover-lift"
              >
                {t("markAllAsRead")}
              </Button>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="inline-flex rounded-full border bg-muted/40 p-1 text-sm">
          <button
            className={`rounded-full px-4 py-2 transition-all duration-300 hover-scale ${filterType === "all"
              ? "bg-background shadow-sm font-semibold"
              : "text-muted-foreground hover:text-foreground"
              }`}
            onClick={() => setFilterType("all")}
          >
            {t("all")} ({notifications.length})
          </button>
          <button
            className={`rounded-full px-4 py-2 transition-all duration-300 hover-scale ${filterType === "unread"
              ? "bg-background shadow-sm font-semibold"
              : "text-muted-foreground hover:text-foreground"
              }`}
            onClick={() => setFilterType("unread")}
          >
            {t("unread")} ({unreadCount})
          </button>
        </div>

        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card className="hover-lift">
              <CardContent className="p-12 text-center">
                <Bell className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {filterType === "unread" ? t("noUnreadNotifications") : t("noNotificationsYet")}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification, index) => (
              <Card
                key={notification.id}
                className={`hover-lift animate-fade-in-up transition-all ${!notification.read
                  ? "border-l-4 border-l-primary bg-primary/5 shadow-md"
                  : "border-l-4 border-l-transparent"
                  }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${!notification.read ? "bg-primary/10" : "bg-muted"
                        }`}>
                        <Bell className={`h-5 w-5 ${!notification.read ? "text-purple-500" : "text-purple-500/50"}`} />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-semibold ${!notification.read ? "text-primary" : ""}`}>
                            {t(notification.title as any)}
                          </h3>
                          {!notification.read && (
                            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{t(notification.message as any)}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(notification.date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!notification.read && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markNotificationAsRead(notification.id)}
                          className="hover-lift"
                        >
                          {t("markAsRead")}
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
      <div className="container space-y-8 py-12 page-content relative max-w-5xl">
        <div className="flex flex-col gap-3 animate-fade-in-down">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                {t("paymentMethods")}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold">{t("yourPaymentMethods")}</h1>
              <p className="text-muted-foreground">
                {t("manageSavedPaymentMethods")}
              </p>
            </div>
            <Button className="hover-lift" size="lg">
              <Plus className="h-4 w-4 mr-2" />
              {t("addPaymentMethod")}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {paymentMethods.length === 0 ? (
            <Card className="hover-lift">
              <CardContent className="p-12 text-center">
                <CreditCard className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No payment methods saved yet</p>
                <Button className="hover-lift">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Payment Method
                </Button>
              </CardContent>
            </Card>
          ) : (
            paymentMethods.map((method, index) => (
              <Card
                key={method.id}
                className={`hover-lift animate-fade-in-up transition-all ${method.isDefault ? "border-2 border-primary/50 shadow-md bg-primary/5" : ""
                  }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`h-14 w-14 rounded-lg flex items-center justify-center ${method.type === "card"
                        ? method.brand === "Visa"
                          ? method.isDefault ? "bg-blue-100" : "bg-blue-50"
                          : method.brand === "Mastercard"
                            ? method.isDefault ? "bg-red-100" : "bg-red-50"
                            : method.isDefault ? "bg-primary/20" : "bg-primary/10"
                        : method.isDefault ? "bg-yellow-100" : "bg-yellow-50"
                        }`}>
                        {method.type === "card" ? (
                          <CreditCard className={`h-7 w-7 ${method.brand === "Visa"
                            ? method.isDefault ? "text-blue-600" : "text-blue-500"
                            : method.brand === "Mastercard"
                              ? method.isDefault ? "text-red-600" : "text-red-500"
                              : method.isDefault ? "text-orange-500" : "text-orange-500/70"
                            }`} />
                        ) : (
                          <div className={`h-7 w-7 rounded flex items-center justify-center ${method.isDefault ? "bg-blue-600" : "bg-blue-500"
                            }`}>
                            <span className="text-white text-xs font-bold">PP</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        {method.type === "card" ? (
                          <>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-lg">
                                {method.brand} •••• {method.last4}
                              </p>
                              {method.isDefault && (
                                <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
                                  {t("default")}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {t("expires")} {method.expiryMonth}/{method.expiryYear} • {method.name}
                            </p>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-lg">PayPal</p>
                              {method.isDefault && (
                                <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
                                  {t("default")}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{method.name}</p>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!method.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDefaultPayment(method.id)}
                          className="hover-lift"
                        >
                          {t("setAsDefault")}
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
            ))
          )}
        </div>

        {/* Security Notice */}
        <Card className="hover-lift border-l-4 border-l-gray-700 bg-gray-100">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <ShieldCheck className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold">{t("securePaymentProcessing")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("allPaymentMethodsEncrypted")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Stats are already calculated earlier in the component
  // Using those values here

  const bookingOptions = [
    {
      title: t("hotels"),
      description: t("bookHotelsStays"),
      icon: Hotel,
      href: "/hotels",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
    {
      title: t("flights"),
      description: t("domesticInternational"),
      icon: Plane,
      href: "/dashboard?tab=transportation",
      color: "from-gray-700 to-gray-500",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: t("trains"),
      description: t("railwayBookings"),
      icon: Train,
      href: "/dashboard?tab=transportation",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: t("buses"),
      description: t("busTickets"),
      icon: Bus,
      href: "/dashboard?tab=transportation",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      title: t("cabs"),
      description: t("taxiCarRentals"),
      icon: Car,
      href: "/dashboard?tab=transportation",
      color: "from-indigo-500 to-blue-500",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: t("packages"),
      description: t("holidayPackages"),
      icon: Package,
      href: "/travel",
      color: "from-gray-600 to-gray-400",
      bgColor: "bg-teal-100",
      iconColor: "text-teal-600",
    },
  ]

  const planningOptions = [
    {
      title: t("tripPlanner"),
      description: t("planCompleteItinerary"),
      icon: Navigation,
      href: "/dashboard?tab=planner",
      color: "from-violet-500 to-purple-500",
      iconColor: "text-white",
      bgColor: "bg-gradient-to-br from-violet-500 to-purple-600",
    },
    {
      title: t("exploreDestinations"),
      description: t("discoverAmazingPlaces"),
      icon: Compass,
      href: "/travel",
      color: "from-cyan-500 to-blue-500",
      iconColor: "text-white",
      bgColor: "bg-gradient-to-br from-cyan-500 to-blue-600",
    },
    {
      title: t("restaurants"),
      description: t("findBestDining"),
      icon: UtensilsCrossed,
      href: "/travel",
      color: "from-amber-500 to-orange-500",
      iconColor: "text-white",
      bgColor: "bg-gradient-to-br from-amber-500 to-orange-600",
    },
    {
      title: t("activities"),
      description: t("thingsToDoExperiences"),
      icon: Activity,
      href: "/travel",
      color: "from-emerald-500 to-teal-500",
      iconColor: "text-white",
      bgColor: "bg-gradient-to-br from-emerald-500 to-teal-600",
    },
    {
      title: t("shopping"),
      description: t("bestShoppingDestinations"),
      icon: ShoppingBag,
      href: "/travel",
      color: "from-rose-500 to-pink-500",
      iconColor: "text-white",
      bgColor: "bg-gradient-to-br from-rose-500 to-pink-600",
    },
    {
      title: t("attractions"),
      description: t("touristSpotsLandmarks"),
      icon: Camera,
      href: "/travel",
      color: "from-blue-500 to-indigo-500",
      iconColor: "text-white",
      bgColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
    },
  ]

  return (
    <div className="container space-y-8 py-12 page-content relative">
      <div className="flex flex-col gap-3 animate-fade-in-down">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary animate-fade-in">
              Dashboard
            </p>
            <h1 className="text-3xl font-bold animate-fade-in-up">{t("welcomeBack")}, {userProfile?.name?.split(' ')[0] || user?.name?.split(' ')[0] || "User"}!</h1>
            <p className="text-muted-foreground animate-fade-in-up">
              {t("overviewActivity")}
            </p>
          </div>
          {!isLoggedIn ? (
            <Button asChild className="hidden sm:inline-flex hover-lift">
              <Link href="/login">{t("goToLogin")}</Link>
            </Button>
          ) : (
            <div className="hidden sm:flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
              <CreditCard className="h-4 w-4" />
              {t("discountsUnlocked")}
            </div>
          )}
        </div>
      </div>

      {!isLoggedIn ? (
        <Card className="border-dashed animate-scale-in hover-lift">
          <CardHeader>
            <CardTitle>{t("signInUnlockDiscounts")}</CardTitle>
            <CardDescription>
              {t("connectAccountDiscounts")}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                {t("showPersonalizedDiscounts")}
              </p>
              <p className="text-xs text-muted-foreground">
                Hook this gate to your auth provider when backend is ready.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="hover-lift">
                <Link href="/login">{t("loginViewDiscounts")}</Link>
              </Button>
              <Button variant="outline" onClick={() => setIsLoggedIn(true)} className="hover-lift">
                {t("previewAsLoggedIn")}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6 animate-fade-in-up">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-stagger">
            <Card className="hover-lift" style={{ animationDelay: '0s' }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Bookings</p>
                    <p className="text-2xl font-bold">{totalBookings}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover-lift" style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Upcoming Trips</p>
                    <p className="text-2xl font-bold">{upcomingBookings}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <Plane className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover-lift" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Saved Trips</p>
                    <p className="text-2xl font-bold">{totalSaved}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-purple-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover-lift" style={{ animationDelay: '0.3s' }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
                    <p className="text-2xl font-bold">${totalSpent ? totalSpent.toLocaleString() : "0"}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-orange-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Booking Options */}
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="h-5 w-5 text-blue-500" />
                {t("quickBookings")}
              </CardTitle>
              <CardDescription>{t("quickBookingsDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-stagger">
                {bookingOptions.map((option, index) => {
                  const Icon = option.icon
                  return (
                    <Link
                      key={option.title}
                      href={option.href}
                      className="group"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <Card className="hover-lift h-full transition-all duration-300 border-2 hover:border-primary">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${option.bgColor || `bg-gradient-to-br ${option.color}`} flex-shrink-0 group-hover:scale-110 transition-transform`}>
                              <Icon className={`h-6 w-6 ${option.iconColor || 'text-white'}`} />
                            </div>
                            <div className="flex-1 space-y-1">
                              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                {option.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">{option.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Planning & Exploration Options */}
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Compass className="h-5 w-5 text-blue-500" />
                {t("planYourTrip")}
              </CardTitle>
              <CardDescription>{t("planYourTripDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-stagger">
                {planningOptions.map((option, index) => {
                  const Icon = option.icon
                  return (
                    <Link
                      key={option.title}
                      href={option.href}
                      className="group"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <Card className="hover-lift h-full transition-all duration-300 border-2 hover:border-primary">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${option.bgColor || `bg-gradient-to-br ${option.color}`} flex-shrink-0 group-hover:scale-110 transition-transform`}>
                              <Icon className={`h-6 w-6 ${option.iconColor || "text-white"}`} />
                            </div>
                            <div className="flex-1 space-y-1">
                              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                {option.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">{option.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <div className="inline-flex rounded-full border bg-muted/40 p-1 text-sm animate-scale-in">
            <button
              className={`rounded-full px-4 py-2 transition-all duration-300 hover-scale ${activeTab === "discounts"
                ? "bg-background shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
                }`}
              onClick={() => setActiveTab("discounts")}
            >
              {t("discounts")}
            </button>
            <button
              className={`rounded-full px-4 py-2 transition-all duration-300 hover-scale ${activeTab === "history"
                ? "bg-background shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
                }`}
              onClick={() => setActiveTab("history")}
            >
              {t("travelHistory")}
            </button>
          </div>

          {activeTab === "discounts" ? (
            <div className="grid gap-6 lg:grid-cols-2 animate-stagger">
              <Card className="shadow-sm hover-lift animate-fade-in-left">
                <CardHeader className="space-y-1">
                  <CardTitle>{t("discountsOnPlacesVisited")}</CardTitle>
                  <CardDescription>
                    {t("loyaltyPricingPerks")}
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
                          {t("visited")} {item.visitedOn} • {item.description}
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
                          {t("applyDeal")}
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="shadow-sm hover-lift animate-fade-in-right">
                <CardHeader className="space-y-1">
                  <CardTitle>{t("transportDiscounts")}</CardTitle>
                  <CardDescription>
                    {t("savingsPreferredWays")}
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
                <CardTitle>{t("yourTravelHistory")}</CardTitle>
                <CardDescription>{t("previouslyCompletedTrips")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 animate-stagger">
                {bookings.filter((b) => b.status === "completed").map((trip, index) => (
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
                        ${trip.amount ? trip.amount.toLocaleString() : "0"}
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
