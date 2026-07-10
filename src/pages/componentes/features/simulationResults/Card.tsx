import { type LucideIcon } from 'lucide-react'
import { cn } from "@/lib/utils" 

interface CardProps {
  icon: LucideIcon
  label: string
  value: string
  subtitle: string
  variant?: 'default' | 'primary'
}

const variantClasses = {
  default: {
    card: 'bg-card',
    accent: 'text-primary',
    value: 'text-foreground',
    subtitle: 'text-muted-foreground',
  },
  primary: {
    card: 'bg-primary',
    accent: 'text-primary-foreground',
    value: 'text-primary-foreground',
    subtitle: 'text-primary-foreground/70',
  },
}

export function Card({
  icon: Icon,
  label,
  value,
  subtitle,
  variant = 'default',
}: CardProps) {
  const styles = variantClasses[variant]

  return (
    <div className={cn('rounded-2xl p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)]', styles.card)}>
      <div className="mb-3 flex items-center gap-2">
        <Icon size={16} className={styles.accent} />
        <span className={cn('text-xs font-semibold tracking-widest uppercase', styles.accent)}>
          {label}
        </span>
      </div>
      <p className={cn('text-3xl font-semibold', styles.value)}>
        {value}
      </p>
      <p className={cn('mt-1 text-sm', styles.subtitle)}>{subtitle}</p>
    </div>
  )
}