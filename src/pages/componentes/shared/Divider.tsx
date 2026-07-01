// src/components/shared/Divider.tsx
import React from "react"
import { cn } from "@/lib/utils"

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical"
}

export function Divider({
  orientation = "horizontal",
  className,
  ...props
}: DividerProps) {
  return (
    <div
      role="none"
      className={cn(
        "bg-border shrink-0",
        orientation === "horizontal" ? "h-px w-full my-4" : "w-px h-4 mx-3",
        className
      )}
      {...props}
    />
  )
}