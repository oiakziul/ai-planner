import React, { useState, useEffect, useRef } from "react";
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

  // Controle de abertura/fechamento do dropdown customizado (só UI, não afeta o dado salvo)
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const timeDropdownRef = useRef<HTMLDivElement>(null);

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

  // Fecha o dropdown se clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (timeDropdownRef.current && !timeDropdownRef.current.contains(e.target as Node)) {
        setIsTimeDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  // ==========================================
  // ESTILIZAÇÃO DO DROPDOWN CUSTOMIZADO
  // Substitui o <select> nativo (impossível de estilizar o popup do SO)
  // por um menu próprio, no mesmo padrão visual do Header
  // ==========================================

  const dropdownTriggerClass = clsx(
    "flex items-center gap-1.5 h-full pl-3 pr-2 text-sm font-semibold",
    "text-muted-foreground hover:text-foreground transition-colors cursor-pointer outline-none",
    "focus-visible:ring-2 focus-visible:ring-primary/50 rounded-md"
  );

  const dropdownIconClass = clsx(
    "h-4 w-4 shrink-0 transition-transform duration-200",
    isTimeDropdownOpen && "rotate-180"
  );

  const dropdownMenuClass = clsx(
    "absolute top-[calc(100%+12px)] right-0 w-32 z-50 rounded-2xl p-1.5",
    "border border-border/60 shadow-2xl bg-popover/98 backdrop-blur-xl overflow-hidden",
    "animate-in fade-in slide-in-from-top-2 duration-200"
  );

  const getOptionButtonClass = (isActive: boolean) => clsx(
    "flex items-center justify-between w-full px-3 py-2.5 cursor-pointer rounded-xl transition-all text-sm",
    "outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
    isActive
      ? "bg-primary/10 text-primary font-semibold"
      : "text-foreground/80 hover:bg-accent hover:text-accent-foreground font-medium"
  );

  const activeDotClass = clsx(
    "h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_6px_1px_var(--primary)] animate-pulse"
  );

  if (currentStep.id === "goalDeadline") {
    inputPropsDynamic.suffix = (
      <div className="relative flex items-center h-full" ref={timeDropdownRef}>
        <button
          type="button"
          onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
          className={dropdownTriggerClass}
        >
          {timeUnit === "years" ? t("goalDeadline_suffix_years", "anos") : t("goalDeadline_suffix_months", "meses")}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={dropdownIconClass}
          >
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>

        {isTimeDropdownOpen && (
          <div className={dropdownMenuClass}>
            <ul className="space-y-0.5">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setTimeUnit("years");
                    setIsTimeDropdownOpen(false);
                  }}
                  className={getOptionButtonClass(timeUnit === "years")}
                >
                  {t("goalDeadline_suffix_years", "anos")}
                  {timeUnit === "years" && <span className={activeDotClass} />}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setTimeUnit("months");
                    setIsTimeDropdownOpen(false);
                  }}
                  className={getOptionButtonClass(timeUnit === "months")}
                >
                  {t("goalDeadline_suffix_months", "meses")}
                  {timeUnit === "months" && <span className={activeDotClass} />}
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
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