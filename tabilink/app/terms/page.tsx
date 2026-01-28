
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"

export default function TermsPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 container py-12">
                <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
                <div className="prose dark:prose-invert max-w-none">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>
                    <p>Welcome to TabiLink. By accessing our website, you agree to these terms and conditions.</p>
                    <h3>1. Usage</h3>
                    <p>You agree to use our platform for lawful purposes only.</p>
                    <h3>2. Bookings</h3>
                    <p>All bookings are subject to availability and confirmation.</p>
                    {/* Add more mock content as needed */}
                </div>
            </main>
            <Footer />
        </div>
    )
}
