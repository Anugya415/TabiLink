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
  { label: "Trips booked securely", value: "120k+" },
  { label: "Avg. traveler rating", value: "4.9/5" },
  { label: "Cities with partners", value: "180+" },
  { label: "Response time", value: "<2 min" },
]

export default function Home() {
  const [checkInDate, setCheckInDate] = useState<Date>()
  const [checkOutDate, setCheckOutDate] = useState<Date>()
  const [destination, setDestination] = useState("")
  const [travelers, setTravelers] = useState("2 adults")

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,_#a5b4fc_0,_transparent_35%)] animate-float" />
        <div className="container relative px-4 md:px-6 py-16 md:py-24 lg:py-28">
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
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium mb-2 block">
                        Destination
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="City, country, or landmark"
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Check in
                      </label>
                      <DatePicker
                        date={checkInDate}
                        onSelect={setCheckInDate}
                        placeholder="Choose date"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Check out
                      </label>
                      <DatePicker
                        date={checkOutDate}
                        onSelect={setCheckOutDate}
                        placeholder="Choose date"
                      />
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Travelers
                      </label>
                      <Input
                        value={travelers}
                        onChange={(e) => setTravelers(e.target.value)}
                        placeholder="2 adults"
                      />
                    </div>
                    <div className="flex items-end gap-3">
                      <Button size="lg" className="w-full" asChild>
                        <Link href="/hotels">
                          <Search className="mr-2 h-4 w-4" />
                          Find stays
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    No booking fees. Free changes on select fares. Rebooking help
                    is included.
                  </p>
                </CardContent>
              </Card>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Protected payments
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Flexible itineraries
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
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
        <div className="container px-4 md:px-6 py-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 text-center animate-stagger">
          {stats.map((item, index) => (
            <div key={item.label} className="space-y-2 hover-scale transition-transform" style={{ animationDelay: `${index * 0.1}s` }}>
              <p className="text-3xl font-bold">{item.value}</p>
              <p className="text-muted-foreground text-sm">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Collections */}
      <section className="py-14 sm:py-16 lg:py-20 bg-muted/40">
        <div className="container px-4 md:px-6 space-y-10">
          <div className="flex flex-col gap-3 text-center animate-fade-in-down">
            <h2 className="text-3xl sm:text-4xl font-bold">Pick your vibe</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hand-built collections to match how you like to travel.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-stagger">
            {collections.map((item, index) => (
              <Card key={item.title} className="shadow-sm h-full hover-lift" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader className="space-y-2">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary hover-scale transition-transform">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>{item.copy}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Journey support */}
      <section className="py-14 sm:py-16 lg:py-20 bg-background">
        <div className="container px-4 md:px-6 space-y-10">
          <div className="flex flex-col gap-3 text-center animate-fade-in-down">
            <h2 className="text-3xl sm:text-4xl font-bold">
              One journey, one support line
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every leg covered—from booking to check-in to getting home.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-stagger">
            {journeySteps.map((step, index) => (
              <Card key={step.title} className="shadow-sm h-full hover-lift" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader className="space-y-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary hover-scale transition-transform">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                  <CardDescription>{step.copy}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Map + assurance */}
      <section className="py-14 sm:py-16 lg:py-20 bg-muted/50">
        <div className="container px-4 md:px-6 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
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
                  <HeartHandshake className="h-4 w-4 text-primary" />
                  Loyalty that stacks
                </div>
                <p className="text-sm text-muted-foreground">
                  Member rates + partner perks applied automatically at checkout.
                </p>
              </div>
              <div className="rounded-lg border bg-background p-4 space-y-2 hover-lift transition-all duration-300">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <ShieldCheck className="h-4 w-4 text-primary" />
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
            <div className="relative h-[260px] w-full bg-gradient-to-br from-primary/15 via-background to-secondary/20">
              <div className="absolute inset-6 rounded-xl border border-dashed border-primary/40 bg-background/70 backdrop-blur" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Map className="h-32 w-32 text-primary/40" />
              </div>
            </div>
            <CardContent className="space-y-3 p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Globe2 className="h-4 w-4" />
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
      <section className="py-14 sm:py-16 lg:py-20 bg-background">
        <div className="container px-4 md:px-6 space-y-8">
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
                      <Star key={idx} className="h-4 w-4 fill-primary" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 sm:py-16 lg:py-20 bg-muted/40">
        <div className="container px-4 md:px-6 space-y-8">
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
      <section className="py-14 sm:py-16 lg:py-20 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6 text-center space-y-6 animate-fade-in-up">
          <div className="flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-wide animate-fade-in">
            <Globe2 className="h-4 w-4" />
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
