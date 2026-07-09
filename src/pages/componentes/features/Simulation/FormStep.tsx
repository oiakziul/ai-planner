// src/components/features/Simulation/FormStep.tsx
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight, type LucideIcon } from 'lucide-react';
import { Input, type InputProps } from '@/pages/componentes/shared/Input';
import ButtonRipple from '@/components/shadcn-space/button/button-16';
import { cn } from '@/lib/utils';

export interface FormStepProps {
  id: string;
  icon: LucideIcon;
  title: string;
  question: string;
  inputProps: InputProps;
  submitButtonProps?: {
    label: string;
    emojiIcon?: string;
  };
}

interface ActionsButtonsProps {
  onBack: () => void;
  onNext: () => void;
  hideBackButton?: boolean;
  hasError?: boolean;
  shake?: boolean;
}

export function FormStep({
  icon: Icon,
  title,
  question,
  inputProps,
  submitButtonProps,
  hideBackButton,
  onBack,
  onNext,
  hasError,
  shake,
}: FormStepProps & ActionsButtonsProps) {
  const { t } = useTranslation("simulationFormSteps");

  const formStepContainer = cn(
    "bg-card rounded-2xl p-4  ring ring-primary/20 md:shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] sm:p-8",
    "w-full max-w-lg mx-auto min-h-[380px] md:min-h-[400px] flex flex-col justify-between"
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
    "flex flex-col gap-4 mt-auto",
    shake && "animate-shake"
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

  return (
    <div className={formStepContainer}>

      {/* Topo do Card */}
      <div>
        <div className={iconContainer}>
          <Icon size={32} className="text-primary-foreground" />
        </div>

        <h2 className={titleStyle}>{t(title)}</h2>

        <h3 className={questionStyle}>{t(question)}</h3>
      </div>

      {/* Formulário */}
      <form
        className={formStyle}
        onSubmit={(e) => {
          e.preventDefault();
          onNext();
        }}
      >
        <div className="flex flex-col w-full relative">

          <Input
            {...inputProps}
            hasError={hasError}
            placeholder={
              typeof inputProps.placeholder === "string"
                ? t(inputProps.placeholder)
                : undefined
            }
            prefix={
              typeof inputProps.prefix === "string"
                ? t(inputProps.prefix)
                : inputProps.prefix
            }
            suffix={
              typeof inputProps.suffix === "string"
                ? t(inputProps.suffix)
                : inputProps.suffix
            }
          />


          {hasError && (
            <span className="text-destructive text-xs font-semibold mt-1.5 ml-1 self-start animate-in fade-in slide-in-from-top-1 duration-300">
              {t("campo_obrigatorio", "Este campo é obrigatório!")}
            </span>
          )}
        </div>

        <div className={buttonContainer}>


          <ButtonRipple
            type="submit"
            variant="default"
            size="default"
            disabled={false}
            className={btnProximoStyle}
          >
            {submitButtonProps?.label ? t(submitButtonProps.label) : t("btn_next")}

            {submitButtonProps?.emojiIcon ? (
              <span className="text-base">{submitButtonProps.emojiIcon}</span>
            ) : (
              <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
            )}
          </ButtonRipple>


          {!hideBackButton && onBack && (
            <ButtonRipple
              type="button"
              variant="ghost"
              size="default"
              disabled={false}
              onClick={onBack}
              className={cn(btnVoltarStyle, hideBackButton ? "hidden" : "flex")}
              icon={ArrowLeft}
              iconPlacement="left"
            >
              {t("btn_back")}
            </ButtonRipple>
          )}

        </div>
      </form>

    </div>
  );
}