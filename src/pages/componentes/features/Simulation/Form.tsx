// src/components/features/Simulation/Form.tsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { simulationFormSteps } from "@/data/simulation";
import { FormStep } from "./FormStep";
import { StepProgress } from "./Progress";
import { formatCurrencyMask, type Currency } from "@/utils/currency";

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

  const [formData, setFormData] = useState<Record<string, string>>({
    income: "",
    expenses: "",
    debts: "",
    goalName: "",
    goalAmount: "",
    goalDeadline: "",
  });

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

  const handleInputChange = (value: string) => {
    let finalValue = value;

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

  // Handler para avançar
  const handleNextStep = () => {
    if (currentStepIndex + 1 > totalSteps - 1) {
      console.log("Formulário concluído! Dados para a IA:", { ...formData, timeUnit });
      return;
    }
    setCurrentStepIndex((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
    if (currentStepIndex === 0) {
      return;
    }
    setCurrentStepIndex((prev) => prev - 1);
  };

  const inputPropsDynamic = {
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
        onBack={currentStepIndex > 0 ? handlePreviousStep : undefined}
        onSubmit={handleNextStep}
      />
    </>
  );
};