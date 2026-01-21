"use client"

import { useEffect, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import Link from 'next/link'

// Dynamic import in parent or here? leaflet needs window.
import dynamic from 'next/dynamic'

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })

// Leaflet icon fix
import L from 'leaflet'

const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
})

interface Hotel {
    id: number
    name: string
    location: string
    price: number
    image: string
    // coordinates?: { lat: number, lng: number } // Assuming we might add this later.
    // For now, I'll mock coordinates based on id/index if not present or expect them.
}

interface MapSearchProps {
    hotels: Hotel[]
    onClose: () => void
}

export default function MapSearch({ hotels, onClose }: MapSearchProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    // Mock coordinates centered around a city (e.g., Paris approx) + randomness if real ones missing
    // Real app should have lat/lng in hotel model.
    const getCoords = (index: number) => ({
        lat: 48.8566 + (Math.random() - 0.5) * 0.1,
        lng: 2.3522 + (Math.random() - 0.5) * 0.1
    })

    // Center on first hotel or default
    const center: [number, number] = [48.8566, 2.3522]

    return (
        <div className="fixed inset-0 top-16 z-[49] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 animate-in fade-in zoom-in-95">
            <div className="relative w-full h-full max-w-6xl bg-card rounded-xl shadow-2xl border overflow-hidden flex flex-col">
                <div className="p-4 border-b flex justify-between items-center bg-card z-10">
                    <h3 className="font-bold text-lg">Map View</h3>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div className="flex-1 relative">
                    <MapContainer
                        center={center}
                        zoom={12}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {hotels.map((hotel, idx) => {
                            const pos = getCoords(idx); // Use real hotel.locationCoordinates later
                            return (
                                <Marker key={hotel.id} position={[pos.lat, pos.lng]} icon={icon}>
                                    <Popup>
                                        <div className="p-2 w-48">
                                            <h4 className="font-bold text-sm mb-1 line-clamp-1">{hotel.name}</h4>
                                            <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{hotel.location}</p>
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold text-primary">${hotel.price}</span>
                                                <Button size="sm" variant="outline" className="h-7 text-xs" asChild>
                                                    <Link href={`/hotels/${hotel.id}/book`}>Book</Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            )
                        })}
                    </MapContainer>
                </div>
            </div>
        </div>
    )
}
