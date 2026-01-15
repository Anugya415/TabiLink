"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "@/contexts/TranslationContext"
import api from "@/lib/api"
import { toast } from "sonner"
import {
  Tag,
  Percent,
  DollarSign,
  Calendar,
  Clock,
  Copy,
  CheckCircle2,
  Gift,
  Sparkles,
  ArrowRight,
  Hotel,
  Plane,
  Globe,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

interface Discount {
  id: number
  code: string
  name: string
  description?: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minPurchaseAmount?: number
  maxDiscountAmount?: number
  applicableTo: 'all' | 'hotel' | 'travel'
  startDate: string
  endDate: string
  usageLimit?: number
  usageCount: number
  isActive: boolean
}

export default function DiscountsPage() {
  const { t } = useTranslation()
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  useEffect(() => {
    fetchDiscounts()
  }, [])

  const fetchDiscounts = async () => {
    try {
      setLoading(true)
      const response = await api.getDiscounts({ active: true })
      if (response.success && response.data?.discounts) {
        setDiscounts(response.data.discounts)
      }
    } catch (error: any) {
      console.error("Error fetching discounts:", error)
      toast.error("Failed to load discounts", {
        description: error.message || "Please try again later",
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    toast.success("Code copied!", {
      description: `Discount code ${code} copied to clipboard`,
    })
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date()
  }

  const isActive = (discount: Discount) => {
    const now = new Date()
    return (
      discount.isActive &&
      now >= new Date(discount.startDate) &&
      now <= new Date(discount.endDate) &&
      (!discount.usageLimit || discount.usageCount < discount.usageLimit)
    )
  }

  const getApplicableIcon = (applicableTo: string) => {
    switch (applicableTo) {
      case 'hotel':
        return <Hotel className="h-4 w-4" />
      case 'travel':
        return <Plane className="h-4 w-4" />
      default:
        return <Globe className="h-4 w-4" />
    }
  }

  const getApplicableText = (applicableTo: string) => {
    switch (applicableTo) {
      case 'hotel':
        return 'Hotel Bookings'
      case 'travel':
        return 'Travel Packages'
      default:
        return 'All Bookings'
    }
  }

  const formatDiscountValue = (discount: Discount) => {
    if (discount.discountType === 'percentage') {
      return `${discount.discountValue}% OFF`
    } else {
      return `$${discount.discountValue} OFF`
    }
  }

  const activeDiscounts = discounts.filter(isActive)
  const expiredDiscounts = discounts.filter((d) => !isActive(d) && isExpired(d.endDate))

  return (
    <div className="container py-8 md:py-12">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Gift className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Exclusive Discounts & Offers</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Save big on your next trip! Use these discount codes at checkout to get amazing deals on hotels and travel packages.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Active Discounts */}
            {activeDiscounts.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-bold">Active Offers</h2>
                  <Badge variant="secondary" className="ml-2">
                    {activeDiscounts.length} available
                  </Badge>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {activeDiscounts.map((discount) => (
                    <Card
                      key={discount.id}
                      className="hover-lift border-2 border-primary/20 hover:border-primary/50 transition-all"
                    >
                      <CardHeader className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {discount.discountType === 'percentage' ? (
                              <Percent className="h-5 w-5 text-primary" />
                            ) : (
                              <DollarSign className="h-5 w-5 text-primary" />
                            )}
                            <CardTitle className="text-lg">{discount.name}</CardTitle>
                          </div>
                          <Badge variant="default" className="bg-green-500">
                            Active
                          </Badge>
                        </div>
                        {discount.description && (
                          <CardDescription>{discount.description}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Discount Code */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">
                            Discount Code
                          </label>
                          <div className="flex items-center gap-2">
                            <Input
                              value={discount.code}
                              readOnly
                              className="font-mono font-bold text-lg text-center bg-muted"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(discount.code)}
                              className="flex-shrink-0"
                            >
                              {copiedCode === discount.code ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* Discount Details */}
                        <div className="space-y-2 p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Discount:</span>
                            <span className="font-bold text-primary text-lg">
                              {formatDiscountValue(discount)}
                            </span>
                          </div>
                          {discount.minPurchaseAmount && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Min. Purchase:</span>
                              <span className="font-semibold">
                                ${discount.minPurchaseAmount}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Valid For:</span>
                            <div className="flex items-center gap-1">
                              {getApplicableIcon(discount.applicableTo)}
                              <span className="font-semibold">
                                {getApplicableText(discount.applicableTo)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Validity Period */}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Valid until {new Date(discount.endDate).toLocaleDateString()}
                          </span>
                        </div>

                        {discount.usageLimit && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>
                              {discount.usageLimit - discount.usageCount} uses remaining
                            </span>
                          </div>
                        )}

                        <Button
                          className="w-full"
                          onClick={() => {
                            if (discount.applicableTo === 'hotel') {
                              window.location.href = '/hotels'
                            } else if (discount.applicableTo === 'travel') {
                              window.location.href = '/travel'
                            } else {
                              window.location.href = '/'
                            }
                          }}
                        >
                          Use This Code
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* No Active Discounts */}
            {activeDiscounts.length === 0 && (
              <Card className="text-center py-12">
                <CardContent className="space-y-4">
                  <Tag className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="text-xl font-semibold">No Active Discounts</h3>
                  <p className="text-muted-foreground">
                    Check back soon for new exclusive offers and discounts!
                  </p>
                  <Button asChild>
                    <a href="/">Browse Hotels & Packages</a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}


