"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, MapPin, Star, Wifi, Car, Dumbbell, UtensilsCrossed, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const hotels = [
  {
    id: 1,
    name: "Grand Luxury Hotel",
    location: "Paris, France",
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
    price: 299,
    rating: 4.8,
    reviews: 1248,
    amenities: ["WiFi", "Parking", "Gym", "Restaurant"],
    description: "Luxury hotel in the heart of Paris with stunning city views",
  },
  {
    id: 2,
    name: "Oceanview Resort",
    location: "Bali, Indonesia",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    price: 189,
    rating: 4.7,
    reviews: 892,
    amenities: ["WiFi", "Parking", "Gym", "Restaurant"],
    description: "Beachfront resort with private beach access and spa",
  },
  {
    id: 3,
    name: "Modern City Hotel",
    location: "Tokyo, Japan",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    price: 249,
    rating: 4.9,
    reviews: 2156,
    amenities: ["WiFi", "Parking", "Gym", "Restaurant"],
    description: "Contemporary hotel with modern amenities and excellent service",
  },
  {
    id: 4,
    name: "Mountain View Lodge",
    location: "Switzerland",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    price: 349,
    rating: 4.6,
    reviews: 543,
    amenities: ["WiFi", "Parking", "Gym", "Restaurant"],
    description: "Scenic mountain lodge with breathtaking alpine views",
  },
  {
    id: 5,
    name: "Urban Boutique Hotel",
    location: "New York, USA",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    price: 279,
    rating: 4.5,
    reviews: 1876,
    amenities: ["WiFi", "Parking", "Gym", "Restaurant"],
    description: "Stylish boutique hotel in Manhattan with rooftop bar",
  },
  {
    id: 6,
    name: "Desert Oasis Resort",
    location: "Dubai, UAE",
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
    price: 399,
    rating: 4.8,
    reviews: 1234,
    amenities: ["WiFi", "Parking", "Gym", "Restaurant"],
    description: "Luxurious desert resort with private pools and butler service",
  },
]

const amenityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  WiFi: Wifi,
  Parking: Car,
  Gym: Dumbbell,
  Restaurant: UtensilsCrossed,
}

export default function HotelsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("rating")
  const [priceRange, setPriceRange] = useState("all")
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
      return matchesSearch && matchesPrice
    })
    .sort((a, b) => {
      if (sortBy === "price") return a.price - b.price
      if (sortBy === "rating") return b.rating - a.rating
      return 0
    })

  return (
    <div className="container py-6 sm:py-8 px-4">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Find Your Perfect Hotel</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Search and compare hotels worldwide</p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6 sm:mb-8">
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by hotel name or location"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Check In</label>
              <DatePicker
                date={checkInDate}
                onSelect={setCheckInDate}
                placeholder="Check in"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Check Out</label>
              <DatePicker
                date={checkOutDate}
                onSelect={setCheckOutDate}
                placeholder="Check out"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
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
                <option value="low">Under $200</option>
                <option value="mid">$200 - $300</option>
                <option value="high">Over $300</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-muted-foreground">
          {filteredHotels.length} hotel{filteredHotels.length !== 1 ? "s" : ""} found
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredHotels.map((hotel) => (
          <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={hotel.image}
                alt={hotel.name}
                width={600}
                height={400}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute top-2 right-2 flex items-center space-x-1 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{hotel.rating}</span>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-xl">{hotel.name}</CardTitle>
              <CardDescription className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{hotel.location}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {hotel.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {hotel.amenities.map((amenity) => {
                  const Icon = amenityIcons[amenity]
                  return (
                    <div
                      key={amenity}
                      className="flex items-center space-x-1 text-xs text-muted-foreground"
                    >
                      {Icon && <Icon className="h-3 w-3" />}
                      <span>{amenity}</span>
                    </div>
                  )
                })}
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xl sm:text-2xl font-bold text-primary">${hotel.price}</span>
                  <span className="text-sm text-muted-foreground"> / night</span>
                  <p className="text-xs text-muted-foreground mt-1">
                    {hotel.reviews} reviews
                  </p>
                </div>
                <Button asChild className="w-full sm:w-auto">
                  <Link href={`/hotels/${hotel.id}/book`}>Book Now</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


