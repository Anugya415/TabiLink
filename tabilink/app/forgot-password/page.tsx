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
      <div className="flex flex-col justify-center space-y-6">
        <div className="space-y-2">
          <Link
            href="/login"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <ArrowLeft className="h-4 w-4" />
            <span>RESET PASSWORD</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Forgot Password?</h1>
          <p className="text-muted-foreground">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              {isSuccess 
                ? "Check your email for reset instructions"
                : "Enter your email to receive reset instructions"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSuccess ? (
              <div className="space-y-4 text-center py-8">
                <div className="flex justify-center">
                  <div className="rounded-full bg-green-100 p-3">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Check your email</h3>
                  <p className="text-sm text-muted-foreground">
                    We've sent password reset instructions to{" "}
                    <span className="font-medium">{form.getValues("email")}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    The link will expire in 1 hour. If you don't see the email, check your spam folder.
                  </p>
                </div>
                <div className="pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsSuccess(false)
                      form.reset()
                    }}
                  >
                    Send another email
                  </Button>
                </div>
              </div>
            ) : (
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

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
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
            )}

            <div className="mt-6 text-center text-sm">
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Back to login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="hidden lg:flex flex-col justify-center space-y-6 p-12 bg-muted/50 rounded-lg">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <CheckCircle2 className="h-4 w-4" />
            <span>SECURE BY DESIGN</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Your password reset link is encrypted and will expire in 1 hour for your security.
          </p>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Password Reset</h2>
          <p className="text-muted-foreground">
            Follow the instructions in the email to securely reset your password.
          </p>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Secure reset process</p>
              <p className="text-sm text-muted-foreground">
                One-time use token that expires in 1 hour
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Email verification</p>
              <p className="text-sm text-muted-foreground">
                Only the account owner can reset the password
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

