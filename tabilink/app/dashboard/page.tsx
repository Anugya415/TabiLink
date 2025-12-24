"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  Bus,
  CreditCard,
  MapPin,
  Plane,
  ShieldCheck,
  Train,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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

const travelHistory = [
  {
    destination: "Osaka, Japan",
    dates: "Mar 12 - Mar 18, 2024",
    bookingType: "Hotel + Rail",
    spend: "$1,180",
    perks: "15% member rate • Early check-in",
  },
  {
    destination: "Lisbon, Portugal",
    dates: "Nov 2 - Nov 8, 2023",
    bookingType: "Hotel + Flight",
    spend: "$1,420",
    perks: "Lounge access • Free breakfast",
  },
  {
    destination: "Seoul, South Korea",
    dates: "Jul 5 - Jul 11, 2023",
    bookingType: "Hotel only",
    spend: "$760",
    perks: "Late checkout • Room upgrade",
  },
]

export default function DashboardPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState<"discounts" | "history">("discounts")

  useEffect(() => {
    if (typeof window === "undefined") return
    const stored = localStorage.getItem("tabilinkDemoLoggedIn")
    setIsLoggedIn(stored === "1")
  }, [])

  return (
    <div className="container space-y-8 py-12 page-content">
      <div className="flex flex-col gap-3 animate-fade-in-down">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary animate-fade-in">
              Dashboard
            </p>
            <h1 className="text-3xl font-bold animate-fade-in-up">Your travel savings</h1>
            <p className="text-muted-foreground animate-fade-in-up">
              View discounts for places you have visited and current transport
              offers. This section unlocks after you sign in.
            </p>
          </div>
          {!isLoggedIn ? (
            <Button asChild className="hidden sm:inline-flex">
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
              <Button asChild>
                <Link href="/login">Login to view discounts</Link>
              </Button>
              <Button variant="outline" onClick={() => setIsLoggedIn(true)}>
                Preview as logged in
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 animate-fade-in-up">
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
                {travelHistory.map((trip, index) => (
                  <div
                    key={trip.destination + trip.dates}
                    className="flex flex-col gap-2 rounded-lg border bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between hover-lift transition-all duration-300"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="space-y-1">
                      <p className="font-semibold">{trip.destination}</p>
                      <p className="text-sm text-muted-foreground">{trip.dates}</p>
                      <p className="text-xs text-muted-foreground">
                        {trip.bookingType} • {trip.perks}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary hover-scale">
                        {trip.spend}
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

