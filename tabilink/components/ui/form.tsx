import * as React from "react"
import { useFormContext, FormProvider, Controller } from "react-hook-form"
import { cn } from "@/lib/utils"
import { Label } from "./label"
import { Input } from "./input"

const Form = FormProvider

const FormField = ({
  name,
  render,
  className,
  ...props
}: {
  name: string
  render: (props: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field: any
    fieldState: {
      error?: { message?: string }
    }
    formState: ReturnType<typeof useFormContext>['formState']
  }) => React.ReactNode
  className?: string
}) => {
  const form = useFormContext()
  const fieldState = form.formState.errors[name]
    ? { error: form.formState.errors[name] as { message?: string } }
    : { error: undefined }

  return (
    <Controller
      name={name as never}
      control={form.control}
      render={({ field }) => (
        <div className={cn("space-y-2", className)} {...props}>
          {render({
            field,
            fieldState,
            formState: form.formState,
          })}
        </div>
      )}
    />
  )
}

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("space-y-2", className)} {...props} />
  )
})
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<
  HTMLLabelElement,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => {
  return (
    <Label
      ref={ref}
      className={cn(className)}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => {
  return <div ref={ref} {...props} />
})
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & {
    fieldState?: { error?: { message?: string } }
  }
>(({ className, children, fieldState, ...props }, ref) => {
  const message = children || fieldState?.error?.message
  if (!message) return null

  return (
    <p
      ref={ref}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {message}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
}

