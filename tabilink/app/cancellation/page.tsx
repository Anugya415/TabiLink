
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"

export default function CancellationPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 container py-12">
                <h1 className="text-3xl font-bold mb-6">Cancellation Policy</h1>
                <div className="prose dark:prose-invert max-w-none">
                    <p>We understand plans change. Here is our cancellation policy.</p>
                    <h3>Refunds</h3>
                    <p>Cancellations made 24 hours before the booking date are eligible for a full refund.</p>
                </div>
            </main>
            <Footer />
        </div>
    )
}
