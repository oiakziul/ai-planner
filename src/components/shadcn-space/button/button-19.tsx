// src/components/shadcn-space/button/button-19.tsx

import React from "react";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  nome?: string;
  icon?: LucideIcon;
}

const InteractiveHoverButton = React.forwardRef<HTMLButtonElement, Props>(
  ({ children, className, nome, icon: Icon, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "group relative flex h-12 w-fit items-center justify-center gap-3 overflow-hidden rounded-full  bg-background px-6 pr-12 py-3 font-sans font-medium text-foreground transition-all duration-300 select-none cursor-pointer",
          "hover:border-primary/50 hover:shadow-md hover:shadow-primary/10 shadow-sm ",
          className
        )}
        {...props}
      >
        {/* Esquerda: bolinha ou ícone */}
        <div className="relative h-4 w-4 shrink-0 flex items-center justify-center">
          <div className="absolute h-2 w-2 rounded-full bg-primary transition-all duration-300 group-hover:scale-0 group-hover:opacity-0" />
          {Icon && (
            <Icon className="absolute h-6 w-6 text-primary scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300" />
          )}
        </div>

        {/* Texto */}
        <span className="text-sm">
          {nome || children || "Button"}
        </span>

        {/* Seta direita */}
        <div className="absolute right-3 flex h-6 w-6 translate-x-12 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </button>
    );
  }
);

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export default InteractiveHoverButton;