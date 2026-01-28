
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"

export default function PrivacyPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 container py-12">
                <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
                <div className="prose dark:prose-invert max-w-none">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>
                    <p>Your privacy is important to us. This policy explains how we handle your data.</p>
                    <h3>Data Collection</h3>
                    <p>We collect information you provide directly to us when making a booking.</p>
                </div>
            </main>
            <Footer />
        </div>
    )
}
