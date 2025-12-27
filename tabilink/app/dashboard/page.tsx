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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"
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

function DashboardContent() {
  const searchParams = useSearchParams()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState<"discounts" | "history">("discounts")
  const [sidebarTab, setSidebarTab] = useState<string | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods)
  
  // Hooks for bookings section
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("date")
  
  // Hooks for saved trips section
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  
  // Hooks for settings section
  const [currency, setCurrency] = useState(mockUserProfile.preferences.currency)
  const [language, setLanguage] = useState(mockUserProfile.preferences.language)
  const [emailNotif, setEmailNotif] = useState(mockUserProfile.preferences.notifications.email)
  const [smsNotif, setSmsNotif] = useState(mockUserProfile.preferences.notifications.sms)
  const [pushNotif, setPushNotif] = useState(mockUserProfile.preferences.notifications.push)
  
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
      <div className="min-h-screen bg-white">
        <div className="container space-y-12 py-16 page-content relative">
          {/* Hero Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-semibold text-gray-700 mb-4 border border-gray-200">
              <Compass className="h-4 w-4 text-gray-700" />
              <span>Plan Your Trip</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
              Plan Your Perfect Trip
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to plan, organize, and experience your dream vacation in one place
            </p>
          </div>

        {!selectedPlanOption ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {planOptions.map((option, index) => {
              const Icon = option.icon
              return (
                <Card
                  key={option.id}
                  className="group relative overflow-hidden border-2 border-gray-200 hover:border-gray-900 transition-all duration-300 cursor-pointer bg-white h-full shadow-sm hover:shadow-xl"
                  onClick={() => setSelectedPlanOption(option.id)}
                >
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      {/* Icon Section */}
                      <div className="flex items-center justify-between">
                        <div className={`flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${option.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="h-10 w-10" />
                        </div>
                        <div className="h-12 w-12 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors"></div>
                      </div>

                      {/* Content */}
                      <div className="space-y-3">
                        <h3 className="font-bold text-2xl text-gray-900 group-hover:text-black transition-colors">
                          {option.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed text-base">
                          {option.description}
                        </p>
                      </div>

                      {/* Data Count */}
                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-sm font-semibold text-gray-700">
                          {option.data.length} {option.data.length === 1 ? 'item' : 'items'} available
                        </p>
                      </div>

                      {/* CTA */}
                      <div className="pt-4">
                        <div className="flex items-center gap-2 text-gray-900 font-semibold group-hover:gap-3 transition-all">
                          <span>Explore Now</span>
                          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </div>
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
                        <h2 className="text-2xl font-bold text-gray-900">Your Itineraries</h2>
                        <Button className="bg-gray-900 text-white hover:bg-gray-800">
                          <Plus className="h-4 w-4 mr-2" />
                          Create New
                        </Button>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {mockTripItineraries.map((item) => (
                          <Card key={item.id} className="border-2 border-gray-200 hover:border-gray-900 transition-all">
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <CardTitle className="text-lg text-gray-900">{item.title}</CardTitle>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  item.status === 'Active' ? 'bg-gray-900 text-white' : 
                                  item.status === 'Completed' ? 'bg-gray-200 text-gray-700' : 
                                  'bg-gray-100 text-gray-600'
                                }`}>
                                  {item.status}
                                </span>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="h-4 w-4" />
                                <span>{item.duration}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="h-4 w-4" />
                                <span>{item.cities.join(", ")}</span>
                              </div>
                              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                <span className="text-sm text-gray-600">Budget</span>
                                <span className="font-bold text-gray-900">{item.budget}</span>
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
                    <div className="space-y-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Popular Destinations</h2>
                        <Button variant="outline" className="border-2 border-gray-900 text-gray-900">
                          <Search className="h-4 w-4 mr-2" />
                          Search
                        </Button>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        {mockDestinations.map((item) => (
                          <Card key={item.id} className="border-2 border-gray-200 hover:border-gray-900 transition-all">
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div>
                                  <CardTitle className="text-xl text-gray-900 mb-1">{item.name}</CardTitle>
                                  <div className="flex items-center gap-2">
                                    <Star className="h-4 w-4 fill-gray-900 text-gray-900" />
                                    <span className="text-sm font-semibold text-gray-700">{item.rating}</span>
                                    <span className="text-sm text-gray-500">({item.reviews.toLocaleString()} reviews)</span>
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
                        <h2 className="text-2xl font-bold text-gray-900">Top Restaurants</h2>
                        <Button variant="outline" className="border-2 border-gray-900 text-gray-900">
                          <Search className="h-4 w-4 mr-2" />
                          Filter
                        </Button>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        {mockRestaurants.map((item) => (
                          <Card key={item.id} className="border-2 border-gray-200 hover:border-gray-900 transition-all">
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
                        <h2 className="text-2xl font-bold text-gray-900">Popular Activities</h2>
                        <Button variant="outline" className="border-2 border-gray-900 text-gray-900">
                          <Search className="h-4 w-4 mr-2" />
                          Browse All
                        </Button>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        {mockActivities.map((item) => (
                          <Card key={item.id} className="border-2 border-gray-200 hover:border-gray-900 transition-all">
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div>
                                  <CardTitle className="text-xl text-gray-900 mb-1">{item.name}</CardTitle>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
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
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="h-4 w-4" />
                                <span>{item.location}</span>
                              </div>
                              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                <span className="text-sm text-gray-600">Price</span>
                                <span className="font-bold text-gray-900">{item.price}</span>
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
                        <h2 className="text-2xl font-bold text-gray-900">Shopping Destinations</h2>
                        <Button variant="outline" className="border-2 border-gray-900 text-gray-900">
                          <Search className="h-4 w-4 mr-2" />
                          Explore
                        </Button>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        {mockShopping.map((item) => (
                          <Card key={item.id} className="border-2 border-gray-200 hover:border-gray-900 transition-all">
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div>
                                  <CardTitle className="text-xl text-gray-900 mb-1">{item.name}</CardTitle>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
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
                        <h2 className="text-2xl font-bold text-gray-900">Must-Visit Attractions</h2>
                        <Button variant="outline" className="border-2 border-gray-900 text-gray-900">
                          <Search className="h-4 w-4 mr-2" />
                          View All
                        </Button>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        {mockAttractions.map((item) => (
                          <Card key={item.id} className="border-2 border-gray-200 hover:border-gray-900 transition-all">
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div>
                                  <CardTitle className="text-xl text-gray-900 mb-1">{item.name}</CardTitle>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
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
                      className="hover-lift h-12 w-12 rounded-full border-2 border-gray-200"
                    >
                      <ArrowRight className="h-5 w-5 rotate-180 text-gray-700" />
                    </Button>
                    <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${option.color} text-white shadow-lg`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                      <h1 className="text-4xl font-bold mb-2 text-gray-900">{option.title}</h1>
                      <p className="text-lg text-gray-600">{option.description}</p>
                    </div>
                  </div>

                  {/* Content Section */}
                  {renderContent()}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                    <Button className="hover-lift flex-1 h-14 text-lg bg-gray-900 text-white hover:bg-gray-800" size="lg">
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

  // Render content based on sidebar tab
  if (sidebarTab === "transportation") {
    return (
      <div className="container space-y-8 py-12 page-content relative">
        <div className="flex flex-col gap-3 animate-fade-in-down">
          <div className="space-y-1">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Book Transportation
            </p>
            <h1 className="text-3xl font-bold">Book Your Transportation</h1>
            <p className="text-muted-foreground">
              Select your preferred mode of travel and book instantly - flights, trains, buses, or cabs
            </p>
          </div>
        </div>

        <Card className="hover-lift border-2 border-primary/20">
          <CardContent className="p-6 space-y-6">
            {/* Transport Type Selection */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-stagger">
              {[
                {
                  id: "flights",
                  title: "Flights",
                  description: "Book domestic & international flights",
                  icon: Plane,
                  color: "from-blue-500 to-cyan-500",
                  features: ["Best Prices", "24/7 Support", "Easy Cancellation"],
                },
                {
                  id: "trains",
                  title: "Trains",
                  description: "Railway ticket booking",
                  icon: Train,
                  color: "from-green-500 to-emerald-500",
                  features: ["Instant Booking", "PNR Status", "Seat Selection"],
                },
                {
                  id: "buses",
                  title: "Buses",
                  description: "Intercity & interstate buses",
                  icon: Bus,
                  color: "from-orange-500 to-red-500",
                  features: ["Multiple Operators", "Live Tracking", "Flexible Dates"],
                },
                {
                  id: "cabs",
                  title: "Cabs",
                  description: "Taxi, car rentals & airport transfers",
                  icon: Car,
                  color: "from-indigo-500 to-purple-500",
                  features: ["Doorstep Pickup", "Multiple Options", "Safe Rides"],
                },
              ].map((transport, index) => {
                const Icon = transport.icon
                const isSelected = selectedTransport === transport.id
                return (
                  <Card
                    key={transport.id}
                    className={`hover-lift h-full transition-all duration-300 border-2 cursor-pointer ${
                      isSelected ? "border-primary shadow-lg bg-primary/5" : "hover:border-primary hover:shadow-lg"
                    }`}
                    onClick={() => setSelectedTransport(transport.id)}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${transport.color} text-white transition-transform shadow-lg ${isSelected ? "scale-110" : ""}`}>
                          <Icon className="h-8 w-8" />
                        </div>
                        <div className="space-y-2">
                          <h3 className={`font-bold text-xl transition-colors ${isSelected ? "text-primary" : ""}`}>
                            {transport.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {transport.description}
                          </p>
                        </div>
                        <div className="w-full space-y-1.5 pt-2 border-t">
                          {transport.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Booking Forms */}
            {selectedTransport && (
              <Card className="border-2 border-primary/30 bg-primary/5 animate-fade-in-up">
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
                              value={flightFrom}
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
                              value={flightTo}
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
                              value={passengers}
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
                      <Button className="w-full hover-lift" size="lg">
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
                              value={trainFrom}
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
                              value={trainTo}
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
                      <Button className="w-full hover-lift" size="lg">
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
                              value={busFrom}
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
                              value={busTo}
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
                      <Button className="w-full hover-lift" size="lg">
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
                              value={cabFrom}
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
                              value={cabTo}
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
                            value={cabTime}
                            onChange={(e) => setCabTime(e.target.value)}
                          />
                        </div>
                      </div>
                      <Button className="w-full hover-lift" size="lg">
                        <Search className="h-4 w-4 mr-2" />
                        Search Cabs
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render content based on sidebar tab
  if (sidebarTab === "bookings") {
    const filteredBookings = mockBookings.filter(booking => {
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
                My Bookings
            </p>
              <h1 className="text-3xl font-bold">Your Reservations</h1>
            <p className="text-muted-foreground">
                Manage and view all your upcoming and past bookings.
              </p>
            </div>
            <Button className="hover-lift">
              <Plus className="h-4 w-4 mr-2" />
              New Booking
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="hover-lift">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Filter:</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                >
                  <option value="date">Date</option>
                  <option value="amount">Amount</option>
                </select>
              </div>
              <div className="ml-auto text-sm text-muted-foreground">
                Showing {sortedBookings.length} of {mockBookings.length} bookings
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {sortedBookings.length === 0 ? (
            <Card className="hover-lift">
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No bookings found with the selected filter.</p>
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
            ))
          )}
        </div>
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
                Saved Trips
              </p>
              <h1 className="text-3xl font-bold">Your Wishlist</h1>
              <p className="text-muted-foreground">
                {mockSavedTrips.length} trips saved for later. Book them when you're ready!
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="hover-lift"
              >
                Grid
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="hover-lift"
              >
                List
              </Button>
            </div>
          </div>
        </div>

        {viewMode === "grid" ? (
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
        ) : (
          <div className="space-y-4 animate-stagger">
            {mockSavedTrips.map((trip, index) => (
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
                        <Button className="hover-lift flex-1">
                          <Link href={trip.type === "hotel" ? `/hotels/${trip.id}` : `/travel/${trip.id}`}>
                            Book Now
                          </Link>
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
              Profile
            </p>
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-muted-foreground">
              Manage your personal information and preferences.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 items-start">
          <Card className="lg:col-span-1 hover-lift border-2">
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-6">
                <div className="relative group">
                  <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
                    <Image
                      src={mockUserProfile.avatar}
                      alt={mockUserProfile.name}
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
                  <h3 className="font-bold text-xl">{mockUserProfile.name}</h3>
                  <p className="text-sm text-muted-foreground break-words">{mockUserProfile.email}</p>
                  <span className="inline-block rounded-full bg-gradient-to-r from-primary to-primary/80 px-4 py-1.5 text-xs font-semibold text-primary-foreground mt-2 shadow-sm">
                    {mockUserProfile.membershipTier} Member
                  </span>
                </div>
                <div className="w-full space-y-4 pt-4 border-t">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-muted-foreground">Total Trips</span>
                    </div>
                    <span className="font-bold text-lg">{mockUserProfile.totalTrips}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-muted-foreground">Loyalty Points</span>
                    </div>
                    <span className="font-bold text-lg">{mockUserProfile.loyaltyPoints.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-muted-foreground">Member Since</span>
                    </div>
                    <span className="font-semibold text-sm text-right">{mockUserProfile.memberSince}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-500" />
                  Personal Information
                </CardTitle>
                <CardDescription>Update your profile details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-500" />
                      Full Name
                    </Label>
                    <Input id="name" defaultValue={mockUserProfile.name} className="w-full h-10" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-500" />
                      Email Address
                    </Label>
                    <Input id="email" type="email" defaultValue={mockUserProfile.email} className="w-full h-10" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-green-500" />
                      Phone Number
                    </Label>
                    <Input id="phone" defaultValue={mockUserProfile.phone} className="w-full h-10" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="memberSince" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      Member Since
                    </Label>
                    <Input id="memberSince" defaultValue={mockUserProfile.memberSince} disabled className="w-full h-10" />
                  </div>
                </div>
                <div className="flex justify-end pt-4 border-t">
                  <Button className="hover-lift" size="lg">
                    <Edit className="h-4 w-4 mr-2" />
                    Save Changes
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
                <CardDescription>Manage your password and security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" placeholder="Enter current password" className="w-full h-10" />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" placeholder="Enter new password" className="w-full h-10" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" type="password" placeholder="Confirm new password" className="w-full h-10" />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button variant="outline" className="hover-lift">
                    Update Password
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
              Settings
            </p>
            <h1 className="text-3xl font-bold">Account Settings</h1>
            <p className="text-muted-foreground">
              Customize your account preferences and notification settings.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-500" />
                General Preferences
              </CardTitle>
              <CardDescription>Manage your language and currency preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-blue-500" />
                  Currency
                </Label>
                <select
                  value={currency}
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
                  Language
                </Label>
                <select
                  value={language}
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
                <Label>Theme</Label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 hover-lift"
                    onClick={() => {}}
                  >
                    <Sun className="h-4 w-4 mr-2" />
                    Light
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 hover-lift"
                    onClick={() => {}}
                  >
                    <Moon className="h-4 w-4 mr-2" />
                    Dark
                  </Button>
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t">
                <Button className="hover-lift">
                  <Settings className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-purple-500" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
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
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive text message alerts</p>
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
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">Browser and app notifications</p>
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
                  Save Notifications
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
                Notifications
              </p>
              <h1 className="text-3xl font-bold">Your Notifications</h1>
              <p className="text-muted-foreground">
                Stay updated with your bookings and special offers.
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
                Mark all as read
              </Button>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="inline-flex rounded-full border bg-muted/40 p-1 text-sm">
          <button
            className={`rounded-full px-4 py-2 transition-all duration-300 hover-scale ${
              filterType === "all"
                ? "bg-background shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setFilterType("all")}
          >
            All ({notifications.length})
          </button>
          <button
            className={`rounded-full px-4 py-2 transition-all duration-300 hover-scale ${
              filterType === "unread"
                ? "bg-background shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setFilterType("unread")}
          >
            Unread ({unreadCount})
          </button>
        </div>

        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card className="hover-lift">
              <CardContent className="p-12 text-center">
                <Bell className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {filterType === "unread" ? "No unread notifications" : "No notifications yet"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification, index) => (
              <Card
                key={notification.id}
                className={`hover-lift animate-fade-in-up transition-all ${
                  !notification.read
                    ? "border-l-4 border-l-primary bg-primary/5 shadow-md"
                    : "border-l-4 border-l-transparent"
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        !notification.read ? "bg-primary/10" : "bg-muted"
                      }`}>
                        <Bell className={`h-5 w-5 ${!notification.read ? "text-purple-500" : "text-purple-500/50"}`} />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-semibold ${!notification.read ? "text-primary" : ""}`}>
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
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
      <div className="container space-y-8 py-12 page-content relative max-w-5xl">
        <div className="flex flex-col gap-3 animate-fade-in-down">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                Payment Methods
              </p>
              <h1 className="text-3xl font-bold">Your Payment Methods</h1>
              <p className="text-muted-foreground">
                Manage your saved payment methods for faster and secure checkout.
              </p>
            </div>
            <Button className="hover-lift" size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Method
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
                className={`hover-lift animate-fade-in-up transition-all ${
                  method.isDefault ? "border-2 border-primary/50 shadow-md bg-primary/5" : ""
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`h-14 w-14 rounded-lg flex items-center justify-center ${
                        method.type === "card" 
                          ? method.brand === "Visa"
                            ? method.isDefault ? "bg-blue-100" : "bg-blue-50"
                            : method.brand === "Mastercard"
                            ? method.isDefault ? "bg-red-100" : "bg-red-50"
                            : method.isDefault ? "bg-primary/20" : "bg-primary/10"
                          : method.isDefault ? "bg-yellow-100" : "bg-yellow-50"
                      }`}>
                        {method.type === "card" ? (
                          <CreditCard className={`h-7 w-7 ${
                            method.brand === "Visa"
                              ? method.isDefault ? "text-blue-600" : "text-blue-500"
                              : method.brand === "Mastercard"
                              ? method.isDefault ? "text-red-600" : "text-red-500"
                              : method.isDefault ? "text-orange-500" : "text-orange-500/70"
                          }`} />
                        ) : (
                          <div className={`h-7 w-7 rounded flex items-center justify-center ${
                            method.isDefault ? "bg-blue-600" : "bg-blue-500"
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
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Expires {method.expiryMonth}/{method.expiryYear} • {method.name}
                            </p>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-lg">PayPal</p>
                              {method.isDefault && (
                                <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
                                  Default
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
            ))
          )}
        </div>

        {/* Security Notice */}
        <Card className="hover-lift border-l-4 border-l-gray-700 bg-gray-100">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <ShieldCheck className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold">Secure Payment Processing</p>
                <p className="text-sm text-muted-foreground">
                  All payment methods are encrypted and securely stored. We never store your full card details.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Default dashboard view (discounts/history tabs)
  const totalBookings = mockBookings.length
  const upcomingBookings = mockBookings.filter(b => b.status === "confirmed" || b.status === "pending").length
  const totalSaved = mockSavedTrips.length
  const totalSpent = mockBookings.reduce((sum, b) => sum + b.amount, 0)

  const bookingOptions = [
    {
      title: "Hotels",
      description: "Book hotels & stays",
      icon: Hotel,
      href: "/hotels",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-gray-100",
    },
    {
      title: "Flights",
      description: "Domestic & International",
      icon: Plane,
      href: "/dashboard?tab=transportation",
        color: "from-gray-700 to-gray-500",
      bgColor: "bg-gray-100",
    },
    {
      title: "Trains",
      description: "Railway bookings",
      icon: Train,
      href: "/dashboard?tab=transportation",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-gray-100",
    },
    {
      title: "Buses",
      description: "Bus tickets",
      icon: Bus,
      href: "/dashboard?tab=transportation",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-gray-100",
    },
    {
      title: "Cabs",
      description: "Taxi & car rentals",
      icon: Car,
      href: "/dashboard?tab=transportation",
      color: "from-indigo-500 to-blue-500",
      bgColor: "bg-gray-100",
    },
    {
      title: "Packages",
      description: "Holiday packages",
      icon: Package,
      href: "/travel",
        color: "from-gray-600 to-gray-400",
      bgColor: "bg-gray-100",
    },
  ]

  const planningOptions = [
    {
      title: "Trip Planner",
      description: "Plan your complete itinerary",
      icon: Navigation,
      href: "/dashboard?tab=planner",
      color: "from-violet-500 to-purple-500",
      iconColor: "text-white",
      bgColor: "bg-gradient-to-br from-violet-500 to-purple-600",
    },
    {
      title: "Explore Destinations",
      description: "Discover amazing places",
      icon: Compass,
      href: "/travel",
      color: "from-cyan-500 to-blue-500",
      iconColor: "text-white",
      bgColor: "bg-gradient-to-br from-cyan-500 to-blue-600",
    },
    {
      title: "Restaurants",
      description: "Find best dining options",
      icon: UtensilsCrossed,
      href: "/travel",
      color: "from-amber-500 to-orange-500",
      iconColor: "text-white",
      bgColor: "bg-gradient-to-br from-amber-500 to-orange-600",
    },
    {
      title: "Activities",
      description: "Things to do & experiences",
      icon: Activity,
      href: "/travel",
      color: "from-emerald-500 to-teal-500",
      iconColor: "text-white",
      bgColor: "bg-gradient-to-br from-emerald-500 to-teal-600",
    },
    {
      title: "Shopping",
      description: "Best shopping destinations",
      icon: ShoppingBag,
      href: "/travel",
      color: "from-rose-500 to-pink-500",
      iconColor: "text-white",
      bgColor: "bg-gradient-to-br from-rose-500 to-pink-600",
    },
    {
      title: "Attractions",
      description: "Tourist spots & landmarks",
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
            <h1 className="text-3xl font-bold animate-fade-in-up">Welcome back, {mockUserProfile.name.split(' ')[0]}!</h1>
            <p className="text-muted-foreground animate-fade-in-up">
              Here's an overview of your travel activity and exclusive savings.
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
        <div className="space-y-6 animate-fade-in-up">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-stagger">
            <Card className="hover-lift border-l-4 border-l-gray-700" style={{ animationDelay: '0s' }}>
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
            <Card className="hover-lift border-l-4 border-l-gray-600" style={{ animationDelay: '0.1s' }}>
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
            <Card className="hover-lift border-l-4 border-l-gray-500" style={{ animationDelay: '0.2s' }}>
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
            <Card className="hover-lift border-l-4 border-l-gray-400" style={{ animationDelay: '0.3s' }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
                    <p className="text-2xl font-bold">${totalSpent.toLocaleString()}</p>
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
                Quick Bookings
              </CardTitle>
              <CardDescription>Book hotels, flights, trains, buses, cabs & packages instantly</CardDescription>
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
                            <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${option.color} text-white flex-shrink-0 group-hover:scale-110 transition-transform`}>
                              <Icon className="h-6 w-6" />
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
                Plan Your Trip
              </CardTitle>
              <CardDescription>Explore destinations, plan itineraries, and discover experiences</CardDescription>
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
