"use client"

import Link from "next/link"
import { Plane, Facebook, Twitter, Instagram, Mail, Phone } from "lucide-react"
import { useTranslation } from "@/contexts/TranslationContext"

export function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-8 sm:py-12 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Plane className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">TabiLink</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {t("footerDescription")}
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t("quickLinks")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/hotels"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("hotels")}
                </Link>
              </li>
              <li>
                <Link
                  href="/travel"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("travelPackages")}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("aboutUs")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("contact")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t("support")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/faq"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("faq")}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("termsConditions")}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/cancellation"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("cancellationPolicy")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t("contactUs")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>support@tabilink.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} TabiLink. {t("allRightsReserved")}.</p>
        </div>
      </div>
    </footer>
  )
}


