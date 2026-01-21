"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useTranslation } from "@/contexts/TranslationContext"
import api from "@/lib/api"
import { toast } from "sonner"
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
  X,
  Map as MapIcon,
  Save
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Slider } from "@/components/ui/slider"
import dynamic from 'next/dynamic'
import { SavedSearchList } from "@/components/hotels/SavedSearchList"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

const MapSearch = dynamic(() => import('@/components/hotels/MapSearch'), { ssr: false })

interface Hotel {
  id: number
  name: string
  location: string
  image: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  amenities: string[]
  description: string
  category: string
  popular: boolean
  discount?: number
  distance?: string
}

// Categories will be defined inside component to use translations

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
  const { t } = useTranslation()
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("rating")

  // Advanced State
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])

  const [selectedCategory, setSelectedCategory] = useState("all")
  const [checkInDate, setCheckInDate] = useState<Date>()
  const [checkOutDate, setCheckOutDate] = useState<Date>()
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useState<number[]>([])
  const [showMap, setShowMap] = useState(false)
  const [showSavedSearches, setShowSavedSearches] = useState(false)
  const [savedSearchName, setSavedSearchName] = useState("")
  const [isSavedSearchDialogOpen, setIsSavedSearchDialogOpen] = useState(false)

  const fetchHotels = async () => {
    try {
      setLoading(true)
      const response = await api.getHotels({
        search: searchTerm || undefined,
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        featured: true,
        minPrice: priceRange[0],
        maxPrice: priceRange[1] < 1000 ? priceRange[1] : undefined,
        checkIn: checkInDate?.toISOString(),
        checkOut: checkOutDate?.toISOString(),
      })

      // Transform API response to match frontend format
      const hotelsData = response.data?.hotels || []
      const transformedHotels = hotelsData.map((hotel: any) => ({
        id: hotel.id,
        name: hotel.name,
        location: `${hotel.locationCity || hotel.city}, ${hotel.locationCountry || hotel.country}`,
        image: hotel.images?.[0] || "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
        price: parseFloat(hotel.price || hotel.pricePerNight || 0),
        originalPrice: hotel.originalPrice ? parseFloat(hotel.originalPrice) : undefined,
        rating: hotel.rating || 0,
        reviews: hotel.totalReviews || 0,
        amenities: hotel.amenities || [],
        description: hotel.description || "",
        category: hotel.category || "luxury",
        popular: hotel.isPopular || false,
        discount: hotel.originalPrice ? Math.round(((parseFloat(hotel.originalPrice) - parseFloat(hotel.price || hotel.pricePerNight || 0)) / parseFloat(hotel.originalPrice)) * 100) : undefined,
        distance: hotel.distanceFromCityCenter ? `${hotel.distanceFromCityCenter} km from city center` : undefined,
      })) || []

      setHotels(transformedHotels)
    } catch (error: any) {
      console.error("Error fetching hotels:", error)
      toast.error("Failed to load hotels", {
        description: error.message || "Please try again later.",
      })
      // Fallback to empty array on error
      setHotels([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHotels()
  }, [searchTerm, selectedCategory, priceRange, checkInDate, checkOutDate]) // Re-fetch on any filter change (debouncing might be needed for slider in real app)

  const categories = [
    { id: "all", label: t("allCategories"), icon: Hotel },
    { id: "luxury", label: t("luxury"), icon: Sparkles },
    { id: "beach", label: t("beach"), icon: Waves },
    { id: "business", label: t("business"), icon: Building2 },
    { id: "boutique", label: "Boutique", icon: Bed },
    { id: "mountain", label: t("mountain"), icon: Mountain },
  ]

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id)
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    )
  }

  const handleSaveSearch = async () => {
    try {
      const criteria = {
        searchTerm,
        priceRange,
        selectedCategory,
        checkInDate,
        checkOutDate
      }
      await api.createSavedSearch(savedSearchName, criteria)
      toast.success("Search saved successfully!")
      setIsSavedSearchDialogOpen(false)
      setSavedSearchName("")
    } catch (error) {
      toast.error("Failed to save search. Please login first.")
    }
  }

  const applySavedSearch = (criteria: any) => {
    if (criteria.searchTerm) setSearchTerm(criteria.searchTerm)
    if (criteria.priceRange) setPriceRange(criteria.priceRange)
    if (criteria.selectedCategory) setSelectedCategory(criteria.selectedCategory)
    if (criteria.checkInDate) setCheckInDate(new Date(criteria.checkInDate))
    if (criteria.checkOutDate) setCheckOutDate(new Date(criteria.checkOutDate))
    toast.success("Saved search applied!")
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const activeFiltersCount = [
    searchTerm,
    priceRange[0] > 0 || priceRange[1] < 1000,
    selectedCategory !== "all",
    checkInDate,
    checkOutDate
  ].filter(Boolean).length

  return (
    <div className="min-h-screen bg-background">
      {showMap && <MapSearch hotels={hotels} onClose={() => setShowMap(false)} />}

      {/* Search Bar Section */}
      <section className="relative pt-8 pb-4 z-10">
        <div className="container px-4 sm:px-6">
          <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
            <CardContent className="p-6 md:p-8">
              <div className="space-y-6">
                {/* Main Search */}
                <div className="relative flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder={t("searchHotelsPlaceholder")}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 h-14 text-base border-2 focus:border-primary"
                    />
                  </div>
                  <Dialog open={isSavedSearchDialogOpen} onOpenChange={setIsSavedSearchDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="h-14 aspect-square" title="Save this search">
                        <Save className="h-5 w-5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Save Search</DialogTitle>
                        <DialogDescription>
                          Save these filters to easily find them later.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">Name</Label>
                          <Input id="name" value={savedSearchName} onChange={(e) => setSavedSearchName(e.target.value)} className="col-span-3" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleSaveSearch}>Save</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant={showSavedSearches ? "secondary" : "outline"}
                    className="h-14 aspect-square"
                    onClick={() => setShowSavedSearches(!showSavedSearches)}
                    title="View Saved Searches"
                  >
                    <Clock className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="default" // Primary color for map
                    className="h-14 aspect-square"
                    onClick={() => setShowMap(!showMap)}
                    title="Toggle Map View"
                  >
                    <MapIcon className="h-5 w-5" />
                  </Button>
                </div>

                {showSavedSearches && (
                  <div className="animate-in slide-in-from-top-2">
                    <SavedSearchList onApply={applySavedSearch} />
                  </div>
                )}

                {/* Date and Filters Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4 text-primary" />
                      {t("checkIn")}
                    </label>
                    <DatePicker
                      date={checkInDate}
                      onSelect={setCheckInDate}
                      placeholder={t("chooseDate")}
                      className="w-full h-12"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4 text-primary" />
                      {t("checkOut")}
                    </label>
                    <DatePicker
                      date={checkOutDate}
                      onSelect={setCheckOutDate}
                      placeholder={t("chooseDate")}
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-end">
                      <div>
                        <label className="text-sm font-semibold mb-2 block text-muted-foreground">
                          {t("sortBy")}
                        </label>
                        <Select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="h-12"
                        >
                          <option value="rating">{t("highestRating")}</option>
                          <option value="price">{t("lowestPrice")}</option>
                          <option value="popular">{t("mostPopular")}</option>
                        </Select>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-semibold block text-muted-foreground">
                            {t("priceRange") || "Price Range"}
                          </label>
                          <span className="text-xs font-bold text-primary">
                            ${priceRange[0]} - ${priceRange[1] >= 1000 ? "1000+" : priceRange[1]}
                          </span>
                        </div>
                        <Slider
                          value={priceRange}
                          min={0}
                          max={1000}
                          step={50}
                          minStepsBetweenThumbs={1}
                          onValueChange={(value) => setPriceRange(value as [number, number])}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchTerm("")
                          setSortBy("rating")
                          setPriceRange([0, 1000])
                          setSelectedCategory("all")
                          setCheckInDate(undefined)
                          setCheckOutDate(undefined)
                        }}
                        className="flex-1"
                      >
                        <X className="h-4 w-4 mr-2" />
                        {t("clearFilters")}
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
                className={`h-11 px-6 rounded-full transition-all duration-300 ${isActive
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
              {hotels.length} {t("hotelsAvailable")}
            </h2>
            <p className="text-muted-foreground">
              {searchTerm ? `${t("searchResultsFor")} "${searchTerm}"` : t("handpickedHotels")}
            </p>
          </div>
        </div>

        {hotels.length === 0 ? (
          <Card className="p-16 text-center border-2 border-dashed">
            <div className="space-y-4 max-w-md mx-auto">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mx-auto">
                <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">{t("noHotelsFound")}</h3>
                <p className="text-muted-foreground mb-6">
                  {t("tryAdjustingSearch")}
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setSortBy("rating")
                    setPriceRange([0, 1000])
                    setSelectedCategory("all")
                    setCheckInDate(undefined)
                    setCheckOutDate(undefined)
                  }}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  {t("clearAllFilters")}
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {hotels.map((hotel, index) => {
              const isFavorite = favorites.includes(hotel.id)
              return (
                <Card
                  key={hotel.id}
                  className="group overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-card"
                >
                  {/* Image Section */}
                  <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900">
                    <Link href={`/hotels/${hotel.id}`}>
                      <Image
                        src={hotel.image}
                        alt={hotel.name}
                        fill
                        sizes="(max-width: 1024px) 100vw, (max-width: 1536px) 50vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                    </Link>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                      {hotel.popular && (
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                          <TrendingUp className="h-3.5 w-3.5" />
                          {t("popular")}
                        </div>
                      )}
                      {hotel.originalPrice && hotel.originalPrice > hotel.price && (
                        <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                          {t("save")} ${hotel.originalPrice - hotel.price}
                        </div>
                      )}
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        toggleFavorite(hotel.id)
                      }}
                      className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-card/90 backdrop-blur-sm hover:bg-card transition-all duration-200 hover:scale-110 shadow-lg"
                    >
                      <Heart
                        className={`h-5 w-5 transition-all duration-200 ${isFavorite
                          ? "fill-red-500 text-red-500 scale-110"
                          : "text-muted-foreground"
                          }`}
                      />
                    </button>

                    {/* Rating Badge */}
                    <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-card/95 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-bold text-foreground">{hotel.rating}</span>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute bottom-4 left-4">
                      <div className="bg-card/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold capitalize shadow-lg text-foreground">
                        {(() => {
                          const categoryMap: Record<string, string> = {
                            luxury: t("luxuryCategory"),
                            beach: t("beachCategory"),
                            business: t("businessCategory"),
                            boutique: t("boutiqueCategory"),
                            mountain: t("mountainCategory"),
                          }
                          return categoryMap[hotel.category] || hotel.category
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <CardHeader className="space-y-3 pb-3">
                    <div>
                      <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">
                        <Link href={`/hotels/${hotel.id}`} className="hover:underline">
                          {hotel.name}
                        </Link>
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 text-sm mt-1.5">
                        <MapPin className="h-4 w-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                        <span className="line-clamp-1 text-muted-foreground">{hotel.location}</span>
                      </CardDescription>
                      {hotel.distance && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          {hotel.distance.includes("km from city center")
                            ? hotel.distance.replace("km from city center", t("kmFromCenter"))
                            : hotel.distance === "Beachfront"
                              ? t("beachfront")
                              : hotel.distance === "Desert location"
                                ? t("desertLocation")
                                : hotel.distance === "Mountain location"
                                  ? t("mountainLocation")
                                  : hotel.distance
                          }
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
                            className="flex items-center gap-1.5 text-xs bg-secondary hover:bg-secondary/80 px-2.5 py-1.5 rounded-lg transition-colors"
                          >
                            {Icon && <Icon className="h-3.5 w-3.5 text-primary" />}
                            <span className="text-muted-foreground font-medium">{amenity}</span>
                          </div>
                        )
                      })}
                      {hotel.amenities.length > 4 && (
                        <div className="flex items-center gap-1.5 text-xs bg-secondary px-2.5 py-1.5 rounded-lg">
                          <span className="text-muted-foreground font-medium">
                            +{hotel.amenities.length - 4} {t("more")}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Reviews */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t border-border">
                      <Users className="h-4 w-4 text-purple-500 dark:text-purple-400 flex-shrink-0" />
                      <span className="font-medium">{hotel.reviews.toLocaleString()} {t("reviews")}</span>
                    </div>

                    {/* Price Section */}
                    <div className="pt-4 border-t border-border space-y-4">
                      <div className="flex items-baseline justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-3xl font-bold text-primary">
                              ${hotel.price}
                            </span>
                            <span className="text-sm text-muted-foreground font-medium">/ {t("perNight")}</span>
                            {hotel.originalPrice && hotel.originalPrice > hotel.price && (
                              <>
                                <span className="text-sm text-muted-foreground line-through">
                                  ${hotel.originalPrice}
                                </span>
                                <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/20 px-2.5 py-1 rounded-md">
                                  {hotel.discount}% {t("off")}
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
                          {t("bookNow")}
                          <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full mt-2" asChild>
                        <Link href={`/hotels/${hotel.id}`}>
                          View Details
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
      <section className="border-t bg-background py-16 lg:py-20">
        <div className="container px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">{t("whyChooseTabiLinkHotels")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("whyChooseHotelsDesc")}
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
              <Card key={idx} className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card">
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
