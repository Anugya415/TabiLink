"use client"

import { useEffect, useState } from "react"
import { Plus, Calendar as CalendarIcon, Map, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import api from "@/lib/api"
import { toast } from "sonner"
import { ShareButton } from "@/components/social/ShareButton"
import { TripCollaborators } from "@/components/social/TripCollaborators"
// import Link from "next/link"

export default function TripsPage() {
    const [trips, setTrips] = useState<{ owned: any[], shared: any[] }>({ owned: [], shared: [] })
    const [loading, setLoading] = useState(true)
    const [isNewTripOpen, setIsNewTripOpen] = useState(false)

    // New Trip State
    const [tripName, setTripName] = useState("")

    const fetchTrips = async () => {
        try {
            setLoading(true)
            const res: any = await api.getTrips()
            if (res.success) {
                setTrips(res.data)
            }
        } catch (error) {
            console.error("Failed to fetch trips")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTrips()
    }, [])

    const handleCreateTrip = async () => {
        try {
            await api.createTrip({ name: tripName })
            toast.success("Trip created!")
            setIsNewTripOpen(false)
            setTripName("")
            fetchTrips()
        } catch (error) {
            toast.error("Failed to create trip")
        }
    }

    const TripCard = ({ trip, isShared = false }: { trip: any, isShared?: boolean }) => (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{trip.name}</CardTitle>
                        <CardDescription>
                            {trip.startDate ? new Date(trip.startDate).toLocaleDateString() : 'Planning'}
                            {isShared && <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">Shared</span>}
                        </CardDescription>
                    </div>
                    <ShareButton
                        title={`Check out my trip: ${trip.name}`}
                        url={`${typeof window !== 'undefined' ? window.location.origin : ''}/trips/share/${trip.shareToken}`}
                    />
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center text-sm text-muted-foreground gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{trip.status}</span>
                    </div>

                    {/* Placeholder for bookings count or preview */}
                    <div className="p-3 bg-muted rounded-md text-sm">
                        {trip.bookings?.length || 0} Bookings linked
                    </div>

                    <TripCollaborators
                        tripId={trip.id}
                        collaborators={trip.collaborators || []}
                        onUpdate={fetchTrips} // Refresh to see accepted invites or changes if we had real-time
                    />
                </div>
            </CardContent>
            <CardFooter>
                <Button variant="outline" className="w-full" disabled>
                    View Details (Coming Soon) <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
            </CardFooter>
        </Card>
    )

    return (
        <div className="container py-8 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">My Trips</h1>
                <Dialog open={isNewTripOpen} onOpenChange={setIsNewTripOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" /> New Trip
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Trip</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Trip Name</Label>
                                <Input id="name" value={tripName} onChange={(e) => setTripName(e.target.value)} placeholder="e.g., Summer Vacation 2026" />
                            </div>
                            <Button onClick={handleCreateTrip} className="w-full">Create</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Upcoming Trips</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...trips.owned, ...trips.shared].length === 0 && !loading ? (
                            <p className="text-muted-foreground col-span-full py-8 text-center bg-muted/20 rounded-lg">No trips found. Start planning one!</p>
                        ) : (
                            <>
                                {trips.owned.map(trip => <TripCard key={trip.id} trip={trip} />)}
                                {trips.shared.map(trip => <TripCard key={trip.id} trip={trip} isShared />)}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
