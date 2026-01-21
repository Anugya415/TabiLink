"use client"

import { useState, useEffect } from "react"
import { Star, User, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import api from "@/lib/api"
import { toast } from "sonner"

interface Review {
    id: number
    userId: number
    rating: number
    comment: string
    title?: string
    user: {
        name: string
        avatar?: string
    }
    createdAt: string
}

interface ReviewSectionProps {
    hotelId?: number
    travelPackageId?: number
}

export function ReviewSection({ hotelId, travelPackageId }: ReviewSectionProps) {
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    // Form State
    const [rating, setRating] = useState(5)
    const [title, setTitle] = useState("")
    const [comment, setComment] = useState("")

    const fetchReviews = async () => {
        try {
            const res: any = await api.getReviews({ hotelId, travelPackageId })
            if (res.success) {
                setReviews(res.data)
            }
        } catch (error) {
            console.error("Failed to fetch reviews")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchReviews()
    }, [hotelId, travelPackageId])

    const handleSubmit = async () => {
        try {
            await api.createReview({
                hotelId,
                travelPackageId,
                rating,
                title,
                comment
            })
            toast.success("Review submitted for moderation")
            setIsDialogOpen(false)
            // Reset form
            setRating(5)
            setTitle("")
            setComment("")
            // Optionally refresh reviews (though it might be pending)
        } catch (error) {
            toast.error("Failed to submit review")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">Reviews</h3>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>Write a Review</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Write a Review</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Rating</Label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setRating(star)}
                                            className="focus:outline-none"
                                        >
                                            <Star
                                                className={`h-6 w-6 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Summary of your experience" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="comment">Review</Label>
                                <Textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Tell us more..." />
                            </div>
                            <Button onClick={handleSubmit} className="w-full">Submit Review</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6">
                {reviews.length === 0 && !loading ? (
                    <p className="text-muted-foreground text-center py-8">No reviews yet. Be the first!</p>
                ) : (
                    reviews.map((review) => (
                        <Card key={review.id}>
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <Avatar>
                                        <AvatarImage src={review.user.avatar} />
                                        <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold">{review.user.name}</h4>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex text-yellow-400">
                                            {Array.from({ length: review.rating }).map((_, i) => (
                                                <Star key={i} className="h-4 w-4 fill-current" />
                                            ))}
                                        </div>
                                        {review.title && <p className="font-medium mt-2">{review.title}</p>}
                                        <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
