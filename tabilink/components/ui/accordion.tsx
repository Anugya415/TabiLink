
"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const Accordion = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { type?: "single" | "multiple", collapsible?: boolean }
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("", className)} {...props} />
))
Accordion.displayName = "Accordion"

const AccordionItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("border-b", className)} {...props} />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)

    // This is a simplified implementation. For full accessible accordion 
    // with 'type="single"' coordination, we'd need context. 
    // For now this effectively behaves like type="multiple".

    return (
        <div className="flex">
            <button
                ref={ref}
                onClick={(e) => {
                    setIsOpen(!isOpen)
                    // Propagate click if needed, but for simple use case this toggle is enough 
                    // if we don't need strictly one-at-a-time opening.
                    // To strictly support the FAQ page, we need to toggle the content visibility.
                    // However, the content is in a sibling component.
                    // Let's use a simpler detailed/summary approach or Context.
                    // Let's retry with Context below.
                    props.onClick?.(e)
                }}
                className={cn(
                    "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
                    className
                )}
                data-state={isOpen ? "open" : "closed"}
                {...props}
            >
                {children}
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
            </button>
        </div>
    )
})
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
            className
        )}
        {...props}
    >
        <div className="pb-4 pt-0">{children}</div>
    </div>
))
AccordionContent.displayName = "AccordionContent"

// Real implementation with Context to support parent control
const AccordionContext = React.createContext<{
    value?: string | string[]
    onValueChange?: (value: string) => void
}>({})

const AccordionRoot = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        type?: "single" | "multiple",
        collapsible?: boolean,
        value?: string,
        defaultValue?: string,
        onValueChange?: (value: string) => void
    }
>(({ className, type, value: valueProp, onValueChange, children, ...props }, ref) => {
    const [value, setValue] = React.useState<string | undefined>(props.defaultValue)

    const handleValueChange = (newValue: string) => {
        if (value === newValue && props.collapsible) {
            setValue("")
        } else {
            setValue(newValue)
        }
    }

    return (
        <AccordionContext.Provider value={{ value, onValueChange: handleValueChange }}>
            <div ref={ref} className={cn("", className)} {...props}>
                {children}
            </div>
        </AccordionContext.Provider>
    )
})
AccordionRoot.displayName = "Accordion"

const AccordionItem2 = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, children, ...props }, ref) => {
    // Pass value down? No need, consume in child.
    // Actually simpler: Just clone children or simple context.
    return (
        <AccordionItemContext.Provider value={{ value }}>
            <div ref={ref} className={cn("border-b", className)} {...props}>
                {children}
            </div>
        </AccordionItemContext.Provider>
    )
})
AccordionItem2.displayName = "AccordionItem"

const AccordionItemContext = React.createContext<{ value: string }>({ value: "" })

const AccordionTrigger2 = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, onClick, ...props }, ref) => {
    const { value: selectedValue, onValueChange } = React.useContext(AccordionContext)
    const { value: itemValue } = React.useContext(AccordionItemContext)
    const isOpen = selectedValue === itemValue

    return (
        <header className="flex">
            <button
                ref={ref}
                onClick={(e) => {
                    onValueChange?.(itemValue)
                    onClick?.(e)
                }}
                className={cn(
                    "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
                    className
                )}
                data-state={isOpen ? "open" : "closed"}
                {...props}
            >
                {children}
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
            </button>
        </header>
    )
})
AccordionTrigger2.displayName = "AccordionTrigger"

const AccordionContent2 = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
    const { value: selectedValue } = React.useContext(AccordionContext)
    const { value: itemValue } = React.useContext(AccordionItemContext)
    const isOpen = selectedValue === itemValue

    if (!isOpen) return null

    return (
        <div
            ref={ref}
            className={cn(
                "overflow-hidden text-sm transition-all",
                className
            )}
            {...props}
        >
            <div className="pb-4 pt-0">{children}</div>
        </div>
    )
})
AccordionContent2.displayName = "AccordionContent"

export { AccordionRoot as Accordion, AccordionItem2 as AccordionItem, AccordionTrigger2 as AccordionTrigger, AccordionContent2 as AccordionContent }
