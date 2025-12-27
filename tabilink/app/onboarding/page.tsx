"use client"

import Link from "next/link"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
  User,
  Phone,
  MapPin,
  Globe2,
  NotebookPen,
  ShieldCheck,
  Info,
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
import { Select } from "@/components/ui/select"

const onboardingSchema = z.object({
  fullName: z.string().min(2, "Add your full name"),
  phone: z.string().min(6, "Add a valid phone"),
  country: z.string().min(2, "Country is required"),
  city: z.string().min(2, "City is required"),
  passportNumber: z.string().optional(),
  preferredLanguage: z.string().min(2, "Choose a language"),
  travelStyle: z.string().min(2, "Select a travel style"),
  travelInterests: z.string().min(5, "Share your travel interests"),
  emergencyContactName: z.string().min(2, "Add contact name"),
  emergencyContactPhone: z.string().min(6, "Add contact phone"),
})

type OnboardingValues = z.infer<typeof onboardingSchema>

const mockCredentials = {
  email: "traveler.demo@tabilink.com",
  password: "Demo@1234",
  note: "UI-only demo credentials for local testing.",
}

export default function OnboardingPage() {
  const form = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      country: "",
      city: "",
      passportNumber: "",
      preferredLanguage: "",
      travelStyle: "",
      travelInterests: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
    },
  })

  const onSubmit = (values: OnboardingValues) => {
    toast.success("Profile saved (UI only)", {
      description:
        "Wire this onboarding form to your backend to persist traveler data.",
    })
    form.reset(values)
  }

  return (
    <div className="container grid gap-8 py-12 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <NotebookPen className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-wide">
              First-time setup
            </span>
          </div>
          <h1 className="text-3xl font-bold">Complete your traveler profile</h1>
          <p className="text-muted-foreground">
            Tell us a bit more so we can personalize recommendations and speed up
            future bookings.
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Traveler details</CardTitle>
            <CardDescription>
              We only use this information to improve your booking experience.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    name="fullName"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>Full name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              placeholder="Alex Traveler"
                              className="pl-10"
                              autoComplete="name"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage fieldState={fieldState} />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="phone"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>Phone number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              placeholder="+1 555 123 4567"
                              className="pl-10"
                              autoComplete="tel"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage fieldState={fieldState} />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="country"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Globe2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              placeholder="Japan"
                              className="pl-10"
                              autoComplete="country"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage fieldState={fieldState} />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="city"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              placeholder="Tokyo"
                              className="pl-10"
                              autoComplete="address-level2"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage fieldState={fieldState} />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="passportNumber"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>
                          Passport / ID <span className="text-muted-foreground">(optional)</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="X1234567" {...field} />
                        </FormControl>
                        <FormMessage fieldState={fieldState} />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="preferredLanguage"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>Preferred language</FormLabel>
                        <FormControl>
                          <Select value={field.value} onChange={field.onChange}>
                            <option value="" disabled>
                              Choose language
                            </option>
                            <option value="English">English</option>
                            <option value="Japanese">Japanese</option>
                            <option value="French">French</option>
                            <option value="Spanish">Spanish</option>
                            <option value="Other">Other</option>
                          </Select>
                        </FormControl>
                        <FormMessage fieldState={fieldState} />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="travelStyle"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>Travel style</FormLabel>
                        <FormControl>
                          <Select value={field.value} onChange={field.onChange}>
                            <option value="" disabled>
                              Select a style
                            </option>
                            <option value="Leisure">Leisure</option>
                            <option value="Business">Business</option>
                            <option value="Family">Family</option>
                            <option value="Adventure">Adventure</option>
                            <option value="Mixed">Mixed</option>
                          </Select>
                        </FormControl>
                        <FormMessage fieldState={fieldState} />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  name="travelInterests"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Travel interests</FormLabel>
                      <FormControl>
                        <textarea
                          placeholder="Beach escapes, museums, food tours..."
                          className="min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm outline-none transition focus-visible:ring-1 focus-visible:ring-ring"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage fieldState={fieldState} />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    name="emergencyContactName"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>Emergency contact name</FormLabel>
                        <FormControl>
                          <Input placeholder="Jamie Doe" {...field} />
                        </FormControl>
                        <FormMessage fieldState={fieldState} />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="emergencyContactPhone"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>Emergency contact phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 555 234 5678" {...field} />
                        </FormControl>
                        <FormMessage fieldState={fieldState} />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-start gap-3 rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
                  <ShieldCheck className="mt-0.5 h-4 w-4 text-primary" />
                  <div>
                    We keep your data secure and only use it to tailor travel
                    experiences. You can update these preferences anytime in your
                    account settings.
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  <CheckCircle2 className="h-4 w-4" />
                  Save and continue
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Mock credentials</CardTitle>
            <CardDescription>Use these for quick UI testing.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              <span className="font-medium">Email</span>
            </div>
            <div className="rounded-md border bg-muted/60 px-3 py-2">
              {mockCredentials.email}
            </div>
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              <span className="font-medium">Password</span>
            </div>
            <div className="rounded-md border bg-muted/60 px-3 py-2">
              {mockCredentials.password}
            </div>
            <p className="text-muted-foreground">{mockCredentials.note}</p>
            <p className="text-xs text-muted-foreground">
              Replace these with real credentials once authentication is wired up.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>What happens next?</CardTitle>
            <CardDescription>
              Finish setup to unlock personalized recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            {[
              "Save your traveler profile for faster checkouts.",
              "Get smarter hotel and package suggestions.",
              "Sync preferences across devices after login.",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                <span>{item}</span>
              </div>
            ))}
            <div className="pt-2">
              <Button asChild variant="outline" className="w-full">
                <Link href="/login">Return to login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}









