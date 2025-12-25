"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
  LogIn,
  Mail,
  Lock,
  ShieldCheck,
  Clock3,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type LoginValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = (values: LoginValues) => {
    toast.success("Signed in (UI only)", {
      description: "Hook this form up to your auth service to continue.",
    })
    form.reset(values)
    // Persist demo login so the dashboard stays unlocked
    if (typeof window !== "undefined") {
      localStorage.setItem("tabilinkDemoLoggedIn", "1")
      // Notify other tabs/components in this tab
      window.dispatchEvent(new StorageEvent("storage", { key: "tabilinkDemoLoggedIn", newValue: "1" }))
    }
    router.push("/dashboard")
  }

  return (
    <div className="container grid min-h-[calc(100vh-6rem)] items-center gap-10 py-12 lg:grid-cols-2">
      <div className="order-2 space-y-8 lg:order-1">
        <Card className="shadow-lg">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <LogIn className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wide">
                Welcome back
              </span>
            </div>
            <CardTitle className="text-2xl">Login to TabiLink</CardTitle>
            <CardDescription>
              Access your trips, manage bookings, and continue your planning.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  name="email"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            className="pl-10"
                            autoComplete="email"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage fieldState={fieldState} />
                    </FormItem>
                  )}
                />

                <FormField
                  name="password"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="pl-10"
                            autoComplete="current-password"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage fieldState={fieldState} />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between text-sm">
                  <div className="text-muted-foreground">
                    <span>Forgot password?</span>{" "}
                    <Link
                      href="/contact"
                      className="font-medium text-primary hover:underline"
                    >
                      Contact support
                    </Link>
                  </div>
                  <Link
                    href="/signup"
                    className="font-medium text-primary hover:underline"
                  >
                    Create account
                  </Link>
                </div>

                <Button type="submit" className="w-full">
                  <LogIn className="h-4 w-4" />
                  Sign in
                </Button>
              </form>
            </Form>

            <div className="rounded-lg border bg-muted/50 p-4 text-sm text-muted-foreground">
              By signing in you agree to our{" "}
              <Link
                href="/about"
                className="font-medium text-primary hover:underline"
              >
                policies
              </Link>{" "}
              and secure booking standards.
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="order-1 space-y-6 rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5 p-8 shadow-inner lg:order-2">
        <div className="flex items-center gap-3 text-primary">
          <ShieldCheck className="h-6 w-6" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest">
              Secure by design
            </p>
            <p className="text-sm text-muted-foreground">
              Your bookings are protected with encrypted payments.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-bold leading-tight">
            Travel confidently with TabiLink
          </h2>
          <p className="text-base text-muted-foreground">
            Manage itineraries, track payments, and chat with support from one
            streamlined dashboard.
          </p>
          <div className="space-y-3">
            {[
              "One-click access to upcoming trips and reservations",
              "Real-time updates on itinerary changes",
              "Priority assistance from our travel specialists",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                <span className="text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg bg-background/70 p-4 ring-1 ring-border">
          <Clock3 className="h-10 w-10 text-primary" />
          <div className="space-y-1">
            <p className="text-sm font-semibold">24/7 expert support</p>
            <p className="text-sm text-muted-foreground">
              Our travel concierges are always ready to help you adjust plans.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

