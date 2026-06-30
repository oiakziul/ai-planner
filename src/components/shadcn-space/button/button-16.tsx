// src/components/shadcn-space/button/button-16.tsx
"use client";
import React, { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { type VariantProps } from "class-variance-authority";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  nome?: string;
  icon?: LucideIcon;
}

const ButtonRipple = React.forwardRef<HTMLButtonElement, Props>(
  ({ children, nome, className, variant = "outline", size = "default", icon: Icon, ...props }, ref) => {
    const [pos, setPos] = useState({ x: 0, y: 0 });

    // [CORRIGIDO]: Usamos e.currentTarget para capturar as coordenadas do botão clicado.
    // Isso é 100% blindado contra bugs, muito mais rápido e remove a necessidade de usar Refs!
    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setPos({ 
        x: e.clientX - rect.left, 
        y: e.clientY - rect.top 
      });
    };

    return (
      <Button
        ref={ref} // Repassamos a Ref caso o componente pai precise, mas não usamos internamente
        variant={variant}
        size={size}
        onMouseEnter={handleMouseEnter}
        className={cn(
          "group relative overflow-hidden rounded-full font-sans font-semibold px-6 h-auto py-3 cursor-pointer border border-border transition-all duration-300 active:scale-95 select-none gap-2",
          className
        )}
        {...props}
      >
        {/* Ripple (A onda de cor que se expande a partir do mouse) */}
        <span
          className="absolute w-10 h-10 rounded-full scale-0 transition-transform duration-700 ease-in-out group-hover:scale-[15] pointer-events-none bg-primary"
          style={{ left: pos.x - 20, top: pos.y - 20 }}
        />

        {/* Ícone */}
        {Icon && (
          <Icon className="relative z-10 h-4 w-4 shrink-0 transition-all duration-300 group-hover:text-primary-foreground" />
        )}

        {/* Texto */}
        <span className="relative z-10 transition-colors duration-500 pointer-events-none group-hover:text-primary-foreground">
          {nome || children || "Button"}
        </span>
      </Button>
    );
  }
);

ButtonRipple.displayName = "ButtonRipple";

export default ButtonRipple;