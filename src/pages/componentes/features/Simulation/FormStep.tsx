// src/components/features/Simulation/FormStep.tsx
import { ArrowRight, type LucideIcon } from 'lucide-react' 
import { Input, type InputProps } from '@/pages/componentes/shared/Input'
import ButtonRipple from '@/components/shadcn-space/button/button-16'

interface FormStepProps {
  icon: LucideIcon
  title: string
  question: string
  inputProps: InputProps
  submitButtonProps?: {
    label: string
    emojiIcon?: string
  }
}

export function FormStep({
  icon: Icon,
  title,
  question,
  inputProps,
  submitButtonProps
}: FormStepProps) {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] sm:p-8">

      <div className="bg-primary mb-4 flex h-15 w-15 items-center justify-center rounded-xl">
        <Icon size={32} className="text-primary-foreground" />
      </div>


      <h2 className="text-primary mb-1 text-xs font-semibold tracking-widest uppercase">
        {title}
      </h2>


      <h3 className="text-foreground mb-6 text-xl leading-snug font-semibold sm:text-2xl">
        {question}
      </h3>

      <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
        <Input {...inputProps} />

        <div className="flex-1">
          <ButtonRipple
            type="submit"
            variant="default"
            size="default"
            disabled={false}
            className="w-full ring ring-primary/20 shadow-lg h-11 py-0 mt-4 cursor-pointer"
          >
            <span>{submitButtonProps?.label ?? "Próximo"}</span>
            
            {submitButtonProps?.emojiIcon ? (
              <span className="ml-1.5 text-base leading-none">
                {submitButtonProps.emojiIcon}
              </span>
            ) : (
              <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
            )}
          </ButtonRipple>
        </div>
      </form>

    </div>
  )
}