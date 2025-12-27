import type { Metadata } from "next";
import { Poppins, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Sidebar } from "@/components/layout/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { TranslationProvider } from "@/contexts/TranslationContext";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TabiLink - Your Trusted Travel Partner",
  description: "Book hotels and travel packages with ease. Secure transactions and friendly booking experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${jetbrainsMono.variable} antialiased font-sans relative bg-white`}
      >
        <TranslationProvider>
          <Header />
          <Sidebar />
          <main className="min-h-screen transition-all duration-300 relative z-10 lg:pl-0 bg-white">{children}</main>
          <Footer />
          <Toaster />
        </TranslationProvider>
      </body>
    </html>
  );
}
