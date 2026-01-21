"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useTranslation } from "@/contexts/TranslationContext"
import api from "@/lib/api"
import { toast } from "sonner"
import {
    MapPin,
    Star,
    Users,
    Wifi,
    Car,
    Dumbbell,
    UtensilsCrossed,
    Sparkles,
    Waves,
    Building2,
    Mountain,
    Bed,
    ArrowRight,
    ChevronLeft,
    Heart
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ShareButton } from "@/components/social/ShareButton"
import { ReviewSection } from "@/components/social/ReviewSection"

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

export default function HotelDetailsPage() {
    const { id } = useParams()
    const router = useRouter()
    const { t } = useTranslation()
    const [hotel, setHotel] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchHotel = async () => {
            try {
                setLoading(true)
                const res: any = await api.getHotel(id as string)
                if (res.success) {
                    setHotel(res.data.hotel)
                }
            } catch (error) {
                console.error("Error fetching hotel:", error)
                toast.error("Failed to load hotel details")
                router.push('/hotels')
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            fetchHotel()
        }
    }, [id, router])

    if (loading) {
        return (
            <div className="container py-8 space-y-8">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-96 w-full rounded-xl" />
                <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-2 space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        )
    }

    if (!hotel) return null

    return (
        <div className="min-h-screen bg-background pb-12">
            {/* Hero Section */}
            <div className="relative h-[60vh] w-full overflow-hidden">
                <Image
                    src={hotel.images?.[0] || "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&q=80"}
                    alt={hotel.name}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-black/30" />
                <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-10">
                    <Button variant="ghost" className="text-white hover:bg-white/20" onClick={() => router.back()}>
                        <ChevronLeft className="h-6 w-6 mr-2" />
                        Back to Hotels
                    </Button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 container">
                    <div className="max-w-4xl text-white space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-primary/90 rounded-full text-xs font-bold uppercase tracking-wider">
                                {hotel.category}
                            </span>
                            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-bold">{hotel.rating}</span>
                                <span className="text-xs text-gray-300">({hotel.totalReviews} reviews)</span>
                            </div>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">{hotel.name}</h1>
                        <div className="flex items-center gap-2 text-lg text-gray-200">
                            <MapPin className="h-5 w-5" />
                            {hotel.locationCity}, {hotel.locationCountry}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container px-4 sm:px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="col-span-1 lg:col-span-2 space-y-8">
                        {/* Description */}
                        <section>
                            <h2 className="text-2xl font-bold mb-4">About this hotel</h2>
                            <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-line">
                                {hotel.description}
                            </p>
                        </section>

                        {/* Amenities */}
                        <section>
                            <h3 className="text-xl font-bold mb-4">Amenities</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {hotel.amenities?.map((amenity: string) => {
                                    const Icon = amenityIcons[amenity] || Star
                                    return (
                                        <div key={amenity} className="flex items-center gap-3 p-3 bg-card border rounded-lg">
                                            <Icon className="h-5 w-5 text-primary" />
                                            <span>{amenity}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </section>

                        {/* Reviews */}
                        <section className="pt-8 border-t">
                            <ReviewSection hotelId={hotel.id} />
                        </section>
                    </div>

                    {/* Sidebar / Booking Card */}
                    <div className="col-span-1">
                        <div className="sticky top-24 space-y-6">
                            <Card className="shadow-xl border-t-4 border-t-primary">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Price starts from</p>
                                            <div className="flex items-baseline gap-2">
                                                <h3 className="text-3xl font-bold text-primary">${hotel.pricePerNight}</h3>
                                                <span className="text-muted-foreground">/ night</span>
                                            </div>
                                            {hotel.originalPrice && (
                                                <div className="text-sm line-through text-muted-foreground mt-1">
                                                    ${hotel.originalPrice}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <ShareButton
                                                title={`Check out ${hotel.name} on TabiLink`}
                                                text={`I found this amazing hotel: ${hotel.name} in ${hotel.locationCity}!`}
                                            />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            <span>Suitable for families & couples</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Bed className="h-4 w-4 text-muted-foreground" />
                                            <span>Multiple room types available</span>
                                        </div>
                                    </div>

                                    <Button className="w-full h-12 text-lg font-bold" size="lg" asChild>
                                        <Link href={`/hotels/${hotel.id}/book`}>
                                            Book Now
                                        </Link>
                                    </Button>

                                    <p className="text-xs text-center text-muted-foreground">
                                        No credit card required for reservation
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Location preview (mock map) */}
                            <div className="bg-muted rounded-lg h-48 w-full flex items-center justify-center relative overflow-hidden group cursor-not-allowed">
                                <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800" />
                                <MapPin className="h-8 w-8 text-primary relative z-10" />
                                <p className="absolute bottom-2 text-xs text-muted-foreground z-10 bg-background/80 px-2 py-1 rounded">
                                    {hotel.address}, {hotel.locationCity}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
