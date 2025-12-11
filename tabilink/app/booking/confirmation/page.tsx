"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Download, Mail, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

function BookingConfirmationContent() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("bookingId") || "N/A"
  const bookingType = searchParams.get("type") || "hotel"

  return (
    <div className="container py-16 px-4 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-4">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-2">Booking Confirmed!</h1>
        <p className="text-muted-foreground text-lg">
          Your {bookingType === "hotel" ? "hotel" : "travel package"} has been successfully booked
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
          <CardDescription>Your booking confirmation information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Booking ID</span>
            <span className="font-mono font-semibold">{bookingId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Booking Type</span>
            <span className="capitalize">
              {bookingType === "hotel" ? "Hotel Reservation" : "Travel Package"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Status</span>
            <span className="text-green-600 dark:text-green-400 font-semibold">Confirmed</span>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>What's Next?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start space-x-3">
            <Mail className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Confirmation Email</p>
              <p className="text-sm text-muted-foreground">
                A confirmation email with all booking details has been sent to your email address.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Download className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Download Receipt</p>
              <p className="text-sm text-muted-foreground">
                You can download your booking receipt from your email or account dashboard.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center">
            Need to modify or cancel your booking? Contact our support team at{" "}
            <a href="mailto:support@tabilink.com" className="text-primary hover:underline">
              support@tabilink.com
            </a>{" "}
            or call{" "}
            <a href="tel:+15551234567" className="text-primary hover:underline">
              +1 (555) 123-4567
            </a>
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild className="flex-1" size="lg">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <Button asChild variant="outline" className="flex-1" size="lg">
          <Link href={bookingType === "hotel" ? "/hotels" : "/travel"}>
            Book Another {bookingType === "hotel" ? "Hotel" : "Package"}
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="container py-16 px-4 max-w-2xl mx-auto">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <BookingConfirmationContent />
    </Suspense>
  )
}

