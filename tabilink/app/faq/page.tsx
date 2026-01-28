
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export default function FAQPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 container py-12">
                <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
                <Accordion type="single" collapsible className="w-full max-w-2xl">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>How do I make a booking?</AccordionTrigger>
                        <AccordionContent>
                            Simply search for your destination, select a hotel or package, and follow the booking steps.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Can I cancel my reservation?</AccordionTrigger>
                        <AccordionContent>
                            Yes, you can cancel via your dashboard subject to our cancellation policy.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Do you offer travel insurance?</AccordionTrigger>
                        <AccordionContent>
                            Currently we do not offer direct travel insurance, but we recommend you secure it separately.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </main>
            <Footer />
        </div>
    )
}
