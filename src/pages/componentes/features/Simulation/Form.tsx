import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { simulationFormSteps } from "@/data/simulation";
import { FormStep } from "./FormStep";
import { StepProgress } from "./Progress";
import { formatCurrencyMask, type Currency } from "@/utils/currency";
import { type InputProps } from "@/pages/componentes/shared/Input";
import { useSimulationStorage } from "@/hooks/useSimulationStorage";

const getCurrencyByLanguage = (langCode: string): Currency => {
  const lang = langCode.split("-")[0].toLowerCase();
  if (lang === "en") return "USD";
  if (lang === "es") return "EUR";
  return "BRL";
};

export const SimulationForm = () => {
  const { t, i18n } = useTranslation("simulationFormSteps");
  const navigate = useNavigate();
  const { saveFormData } = useSimulationStorage();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const totalSteps = simulationFormSteps.length;
  const currentStep = simulationFormSteps[currentStepIndex];

  const [timeUnit, setTimeUnit] = useState<"years" | "months">("years");

  const [showError, setShowError] = useState(false);
  const [shake, setShake] = useState(false);

  const [formData, setFormData] = useState<Record<string, string>>({
    income: "",
    expenses: "",
    debts: "",
    goalName: "",
    goalAmount: "",
    goalDeadline: "",
  });

  useEffect(() => {
    localStorage.setItem("ai_planner_simulation_data", JSON.stringify(formData));
  }, [formData]);

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

  const handleNextStep = () => {
    const valorEtapaAtual = formData[currentStep.id];

    if (!valorEtapaAtual || valorEtapaAtual.trim() === "") {
      setShowError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setShowError(false);

    if (currentStepIndex + 1 > totalSteps - 1) {
      const newSimulationId = saveFormData(formData, timeUnit);
      localStorage.removeItem("ai_planner_simulation_data");
      navigate(`/resultado/${newSimulationId}`);
      return;
    }
    setCurrentStepIndex((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
    setShowError(false);
    setShake(false);

    if (currentStepIndex === 0) {
      return;
    }
    setCurrentStepIndex((prev) => prev - 1);
  };

  const inputPropsDynamic: InputProps = {
    ...currentStep.inputProps,
    value: formData[currentStep.id] || "",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      handleInputChange(e.target.value),
  };

  const selectClasses = clsx(
    "bg-transparent text-muted-foreground text-sm font-medium outline-none cursor-pointer pr-1"
  );
  
  const optionClasses = clsx(
    "bg-popover text-foreground"
  );

  if (currentStep.id === "goalDeadline") {
    inputPropsDynamic.suffix = (
      <select
        value={timeUnit}
        onChange={(e) => setTimeUnit(e.target.value as "years" | "months")}
        className={selectClasses}
      >
        <option value="years" className={optionClasses}>
          {t("goalDeadline_suffix_years", "anos")}
        </option>
        <option value="months" className={optionClasses}>
          {t("goalDeadline_suffix_months", "meses")}
        </option>
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