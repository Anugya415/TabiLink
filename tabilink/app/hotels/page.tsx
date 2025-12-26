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
  Filter,
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
  Building2
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

  return (
    <div className="flex flex-col bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b">
        <div className="container py-12 md:py-16 lg:py-20">
          <div className="space-y-6 animate-fade-in-down">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary animate-fade-in">
                Hotels & Stays
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight animate-fade-in-up">
                Find Your Perfect Stay
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up">
                Discover amazing hotels worldwide with best prices, instant confirmation, and flexible cancellation
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground animate-fade-in-up">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                <span>Secure Bookings</span>
              </div>
              <div className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-blue-500" />
                <span>Best Price Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                <span>Free Cancellation</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-500" />
                <span>10M+ Happy Guests</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters Section */}
      <section className="sticky top-0 z-[60] bg-white border-b shadow-md">
        <div className="container py-6">
          <Card className="shadow-lg border-2 hover-lift bg-white">
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-6">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search hotels, locations, or destinations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 text-base"
                  />
                </div>

                {/* Date Pickers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      Check In
                    </label>
                    <DatePicker
                      date={checkInDate}
                      onSelect={setCheckInDate}
                      placeholder="Select check-in date"
                      className="w-full"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      Check Out
                    </label>
                    <DatePicker
                      date={checkOutDate}
                      onSelect={setCheckOutDate}
                      placeholder="Select check-out date"
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Category Tabs */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => {
                    const Icon = category.icon
                    return (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        onClick={() => setSelectedCategory(category.id)}
                        className="hover-lift transition-all duration-300"
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {category.label}
                      </Button>
                    )
                  })}
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                      <Filter className="h-4 w-4 text-primary" />
                      Sort By
                    </label>
                    <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                      <option value="rating">Highest Rating</option>
                      <option value="price">Lowest Price</option>
                      <option value="popular">Most Popular</option>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      Price Range
                    </label>
                    <Select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
                      <option value="all">All Prices</option>
                      <option value="low">Under $200</option>
                      <option value="mid">$200 - $300</option>
                      <option value="high">Over $300</option>
                    </Select>
                  </div>
                  <div className="flex items-end">
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
                      className="w-full hover-lift"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Results Section */}
      <section className="container py-8 lg:py-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">
              {filteredHotels.length} Hotel{filteredHotels.length !== 1 ? "s" : ""} Found
            </h2>
            <p className="text-sm text-muted-foreground">
              {searchTerm ? `Search results for "${searchTerm}"` : "Explore our curated hotel collection"}
            </p>
          </div>
        </div>

        {filteredHotels.length === 0 ? (
          <Card className="p-12 text-center animate-fade-in">
            <div className="space-y-4">
              <Search className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <h3 className="text-xl font-semibold mb-2">No hotels found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filter criteria
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
                  className="hover-lift"
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredHotels.map((hotel, index) => (
              <Card
                key={hotel.id}
                className="overflow-hidden hover-lift transition-all duration-300 border-2 hover:border-primary group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Image Section */}
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={hotel.image}
                    alt={hotel.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {hotel.popular && (
                      <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        Popular
                      </div>
                    )}
                    {hotel.originalPrice > hotel.price && (
                      <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Save ${hotel.originalPrice - hotel.price}/night
                      </div>
                    )}
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-background/95 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold">{hotel.rating}</span>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute bottom-3 left-3">
                    <div className="bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium capitalize">
                      {hotel.category}
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <CardHeader className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {hotel.name}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover-lift"
                      onClick={(e) => {
                        e.preventDefault()
                        // Handle save functionality
                      }}
                    >
                      <Heart className="h-4 w-4 text-muted-foreground hover:text-red-500 transition-colors" />
                    </Button>
                  </div>
                  <CardDescription className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span className="line-clamp-1">{hotel.location}</span>
                  </CardDescription>
                  {hotel.distance && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {hotel.distance}
                    </p>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Description */}
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {hotel.description}
                  </p>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2">
                    {hotel.amenities.slice(0, 4).map((amenity) => {
                      const Icon = amenityIcons[amenity]
                      return (
                        <div
                          key={amenity}
                          className="flex items-center gap-1.5 text-xs bg-muted/50 px-2 py-1 rounded-md"
                        >
                          {Icon && <Icon className="h-3.5 w-3.5 text-blue-500" />}
                          <span className="text-muted-foreground">{amenity}</span>
                        </div>
                      )
                    })}
                    {hotel.amenities.length > 4 && (
                      <div className="flex items-center gap-1.5 text-xs bg-muted/50 px-2 py-1 rounded-md">
                        <span className="text-muted-foreground">+{hotel.amenities.length - 4} more</span>
                      </div>
                    )}
                  </div>

                  {/* Reviews */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4 text-purple-500 flex-shrink-0" />
                    <span>{hotel.reviews.toLocaleString()} verified reviews</span>
                  </div>

                  {/* Price Section */}
                  <div className="pt-4 border-t space-y-3">
                    <div className="flex items-baseline justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-2xl font-bold text-primary">
                            ${hotel.price}
                          </span>
                          <span className="text-sm text-muted-foreground">/ night</span>
                          {hotel.originalPrice > hotel.price && (
                            <>
                              <span className="text-sm text-muted-foreground line-through">
                                ${hotel.originalPrice}
                              </span>
                              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                                {hotel.discount}% OFF
                              </span>
                            </>
                          )}
                        </div>
                        {checkInDate && checkOutDate && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Total: ${hotel.price * Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Button className="w-full hover-lift" asChild>
                      <Link href={`/hotels/${hotel.id}/book`}>
                        Book Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="border-t bg-white py-12 lg:py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover-lift border-2">
              <CardContent className="p-6 text-center space-y-3">
                <div className="flex justify-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <ShieldCheck className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg">Secure Payments</h3>
                <p className="text-sm text-muted-foreground">
                  Your payment information is encrypted and secure
                </p>
              </CardContent>
            </Card>
            <Card className="hover-lift border-2">
              <CardContent className="p-6 text-center space-y-3">
                <div className="flex justify-center">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg">Instant Confirmation</h3>
                <p className="text-sm text-muted-foreground">
                  Get immediate booking confirmation via email
                </p>
              </CardContent>
            </Card>
            <Card className="hover-lift border-2">
              <CardContent className="p-6 text-center space-y-3">
                <div className="flex justify-center">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-purple-500" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg">24/7 Support</h3>
                <p className="text-sm text-muted-foreground">
                  Round-the-clock assistance for all your travel needs
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
