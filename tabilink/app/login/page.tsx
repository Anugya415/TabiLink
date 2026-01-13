"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect, useCallback } from "react"
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

declare global {
  interface Window {
    google?: any;
  }
}

export default function LoginPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { setUser } = useRole()
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const handleGoogleSignIn = useCallback(async (response: any) => {
    // Handle error responses from Google
    if (response.error) {
      const errorMessage = response.error === 'popup_closed_by_user' 
        ? 'Sign-in was cancelled. Please try again.'
        : response.error === 'access_denied'
        ? 'Access denied. Please try again or use email/password login.'
        : 'Google sign-in was cancelled or failed. Please try again.';
      
      toast.error("Google sign-in cancelled", {
        description: errorMessage,
      });
      setIsGoogleLoading(false);
      return;
    }

    if (!response.credential) {
      toast.error("Google sign-in failed", {
        description: "No credential received from Google. Please try again.",
      });
      setIsGoogleLoading(false);
      return;
    }

    setIsGoogleLoading(true);
    try {
      const apiResponse = await api.googleLogin(response.credential) as { 
        success: boolean; 
        message: string; 
        data: { token: string; user: any } 
      };

      if (apiResponse.success) {
        // Store token for future API calls
        if (typeof window !== "undefined") {
          localStorage.setItem("token", apiResponse.data.token);
        }

        // Set user in context
        const userData = {
          id: apiResponse.data.user.id.toString(),
          email: apiResponse.data.user.email,
          name: apiResponse.data.user.name,
          role: apiResponse.data.user.role,
          avatar: apiResponse.data.user.avatar,
          createdAt: new Date().toISOString(),
        };
        setUser(userData);

        toast.success(t("loginSuccessful"), {
          description: t("loginSuccessfulDesc"),
        });
        
        // Redirect based on user role
        if (apiResponse.data.user.role === "super_admin") {
          router.push("/super-admin/overview");
        } else if (apiResponse.data.user.role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (error: any) {
      // Extract error message from error object - check multiple sources
      let errorMessage = "Google sign-in failed. Please try again later.";
      const errorStatus = error.status || error.response?.status;
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.message) {
        errorMessage = error.response.message;
      } else if (typeof error.response === 'object' && error.response !== null) {
        // Try to extract from response object
        errorMessage = error.response.message || error.response.error || errorMessage;
      }
      
      // Only log server errors (5xx), not client errors (4xx) or service unavailable (503)
      if (errorStatus && errorStatus >= 500 && errorStatus !== 503) {
        console.error("Google login error:", errorMessage);
        console.error("Error status:", errorStatus);
      } else if (errorStatus === 503) {
        // 503 Service Unavailable - log as warning, not error
        console.warn("Google login service unavailable:", errorMessage);
      }
      
      // Show user-friendly error message
      toast.error("Google sign-in failed", {
        description: errorMessage,
      });
    } finally {
      setIsGoogleLoading(false);
    }
  }, [setUser, router, t]);

  // Load Google Sign-In script and initialize
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      // Don't show warning in console - it's expected if not configured
      return;
    }

    const initializeGoogleSignIn = () => {
      if (!window.google || !window.google.accounts) {
        return;
      }

      try {
        // Initialize Google Identity Services
        // Disable FedCM to avoid IdentityCredentialError issues
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleSignIn,
          use_fedcm_for_prompt: false, // Disable FedCM to prevent errors
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Render the button
        const button = document.getElementById('google-signin-button');
        if (button && !button.hasAttribute('data-google-rendered')) {
          try {
            window.google.accounts.id.renderButton(button, {
              type: 'standard',
              theme: 'outline',
              size: 'large',
              text: 'signin_with',
              width: 300,
            });
            button.setAttribute('data-google-rendered', 'true');
          } catch (error) {
            console.error('Error rendering Google button:', error);
          }
        }
      } catch (error) {
        console.error('Error initializing Google Sign-In:', error);
      }
    };

    // Check if script already exists
    if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
      // Script already loaded, just initialize
      if (window.google && window.google.accounts) {
        initializeGoogleSignIn();
      } else {
        // Wait a bit for the script to fully load
        setTimeout(initializeGoogleSignIn, 100);
      }
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      // Wait for Google Identity Services to be fully ready
      const checkGoogleReady = () => {
        if (window.google && window.google.accounts && window.google.accounts.id) {
          initializeGoogleSignIn();
        } else {
          setTimeout(checkGoogleReady, 50);
        }
      };
      checkGoogleReady();
    };
    script.onerror = () => {
      console.error('Failed to load Google Sign-In script');
    };
    document.body.appendChild(script);

    return () => {
      // Don't remove script on cleanup to avoid re-loading
    };
  }, [handleGoogleSignIn]);


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
                  <Link
                    href="/forgot-password"
                    className="font-medium text-primary hover:underline"
                  >
                    {t("forgotPassword")}
                  </Link>
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

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            
            <div id="google-signin-button" className="w-full flex justify-center min-h-[40px]"></div>
            
            {!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
              <p className="text-xs text-center text-muted-foreground">
                Google Sign-In requires NEXT_PUBLIC_GOOGLE_CLIENT_ID to be configured
              </p>
            )}

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

