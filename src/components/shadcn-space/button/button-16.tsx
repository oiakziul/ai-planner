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
  iconPlacement?: "left" | "right";
}

const RIPPLE_SIZE = 40; // deve bater com w-10 h-10 (10 * 4px)

const ButtonRipple = React.forwardRef<HTMLButtonElement, Props>(
  ({ children, nome, className, variant = "outline", size = "default", icon: Icon, iconPlacement = "left", ...props }, ref) => {
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(15);

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // distância até o canto mais distante do ponto onde o mouse entrou
      const maxX = Math.max(x, rect.width - x);
      const maxY = Math.max(y, rect.height - y);
      const distance = Math.sqrt(maxX ** 2 + maxY ** 2);

      // escala necessária pro círculo cobrir até esse canto, +margem de 20%
      const requiredScale = (distance / (RIPPLE_SIZE / 2)) * 1.2;

      setPos({ x, y });
      setScale(Math.max(requiredScale, 15)); // nunca menor que o mínimo original
    };

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        onMouseEnter={handleMouseEnter}
        className={cn(
          "group relative overflow-hidden rounded-full font-sans font-semibold px-6 h-auto py-3 cursor-pointer border border-border transition-all duration-300 active:scale-95 select-none gap-2",
          className
        )}
        {...props}
      >
        {/* Ripple */}
        <span
          className="absolute w-10 h-10 rounded-full scale-0 transition-transform duration-700 ease-in-out group-hover:scale-(--ripple-scale) pointer-events-none bg-primary"
          style={{
            left: pos.x - RIPPLE_SIZE / 2,
            top: pos.y - RIPPLE_SIZE / 2,
            "--ripple-scale": scale,
          } as React.CSSProperties}
        />

        {/* Ícone à esquerda */}
        {Icon && iconPlacement === "left" && (
          <Icon className="relative z-10 h-4 w-4 shrink-0 transition-all duration-300 group-hover:text-primary-foreground" />
        )}

        {/* [CORRIGIDO]: Adicionado 'flex items-center justify-center gap-1.5' para garantir que os elementos filhos fiquem sempre lado a lado na horizontal */}
        <span className="relative z-10 flex items-center justify-center gap-1.5 transition-colors duration-500 pointer-events-none group-hover:text-primary-foreground">
          {nome || children || "Button"}
        </span>

        {/* Ícone à direita */}
        {Icon && iconPlacement === "right" && (
          <Icon className="relative z-10 h-4 w-4 shrink-0 transition-all duration-300 group-hover:text-primary-foreground" />
        )}
      </Button>
    );
  }
);

ButtonRipple.displayName = "ButtonRipple";

export default ButtonRipple;