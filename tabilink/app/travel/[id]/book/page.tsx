"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter, useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import api from "@/lib/api"
import { toast } from "sonner"
import { Calendar, Users, CreditCard, Lock, Plane, Tag, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { useRole } from "@/contexts/RoleContext"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

const bookingSchema = z.object({
  travelers: z.string().min(1, "Number of travelers is required"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Invalid phone number"),
  cardNumber: z.string().min(16, "Card number must be 16 digits"),
  cardExpiry: z.string().regex(/^\d{2}\/\d{2}$/, "Invalid expiry date (MM/YY)"),
  cardCVC: z.string().min(3, "CVC must be 3 digits"),
  cardName: z.string().min(2, "Cardholder name is required"),
})

type BookingFormData = z.infer<typeof bookingSchema>

export default function TravelBookingPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useRole()
  const packageId = params?.id as string
  const [packageData, setPackageData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [discountCode, setDiscountCode] = useState("")
  const [discountAmount, setDiscountAmount] = useState(0)
  const [discountError, setDiscountError] = useState("")
  const [validatingDiscount, setValidatingDiscount] = useState(false)

  useEffect(() => {
    const fetchPackage = async () => {
      if (!packageId) return
      try {
        setLoading(true)
        const response = await api.getPackage(packageId) as { success: boolean; data: { package: any } }
        const pkg = response.data?.package || response.data
        
        // Convert duration object to string format
        let durationStr = ""
        if (typeof pkg.duration === 'object' && pkg.duration !== null) {
          const days = pkg.duration.days || 0
          const nights = pkg.duration.nights || 0
          durationStr = `${days} Days / ${nights} Nights`
        } else if (typeof pkg.duration === 'string') {
          durationStr = pkg.duration
        } else {
          // Fallback if duration is not available
          durationStr = pkg.days ? `${pkg.days} Days / ${pkg.days - 1} Nights` : "1 Day / 0 Nights"
        }
        
        setPackageData({
          id: pkg.id,
          title: pkg.title,
          destination: pkg.destination,
          duration: durationStr,
          price: parseFloat(pkg.price || pkg.totalPrice || 0),
          originalPrice: pkg.originalPrice ? parseFloat(pkg.originalPrice) : undefined,
          image: pkg.images?.[0] || "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&q=80",
          includes: pkg.includes || [],
        })
      } catch (error: any) {
        console.error("Error fetching travel package:", error)
        toast.error("Failed to load travel package", {
          description: error.message || "Please try again later.",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPackage()
  }, [packageId])

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      travelers: "1",
    },
  })

  const travelers = parseInt(form.watch("travelers") || "1")
  const subtotal = (packageData?.price || 0) * travelers
  const packageDiscount = packageData?.originalPrice && packageData?.price 
    ? (packageData.originalPrice - packageData.price) * travelers 
    : 0
  const tax = (subtotal - discountAmount) * 0.1
  const total = subtotal - discountAmount + tax

  const validateDiscount = async () => {
    if (!discountCode.trim()) {
      setDiscountAmount(0)
      setDiscountError("")
      return
    }

    if (!packageData || travelers === 0) {
      setDiscountError("Please wait for package details to load")
      return
    }

    setValidatingDiscount(true)
    setDiscountError("")

    try {
      const response = await api.validateDiscountCode({
        code: discountCode.trim(),
        subtotal,
        type: "travel",
        travelPackageId: packageId,
      })

      if (response.success && response.data?.discount) {
        setDiscountAmount(response.data.discount.discountAmount || 0)
        toast.success("Discount code applied!", {
          description: `${response.data.discount.name} - ${response.data.discount.discountAmount > 0 ? `$${response.data.discount.discountAmount} off` : 'Applied'}`,
        })
      }
    } catch (error: any) {
      setDiscountAmount(0)
      setDiscountError(error.message || "Invalid discount code")
      toast.error("Invalid discount code", {
        description: error.message || "Please check the code and try again",
      })
    } finally {
      setValidatingDiscount(false)
    }
  }

  useEffect(() => {
    if (discountCode.trim() && packageData) {
      const timeoutId = setTimeout(() => {
        validateDiscount()
      }, 500)
      return () => clearTimeout(timeoutId)
    } else {
      setDiscountAmount(0)
      setDiscountError("")
    }
  }, [discountCode, subtotal, packageData])

  const onSubmit = async (data: BookingFormData) => {
    if (!packageId) {
      toast.error("Package ID is missing")
      return
    }

    // Check if user is authenticated
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token || !user) {
      toast.error("Authentication required", {
        description: "Please log in to make a booking.",
      })
      router.push("/login")
      return
    }

    setIsProcessing(true)
    
    try {
      const bookingData = {
        type: "travel" as const,
        travelPackage: packageId,
        travelers: parseInt(data.travelers),
        discountCode: discountCode.trim() || undefined,
        guests: [{
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
        }],
      }

      console.log("Creating booking with data:", bookingData)
      const response = await api.createBooking(bookingData) as { success: boolean; message?: string; data?: { booking?: any } }
      console.log("Booking response:", response)

      if (!response.success) {
        throw new Error(response.message || "Failed to create booking")
      }

      // Extract booking ID from the response
      const booking = response.data?.booking
      const bookingId = booking?.bookingId || booking?.id || `TRAVEL-${Date.now()}`
      
      if (!bookingId) {
        throw new Error("Booking ID not found in response")
      }

      console.log("Booking created successfully with ID:", bookingId)
      toast.success("Booking confirmed!", {
        description: "Your travel package booking has been successfully created.",
      })
      
      router.push(`/booking/confirmation?bookingId=${bookingId}&type=travel`)
    } catch (error: any) {
      console.error("Booking error:", error)
      console.error("Error details:", {
        message: error.message,
        status: error.status,
        response: error.response,
      })
      toast.error("Booking failed", {
        description: error.message || "Please try again later.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-6 sm:py-8 px-4 max-w-6xl">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading package details...</p>
        </div>
      </div>
    )
  }

  if (!packageData) {
    return (
      <div className="container py-6 sm:py-8 px-4 max-w-6xl">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Travel package not found</p>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="container py-6 sm:py-8 px-4 max-w-6xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Complete Your Booking</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Secure checkout for {packageData.title}</p>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Booking Form */}
        <div className="lg:col-span-2 space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Booking Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Travel Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    name="travelers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Travelers</FormLabel>
                        <FormControl>
                          <Select value={field.value || "1"} onChange={field.onChange}>
                            <option value="1">1 Traveler</option>
                            <option value="2">2 Travelers</option>
                            <option value="3">3 Travelers</option>
                            <option value="4">4 Travelers</option>
                            <option value="5">5+ Travelers</option>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Discount Code */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Discount Code
                  </CardTitle>
                  <CardDescription>
                    Enter a discount code to save on your booking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        placeholder="Enter discount code"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                        className={discountError ? "border-red-500" : ""}
                      />
                      {discountError && (
                        <p className="text-sm text-red-500 mt-1">{discountError}</p>
                      )}
                    </div>
                    {discountCode && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setDiscountCode("")
                          setDiscountAmount(0)
                          setDiscountError("")
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {discountAmount > 0 && (
                    <div className="mt-2 p-2 bg-green-50 dark:bg-green-950/20 rounded-md">
                      <p className="text-sm text-green-700 dark:text-green-400 font-semibold">
                        Discount applied: -${discountAmount.toFixed(2)}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Traveler Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Traveler Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  src={packageData.image}
                  alt={packageData.title}
                  width={96}
                  height={96}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{packageData.title}</h3>
                  <p className="text-sm text-muted-foreground">{packageData.destination}</p>
                  <p className="text-xs text-muted-foreground mt-1">{packageData.duration}</p>
                </div>
              </div>
              <div className="space-y-1 text-sm">
                <p className="font-medium mb-2">Includes:</p>
                {packageData.includes.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2 text-muted-foreground">
                    <Plane className="h-3 w-3" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 text-sm pt-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Travelers</span>
                  <span>{travelers}</span>
                </div>
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price per person</span>
                  <span>${packageData.price.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-gray-700">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                    <span className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      Discount ({discountCode})
                    </span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
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
    </ProtectedRoute>
  )
}

