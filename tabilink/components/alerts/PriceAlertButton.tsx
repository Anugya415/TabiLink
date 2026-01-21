"use client"

import { useState, useEffect } from "react"
import { Bell, BellOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import api from "@/lib/api"
import { useRole } from "@/contexts/RoleContext"

interface PriceAlertButtonProps {
    hotelId?: number
    travelPackageId?: number
    currentPrice: number
}

export function PriceAlertButton({ hotelId, travelPackageId, currentPrice }: PriceAlertButtonProps) {
    const { user } = useRole()
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [targetPrice, setTargetPrice] = useState(currentPrice.toString())
    const [hasAlert, setHasAlert] = useState(false)
    const [alertId, setAlertId] = useState<number | null>(null)

    useEffect(() => {
        if (user) {
            checkStatus()
        }
    }, [user, hotelId, travelPackageId])

    const checkStatus = async () => {
        try {
            const res = await api.checkAlertStatus({ hotelId, travelPackageId })
            if (res.success) {
                setHasAlert(res.hasAlert)
                setAlertId(res.alertId)
            }
        } catch (error) {
            console.error("Failed to check alert status", error)
        }
    }

    const handleCreateAlert = async () => {
        if (!user) {
            toast.error("Please login to set alerts")
            return
        }

        setLoading(true)
        try {
            const res = await api.createAlert({
                hotelId,
                travelPackageId,
                targetPrice: parseFloat(targetPrice)
            })
            if (res.success) {
                toast.success("Price alert set successfully!")
                setHasAlert(true)
                setAlertId(res.data.id)
                setIsOpen(false)
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to set alert")
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteAlert = async () => {
        if (!alertId) return

        setLoading(true)
        try {
            await api.deleteAlert(alertId)
            toast.success("Alert removed")
            setHasAlert(false)
            setAlertId(null)
        } catch (error: any) {
            toast.error("Failed to remove alert")
        } finally {
            setLoading(false)
        }
    }

    if (hasAlert) {
        return (
            <Button variant="outline" size="sm" onClick={handleDeleteAlert} disabled={loading}>
                <BellOff className="mr-2 h-4 w-4" />
                {loading ? "Removing..." : "Remove Alert"}
            </Button>
        )
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Bell className="mr-2 h-4 w-4" />
                    Track Price
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Set Price Alert</DialogTitle>
                    <DialogDescription>
                        We'll notify you when the price drops below your target.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="current" className="text-right">
                            Current
                        </Label>
                        <Input id="current" value={`$${currentPrice}`} disabled className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="target" className="text-right">
                            Target
                        </Label>
                        <Input
                            id="target"
                            type="number"
                            value={targetPrice}
                            onChange={(e) => setTargetPrice(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleCreateAlert} disabled={loading}>
                        {loading ? "Saving..." : "Set Alert"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
