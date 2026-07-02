// src/components/features/Simulation/Form.tsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { simulationFormSteps } from "@/data/simulation";
import { FormStep } from "./FormStep";
import { StepProgress } from "./Progress";
import { formatCurrencyMask, type Currency } from "@/utils/currency";
// Importamos o tipo correto para evitar o erro de inferência estrita de caminhos do TypeScript [1]
import { type InputProps } from "@/pages/componentes/shared/Input";

const getCurrencyByLanguage = (langCode: string): Currency => {
  const lang = langCode.split("-")[0].toLowerCase();
  if (lang === "en") return "USD";
  if (lang === "es") return "EUR";
  return "BRL";
};

export const SimulationForm = () => {
  const { t, i18n } = useTranslation("inicio"); 
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const totalSteps = simulationFormSteps.length;
  const currentStep = simulationFormSteps[currentStepIndex];

  const [timeUnit, setTimeUnit] = useState<"years" | "months">("years");

  // Estados para controlar o alerta de erro e o tremor físico do input
  const [showError, setShowError] = useState(false);
  const [shake, setShake] = useState(false);

  const [formData, setFormData] = useState<Record<string, string>>(() => {
    if (typeof window === "undefined") return { income: "", expenses: "", debts: "", goalName: "", goalAmount: "", goalDeadline: "" };
    const savedData = localStorage.getItem("ai_planner_simulation_data");
    return savedData ? JSON.parse(savedData) : {
      income: "", expenses: "", debts: "", goalName: "", goalAmount: "", goalDeadline: "",
    };
  });

  // Gravação automática das respostas
  useEffect(() => {
    localStorage.setItem("ai_planner_simulation_data", JSON.stringify(formData));
  }, [formData]);

  // Sincronização de idioma
  useEffect(() => {
    setFormData((prev) => {
      const updated = { ...prev };
      const camposMonetarios = ["income", "expenses", "debts", "goalAmount"];
      const activeCurrency = getCurrencyByLanguage(i18n.language);

      camposMonetarios.forEach((key) => {
        const value = prev[key];
        if (value) {
          const rawDigits = value.replace(/\D/g, "");
          updated[key] = formatCurrencyMask(rawDigits, activeCurrency);
        }
      });

      return updated;
    });
  }, [i18n.language]);

  // Handler para capturar a digitação
  const handleInputChange = (value: string) => {
    let finalValue = value;

    // Se o usuário começar a digitar, removemos os avisos de erro e tremor imediatamente!
    setShowError(false);
    setShake(false);

    if (currentStep.id === "goalDeadline") {
      if (value.length > 2) return;
    }

    const camposMonetarios = ["income", "expenses", "debts", "goalAmount"];

    if (camposMonetarios.includes(currentStep.id)) {
      const activeCurrency = getCurrencyByLanguage(i18n.language);
      finalValue = formatCurrencyMask(value, activeCurrency);
    }

    setFormData((prev) => ({
      ...prev,
      [currentStep.id]: finalValue,
    }));
  };

  // Handler para avançar de etapa
  const handleNextStep = () => {
    const valorEtapaAtual = formData[currentStep.id];

    // [VALIDAÇÃO]: Se estiver vazio, ativa a borda vermelha e faz o input tremer!
    if (!valorEtapaAtual || valorEtapaAtual.trim() === "") {
      setShowError(true);
      setShake(true);
      
      // Reseta o estado do tremor após 500ms para permitir que trema novamente no próximo clique vazio
      setTimeout(() => setShake(false), 500); 
      return;
    }

    setShowError(false); // Reseta o erro para o próximo passo

    if (currentStepIndex + 1 > totalSteps - 1) {
      console.log("Formulário concluído! Dados para a IA:", { ...formData, timeUnit });
      return;
    }
    setCurrentStepIndex((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
    // Se o usuário clicar em voltar, removemos os avisos de erro da tela anterior
    setShowError(false);
    setShake(false);

    if (currentStepIndex === 0) {
      return;
    }
    setCurrentStepIndex((prev) => prev - 1);
  };

  // [CORRIGIDO]: Tipagem explícita de `: InputProps` garante compatibilidade total com o select dinâmico [1, 3]
  const inputPropsDynamic: InputProps = {
    ...currentStep.inputProps,
    value: formData[currentStep.id] || "",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e.target.value),
  };

  if (currentStep.id === "goalDeadline") {
    inputPropsDynamic.suffix = (
      <select
        value={timeUnit}
        onChange={(e) => setTimeUnit(e.target.value as "years" | "months")}
        className="bg-transparent text-muted-foreground text-sm font-medium outline-none cursor-pointer pr-1"
      >
        <option value="years" className="bg-popover text-foreground">{t("goalDeadline_suffix_years", "anos")}</option>
        <option value="months" className="bg-popover text-foreground">{t("goalDeadline_suffix_months", "meses")}</option>
      </select>
    );
  }

  return (
    <>
      <StepProgress currentStep={currentStepIndex + 1} totalSteps={totalSteps} />

      <FormStep
        key={currentStep.id}
        {...currentStep}
        inputProps={inputPropsDynamic}
        onBack={handlePreviousStep}
        onNext={handleNextStep}
        hideBackButton={currentStepIndex === 0}
        hasError={showError} 
        shake={shake} 
      />
    </>
  );
};