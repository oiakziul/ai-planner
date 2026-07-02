"use client";

import React, { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { type VariantProps } from "class-variance-authority";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  nome?: string;
  icon?: LucideIcon;
  iconPlacement?: "left" | "right";
}

const RIPPLE_SIZE = 40;

const ButtonRipple = React.forwardRef<HTMLButtonElement, Props>(
  (
    {
      children,
      nome,
      className,
      variant = "outline",
      size = "default",
      icon: Icon,
      iconPlacement = "left",
      ...props
    },
    ref
  ) => {
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(15);

    const handleMouseEnter = (
      e: React.MouseEvent<HTMLButtonElement>
    ) => {
      const rect = e.currentTarget.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const maxX = Math.max(x, rect.width - x);
      const maxY = Math.max(y, rect.height - y);

      const distance = Math.sqrt(maxX ** 2 + maxY ** 2);
      const requiredScale =
        (distance / (RIPPLE_SIZE / 2)) * 1.2;

      setPos({ x, y });
      setScale(Math.max(requiredScale, 15));
    };

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        onMouseEnter={handleMouseEnter}
        className={cn(
          "group relative overflow-hidden rounded-full border border-border px-6 py-3 font-sans font-semibold transition-all duration-300 active:scale-95 cursor-pointer select-none",
          className
        )}
        {...props}
      >
        {/* Ripple */}
        <span
          className="pointer-events-none absolute h-10 w-10 scale-0 rounded-full bg-primary transition-transform duration-700 ease-in-out group-hover:scale-(--ripple-scale)"
          style={
            {
              left: pos.x - RIPPLE_SIZE / 2,
              top: pos.y - RIPPLE_SIZE / 2,
              "--ripple-scale": scale,
            } as React.CSSProperties
          }
        />

        {/* Conteúdo */}
        <span className="relative z-10 flex items-center justify-center gap-2 leading-none transition-colors duration-500 group-hover:text-primary-foreground">
          {Icon && iconPlacement === "left" && (
            <Icon className="h-4 w-4 shrink-0" />
          )}

          {nome || children || "Button"}

          {Icon && iconPlacement === "right" && (
            <Icon className="h-4 w-4 shrink-0" />
          )}
        </span>
      </Button>
    );
  }
);

ButtonRipple.displayName = "ButtonRipple";

export default ButtonRipple;