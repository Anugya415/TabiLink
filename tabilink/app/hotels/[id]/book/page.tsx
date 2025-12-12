"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Calendar, Users, CreditCard, Lock, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"

const bookingSchema = z.object({
  checkIn: z.date({ message: "Check-in date is required" }),
  checkOut: z.date({ message: "Check-out date is required" }),
  guests: z.string().min(1, "Number of guests is required"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Invalid phone number"),
  cardNumber: z.string().min(16, "Card number must be 16 digits"),
  cardExpiry: z.string().regex(/^\d{2}\/\d{2}$/, "Invalid expiry date (MM/YY)"),
  cardCVC: z.string().min(3, "CVC must be 3 digits"),
  cardName: z.string().min(2, "Cardholder name is required"),
}).refine((data) => data.checkOut > data.checkIn, {
  message: "Check-out date must be after check-in date",
  path: ["checkOut"],
})

type BookingFormData = z.infer<typeof bookingSchema>

// Mock hotel data
const hotelData = {
  id: 1,
  name: "Grand Luxury Hotel",
  location: "Paris, France",
  price: 299,
  image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
}

export default function HotelBookingPage() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      guests: "1",
    },
  })

  const checkIn = form.watch("checkIn")
  const checkOut = form.watch("checkOut")
  const guests = parseInt(form.watch("guests") || "1")

  const calculateNights = () => {
    if (checkIn && checkOut && checkOut > checkIn) {
      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays
    }
    return 0
  }

  const nights = calculateNights()
  const subtotal = hotelData.price * nights * guests
  const tax = subtotal * 0.1
  const total = subtotal + tax

  const onSubmit = async (data: BookingFormData) => {
    setIsProcessing(true)
    
    // Simulate secure payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    // In a real app, you would send this to your payment processor
    // For now, we'll just simulate a successful transaction
    const bookingId = `HOTEL-${Date.now()}`
    
    setIsProcessing(false)
    router.push(`/booking/confirmation?bookingId=${bookingId}&type=hotel`)
  }

  return (
    <div className="container py-6 sm:py-8 px-4 max-w-6xl">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Complete Your Booking</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Secure checkout for {hotelData.name}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Booking Form */}
        <div className="lg:col-span-2 space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Booking Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Booking Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      name="checkIn"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel>Check In</FormLabel>
                          <FormControl>
                            <DatePicker
                              date={field.value}
                              onSelect={field.onChange}
                              placeholder="Check in date"
                            />
                          </FormControl>
                          <FormMessage fieldState={fieldState} />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="checkOut"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel>Check Out</FormLabel>
                          <FormControl>
                            <DatePicker
                              date={field.value}
                              onSelect={field.onChange}
                              placeholder="Check out date"
                            />
                          </FormControl>
                          <FormMessage fieldState={fieldState} />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    name="guests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Guests</FormLabel>
                        <FormControl>
                          <Select value={field.value} onChange={field.onChange}>
                            <option value="1">1 Guest</option>
                            <option value="2">2 Guests</option>
                            <option value="3">3 Guests</option>
                            <option value="4">4 Guests</option>
                            <option value="5">5+ Guests</option>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Guest Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Guest Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      name="firstName"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage fieldState={fieldState} />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="lastName"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage fieldState={fieldState} />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+1 (555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lock className="h-5 w-5" />
                    <span>Payment Information</span>
                  </CardTitle>
                  <CardDescription>
                    Your payment is secured with 256-bit SSL encryption
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    name="cardName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cardholder Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Card Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\s/g, "")
                              const formatted = value.match(/.{1,4}/g)?.join(" ") || value
                              field.onChange(formatted)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      name="cardExpiry"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel>Expiry Date</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="MM/YY"
                              maxLength={5}
                              {...field}
                              onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, "")
                                if (value.length >= 2) {
                                  value = value.slice(0, 2) + "/" + value.slice(2, 4)
                                }
                                field.onChange(value)
                              }}
                            />
                          </FormControl>
                          <FormMessage fieldState={fieldState} />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="cardCVC"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel>CVC</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="123"
                              maxLength={3}
                              type="password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage fieldState={fieldState} />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  "Processing Payment..."
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Complete Secure Payment
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>

        {/* Booking Summary */}
        <div className="lg:col-span-1">
          <Card className="lg:sticky lg:top-4">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-4">
                <Image
                  src={hotelData.image}
                  alt={hotelData.name}
                  width={96}
                  height={96}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{hotelData.name}</h3>
                  <p className="text-sm text-muted-foreground">{hotelData.location}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Check In</span>
                  <span>{checkIn ? checkIn.toLocaleDateString() : "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Check Out</span>
                  <span>{checkOut ? checkOut.toLocaleDateString() : "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nights</span>
                  <span>{nights}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Guests</span>
                  <span>{guests}</span>
                </div>
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxes & Fees</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground pt-2">
                <Lock className="h-3 w-3" />
                <span>Secure 256-bit SSL encryption</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

