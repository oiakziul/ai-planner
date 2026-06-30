import { type ButtonHTMLAttributes } from "react";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils"; // cn já faz o papel do clsx e resolve conflitos

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "primary" | "secondary" | "ghost";
  icon?: LucideIcon;
}

// 1. Classes Base: Adicionado efeito físico de clique (scale-95), foco com teclado e transições suaves
const baseClasses = cn(
  "group inline-flex shrink-0 items-center justify-center font-sans font-medium text-sm gap-2",
  "px-5 py-2.5 transition-all duration-300 select-none cursor-pointer",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  "active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50"
);

// 2. Classes de Variantes: Adicionado Sombras Glow, bordas sutis e variações elegantes de hover
const variantClasses = {
  // Padrão Primário (Verde-água vibrante com sombra glow que se expande no hover)
  primary: cn(
    "bg-primary text-primary-foreground font-semibold rounded-xl border border-transparent",
    "shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/25 hover:brightness-105"
  ),
  // Padrão Secundário (Visual com borda sutil, fica ligeiramente aceso no hover)
  secondary: cn(
    "bg-secondary text-secondary-foreground border border-border rounded-3xl",
    "hover:bg-accent hover:text-accent-foreground hover:shadow-sm"
  ),
  // Padrão Fantasma (Fundo transparente, acende no hover usando as variáveis do Shadcn)
  ghost: cn(
    "rounded-lg text-foreground bg-transparent",
    "hover:bg-accent hover:text-accent-foreground"
  ),
};

export function Button({
  variant,
  icon: Icon,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(baseClasses, variantClasses[variant], className)}
    >
      {/* 3. Ícone Vivo: O ícone agora ganha uma leve rotação de 6 graus e cresce no hover do botão! */}
      {Icon && (
        <Icon 
          size={16} 
          className="text-current opacity-85 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 ease-out" 
        />
      )}
      
      <span className="tracking-wide">{children || "Clique"}</span>
    </button>
  );
}