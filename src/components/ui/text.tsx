import { cn } from "@/lib/utils"

function Text({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="text"
      className={cn("select-none", className)}
      {...props}
    />
  )
}

export { Text }
