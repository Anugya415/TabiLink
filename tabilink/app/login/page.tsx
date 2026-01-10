"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useTranslation } from "@/contexts/TranslationContext"
import { useRole } from "@/contexts/RoleContext"
import {
  LogIn,
  Mail,
  Lock,
  ShieldCheck,
  Clock3,
  CheckCircle2,
  Loader2,
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
import api from "@/lib/api"

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type LoginValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { setUser } = useRole()
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: LoginValues) => {
    setIsLoading(true)
    try {
      const response = await api.login({
        email: values.email,
        password: values.password,
      }) as { success: boolean; message: string; data: { token: string; user: any } }

      if (response.success) {
        // Store token for future API calls
        if (typeof window !== "undefined") {
          localStorage.setItem("token", response.data.token)
        }

        // Set user in context
        const userData = {
          id: response.data.user.id.toString(),
          email: response.data.user.email,
          name: response.data.user.name,
          role: response.data.user.role,
          avatar: response.data.user.avatar,
          createdAt: new Date().toISOString(),
        }
        setUser(userData)

        toast.success(t("loginSuccessful"), {
          description: t("loginSuccessfulDesc"),
        })
        
        // Redirect based on user role
        if (response.data.user.role === "super_admin") {
          router.push("/super-admin/overview")
        } else if (response.data.user.role === "admin") {
          router.push("/admin/dashboard")
        } else {
          router.push("/dashboard")
        }
      }
    } catch (error: any) {
      // Only log unexpected errors (not 401 Invalid credentials which is expected)
      const errorStatus = error.status || error.response?.status;
      if (!errorStatus || errorStatus >= 500) {
        // Log server errors or unexpected errors for debugging
        console.error("Login error:", {
          message: error.message,
          status: errorStatus,
          name: error.name,
        });
      }
      
      // Provide more specific error messages
      let errorMessage = "Invalid email or password. Please try again."
      if (error.message) {
        if (error.message.includes("Cannot connect")) {
          errorMessage = "Cannot connect to server. Please make sure the backend server is running on http://localhost:5000"
        } else if (error.message.includes("timeout")) {
          errorMessage = "Request timeout. The server is taking too long to respond."
        } else if (error.message.includes("Invalid credentials") || errorStatus === 401) {
          errorMessage = "Invalid email or password. Please check your credentials and try again."
        } else {
          errorMessage = error.message
        }
      }
      
      toast.error("Login failed", {
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container grid min-h-[calc(100vh-6rem)] items-center gap-10 py-12 lg:grid-cols-2">
      <div className="order-2 space-y-8 lg:order-1">
        <Card className="shadow-lg">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <LogIn className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wide">
                {t("welcomeBack")}
              </span>
            </div>
            <CardTitle className="text-2xl">{t("loginToTabiLink")}</CardTitle>
            <CardDescription>
              {t("loginDescription")}
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
                      <FormLabel>{t("email")}</FormLabel>
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
                      <FormLabel>{t("password")}</FormLabel>
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
                    <span>{t("forgotPassword")}</span>{" "}
                    <Link
                      href="/contact"
                      className="font-medium text-primary hover:underline"
                    >
                      {t("contactSupport")}
                    </Link>
                  </div>
                  <Link
                    href="/signup"
                    className="font-medium text-primary hover:underline"
                  >
                    {t("createAccount")}
                  </Link>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4" />
                      {t("signIn")}
                    </>
                  )}
                </Button>
              </form>
            </Form>

            <div className="rounded-lg border bg-muted/50 p-4 text-sm text-muted-foreground">
              {t("agreeToPolicies")}{" "}
              <Link
                href="/about"
                className="font-medium text-primary hover:underline"
              >
                {t("policies")}
              </Link>{" "}
              {t("andSecureBooking")}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="order-1 space-y-6 rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5 p-8 shadow-inner lg:order-2">
        <div className="flex items-center gap-3 text-primary">
          <ShieldCheck className="h-6 w-6" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest">
              {t("secureByDesign")}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("secureBookingDesc")}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-bold leading-tight">
            {t("travelConfidently")}
          </h2>
          <p className="text-base text-muted-foreground">
            {t("manageItineraries")}
          </p>
          <div className="space-y-3">
            {[
              t("oneClickAccess"),
              t("realTimeUpdates"),
              t("priorityAssistance"),
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
            <p className="text-sm font-semibold">{t("expertSupport24")}</p>
            <p className="text-sm text-muted-foreground">
              {t("travelConcierges")}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

