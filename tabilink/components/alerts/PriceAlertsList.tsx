"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Bell, BellOff, ExternalLink, Trash2, TrendingDown, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import api from "@/lib/api"

interface PriceAlert {
    id: number
    targetPrice: number
    currentPrice: number
    triggerType: 'price_drop' | 'availability'
    createdAt: string
    hotel?: {
        id: number
        name: string
        locationCity: string
        slug?: string // assuming slug might exist, otherwise use id
    }
    travelPackage?: {
        id: number
        title: string
        destination: string[]
        slug?: string
    }
}

export function PriceAlertsList() {
    const [alerts, setAlerts] = useState<PriceAlert[]>([])
    const [loading, setLoading] = useState(true)
    const [deletingId, setDeletingId] = useState<number | null>(null)

    const fetchAlerts = async () => {
        try {
            setLoading(true)
            const res: any = await api.getAlerts()
            if (res.success) {
                setAlerts(res.data)
            }
        } catch (error) {
            console.error("Failed to fetch alerts", error)
            toast.error("Failed to load your price alerts")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAlerts()
    }, [])

    const handleDelete = async (id: number) => {
        try {
            setDeletingId(id)
            await api.deleteAlert(id)
            setAlerts(prev => prev.filter(a => a.id !== id))
            toast.success("Alert removed")
        } catch (error) {
            console.error("Failed to delete alert", error)
            toast.error("Failed to remove alert")
        } finally {
            setDeletingId(null)
        }
    }

    if (loading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
        )
    }

    if (alerts.length === 0) {
        return (
            <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                    <div className="p-3 bg-muted rounded-full">
                        <BellOff className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg">No active alerts</h3>
                        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                            You're not tracking any prices yet. Browse hotels or packages and tap the "Track Price" button to get notified of deals.
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/hotels">Browse Hotels</Link>
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="grid gap-4">
            {alerts.map((alert) => {
                const item = alert.hotel || alert.travelPackage
                const isHotel = !!alert.hotel
                const link = isHotel ? `/hotels/${alert.hotel?.id}` : `/packages/${alert.travelPackage?.id}`
                const name = isHotel ? alert.hotel?.name : alert.travelPackage?.title
                const location = isHotel ? alert.hotel?.locationCity : alert.travelPackage?.destination?.join(", ")

                return (
                    <Card key={alert.id} className="overflow-hidden transition-all hover:border-primary/50">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs font-normal">
                                        {isHotel ? "Hotel" : "Package"}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                        Set on {new Date(alert.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                                    <Link href={link}>{name}</Link>
                                </h3>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                    <TrendingDown className="h-3 w-3" />
                                    Target: ${alert.targetPrice}
                                    <span className="text-muted-foreground/50 mx-1">•</span>
                                    Current: ${alert.currentPrice}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-center">
                                <Button variant="ghost" size="sm" asChild className="h-8">
                                    <Link href={link}>
                                        View
                                        <ExternalLink className="ml-2 h-3 w-3" />
                                    </Link>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(alert.id)}
                                    disabled={deletingId === alert.id}
                                    className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                </Button>
                            </div>
                        </div>
                    </Card>
                )
            })}
        </div>
    )
}
