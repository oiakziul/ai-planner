// src/components/features/Simulation/Form.tsx
import { useState } from "react";
import { simulationFormSteps } from "@/data/simulation";
import { FormStep } from "./FormStep";
import { StepProgress } from "./Progress";

export const SimulationForm = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const totalSteps = simulationFormSteps.length;
  const currentStep = simulationFormSteps[currentStepIndex];

  // Handler para avançar de etapa (com trava de segurança para o limite)
  const handleNextStep = () => {
    if (currentStepIndex + 1 > totalSteps - 1) {
      return;
    }
    setCurrentStepIndex((prev) => prev + 1);
  };

  // Handler para retroceder de etapa (com trava de segurança para não ficar menor que 0)
  const handlePreviousStep = () => {
    if (currentStepIndex === 0) {
      return;
    }
    setCurrentStepIndex((prev) => prev - 1);
  };

  return (
    <>
      {/* [CORRIGIDO]: Mapeamento dinâmico do progresso da barra verde-água baseada no estado */}
      <StepProgress currentStep={currentStepIndex + 1} totalSteps={totalSteps} />

      {/* [CORRIGIDO]: Passando a função de voltar para o botão 'Voltar' acionar a navegação reversa */}
      <FormStep
        key={currentStep.id}
        {...currentStep}
        onBack={handlePreviousStep}
        onSubmit={handleNextStep}
      />
    </>
  );
};