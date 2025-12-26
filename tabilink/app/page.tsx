"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import {
  ArrowRight,
  BadgeCheck,
  Calendar,
  Compass,
  Globe2,
  HeartHandshake,
  Hotel,
  Leaf,
  Map,
  MapPin,
  Plane,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Train,
  Users,
  Percent,
  Tag,
  Gift,
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
import { DatePicker } from "@/components/ui/date-picker"

const featuredDestinations = [
  {
    title: "Kyoto Temples",
    location: "Kyoto, Japan",
    priceFrom: "$899",
    rating: 4.9,
    tag: "Member deal",
    image:
      "https://images.unsplash.com/photo-1545569341-9eb8b30979d8?w=1000&q=80",
  },
  {
    title: "Algarve Coast",
    location: "Faro, Portugal",
    priceFrom: "$1,120",
    rating: 4.8,
    tag: "Free breakfast",
    image:
      "https://images.unsplash.com/photo-1505764706515-aa95265c5abc?w=1000&q=80",
  },
  {
    title: "Northern Lights",
    location: "Tromsø, Norway",
    priceFrom: "$1,480",
    rating: 4.7,
    tag: "Popular now",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1000&q=80",
  },
]

const collections = [
  {
    title: "Weekend escapes",
    copy: "Fast, flexible trips with late checkout and priority support.",
    icon: Compass,
  },
  {
    title: "Work-friendly stays",
    copy: "Business-ready rooms with Wi‑Fi guarantees and quiet zones.",
    icon: BadgeCheck,
  },
  {
    title: "Family bundles",
    copy: "Suites, cribs, and airport pickups in one simple booking.",
    icon: Users,
  },
  {
    title: "Low-impact travel",
    copy: "Rail-first routes and eco-rated stays to shrink your footprint.",
    icon: Leaf,
  },
]

const journeySteps = [
  {
    title: "Book in one place",
    copy: "Flights, rail, and hotels combined with transparent pricing.",
    icon: Plane,
  },
  {
    title: "Stay flexible",
    copy: "Free changes on select fares and instant rebooking during delays.",
    icon: Calendar,
  },
  {
    title: "Protected on-trip",
    copy: "24/7 human support plus coverage for disruptions and baggage.",
    icon: ShieldCheck,
  },
  {
    title: "Earn & stack perks",
    copy: "Member rates, partner perks, and loyalty credits on every trip.",
    icon: Sparkles,
  },
]

const testimonials = [
  {
    name: "Priya K.",
    role: "Frequent traveler",
    quote:
      "TabiLink rebooked my delayed flight in minutes and kept my hotel check-in smooth. The discounts are real.",
  },
  {
    name: "Marco L.",
    role: "Remote founder",
    quote:
      "The rail + hotel bundles save time and money. I love the clean dashboard for upcoming trips.",
  },
  {
    name: "Isabella M.",
    role: "Designer",
    quote:
      "Loved the curated stays and the responsive support. Everything felt covered before I landed.",
  },
]

const faqs = [
  {
    question: "How do changes or cancellations work?",
    answer:
      "Many fares include free changes. For stricter tickets, we’ll surface exact fees before you confirm and handle rebooking for you.",
  },
  {
    question: "Do I get member rates automatically?",
    answer:
      "Yes. Sign in and eligible rates are applied. Stacked perks appear at checkout for flights, rail, and hotels.",
  },
  {
    question: "Is support really 24/7?",
    answer:
      "Absolutely. Live agents can rebook, escalate with partners, and coordinate your transfers at any hour.",
  },
]

const stats = [
  { label: "Happy Customers", value: "15M+" },
  { label: "Bookings Every Month", value: "1M+" },
  { label: "Countries Covered", value: "200+" },
  { label: "24/7 Support", value: "Always On" },
]

const offers = [
  {
    title: "Weekend Getaway Sale",
    description: "Flat 25% OFF on domestic hotels",
    code: "WEEKEND25",
    icon: Percent,
    gradient: "from-gray-700 to-gray-500",
  },
  {
    title: "International Flight Deals",
    description: "Save up to $200 on international flights",
    code: "FLY200",
    icon: Plane,
    gradient: "from-gray-600 to-gray-400",
  },
  {
    title: "Luxury Stays",
    description: "Extra 15% OFF on premium properties",
    code: "LUX15",
    icon: Tag,
    gradient: "from-gray-700 to-gray-500",
  },
  {
    title: "First Booking Bonus",
    description: "Get $50 instant discount on first booking",
    code: "FIRST50",
    icon: Gift,
    gradient: "from-gray-500 to-gray-300",
  },
]

export default function Home() {
  const [checkInDate, setCheckInDate] = useState<Date>()
  const [checkOutDate, setCheckOutDate] = useState<Date>()
  const [destination, setDestination] = useState("")
  const [travelers, setTravelers] = useState("2 adults")

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div className="container relative py-16 md:py-24 lg:py-28 z-10">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] items-center">
            <div className="space-y-6 animate-fade-in-left">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary animate-fade-in">
                TabiLink • Travel with confidence
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight animate-fade-in-up">
                Build smarter trips with protected bookings and real perks.
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl animate-fade-in-up">
                Search once for flights, trains, and stays. Lock member rates,
                stay flexible, and get human help when you need it.
              </p>

              <Card className="shadow-lg animate-scale-in hover-lift">
                <CardContent className="p-4 sm:p-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-start">
                    <div className="sm:col-span-2 flex flex-col space-y-2">
                      <label className="text-sm font-medium">
                        Destination
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500 z-10 pointer-events-none" />
                        <Input
                          placeholder="City, country, or landmark"
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          className="pl-10 h-9"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <label className="text-sm font-medium">
                        Check in
                      </label>
                      <DatePicker
                        date={checkInDate}
                        onSelect={setCheckInDate}
                        placeholder="Choose date"
                        className="w-full"
                      />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <label className="text-sm font-medium">
                        Check out
                      </label>
                      <DatePicker
                        date={checkOutDate}
                        onSelect={setCheckOutDate}
                        placeholder="Choose date"
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 items-start">
                    <div className="flex flex-col">
                      <label className="text-sm font-medium mb-2 block">
                        Travelers
                      </label>
                      <Input
                        value={travelers}
                        onChange={(e) => setTravelers(e.target.value)}
                        placeholder="2 adults"
                        className="h-9"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm font-medium mb-2 block opacity-0 pointer-events-none select-none">
                        Search
                      </label>
                      <Button className="w-full h-10 text-base font-semibold" asChild>
                        <Link href="/hotels">
                          <Search className="mr-2 h-5 w-5" />
                          SEARCH HOTELS
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
                      <span>Secure Payments</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BadgeCheck className="h-3.5 w-3.5 text-blue-500" />
                      <span>Best Price Guaranteed</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-purple-500" />
                      <span>15M+ Happy Users</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-green-500" />
                  Protected payments
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  Flexible itineraries
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-500" />
                  24/7 human support
                </div>
              </div>
            </div>

            <Card className="shadow-xl border-0 bg-background/90 backdrop-blur animate-fade-in-right hover-lift">
              <CardHeader>
                <CardTitle>Featured destinations</CardTitle>
                <CardDescription>Curated stays with member perks.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {featuredDestinations.map((trip, index) => (
                  <div
                    key={trip.title}
                    className="flex items-center gap-4 rounded-lg border bg-muted/50 p-3 hover-lift transition-all duration-300"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative h-20 w-24 overflow-hidden rounded-md hover-scale transition-transform">
                      <Image
                        src={trip.image}
                        alt={trip.title}
                        fill
                        sizes="120px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-semibold">{trip.title}</p>
                      <p className="text-xs text-muted-foreground">{trip.location}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{trip.rating}</span>
                        <span className="text-muted-foreground">({trip.priceFrom})</span>
                      </div>
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {trip.tag}
                    </span>
                  </div>
                ))}
                <Button variant="outline" className="w-full hover-lift" asChild>
                  <Link href="/travel">
                    Browse more
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y bg-background">
        <div className="container py-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 text-center animate-stagger">
          {stats.map((item, index) => (
            <div key={item.label} className="space-y-2 hover-scale transition-transform" style={{ animationDelay: `${index * 0.1}s` }}>
              <p className="text-3xl font-bold">{item.value}</p>
              <p className="text-muted-foreground text-sm">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Offers & Deals Section */}
      <section className="py-14 sm:py-16 lg:py-20 bg-white relative overflow-hidden">
        <div className="container space-y-10 relative z-10">
          <div className="flex flex-col gap-3 text-center animate-fade-in-down">
            <h2 className="text-3xl sm:text-4xl font-bold">Exclusive Offers & Deals</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Save big on your next adventure with our special promotions and discounts
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-stagger">
            {offers.map((offer, index) => {
              const Icon = offer.icon
              return (
                <Card key={offer.code} className="shadow-xl border-2 border-gray-200 hover:border-gray-600 hover:shadow-2xl transition-all duration-300 hover-lift overflow-hidden group h-full flex flex-col bg-white relative" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardHeader className="space-y-4 flex-shrink-0 p-6 pb-4">
                    {/* Icon with enhanced styling */}
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-black border-2 border-black shadow-lg group-hover:scale-110 group-hover:shadow-xl group-hover:border-gray-800 transition-all duration-300 relative overflow-hidden">
                      <Icon className="h-8 w-8 text-white drop-shadow-sm" />
                    </div>
                    
                    <div className="space-y-2">
                      <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors leading-tight">{offer.title}</CardTitle>
                      <CardDescription className="text-sm leading-relaxed text-muted-foreground">{offer.description}</CardDescription>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1 flex flex-col justify-end p-6 pt-4">
                    {/* Enhanced code section */}
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-gray-50 via-gray-100/80 to-gray-50 border-2 border-gray-200 group-hover:border-gray-400 group-hover:bg-gradient-to-r group-hover:from-gray-100 group-hover:via-gray-200/80 group-hover:to-gray-100 transition-all duration-300">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Code:</span>
                      </div>
                      <span className="font-mono font-bold text-lg text-primary tracking-wider group-hover:scale-105 transition-transform duration-300">{offer.code}</span>
                    </div>
                    
                    {/* Subtle decorative element */}
                    <div className="mt-4 flex items-center justify-center gap-1.5 opacity-40 group-hover:opacity-60 transition-opacity">
                      <div className="h-1.5 w-1.5 rounded-full bg-gray-500" />
                      <div className="h-1.5 w-1.5 rounded-full bg-gray-500" />
                      <div className="h-1.5 w-1.5 rounded-full bg-gray-500" />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="py-14 sm:py-16 lg:py-20 bg-white relative overflow-hidden">
        <div className="container space-y-10 relative z-10">
          <div className="flex flex-col gap-3 text-center animate-fade-in-down">
            <h2 className="text-3xl sm:text-4xl font-bold">Pick your vibe</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hand-built collections to match how you like to travel.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-stagger">
            {collections.map((item, index) => {
              const iconColors: Record<string, string> = {
                "Weekend escapes": "text-blue-500",
                "Work-friendly stays": "text-blue-500",
                "Family bundles": "text-purple-500",
                "Low-impact travel": "text-green-500",
              }
              const Icon = item.icon
              const iconColor = iconColors[item.title] || "text-blue-500"
              return (
                <Card key={item.title} className="shadow-sm h-full hover-lift" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardHeader className="space-y-2">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 ${iconColor} hover-scale transition-transform`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>{item.copy}</CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Journey support */}
      <section className="py-14 sm:py-16 lg:py-20 bg-white relative overflow-hidden">
        <div className="container space-y-10 relative z-10">
          <div className="flex flex-col gap-3 text-center animate-fade-in-down">
            <h2 className="text-3xl sm:text-4xl font-bold">
              One journey, one support line
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every leg covered—from booking to check-in to getting home.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-stagger">
            {journeySteps.map((step, index) => {
              const iconColors: Record<string, string> = {
                "Book in one place": "text-blue-500",
                "Stay flexible": "text-blue-500",
                "Protected on-trip": "text-green-500",
                "Earn & stack perks": "text-yellow-500",
              }
              const Icon = step.icon
              const iconColor = iconColors[step.title] || "text-blue-500"
              return (
                <Card key={step.title} className="shadow-sm h-full hover-lift" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardHeader className="space-y-2">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 ${iconColor} hover-scale transition-transform`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                    <CardDescription>{step.copy}</CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Map + assurance */}
      <section className="py-14 sm:py-16 lg:py-20 bg-white relative overflow-hidden">
        <div className="container px-4 md:px-6 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center relative z-10">
          <div className="space-y-6 animate-fade-in-left">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Coverage + confidence
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
              Stay protected and keep earning on every route.
            </h2>
            <p className="text-muted-foreground">
              Instant confirmations, disruption coverage, and loyalty that stacks
              with airline and hotel programs. Transparent prices before you pay.
            </p>
            <div className="grid gap-3 md:grid-cols-2 animate-stagger">
              <div className="rounded-lg border bg-background p-4 space-y-2 hover-lift transition-all duration-300">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <HeartHandshake className="h-4 w-4 text-red-500" />
                  Loyalty that stacks
                </div>
                <p className="text-sm text-muted-foreground">
                  Member rates + partner perks applied automatically at checkout.
                </p>
              </div>
              <div className="rounded-lg border bg-background p-4 space-y-2 hover-lift transition-all duration-300">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <ShieldCheck className="h-4 w-4 text-green-500" />
                  Protected changes
                </div>
                <p className="text-sm text-muted-foreground">
                  Free changes on select fares and priority support when plans shift.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="hover-lift">
                <Link href="/signup">Create free account</Link>
              </Button>
              <Button variant="outline" asChild className="hover-lift">
                <Link href="/about">See how we protect trips</Link>
              </Button>
            </div>
          </div>
          <Card className="shadow-lg overflow-hidden animate-fade-in-right hover-lift">
            <div className="relative h-[260px] w-full bg-white">
              <div className="absolute inset-6 rounded-lg border border-dashed border-primary/40 bg-background/70 backdrop-blur" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Map className="h-32 w-32 text-blue-500/40" />
              </div>
            </div>
            <CardContent className="space-y-3 p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Globe2 className="h-4 w-4 text-blue-500" />
                Live coverage in 50+ countries
              </div>
              <p className="text-sm text-muted-foreground">
                Local partners, vetted transport options, and on-the-ground support
                when you need it.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-14 sm:py-16 lg:py-20 bg-background relative overflow-hidden">
        <div className="container px-4 md:px-6 space-y-8 relative z-10">
          <div className="flex flex-col gap-3 text-center animate-fade-in-down">
            <h2 className="text-3xl sm:text-4xl font-bold">Travelers trust TabiLink</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Real stories from people who needed reliable booking and fast support.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3 animate-stagger">
            {testimonials.map((item, index) => (
              <Card key={item.name} className="shadow-sm hover-lift" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold hover-scale transition-transform">
                      {item.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.role}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{item.quote}</p>
                  <div className="flex items-center gap-1 text-primary">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 sm:py-16 lg:py-20 bg-white relative overflow-hidden">
        <div className="container px-4 md:px-6 space-y-8 relative z-10">
          <div className="flex flex-col gap-3 text-center animate-fade-in-down">
            <h2 className="text-3xl sm:text-4xl font-bold">Questions, answered</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Straightforward policies and real humans when you need them.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-stagger">
            {faqs.map((faq, index) => (
              <Card key={faq.question} className="shadow-sm h-full hover-lift" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <CardTitle className="text-base">{faq.question}</CardTitle>
                  <CardDescription>{faq.answer}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 sm:py-16 lg:py-20 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="container px-4 md:px-6 text-center space-y-6 animate-fade-in-up relative z-10">
          <div className="flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-wide animate-fade-in">
            <Globe2 className="h-4 w-4 text-primary-foreground" />
            Travel made simple
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight animate-fade-in-up">
            Start your next trip with better rates and real support.
          </h2>
          <p className="max-w-3xl mx-auto text-base sm:text-lg opacity-90 animate-fade-in-up">
            Plan once, manage everywhere. Flights, trains, and stays covered with
            member perks included.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" variant="secondary" className="hover-lift">
              <Link href="/signup">Create free account</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover-lift"
            >
              <Link href="/travel">Browse packages</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

