"use client"

import Link from "next/link"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
  UserPlus,
  Mail,
  Lock,
  CheckCircle2,
  Sparkles,
  Globe2,
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

const signupSchema = z
  .object({
    fullName: z.string().min(2, "Add your full name"),
    email: z.string().email("Enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Za-z]/, "Include at least one letter")
      .regex(/\d/, "Include at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
  })

type SignupValues = z.infer<typeof signupSchema>

export default function SignupPage() {
  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = (values: SignupValues) => {
    toast.success("Account created (UI only)", {
      description: "Wire this form to your auth backend to finish signup.",
    })
    form.reset(values)
  }

  return (
    <div className="container grid min-h-[calc(100vh-6rem)] items-center gap-10 py-12 lg:grid-cols-2">
      <div className="order-2 space-y-8 lg:order-1">
        <Card className="shadow-lg">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <UserPlus className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wide">
                Join TabiLink
              </span>
            </div>
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CardDescription>
              Start booking trips faster with saved traveler details and secure
              payments.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  name="fullName"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Full name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Alex Traveler"
                          autoComplete="name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage fieldState={fieldState} />
                    </FormItem>
                  )}
                />

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
                            autoComplete="new-password"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage fieldState={fieldState} />
                    </FormItem>
                  )}
                />

                <FormField
                  name="confirmPassword"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Confirm password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Repeat your password"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage fieldState={fieldState} />
                    </FormItem>
                  )}
                />

                <div className="text-sm text-muted-foreground">
                  By creating an account you agree to our{" "}
                  <Link
                    href="/about"
                    className="font-medium text-primary hover:underline"
                  >
                    terms
                  </Link>{" "}
                  and privacy standards.
                </div>

                <Button type="submit" className="w-full">
                  <UserPlus className="h-4 w-4" />
                  Create account
                </Button>
              </form>
            </Form>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              Already have an account?
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="order-1 space-y-6 rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5 p-8 shadow-inner lg:order-2">
        <div className="flex items-center gap-3 text-primary">
          <Sparkles className="h-6 w-6" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest">
              Member perks
            </p>
            <p className="text-sm text-muted-foreground">
              Unlock faster checkouts and curated travel deals.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-bold leading-tight">
            Plan, book, and track trips together
          </h2>
          <p className="text-base text-muted-foreground">
            Save traveler details, payment preferences, and wishlist ideas so
            every booking stays organized.
          </p>
          <div className="space-y-3">
            {[
              "Shared itineraries for family and friends",
              "Smart suggestions based on your preferences",
              "Secure payments with instant confirmations",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                <span className="text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-background/70 p-4 ring-1 ring-border">
          <Globe2 className="h-10 w-10 text-primary" />
          <div className="space-y-1">
            <p className="text-sm font-semibold">Global support</p>
            <p className="text-sm text-muted-foreground">
              Localized recommendations and assistance wherever you go.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

