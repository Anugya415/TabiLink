"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  Search, 
  MapPin, 
  Star, 
  Wifi, 
  Car, 
  Dumbbell, 
  UtensilsCrossed, 
  ShieldCheck,
  BadgeCheck,
  Sparkles,
  Users,
  Heart,
  TrendingUp,
  CheckCircle2,
  Clock,
  Calendar,
  ArrowRight,
  Hotel,
  Bed,
  Waves,
  Mountain,
  Building2,
  SlidersHorizontal,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"

const hotels = [
  {
    id: 1,
    name: "Grand Luxury Hotel",
    location: "Paris, France",
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
    price: 299,
    originalPrice: 399,
    rating: 4.8,
    reviews: 1248,
    amenities: ["WiFi", "Parking", "Gym", "Restaurant", "Spa", "Pool"],
    description: "Luxury hotel in the heart of Paris with stunning city views and world-class amenities",
    category: "luxury",
    popular: true,
    discount: 25,
    distance: "0.5 km from city center",
  },
  {
    id: 2,
    name: "Oceanview Resort",
    location: "Bali, Indonesia",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    price: 189,
    originalPrice: 249,
    rating: 4.7,
    reviews: 892,
    amenities: ["WiFi", "Parking", "Gym", "Restaurant", "Beach Access", "Spa"],
    description: "Beachfront resort with private beach access, infinity pool, and luxury spa facilities",
    category: "beach",
    popular: true,
    discount: 24,
    distance: "Beachfront",
  },
  {
    id: 3,
    name: "Modern City Hotel",
    location: "Tokyo, Japan",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    price: 249,
    originalPrice: 299,
    rating: 4.9,
    reviews: 2156,
    amenities: ["WiFi", "Parking", "Gym", "Restaurant", "Business Center", "Concierge"],
    description: "Contemporary hotel with modern amenities, excellent service, and prime location",
    category: "business",
    popular: true,
    discount: 17,
    distance: "1.2 km from city center",
  },
  {
    id: 4,
    name: "Mountain View Lodge",
    location: "Switzerland",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    price: 349,
    originalPrice: 429,
    rating: 4.6,
    reviews: 543,
    amenities: ["WiFi", "Parking", "Gym", "Restaurant", "Ski Access", "Fireplace"],
    description: "Scenic mountain lodge with breathtaking alpine views and cozy atmosphere",
    category: "mountain",
    popular: false,
    discount: 19,
    distance: "Mountain location",
  },
  {
    id: 5,
    name: "Urban Boutique Hotel",
    location: "New York, USA",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    price: 279,
    originalPrice: 329,
    rating: 4.5,
    reviews: 1876,
    amenities: ["WiFi", "Parking", "Gym", "Restaurant", "Rooftop Bar", "Concierge"],
    description: "Stylish boutique hotel in Manhattan with rooftop bar and modern design",
    category: "boutique",
    popular: false,
    discount: 15,
    distance: "0.8 km from Times Square",
  },
  {
    id: 6,
    name: "Desert Oasis Resort",
    location: "Dubai, UAE",
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
    price: 399,
    originalPrice: 499,
    rating: 4.8,
    reviews: 1234,
    amenities: ["WiFi", "Parking", "Gym", "Restaurant", "Private Pool", "Butler Service"],
    description: "Luxurious desert resort with private pools, butler service, and exclusive amenities",
    category: "luxury",
    popular: true,
    discount: 20,
    distance: "Desert location",
  },
]

const categories = [
  { id: "all", label: "All Hotels", icon: Hotel },
  { id: "luxury", label: "Luxury", icon: Sparkles },
  { id: "beach", label: "Beach", icon: Waves },
  { id: "business", label: "Business", icon: Building2 },
  { id: "boutique", label: "Boutique", icon: Bed },
  { id: "mountain", label: "Mountain", icon: Mountain },
]

const amenityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  WiFi: Wifi,
  Parking: Car,
  Gym: Dumbbell,
  Restaurant: UtensilsCrossed,
  Spa: Sparkles,
  Pool: Waves,
  "Beach Access": Waves,
  "Business Center": Building2,
  Concierge: Users,
  "Ski Access": Mountain,
  Fireplace: Sparkles,
  "Rooftop Bar": UtensilsCrossed,
  "Private Pool": Waves,
  "Butler Service": Users,
}

export default function HotelsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("rating")
  const [priceRange, setPriceRange] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [checkInDate, setCheckInDate] = useState<Date>()
  const [checkOutDate, setCheckOutDate] = useState<Date>()
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useState<number[]>([])

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    )
  }

  const filteredHotels = hotels
    .filter((hotel) => {
      const matchesSearch =
        hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.location.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesPrice =
        priceRange === "all" ||
        (priceRange === "low" && hotel.price < 200) ||
        (priceRange === "mid" && hotel.price >= 200 && hotel.price < 300) ||
        (priceRange === "high" && hotel.price >= 300)
      const matchesCategory = selectedCategory === "all" || hotel.category === selectedCategory
      return matchesSearch && matchesPrice && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === "price") return a.price - b.price
      if (sortBy === "rating") return b.rating - a.rating
      if (sortBy === "popular") {
        if (a.popular && !b.popular) return -1
        if (!a.popular && b.popular) return 1
        return 0
      }
      return 0
    })

  const activeFiltersCount = [
    searchTerm,
    priceRange !== "all",
    selectedCategory !== "all",
    checkInDate,
    checkOutDate
  ].filter(Boolean).length

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="relative container py-16 md:py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium border border-gray-200">
              <Hotel className="h-4 w-4 text-gray-700" />
              <span className="text-gray-700">Premium Hotel Collection</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight text-gray-900">
              Discover Your Perfect Stay
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Explore thousands of handpicked hotels worldwide. Best prices, instant confirmation, and flexible cancellation policies.
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
              {[
                { icon: ShieldCheck, text: "Secure Bookings", color: "text-green-600" },
                { icon: BadgeCheck, text: "Best Price Guarantee", color: "text-yellow-600" },
                { icon: Sparkles, text: "Free Cancellation", color: "text-pink-600" },
                { icon: Users, text: "10M+ Happy Guests", color: "text-purple-600" },
              ].map((badge, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <badge.icon className={`h-4 w-4 ${badge.color}`} />
                  <span>{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar Section */}
      <section className="relative -mt-12 md:-mt-16 lg:-mt-20 z-10">
        <div className="container px-4 sm:px-6">
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardContent className="p-6 md:p-8">
              <div className="space-y-6">
                {/* Main Search */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search hotels, locations, or destinations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-14 text-base border-2 focus:border-primary"
                  />
                </div>

                {/* Date and Filters Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4 text-primary" />
                      Check In
                    </label>
                    <DatePicker
                      date={checkInDate}
                      onSelect={setCheckInDate}
                      placeholder="Select date"
                      className="w-full h-12"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4 text-primary" />
                      Check Out
                    </label>
                    <DatePicker
                      date={checkOutDate}
                      onSelect={setCheckOutDate}
                      placeholder="Select date"
                      className="w-full h-12"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={() => setShowFilters(!showFilters)}
                      variant={showFilters ? "default" : "outline"}
                      className="w-full h-12 gap-2"
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                      Filters
                      {activeFiltersCount > 0 && (
                        <span className="ml-1 px-2 py-0.5 bg-primary/20 rounded-full text-xs font-semibold">
                          {activeFiltersCount}
                        </span>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Expandable Filters */}
                {showFilters && (
                  <div className="pt-4 border-t space-y-4 animate-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold mb-2 block text-muted-foreground">
                          Sort By
                        </label>
                        <Select 
                          value={sortBy} 
                          onChange={(e) => setSortBy(e.target.value)}
                          className="h-12"
                        >
                          <option value="rating">Highest Rating</option>
                          <option value="price">Lowest Price</option>
                          <option value="popular">Most Popular</option>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-semibold mb-2 block text-muted-foreground">
                          Price Range
                        </label>
                        <Select 
                          value={priceRange} 
                          onChange={(e) => setPriceRange(e.target.value)}
                          className="h-12"
                        >
                          <option value="all">All Prices</option>
                          <option value="low">Under $200</option>
                          <option value="mid">$200 - $300</option>
                          <option value="high">Over $300</option>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchTerm("")
                          setSortBy("rating")
                          setPriceRange("all")
                          setSelectedCategory("all")
                          setCheckInDate(undefined)
                          setCheckOutDate(undefined)
                        }}
                        className="flex-1"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Clear All
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="container px-4 sm:px-6 py-8">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category) => {
            const Icon = category.icon
            const isActive = selectedCategory === category.id
            return (
              <Button
                key={category.id}
                variant={isActive ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`h-11 px-6 rounded-full transition-all duration-300 ${
                  isActive 
                    ? "shadow-lg scale-105" 
                    : "hover:scale-105 hover:shadow-md"
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {category.label}
              </Button>
            )
          })}
        </div>
      </section>

      {/* Results Section */}
      <section className="container px-4 sm:px-6 py-8 lg:py-12">
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              {filteredHotels.length} Hotel{filteredHotels.length !== 1 ? "s" : ""} Available
            </h2>
            <p className="text-muted-foreground">
              {searchTerm ? `Search results for "${searchTerm}"` : "Handpicked hotels for your perfect stay"}
            </p>
          </div>
        </div>

        {filteredHotels.length === 0 ? (
          <Card className="p-16 text-center border-2 border-dashed">
            <div className="space-y-4 max-w-md mx-auto">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mx-auto">
                <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">No hotels found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or filter criteria to find more options
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setSortBy("rating")
                    setPriceRange("all")
                    setSelectedCategory("all")
                    setCheckInDate(undefined)
                    setCheckOutDate(undefined)
                  }}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear All Filters
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {filteredHotels.map((hotel, index) => {
              const isFavorite = favorites.includes(hotel.id)
              return (
                <Card
                  key={hotel.id}
                  className="group overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-white"
                >
                  {/* Image Section */}
                  <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300">
                    <Image
                      src={hotel.image}
                      alt={hotel.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, (max-width: 1536px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                      {hotel.popular && (
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                          <TrendingUp className="h-3.5 w-3.5" />
                          Popular
                        </div>
                      )}
                      {hotel.originalPrice > hotel.price && (
                        <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                          Save ${hotel.originalPrice - hotel.price}
                        </div>
                      )}
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        toggleFavorite(hotel.id)
                      }}
                      className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-200 hover:scale-110 shadow-lg"
                    >
                      <Heart 
                        className={`h-5 w-5 transition-all duration-200 ${
                          isFavorite 
                            ? "fill-red-500 text-red-500 scale-110" 
                            : "text-gray-600"
                        }`} 
                      />
                    </button>

                    {/* Rating Badge */}
                    <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-bold">{hotel.rating}</span>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute bottom-4 left-4">
                      <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold capitalize shadow-lg">
                        {hotel.category}
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <CardHeader className="space-y-3 pb-3">
                    <div>
                      <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">
                        {hotel.name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 text-sm mt-1.5">
                        <MapPin className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        <span className="line-clamp-1">{hotel.location}</span>
                      </CardDescription>
                      {hotel.distance && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                          <MapPin className="h-3 w-3" />
                          {hotel.distance}
                        </p>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 pt-0">
                    {/* Description */}
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {hotel.description}
                    </p>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-2">
                      {hotel.amenities.slice(0, 4).map((amenity) => {
                        const Icon = amenityIcons[amenity]
                        return (
                          <div
                            key={amenity}
                            className="flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition-colors"
                          >
                            {Icon && <Icon className="h-3.5 w-3.5 text-primary" />}
                            <span className="text-muted-foreground font-medium">{amenity}</span>
                          </div>
                        )
                      })}
                      {hotel.amenities.length > 4 && (
                        <div className="flex items-center gap-1.5 text-xs bg-slate-100 px-2.5 py-1.5 rounded-lg">
                          <span className="text-muted-foreground font-medium">
                            +{hotel.amenities.length - 4} more
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Reviews */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
                      <Users className="h-4 w-4 text-purple-500 flex-shrink-0" />
                      <span className="font-medium">{hotel.reviews.toLocaleString()} verified reviews</span>
                    </div>

                    {/* Price Section */}
                    <div className="pt-4 border-t space-y-4">
                      <div className="flex items-baseline justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-3xl font-bold text-primary">
                              ${hotel.price}
                            </span>
                            <span className="text-sm text-muted-foreground font-medium">/ night</span>
                            {hotel.originalPrice > hotel.price && (
                              <>
                                <span className="text-sm text-muted-foreground line-through">
                                  ${hotel.originalPrice}
                                </span>
                                <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-md">
                                  {hotel.discount}% OFF
                                </span>
                              </>
                            )}
                          </div>
                          {checkInDate && checkOutDate && (
                            <p className="text-xs text-muted-foreground mt-2 font-medium">
                              Total: ${hotel.price * Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* CTA Button */}
                      <Button className="w-full h-12 text-base font-semibold gap-2 group/btn" asChild>
                        <Link href={`/hotels/${hotel.id}/book`}>
                          Book Now
                          <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="border-t bg-white py-16 lg:py-20">
        <div className="container px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Why Choose TabiLink Hotels?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're committed to providing you with the best hotel booking experience
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: ShieldCheck,
                title: "Secure Payments",
                description: "Your payment information is encrypted and secure with industry-leading protection",
                color: "bg-blue-100 text-blue-600",
              },
              {
                icon: CheckCircle2,
                title: "Instant Confirmation",
                description: "Get immediate booking confirmation via email with all the details you need",
                color: "bg-green-100 text-green-600",
              },
              {
                icon: Clock,
                title: "24/7 Support",
                description: "Round-the-clock assistance for all your travel needs, whenever you need us",
                color: "bg-purple-100 text-purple-600",
              },
            ].map((feature, idx) => (
              <Card key={idx} className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="flex justify-center">
                    <div className={`h-16 w-16 rounded-2xl ${feature.color} flex items-center justify-center`}>
                      <feature.icon className="h-8 w-8" />
                    </div>
                  </div>
                  <h3 className="font-bold text-xl">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
