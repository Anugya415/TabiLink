"use client"

import { useState } from "react"
import Link from "next/link"
import { MapPin, Star, Calendar, Users, Plane, ArrowRight } from "lucide-react"
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
    description: "Explore three of Europe's most iconic cities",
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
    description: "Luxury beachfront experience in tropical destinations",
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
    description: "Discover the best of Asian culture and cuisine",
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
    description: "Experience the opulence and adventure of the UAE",
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
    description: "Mountain adventures in the heart of the Alps",
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
  },
]

export default function TravelPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("rating")
  const [priceRange, setPriceRange] = useState("all")

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
      return matchesSearch && matchesPrice
    })
    .sort((a, b) => {
      if (sortBy === "price") return a.price - b.price
      if (sortBy === "rating") return b.rating - a.rating
      return 0
    })

  return (
    <div className="container py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Travel Packages</h1>
        <p className="text-muted-foreground">
          Discover amazing all-inclusive travel packages
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <Input
                placeholder="Search packages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Sort By</label>
              <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="rating">Highest Rating</option>
                <option value="price">Lowest Price</option>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Price Range</label>
              <Select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
                <option value="all">All Prices</option>
                <option value="low">Under $2,000</option>
                <option value="mid">$2,000 - $3,000</option>
                <option value="high">Over $3,000</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="mb-4">
        <p className="text-muted-foreground">
          {filteredPackages.length} package{filteredPackages.length !== 1 ? "s" : ""} found
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPackages.map((pkg) => (
          <Card key={pkg.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src={pkg.image}
                alt={pkg.title}
                className="w-full h-full object-cover"
              />
              {pkg.originalPrice > pkg.price && (
                <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground px-2 py-1 rounded text-xs font-semibold">
                  Save ${pkg.originalPrice - pkg.price}
                </div>
              )}
              <div className="absolute top-2 right-2 flex items-center space-x-1 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{pkg.rating}</span>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-xl">{pkg.title}</CardTitle>
              <CardDescription className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{pkg.destination}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {pkg.description}
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{pkg.duration}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Plane className="h-4 w-4" />
                  <span>{pkg.includes.join(", ")}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-primary">${pkg.price}</span>
                    {pkg.originalPrice > pkg.price && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${pkg.originalPrice}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {pkg.reviews} reviews
                  </p>
                </div>
              </div>
              <Button className="w-full" asChild>
                <Link href={`/travel/${pkg.id}/book`}>
                  Book Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

