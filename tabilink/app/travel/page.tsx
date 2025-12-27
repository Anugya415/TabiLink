"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useTranslation } from "@/contexts/TranslationContext"
import { 
  MapPin, 
  Star, 
  Calendar, 
  Users, 
  Plane, 
  ArrowRight, 
  Search,
  ShieldCheck,
  BadgeCheck,
  Sparkles,
  Heart,
  Clock,
  Globe2,
  TrendingUp,
  CheckCircle2,
  SlidersHorizontal,
  X,
  Package
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

// Categories moved inside component to use translations

export default function TravelPage() {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("rating")
  const [priceRange, setPriceRange] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useState<number[]>([])

  const categories = [
    { id: "all", label: t("allTypes"), icon: Globe2 },
    { id: "adventure", label: t("adventure"), icon: TrendingUp },
    { id: "beach", label: t("beach"), icon: Sparkles },
    { id: "cultural", label: t("cultural"), icon: MapPin },
    { id: "mountain", label: t("mountain"), icon: Globe2 },
  ]

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    )
  }

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

  const activeFiltersCount = [
    searchTerm,
    priceRange !== "all",
    selectedCategory !== "all"
  ].filter(Boolean).length

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="relative container py-16 md:py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium border border-gray-200">
              <Package className="h-4 w-4 text-gray-700" />
              <span className="text-gray-700">{t("premiumPackages")}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight text-gray-900">
              {t("discoverPackages")}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {t("explorePackagesDesc")}
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
              {[
                { icon: ShieldCheck, text: "Secure Bookings", color: "text-green-600" },
                { icon: BadgeCheck, text: "Best Price Guarantee", color: "text-yellow-600" },
                { icon: Sparkles, text: "24/7 Support", color: "text-pink-600" },
                { icon: Users, text: "15M+ Happy Travelers", color: "text-purple-600" },
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
                    placeholder="Search destinations, packages, or experiences..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-14 text-base border-2 focus:border-primary"
                  />
                </div>

                {/* Filters Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-end">
                    <Button
                      onClick={() => setShowFilters(!showFilters)}
                      variant={showFilters ? "default" : "outline"}
                      className="w-full h-12 gap-2"
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                      {t("filter")}
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
                          <option value="low">Under $2,000</option>
                          <option value="mid">$2,000 - $3,000</option>
                          <option value="high">Over $3,000</option>
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
              {filteredPackages.length} Package{filteredPackages.length !== 1 ? "s" : ""} Available
            </h2>
            <p className="text-muted-foreground">
              {searchTerm ? `Search results for "${searchTerm}"` : "Handpicked travel packages for your perfect adventure"}
            </p>
          </div>
        </div>

        {filteredPackages.length === 0 ? (
          <Card className="p-16 text-center border-2 border-dashed">
            <div className="space-y-4 max-w-md mx-auto">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mx-auto">
                <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">No packages found</h3>
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
            {filteredPackages.map((pkg, index) => {
              const isFavorite = favorites.includes(pkg.id)
              return (
                <Card
                  key={pkg.id}
                  className="group overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-white"
                >
                  {/* Image Section */}
                  <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300">
                    <Image
                      src={pkg.image}
                      alt={pkg.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, (max-width: 1536px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                      {pkg.popular && (
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                          <TrendingUp className="h-3.5 w-3.5" />
                          {t("popular")}
                        </div>
                      )}
                      {pkg.originalPrice > pkg.price && (
                        <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                          {t("save")} ${pkg.originalPrice - pkg.price}
                        </div>
                      )}
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        toggleFavorite(pkg.id)
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
                      <span className="text-sm font-bold">{pkg.rating}</span>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute bottom-4 left-4">
                      <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold capitalize shadow-lg">
                        {(() => {
                          const categoryMap: Record<string, string> = {
                            adventure: t("adventureCategory"),
                            beach: t("beachCategory"),
                            cultural: t("culturalCategory"),
                            mountain: t("mountainCategory"),
                          }
                          return categoryMap[pkg.category] || pkg.category
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <CardHeader className="space-y-3 pb-3">
                    <div>
                      <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">
                        {pkg.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 text-sm mt-1.5">
                        <MapPin className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        <span className="line-clamp-1">{pkg.destination}</span>
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 pt-0">
                    {/* Description */}
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {pkg.description}
                    </p>

                    {/* Details */}
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        <span className="font-medium">
                          {pkg.duration.replace(/Days/g, t("days")).replace(/Nights/g, t("nights"))}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Plane className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        <span className="line-clamp-1 font-medium">
                          {pkg.includes.map(item => {
                            const translationMap: Record<string, string> = {
                              "Flights": t("flights"),
                              "Hotels": t("hotels"),
                              "Resorts": t("resorts"),
                              "All Meals": t("allMeals"),
                              "Breakfast": t("breakfast"),
                              "Water Activities": t("waterActivities"),
                              "City Tours": t("cityTours"),
                              "Cultural Tours": t("culturalTours"),
                              "Desert Safari": t("desertSafari"),
                              "Ski Passes": t("skiPasses"),
                              "City Passes": t("cityPasses"),
                              "Mountain Hotels": t("mountainHotels"),
                              "Luxury Hotels": t("luxuryHotels"),
                            }
                            return translationMap[item] || item
                          }).join(" • ")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
                        <Users className="h-4 w-4 text-purple-500 flex-shrink-0" />
                        <span className="font-medium">{pkg.reviews.toLocaleString()} {t("reviews")}</span>
                      </div>
                    </div>

                    {/* Price Section */}
                    <div className="pt-4 border-t space-y-4">
                      <div className="flex items-baseline justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-3xl font-bold text-primary">
                              ${pkg.price.toLocaleString()}
                            </span>
                            {pkg.originalPrice > pkg.price && (
                              <>
                                <span className="text-sm text-muted-foreground line-through">
                                  ${pkg.originalPrice.toLocaleString()}
                                </span>
                                <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-md">
                                  {pkg.discount}% {t("off")}
                                </span>
                              </>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-2 font-medium">
                            {t("perPerson")}
                          </p>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <Button className="w-full h-12 text-base font-semibold gap-2 group/btn" asChild>
                        <Link href={`/travel/${pkg.id}/book`}>
                          {t("bookNow")}
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
            <h2 className="text-3xl font-bold mb-3">{t("whyChooseTabiLinkTravel")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("whyChooseTravelDesc")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: ShieldCheck,
                title: t("securePaymentsTitle"),
                description: t("securePaymentsDesc"),
                color: "bg-blue-100 text-blue-600",
              },
              {
                icon: CheckCircle2,
                title: t("instantConfirmation"),
                description: t("instantConfirmationDesc"),
                color: "bg-green-100 text-green-600",
              },
              {
                icon: Clock,
                title: t("support247Title"),
                description: t("support247Desc"),
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
