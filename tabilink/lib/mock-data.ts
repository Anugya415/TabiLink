import { Plane, Train, Bus, Hotel, MapPin, Calendar, CreditCard, Star } from "lucide-react"

export interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  memberSince: string
  membershipTier: "Silver" | "Gold" | "Platinum"
  totalTrips: number
  totalSpent: number
  loyaltyPoints: number
  preferences: {
    currency: string
    language: string
    notifications: {
      email: boolean
      sms: boolean
      push: boolean
    }
  }
}

export interface Booking {
  id: string
  type: "hotel" | "travel" | "flight"
  title: string
  destination: string
  checkIn?: string
  checkOut?: string
  travelers?: number
  status: "confirmed" | "pending" | "cancelled" | "completed"
  amount: number
  bookingDate: string
  image: string
  details: {
    hotelName?: string
    flightNumber?: string
    packageName?: string
  }
}

export interface SavedTrip {
  id: string
  destination: string
  image: string
  price: number
  originalPrice?: number
  rating: number
  savedDate: string
  description: string
  type: "hotel" | "package"
  location: string
}

export interface PaymentMethod {
  id: string
  type: "card" | "paypal"
  last4?: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
  isDefault: boolean
  name: string
}

export interface Notification {
  id: string
  type: "booking" | "discount" | "reminder" | "system"
  title: string
  message: string
  date: string
  read: boolean
  actionUrl?: string
}

// Mock User Profile
export const mockUserProfile: UserProfile = {
  id: "user_123",
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  phone: "+1 (555) 123-4567",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  memberSince: "Jan 2023",
  membershipTier: "Gold",
  totalTrips: 12,
  totalSpent: 12450,
  loyaltyPoints: 2480,
  preferences: {
    currency: "USD",
    language: "English",
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
  },
}

// Mock Bookings
export const mockBookings: Booking[] = [
  {
    id: "BK-2024-001",
    type: "hotel",
    title: "Grand Luxury Hotel",
    destination: "Paris, France",
    checkIn: "2024-03-15",
    checkOut: "2024-03-20",
    travelers: 2,
    status: "confirmed",
    amount: 1495,
    bookingDate: "2024-02-10",
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
    details: {
      hotelName: "Grand Luxury Hotel",
    },
  },
  {
    id: "BK-2024-002",
    type: "travel",
    title: "European Adventure Package",
    destination: "Paris, Rome, Barcelona",
    checkIn: "2024-04-10",
    checkOut: "2024-04-17",
    travelers: 2,
    status: "confirmed",
    amount: 3798,
    bookingDate: "2024-01-25",
    image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&q=80",
    details: {
      packageName: "European Adventure",
    },
  },
  {
    id: "BK-2024-003",
    type: "hotel",
    title: "Seaside Resort",
    destination: "Barcelona, Spain",
    checkIn: "2024-05-05",
    checkOut: "2024-05-10",
    travelers: 1,
    status: "pending",
    amount: 890,
    bookingDate: "2024-02-28",
    image: "https://images.unsplash.com/photo-1505764706515-aa95265c5abc?w=800&q=80",
    details: {
      hotelName: "Seaside Resort",
    },
  },
  {
    id: "BK-2023-045",
    type: "hotel",
    title: "Mountain View Lodge",
    destination: "Banff, Canada",
    checkIn: "2023-12-20",
    checkOut: "2023-12-25",
    travelers: 2,
    status: "completed",
    amount: 1120,
    bookingDate: "2023-11-15",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80",
    details: {
      hotelName: "Mountain View Lodge",
    },
  },
  {
    id: "BK-2023-038",
    type: "travel",
    title: "Asian Discovery",
    destination: "Tokyo, Kyoto, Seoul",
    checkIn: "2023-11-10",
    checkOut: "2023-11-20",
    travelers: 2,
    status: "completed",
    amount: 4299,
    bookingDate: "2023-09-20",
    image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d8?w=800&q=80",
    details: {
      packageName: "Asian Discovery",
    },
  },
]

// Mock Saved Trips
export const mockSavedTrips: SavedTrip[] = [
  {
    id: "ST-001",
    destination: "Kyoto Temples",
    image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d8?w=800&q=80",
    price: 899,
    originalPrice: 1099,
    rating: 4.9,
    savedDate: "2024-02-15",
    description: "Traditional Japanese experience with temple visits",
    type: "hotel",
    location: "Kyoto, Japan",
  },
  {
    id: "ST-002",
    destination: "Algarve Coast",
    image: "https://images.unsplash.com/photo-1505764706515-aa95265c5abc?w=800&q=80",
    price: 1120,
    originalPrice: 1350,
    rating: 4.8,
    savedDate: "2024-02-10",
    description: "Beautiful coastal views and beach access",
    type: "hotel",
    location: "Faro, Portugal",
  },
  {
    id: "ST-003",
    destination: "Northern Lights Adventure",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80",
    price: 1480,
    originalPrice: 1799,
    rating: 4.7,
    savedDate: "2024-01-28",
    description: "Aurora viewing with guided tours",
    type: "package",
    location: "Tromsø, Norway",
  },
  {
    id: "ST-004",
    destination: "Santorini Sunset",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80",
    price: 1650,
    originalPrice: 1999,
    rating: 4.9,
    savedDate: "2024-01-20",
    description: "Luxury stay with stunning sunset views",
    type: "hotel",
    location: "Santorini, Greece",
  },
  {
    id: "ST-005",
    destination: "Iceland Ring Road",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80",
    price: 2199,
    originalPrice: 2599,
    rating: 4.8,
    savedDate: "2024-01-15",
    description: "Complete ring road tour with all highlights",
    type: "package",
    location: "Reykjavik, Iceland",
  },
]

// Mock Payment Methods
export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "pm_001",
    type: "card",
    last4: "4242",
    brand: "Visa",
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true,
    name: "Alex Johnson",
  },
  {
    id: "pm_002",
    type: "card",
    last4: "8888",
    brand: "Mastercard",
    expiryMonth: 8,
    expiryYear: 2026,
    isDefault: false,
    name: "Alex Johnson",
  },
  {
    id: "pm_003",
    type: "paypal",
    isDefault: false,
    name: "alex.johnson@example.com",
  },
]

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: "notif_001",
    type: "booking",
    title: "Booking Confirmed",
    message: "Your booking for Grand Luxury Hotel, Paris has been confirmed for Mar 15-20, 2024.",
    date: "2024-02-10T10:30:00",
    read: false,
    actionUrl: "/dashboard?tab=bookings",
  },
  {
    id: "notif_002",
    type: "discount",
    title: "Special Offer Available",
    message: "Get 20% off on your next booking to Kyoto, Japan. Valid until Mar 31, 2024.",
    date: "2024-02-12T14:15:00",
    read: false,
    actionUrl: "/hotels",
  },
  {
    id: "notif_003",
    type: "reminder",
    title: "Upcoming Trip Reminder",
    message: "Your trip to Paris, France starts in 5 days. Don't forget to check in!",
    date: "2024-03-10T09:00:00",
    read: true,
    actionUrl: "/dashboard?tab=bookings",
  },
  {
    id: "notif_004",
    type: "system",
    title: "Profile Update Required",
    message: "Please update your phone number to receive SMS notifications.",
    date: "2024-02-08T16:45:00",
    read: true,
    actionUrl: "/dashboard?tab=profile",
  },
  {
    id: "notif_005",
    type: "discount",
    title: "Loyalty Points Added",
    message: "You've earned 150 loyalty points from your recent booking. Total: 2,480 points.",
    date: "2024-02-11T11:20:00",
    read: false,
    actionUrl: "/dashboard",
  },
]




