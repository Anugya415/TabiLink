"use client"

import { Plane, Shield, Users, Award } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/contexts/TranslationContext"

export default function AboutPage() {
  const { t } = useTranslation()
  return (
    <div className="container py-8 sm:py-12 lg:py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">{t("aboutTabiLink")}</h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
            {t("aboutDescription")}
          </p>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <p className="text-muted-foreground">
            {t("aboutMission")}
          </p>
          <p className="text-muted-foreground">
            {t("aboutExperience")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle>{t("secureTrusted")}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {t("secureDescription")}
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>{t("expertSupport")}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {t("expertSupportDesc")}
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Plane className="h-8 w-8 text-primary mb-2" />
              <CardTitle>{t("bestPrices")}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {t("bestPricesDesc")}
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Award className="h-8 w-8 text-primary mb-2" />
              <CardTitle>{t("qualityAssured")}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {t("qualityAssuredDesc")}
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">{t("joinTravelers")}</h2>
          <p className="text-muted-foreground mb-6">
            {t("startAdventure")}
          </p>
        </div>
      </div>
    </div>
  )
}


