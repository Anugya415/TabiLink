"use client"

import Link from "next/link"
import Image from "next/image"
import { Search, MapPin, Star, Hotel, Plane, Shield, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { useState } from "react"

const featuredDestinations = [
  {
    id: 1,
    name: "Paris, France",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
    description: "The City of Light awaits you",
    price: "$899",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Tokyo, Japan",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
    description: "Experience ancient and modern Japan",
    price: "$1,299",
    rating: 4.9,
  },
  {
    id: 3,
    name: "Bali, Indonesia",
    image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80",
    description: "Tropical paradise for your perfect getaway",
    price: "$699",
    rating: 4.7,
  },
  {
    id: 4,
    name: "New York, USA",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80",
    description: "The city that never sleeps",
    price: "$799",
    rating: 4.6,
  },
]

const features = [
  {
    icon: Shield,
    title: "Secure Transactions",
    description: "Your payment information is encrypted and secure",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Our team is always here to help you",
  },
  {
    icon: Plane,
    title: "Best Deals",
    description: "Find the best prices on hotels and travel packages",
  },
  {
    icon: Users,
    title: "Expert Guidance",
    description: "Get personalized recommendations from travel experts",
  },
]

export default function Home() {
  const [checkInDate, setCheckInDate] = useState<Date>()
  const [checkOutDate, setCheckOutDate] = useState<Date>()
  const [destination, setDestination] = useState("")

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full py-12 sm:py-16 md:py-24 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-6 sm:space-y-8 text-center">
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tighter leading-tight px-4">
                Discover Your Next
                <span className="text-primary block sm:inline"> Adventure</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground text-base sm:text-lg md:text-xl px-4">
                Book hotels and travel packages with confidence. Secure transactions
                and seamless booking experience.
              </p>
            </div>

            {/* Search Bar */}
            <Card className="w-full max-w-4xl">
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium mb-2 block">Destination</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Where are you going?"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
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
                <Button className="w-full mt-4" size="lg" asChild>
                  <Link href="/hotels">
                    <Search className="mr-2 h-4 w-4" />
                    Search Hotels
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-12 sm:py-16 lg:py-20 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-3 sm:space-y-4 text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter px-4">
              Featured Destinations
            </h2>
            <p className="max-w-[700px] text-muted-foreground text-sm sm:text-base md:text-lg px-4">
              Explore our handpicked destinations for an unforgettable experience
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredDestinations.map((destination) => (
              <Card key={destination.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={destination.image}
                    alt={destination.name}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-2 right-2 flex items-center space-x-1 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{destination.rating}</span>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{destination.name}</CardTitle>
                  <CardDescription>{destination.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xl sm:text-2xl font-bold text-primary">{destination.price}</span>
                      <span className="text-sm text-muted-foreground"> / person</span>
                    </div>
                    <Button asChild className="w-full sm:w-auto">
                      <Link href={`/travel?destination=${destination.name}`}>Book Now</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center space-y-4">
                <div className="rounded-full bg-primary/10 p-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-6 sm:space-y-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter">
              Ready to Start Your Journey?
            </h2>
            <p className="max-w-[700px] text-base sm:text-lg opacity-90 px-4">
              Join thousands of satisfied travelers who have booked their dream trips with us
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
              <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
                <Link href="/hotels">Browse Hotels</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10">
                <Link href="/travel">View Packages</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
