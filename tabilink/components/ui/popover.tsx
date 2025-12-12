import * as React from "react"
import { cn } from "@/lib/utils"

interface PopoverProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

interface PopoverContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const PopoverContext = React.createContext<PopoverContextValue | undefined>(
  undefined
)

const Popover = ({ open = false, onOpenChange, children }: PopoverProps) => {
  const [isOpen, setIsOpen] = React.useState(open)

  React.useEffect(() => {
    setIsOpen(open)
  }, [open])

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  return (
    <PopoverContext.Provider value={{ open: isOpen, onOpenChange: handleOpenChange }}>
      <div className="relative">{children}</div>
    </PopoverContext.Provider>
  )
}

const PopoverTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ children, onClick, className, asChild, ...props }, ref) => {
  const context = React.useContext(PopoverContext)
  if (!context) throw new Error("PopoverTrigger must be used within Popover")

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    context.onOpenChange(!context.open)
    onClick?.(e as any)
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      ref,
      className: cn(className, (children as any).props?.className),
      onClick: handleClick,
      ...props,
    })
  }

  return (
    <button
      ref={ref}
      className={cn(className)}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  )
})
PopoverTrigger.displayName = "PopoverTrigger"

const PopoverContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    align?: "start" | "center" | "end"
  }
>(({ className, align = "center", children, ...props }, ref) => {
  const context = React.useContext(PopoverContext)
  if (!context) throw new Error("PopoverContent must be used within Popover")

  if (!context.open) return null

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={() => context.onOpenChange(false)}
      />
      <div
        ref={ref}
        className={cn(
          "absolute z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
          align === "center" && "left-1/2 -translate-x-1/2",
          align === "start" && "left-0",
          align === "end" && "right-0",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </>
  )
})
PopoverContent.displayName = "PopoverContent"

export { Popover, PopoverTrigger, PopoverContent }

