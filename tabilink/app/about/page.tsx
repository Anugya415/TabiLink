import { Plane, Shield, Users, Award } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="container py-8 sm:py-12 lg:py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">About TabiLink</h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
            Your trusted partner for unforgettable travel experiences
          </p>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <p className="text-muted-foreground">
            TabiLink was founded with a simple mission: to make travel booking effortless,
            secure, and enjoyable. We believe everyone deserves to explore the world, and
            we're here to make that dream a reality.
          </p>
          <p className="text-muted-foreground">
            With years of experience in the travel industry, our team curates the best
            hotels and travel packages to ensure you have memorable experiences wherever
            you go. We partner with trusted providers worldwide to bring you competitive
            prices without compromising on quality.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Secure & Trusted</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                All transactions are protected with 256-bit SSL encryption. Your data and
                payment information are always secure.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Expert Support</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Our 24/7 customer support team is always ready to help you with any
                questions or concerns about your booking.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Plane className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Best Prices</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                We compare prices across multiple providers to ensure you get the best
                deals on hotels and travel packages.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Award className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Quality Assured</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                All our partners are carefully vetted to ensure they meet our high
                standards for quality and service.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Join Thousands of Happy Travelers</h2>
          <p className="text-muted-foreground mb-6">
            Start your next adventure with TabiLink today
          </p>
        </div>
      </div>
    </div>
  )
}


