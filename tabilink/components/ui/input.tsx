import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, value, defaultValue, ...props }, ref) => {
    const inputProps: any = {
      type,
      className: cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ref,
      ...props,
    }
    
    // Only set value if it's explicitly provided (controlled mode)
    // If defaultValue is provided, let it be handled by React (uncontrolled mode)
    if (value !== undefined) {
      inputProps.value = value === null ? "" : value
    } else if (defaultValue !== undefined) {
      // Use defaultValue for uncontrolled mode
      inputProps.defaultValue = defaultValue
    }
    
    return (
      <input {...inputProps} />
    )
  }
)
Input.displayName = "Input"

export { Input }


















