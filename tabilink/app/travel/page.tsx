"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  MapPin, 
  Star, 
  Calendar, 
  Users, 
  Plane, 
  ArrowRight, 
  Search,
  Filter,
  ShieldCheck,
  BadgeCheck,
  Sparkles,
  Heart,
  Clock,
  Globe2,
  TrendingUp,
  CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"

const travelPackages = [
  {
    id: 1,
    title: "European Adventure",
    destination: "Paris, Rome, Barcelona",
    image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&q=80",
    duration: "7 Days / 6 Nights",
    price: 1899,
    originalPrice: 2299,
    rating: 4.8,
    reviews: 892,
    includes: ["Flights", "Hotels", "Breakfast", "City Tours"],
    description: "Explore three of Europe's most iconic cities with guided tours and luxury accommodations",
    category: "adventure",
    popular: true,
    discount: 17,
  },
  {
    id: 2,
    title: "Tropical Paradise",
    destination: "Maldives, Bali",
    image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80",
    duration: "10 Days / 9 Nights",
    price: 2499,
    originalPrice: 2999,
    rating: 4.9,
    reviews: 1234,
    includes: ["Flights", "Resorts", "All Meals", "Water Activities"],
    description: "Luxury beachfront experience in tropical destinations with all-inclusive resorts",
    category: "beach",
    popular: true,
    discount: 17,
  },
  {
    id: 3,
    title: "Asian Discovery",
    destination: "Tokyo, Seoul, Singapore",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
    duration: "12 Days / 11 Nights",
    price: 2799,
    originalPrice: 3299,
    rating: 4.7,
    reviews: 756,
    includes: ["Flights", "Hotels", "Breakfast", "Cultural Tours"],
    description: "Discover the best of Asian culture and cuisine with immersive experiences",
    category: "cultural",
    popular: false,
    discount: 15,
  },
  {
    id: 4,
    title: "Desert Safari Experience",
    destination: "Dubai, Abu Dhabi",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
    duration: "5 Days / 4 Nights",
    price: 1499,
    originalPrice: 1899,
    rating: 4.6,
    reviews: 634,
    includes: ["Flights", "Luxury Hotels", "Desert Safari", "City Tours"],
    description: "Experience the opulence and adventure of the UAE with desert safaris",
    category: "adventure",
    popular: false,
    discount: 21,
  },
  {
    id: 5,
    title: "Alpine Wonderland",
    destination: "Switzerland, Austria",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    duration: "8 Days / 7 Nights",
    price: 2199,
    originalPrice: 2599,
    rating: 4.8,
    reviews: 1023,
    includes: ["Flights", "Mountain Hotels", "Breakfast", "Ski Passes"],
    description: "Mountain adventures in the heart of the Alps with stunning views",
    category: "mountain",
    popular: true,
    discount: 15,
  },
  {
    id: 6,
    title: "Americas Explorer",
    destination: "New York, Miami, Los Angeles",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80",
    duration: "14 Days / 13 Nights",
    price: 3299,
    originalPrice: 3899,
    rating: 4.7,
    reviews: 1125,
    includes: ["Flights", "Hotels", "Breakfast", "City Passes"],
    description: "Coast-to-coast journey through iconic American cities",
    category: "adventure",
    popular: false,
    discount: 15,
  },
]

const categories = [
  { id: "all", label: "All Packages", icon: Globe2 },
  { id: "adventure", label: "Adventure", icon: TrendingUp },
  { id: "beach", label: "Beach", icon: Sparkles },
  { id: "cultural", label: "Cultural", icon: MapPin },
  { id: "mountain", label: "Mountain", icon: Globe2 },
]

export default function TravelPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("rating")
  const [priceRange, setPriceRange] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredPackages = travelPackages
    .filter((pkg) => {
      const matchesSearch =
        pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.destination.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesPrice =
        priceRange === "all" ||
        (priceRange === "low" && pkg.price < 2000) ||
        (priceRange === "mid" && pkg.price >= 2000 && pkg.price < 3000) ||
        (priceRange === "high" && pkg.price >= 3000)
      const matchesCategory = selectedCategory === "all" || pkg.category === selectedCategory
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
                Travel Packages
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight animate-fade-in-up">
                Discover Your Perfect Adventure
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up">
                All-inclusive packages with flights, hotels, and experiences. Book with confidence and save more.
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
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-500" />
                <span>15M+ Happy Travelers</span>
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
                    placeholder="Search destinations, packages, or experiences..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 text-base"
                  />
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
                      <option value="low">Under $2,000</option>
                      <option value="mid">$2,000 - $3,000</option>
                      <option value="high">Over $3,000</option>
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
              {filteredPackages.length} Package{filteredPackages.length !== 1 ? "s" : ""} Found
            </h2>
            <p className="text-sm text-muted-foreground">
              {searchTerm ? `Search results for "${searchTerm}"` : "Explore our curated travel packages"}
            </p>
          </div>
        </div>

        {filteredPackages.length === 0 ? (
          <Card className="p-12 text-center animate-fade-in">
            <div className="space-y-4">
              <Search className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <h3 className="text-xl font-semibold mb-2">No packages found</h3>
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
            {filteredPackages.map((pkg, index) => (
              <Card
                key={pkg.id}
                className="overflow-hidden hover-lift transition-all duration-300 border-2 hover:border-primary group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Image Section */}
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={pkg.image}
                    alt={pkg.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {pkg.popular && (
                      <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        Popular
                      </div>
                    )}
                    {pkg.originalPrice > pkg.price && (
                      <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Save ${pkg.originalPrice - pkg.price}
                      </div>
                    )}
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-background/95 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold">{pkg.rating}</span>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute bottom-3 left-3">
                    <div className="bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium capitalize">
                      {pkg.category}
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <CardHeader className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {pkg.title}
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
                    <span className="line-clamp-1">{pkg.destination}</span>
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Description */}
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {pkg.description}
                  </p>

                  {/* Details */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span>{pkg.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Plane className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span className="line-clamp-1">{pkg.includes.join(" • ")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4 text-purple-500 flex-shrink-0" />
                      <span>{pkg.reviews.toLocaleString()} verified reviews</span>
                    </div>
                  </div>

                  {/* Price Section */}
                  <div className="pt-4 border-t space-y-3">
                    <div className="flex items-baseline justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-2xl font-bold text-primary">
                            ${pkg.price.toLocaleString()}
                          </span>
                          {pkg.originalPrice > pkg.price && (
                            <>
                              <span className="text-sm text-muted-foreground line-through">
                                ${pkg.originalPrice.toLocaleString()}
                              </span>
                              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                                {pkg.discount}% OFF
                              </span>
                            </>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          per person
                        </p>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Button className="w-full hover-lift" asChild>
                      <Link href={`/travel/${pkg.id}/book`}>
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
