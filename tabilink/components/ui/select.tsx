import * as React from "react"
import { cn } from "@/lib/utils"

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, value, defaultValue, ...props }, ref) => {
    // If value is provided, use controlled mode; otherwise use defaultValue (uncontrolled)
    const selectProps: any = {
      className: cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ref,
      ...props,
    }
    
    // Only set value if it's explicitly provided (controlled mode)
    if (value !== undefined) {
      selectProps.value = value === null ? "" : value
    } else if (defaultValue !== undefined) {
      // Use defaultValue for uncontrolled mode
      selectProps.defaultValue = defaultValue
    }
    
    return (
      <select {...selectProps}>
        {children}
      </select>
    )
  }
)
Select.displayName = "Select"

export { Select }


















