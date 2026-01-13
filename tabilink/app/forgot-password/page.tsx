"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
  Mail,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Lock,
  KeyRound,
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

const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
})

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (values: ForgotPasswordValues) => {
    setIsLoading(true)
    try {
      const response = await api.forgotPassword(values.email) as { 
        success: boolean; 
        message: string 
      }

      if (response.success) {
        setIsSuccess(true)
        toast.success("Email sent!", {
          description: "Check your inbox for password reset instructions.",
        })
      }
    } catch (error: any) {
      console.error("Forgot password error:", error)
      toast.error("Failed to send reset email", {
        description: error.message || "An error occurred. Please try again.",
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
              <KeyRound className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wide">
                Password Recovery
              </span>
            </div>
            <CardTitle className="text-2xl">Forgot Password?</CardTitle>
            <CardDescription>
              {isSuccess 
                ? "Check your email for reset instructions"
                : "Enter your email address and we'll send you a secure link to reset your password"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isSuccess ? (
              <div className="space-y-6 text-center py-6">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl"></div>
                    <div className="relative rounded-full bg-gradient-to-br from-green-100 to-green-50 p-6 border-2 border-green-200">
                      <CheckCircle2 className="h-12 w-12 text-green-600" />
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">Check your email</h3>
                  <p className="text-sm text-muted-foreground">
                    We've sent password reset instructions to
                  </p>
                  <p className="text-base font-medium text-foreground">
                    {form.getValues("email")}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
                    <Clock className="h-3 w-3" />
                    <span>The link will expire in 1 hour</span>
                  </div>
                  <p className="text-xs text-muted-foreground pt-2">
                    If you don't see the email, check your spam folder or try again.
                  </p>
                </div>
                <div className="pt-4 space-y-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setIsSuccess(false)
                      form.reset()
                    }}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Send another email
                  </Button>
                  <Link href="/login">
                    <Button variant="ghost" className="w-full">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to login
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-5"
                  >
                    <FormField
                      name="email"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
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

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending reset link...
                        </>
                      ) : (
                        <>
                          <Mail className="mr-2 h-4 w-4" />
                          Send reset link
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
                      Remember your password?
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to login
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="order-1 space-y-6 rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5 p-8 shadow-inner lg:order-2">
        <div className="flex items-center gap-3 text-primary">
          <ShieldCheck className="h-6 w-6" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest">
              Secure by Design
            </p>
            <p className="text-sm text-muted-foreground">
              Your password reset link is encrypted and secure
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-bold leading-tight">
            Reset Your Password
          </h2>
          <p className="text-base text-muted-foreground">
            Follow the instructions in the email to securely reset your password and regain access to your account.
          </p>
          <div className="space-y-3">
            {[
              {
                icon: Lock,
                title: "Secure reset process",
                description: "One-time use token that expires in 1 hour",
              },
              {
                icon: Mail,
                title: "Email verification",
                description: "Only the account owner can reset the password",
              },
              {
                icon: Clock,
                title: "Time-limited link",
                description: "Reset links expire after 1 hour for your security",
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3 rounded-lg bg-background/70 p-4 ring-1 ring-border">
                <div className="rounded-full bg-primary/10 p-2">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1 flex-1">
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border bg-background/70 p-4 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <ShieldCheck className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <p>
              Your security is our priority. All reset links are encrypted and can only be used once.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}



