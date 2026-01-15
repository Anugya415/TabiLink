"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "@/contexts/TranslationContext"
import { useRole } from "@/contexts/RoleContext"
import api from "@/lib/api"
import { toast } from "sonner"
import {
  Gift,
  Sparkles,
  Star,
  DollarSign,
  Percent,
  Ticket,
  ArrowUp,
  Package,
  Coins,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Filter,
  Search,
  TrendingUp,
  Award,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

interface Reward {
  id: number
  name: string
  description: string
  category: 'discount' | 'cashback' | 'voucher' | 'upgrade' | 'freebie'
  pointsRequired: number
  discountType?: 'percentage' | 'fixed'
  discountValue?: number
  cashbackAmount?: number
  voucherCode?: string
  image?: string
  applicableTo?: 'all' | 'hotel' | 'travel'
  minPurchaseAmount?: number
  validFrom: string
  validUntil: string
}

interface Redemption {
  id: number
  pointsUsed: number
  status: 'pending' | 'completed' | 'cancelled' | 'expired'
  discountCode?: string
  voucherCode?: string
  cashbackAmount?: number
  expiresAt?: string
  redeemedAt?: string
  reward: Reward
}

export default function RewardsPage() {
  const { t } = useTranslation()
  const { user } = useRole()
  const [rewards, setRewards] = useState<Reward[]>([])
  const [redemptions, setRedemptions] = useState<Redemption[]>([])
  const [loading, setLoading] = useState(true)
  const [redeeming, setRedeeming] = useState<number | null>(null)
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null)
  const [showRedeemDialog, setShowRedeemDialog] = useState(false)
  const [userPoints, setUserPoints] = useState(0)
  const [conversionRate, setConversionRate] = useState(100)
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [pointsFilter, setPointsFilter] = useState<string>("all")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [rewardsRes, redemptionsRes, conversionRes, userRes] = await Promise.all([
        api.getRewards(),
        api.getUserRedemptions(),
        api.getConversionRate(),
        api.getMe(),
      ])

      if (rewardsRes.success && rewardsRes.data?.rewards) {
        setRewards(rewardsRes.data.rewards)
      }

      if (redemptionsRes.success && redemptionsRes.data?.redemptions) {
        setRedemptions(redemptionsRes.data.redemptions)
      }

      if (conversionRes.success && conversionRes.data?.rate) {
        setConversionRate(conversionRes.data.rate)
      }

      if (userRes.success && userRes.data?.user) {
        setUserPoints(userRes.data.user.loyaltyPoints || 0)
      }
    } catch (error: any) {
      console.error("Error fetching rewards:", error)
      toast.error("Failed to load rewards", {
        description: error.message || "Please try again later",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRedeem = async (reward: Reward) => {
    if (userPoints < reward.pointsRequired) {
      toast.error("Insufficient Points", {
        description: `You need ${reward.pointsRequired} points but only have ${userPoints}`,
      })
      return
    }

    setSelectedReward(reward)
    setShowRedeemDialog(true)
  }

  const confirmRedeem = async () => {
    if (!selectedReward) return

    try {
      setRedeeming(selectedReward.id)
      const response = await api.redeemReward(selectedReward.id)

      if (response.success) {
        toast.success("Reward Redeemed!", {
          description: `You've successfully redeemed ${selectedReward.name}`,
        })
        setShowRedeemDialog(false)
        setSelectedReward(null)
        await fetchData() // Refresh data
      }
    } catch (error: any) {
      toast.error("Redemption Failed", {
        description: error.message || "Please try again later",
      })
    } finally {
      setRedeeming(null)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'discount':
        return <Percent className="h-5 w-5" />
      case 'cashback':
        return <DollarSign className="h-5 w-5" />
      case 'voucher':
        return <Ticket className="h-5 w-5" />
      case 'upgrade':
        return <ArrowUp className="h-5 w-5" />
      case 'freebie':
        return <Gift className="h-5 w-5" />
      default:
        return <Star className="h-5 w-5" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'discount':
        return 'bg-blue-500'
      case 'cashback':
        return 'bg-green-500'
      case 'voucher':
        return 'bg-purple-500'
      case 'upgrade':
        return 'bg-orange-500'
      case 'freebie':
        return 'bg-pink-500'
      default:
        return 'bg-gray-500'
    }
  }

  const formatRewardValue = (reward: Reward) => {
    if (reward.category === 'cashback' && reward.cashbackAmount) {
      return `$${reward.cashbackAmount}`
    }
    if (reward.category === 'discount' && reward.discountValue) {
      if (reward.discountType === 'percentage') {
        return `${reward.discountValue}% OFF`
      } else {
        return `$${reward.discountValue} OFF`
      }
    }
    return reward.name
  }

  const filteredRewards = rewards.filter((reward) => {
    if (categoryFilter !== "all" && reward.category !== categoryFilter) {
      return false
    }
    if (pointsFilter === "low" && reward.pointsRequired > 500) {
      return false
    }
    if (pointsFilter === "medium" && (reward.pointsRequired <= 500 || reward.pointsRequired > 2000)) {
      return false
    }
    if (pointsFilter === "high" && reward.pointsRequired <= 2000) {
      return false
    }
    return true
  })

  const activeRedemptions = redemptions.filter((r) => r.status === 'completed')
  const cashValue = userPoints / conversionRate

  return (
    <ProtectedRoute>
      <div className="container py-8 md:py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold">Rewards & Redemptions</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Redeem your loyalty points for amazing rewards, discounts, and cashback!
            </p>
          </div>

          {/* Points Summary */}
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                    <Coins className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Your Loyalty Points</p>
                    <p className="text-4xl font-bold text-primary">{userPoints.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      ≈ ${cashValue.toFixed(2)} USD value
                    </p>
                  </div>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-sm text-muted-foreground">Conversion Rate</p>
                  <p className="text-2xl font-bold">{conversionRate} points = $1 USD</p>
                  <Badge variant="secondary" className="mt-2">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Active Redemptions: {activeRedemptions.length}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {/* Filters */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Filters:</span>
                </div>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="h-10 min-w-[180px]"
                >
                  <option value="all">All Categories</option>
                  <option value="discount">Discounts</option>
                  <option value="cashback">Cashback</option>
                  <option value="voucher">Vouchers</option>
                  <option value="upgrade">Upgrades</option>
                  <option value="freebie">Freebies</option>
                </Select>
                <Select
                  value={pointsFilter}
                  onChange={(e) => setPointsFilter(e.target.value)}
                  className="h-10 min-w-[180px]"
                >
                  <option value="all">All Points</option>
                  <option value="low">Low (1-500)</option>
                  <option value="medium">Medium (501-2000)</option>
                  <option value="high">High (2000+)</option>
                </Select>
              </div>

              {/* Rewards Grid */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Available Rewards</h2>
                  <Badge variant="secondary">
                    {filteredRewards.length} rewards available
                  </Badge>
                </div>
                {filteredRewards.length === 0 ? (
                  <Card className="text-center py-12">
                    <CardContent>
                      <Gift className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="text-xl font-semibold mb-2">No Rewards Available</h3>
                      <p className="text-muted-foreground">
                        Check back soon for new rewards!
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredRewards.map((reward) => {
                      const canAfford = userPoints >= reward.pointsRequired
                      return (
                        <Card
                          key={reward.id}
                          className={`hover-lift border-2 transition-all ${
                            canAfford
                              ? 'border-primary/20 hover:border-primary/50'
                              : 'border-muted opacity-75'
                          }`}
                        >
                          <CardHeader className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div
                                className={`flex h-12 w-12 items-center justify-center rounded-full ${getCategoryColor(
                                  reward.category
                                )} text-white`}
                              >
                                {getCategoryIcon(reward.category)}
                              </div>
                              <Badge variant="outline" className="capitalize">
                                {reward.category}
                              </Badge>
                            </div>
                            <CardTitle className="text-lg">{reward.name}</CardTitle>
                            <CardDescription className="line-clamp-2">
                              {reward.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2 p-3 rounded-lg bg-muted/50">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Points Required:</span>
                                <span className="font-bold text-primary text-lg">
                                  {reward.pointsRequired.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Value:</span>
                                <span className="font-semibold">
                                  {formatRewardValue(reward)}
                                </span>
                              </div>
                              {reward.applicableTo && reward.applicableTo !== 'all' && (
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <span>Valid For:</span>
                                  <span className="capitalize">{reward.applicableTo}</span>
                                </div>
                              )}
                            </div>
                            <Button
                              className="w-full"
                              onClick={() => handleRedeem(reward)}
                              disabled={!canAfford || redeeming === reward.id}
                            >
                              {redeeming === reward.id ? (
                                "Redeeming..."
                              ) : canAfford ? (
                                <>
                                  Redeem Now
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                              ) : (
                                <>
                                  Need {reward.pointsRequired - userPoints} more points
                                </>
                              )}
                            </Button>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* My Redemptions */}
              {redemptions.length > 0 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">My Redemptions</h2>
                  <div className="space-y-4">
                    {redemptions.map((redemption) => {
                      const isExpired =
                        redemption.expiresAt && new Date(redemption.expiresAt) < new Date()
                      const isValid = redemption.status === 'completed' && !isExpired

                      return (
                        <Card
                          key={redemption.id}
                          className={`hover-lift ${
                            isValid
                              ? 'border-green-200 dark:border-green-800'
                              : 'border-muted opacity-75'
                          }`}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-lg">
                                    {redemption.reward.name}
                                  </h3>
                                  <Badge
                                    variant={
                                      isValid
                                        ? 'default'
                                        : redemption.status === 'expired'
                                        ? 'destructive'
                                        : 'secondary'
                                    }
                                  >
                                    {redemption.status === 'completed' && isValid
                                      ? 'Active'
                                      : redemption.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {redemption.reward.description}
                                </p>
                                <div className="flex items-center gap-4 text-sm">
                                  <span className="text-muted-foreground">
                                    Points Used: <span className="font-semibold">{redemption.pointsUsed}</span>
                                  </span>
                                  {redemption.expiresAt && (
                                    <span className="text-muted-foreground flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      Expires: {new Date(redemption.expiresAt).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                                {redemption.discountCode && (
                                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                                    <p className="text-xs text-muted-foreground mb-1">Discount Code</p>
                                    <p className="font-mono font-bold text-primary">
                                      {redemption.discountCode}
                                    </p>
                                  </div>
                                )}
                                {redemption.voucherCode && (
                                  <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
                                    <p className="text-xs text-muted-foreground mb-1">Voucher Code</p>
                                    <p className="font-mono font-bold text-purple-600 dark:text-purple-400">
                                      {redemption.voucherCode}
                                    </p>
                                  </div>
                                )}
                                {redemption.cashbackAmount && (
                                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                                    <p className="text-xs text-muted-foreground mb-1">Cashback Amount</p>
                                    <p className="font-bold text-green-600 dark:text-green-400 text-lg">
                                      ${redemption.cashbackAmount}
                                    </p>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {isValid ? (
                                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                                ) : (
                                  <XCircle className="h-6 w-6 text-muted-foreground" />
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Redeem Confirmation Dialog */}
        <Dialog open={showRedeemDialog} onOpenChange={setShowRedeemDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Redemption</DialogTitle>
              <DialogDescription>
                Are you sure you want to redeem this reward?
              </DialogDescription>
            </DialogHeader>
            {selectedReward && (
              <div className="space-y-4 py-4">
                <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Reward:</span>
                    <span className="font-semibold">{selectedReward.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Points Required:</span>
                    <span className="font-bold text-primary">
                      {selectedReward.pointsRequired.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Your Points:</span>
                    <span className="font-semibold">{userPoints.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Remaining Points:</span>
                    <span className="font-bold text-lg">
                      {(userPoints - selectedReward.pointsRequired).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowRedeemDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={confirmRedeem}
                    disabled={redeeming === selectedReward.id}
                  >
                    {redeeming === selectedReward.id ? "Redeeming..." : "Confirm Redemption"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}

