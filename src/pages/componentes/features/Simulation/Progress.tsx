// src/components/features/Simulation/Progress.tsx
import { useTranslation } from "react-i18next" 

interface StepProgressProps {
  currentStep: number
  totalSteps: number
}

export function StepProgress({ currentStep, totalSteps }: StepProgressProps) {
  const { t } = useTranslation("inicio"); 
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="mb-4">
      <p className="text-muted-foreground mb-2 text-sm font-sans select-none">
        {t("passo")} {currentStep} {t("de")} {totalSteps}
      </p>
      
      <div className="bg-border h-1 w-full overflow-hidden rounded-full">
        <div
          role="progressbar"
          aria-valuenow={currentStep}
          aria-valuemin={1}
          aria-valuemax={totalSteps}
          aria-label={`${t("passo")} ${currentStep} ${t("de")} ${totalSteps}`}
          className="bg-primary h-full rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}