// src/pages/componentes/shared/Input.tsx
import type { InputHTMLAttributes } from 'react'
import { Divider } from './Divider'
import { cn } from '@/lib/utils' // [NOVO] Importando o utilitário de classes

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  prefix?: string
  suffix?: string | React.ReactNode 
  hasError?: boolean // [NOVO] Adicionado na tipagem para resolver o erro do TypeScript
}

export function Input({ prefix, suffix, hasError, ...rest }: InputProps) {
  // [NOVO] Classe dinâmica: se houver erro, adiciona borda vermelha e muda o ring
  const containerStyle = cn(
    "bg-input flex items-center rounded-2xl p-4 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] transition-all border",
    hasError 
      ? "border-destructive focus-within:ring-2 focus-within:ring-destructive/20" 
      : "border-transparent focus-within:border-primary/50"
  )

  return (
    <div className={containerStyle}>
      {prefix && (
        <>
          <span className="text-muted-foreground text-sm font-medium">
            {prefix}
          </span>
          <Divider orientation="vertical" />
        </>
      )}
      <input
        className="text-foreground placeholder:text-muted-foreground w-full bg-transparent text-sm outline-none"
        autoFocus
        {...rest}
      />
      {suffix && (
        <>
          <Divider orientation="vertical" />
          <div className="text-muted-foreground flex items-center text-sm font-medium">
            {suffix}
          </div>
        </>
      )}
    </div>
  )
}