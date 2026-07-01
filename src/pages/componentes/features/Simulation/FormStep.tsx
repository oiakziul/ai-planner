// src/components/features/Simulation/FormStep.tsx
import { useTranslation } from "react-i18next" 
import { ArrowLeft, ArrowRight, type LucideIcon } from 'lucide-react'
import { Input, type InputProps } from '@/pages/componentes/shared/Input'
import ButtonRipple from '@/components/shadcn-space/button/button-16'
import { cn } from '@/lib/utils'

export interface FormStepProps {
  id: string
  icon: LucideIcon
  title: string
  question: string
  inputProps: InputProps
  submitButtonProps?: {
    label: string
    emojiIcon?: string
  }
  onBack?: () => void
  onSubmit?: () => void
}

export function FormStep({
  icon: Icon,
  title,
  question,
  inputProps,
  submitButtonProps,
  onBack,
  onSubmit
}: FormStepProps) {
  const { t } = useTranslation("inicio");

  // ==========================================
  // CONFIGURAÇÃO DE CLASSES (DESIGN TOKENS)
  // ==========================================

  const formStepContainer = cn(
    "bg-card rounded-2xl p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] sm:p-8"
  );

  const iconContainer = cn(
    "bg-primary mb-4 flex h-15 w-15 items-center justify-center rounded-xl"
  );

  const titleStyle = cn(
    "text-primary mb-1 text-xs font-semibold tracking-widest uppercase"
  );

  const questionStyle = cn(
    "text-foreground mb-6 text-xl leading-snug font-semibold sm:text-2xl"
  );

  const formStyle = cn(
    "flex flex-col gap-4"
  );

  const buttonContainer = cn(
    "flex flex-col sm:flex-row-reverse gap-3 mt-4 w-full"
  );

  const btnProximoStyle = cn(
    "w-full sm:flex-1 ring ring-primary/20 shadow-lg h-11 py-0 cursor-pointer"
  );

  const btnVoltarStyle = cn(
    "w-full sm:flex-1 ring ring-primary/20 shadow-lg h-11 py-0 cursor-pointer"
  );

  // ==========================================
  // ESTRUTURA VISUAL (JSX)
  // ==========================================

  return (
    <div className={formStepContainer}>

      {/* Ícone */}
      <div className={iconContainer}>
        <Icon size={32} className="text-primary-foreground" />
      </div>

      {/* Título Traduzido */}
      <h2 className={titleStyle}>{t(title)}</h2>

      {/* Pergunta Traduzida */}
      <h3 className={questionStyle}>{t(question)}</h3>

      {/* Formulário */}
      <form 
        className={formStyle} 
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.(); // [CORRIGIDO]: Dispara o avanço de etapa no Enter ou Clique!
        }}
      >
        {/* Tradução automática de placeholders, prefixos ($ ou R$) e sufixos */}
        <Input
          {...inputProps}
          placeholder={inputProps.placeholder ? t(inputProps.placeholder) : undefined}
          prefix={inputProps.prefix ? t(inputProps.prefix) : undefined}
          suffix={inputProps.suffix ? t(inputProps.suffix) : undefined}
        />

        <div className={buttonContainer}>

          {/* Botão Avançar / Gerar Simulação */}
          <ButtonRipple
            type="submit"
            variant="default"
            size="default"
            disabled={false}
            className={btnProximoStyle}
          >
            <span className="inline-flex items-center justify-center gap-1.5 leading-none">
              {submitButtonProps?.label ? t(submitButtonProps.label) : t("Próximo", "Próximo")}

              {submitButtonProps?.emojiIcon ? (
                <span className="text-base leading-none">
                  {submitButtonProps.emojiIcon}
                </span>
              ) : (
                <ArrowRight className="h-4 w-4 shrink-0 translate-y-px transition-transform group-hover:translate-x-1" />
              )}
            </span>
          </ButtonRipple>

          {/* Botão Voltar */}
          <ButtonRipple
            type="button"
            variant="ghost"
            size="default"
            disabled={false}
            onClick={onBack}
            className={btnVoltarStyle}
          >
            <span className="inline-flex items-center justify-center gap-1.5 leading-none">
              <ArrowLeft className="h-4 w-4 shrink-0 translate-y-px transition-transform group-hover:-translate-x-1" />
              {t("Voltar", "Voltar")}
            </span>
          </ButtonRipple>

        </div>
      </form>

    </div>
  )
}