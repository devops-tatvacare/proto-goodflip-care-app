import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

const getButtonClasses = (variant = "default", size = "default") => {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
  
  const motionClasses = "transition-all duration-normal ease-out"

  const variantClasses = {
    default: "bg-[var(--app-primary)] hover:bg-[var(--app-primary-hover)] text-[var(--ds-text-inverse)]",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline:
      "border-2 border-[var(--app-primary)] text-[var(--app-primary)] bg-[var(--ds-surface-primary)] hover:bg-[var(--app-primary)] hover:text-[var(--ds-text-inverse)]",
    secondary:
      "border-2 border-[var(--app-primary)] text-[var(--app-primary)] bg-[var(--ds-surface-primary)] hover:bg-[var(--app-primary)] hover:text-[var(--ds-text-inverse)]",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  }

  const sizeClasses = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3",
    lg: "h-11 px-8",
    icon: "h-10 w-10",
  }

  return `${baseClasses} ${motionClasses} ${variantClasses[variant as keyof typeof variantClasses] || variantClasses.default} ${sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.default}`
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(getButtonClasses(variant, size), className)} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button }
