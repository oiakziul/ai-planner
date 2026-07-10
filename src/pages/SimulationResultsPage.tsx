import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Goal, CalendarClock, PiggyBank, Wallet, CreditCard, Landmark } from 'lucide-react';
import { cn } from "@/lib/utils";
import { type SimulationFormData } from "@/data/simulation";
import { calcMonthlySavings } from "@/utils/simulation";
import { useSimulationStorage } from "@/hooks/useSimulationStorage";
import { Card } from "./componentes/features/simulationResults/Card";
import { PageHero } from "./componentes/shared/PageHero";
import { AIInsightsCard } from "./componentes/features/simulationResults/AIInsightCardProps";
import { formatCurrencyMask, type Currency } from "@/utils/currency";

const mockSimulation: SimulationFormData = {
  id: "simulation_test",
  income: '500000',
  expenses: '200000',
  debts: '50000',
  goalName: 'Viagem para o Japão',
  goalAmount: '1500000',
  goalDeadline: '12',
};

const getCurrencyByLanguage = (langCode: string): Currency => {
  const lang = langCode.split("-")[0].toLowerCase();
  if (lang === "en") return "USD";
  if (lang === "es") return "EUR";
  return "BRL";
};

export const SimulationResultsPage = () => {
  // Carrega as traduções da página de resultados e reaproveita as chaves dos inputs
  const { t, i18n } = useTranslation(["resultado", "simulationFormSteps"]);
  const { id } = useParams<{ id: string }>();
  const { getFormData } = useSimulationStorage();

  const [isAIPanelExpanded, setIsAIPanelExpanded] = useState(false);

  const data = (id ? getFormData(id) : null) || mockSimulation;

  const monthlySavings = calcMonthlySavings(data);
  const activeCurrency = getCurrencyByLanguage(i18n.language);

  const formattedSavings = monthlySavings.toLocaleString(
    activeCurrency === "USD" ? "en-US" : activeCurrency === "EUR" ? "de-DE" : "pt-BR",
    {
      style: "currency",
      currency: activeCurrency,
    }
  );

  const formatCardValue = (rawString: string) => {
    const rawDigits = rawString.replace(/\D/g, "");
    return formatCurrencyMask(rawDigits, activeCurrency);
  };

  const mainLayout = cn(
    "mx-auto max-w-[89rem] h-auto px-4 py-10 sm:py-14 font-sans select-none"
  );

  const pageGridLayout = cn(
    "grid grid-cols-1 lg:grid-cols-3 gap-6"
  );

  const card1Wrapper = cn("lg:col-start-1 lg:row-start-1");
  const card2Wrapper = cn("lg:col-start-2 lg:row-start-1");
  const card3Wrapper = cn("lg:col-start-3 lg:row-start-1");

  const card4Wrapper = cn("lg:col-start-3 lg:row-start-2");
  const card5Wrapper = cn("lg:col-start-3 lg:row-start-3");
  const card6Wrapper = cn("lg:col-start-3 lg:row-start-4");

  const aiCardWrapper = cn(
    isAIPanelExpanded
      ? "fixed top-20 sm:top-24 bottom-6 left-4 right-4 md:left-10 md:right-10 lg:left-16 lg:right-16 z-40 transition-all duration-300 ease-in-out"
      : "lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:row-span-3 h-full transition-all duration-200"
  );

  const backdropClass = cn(
    "fixed inset-0 bg-black/75 backdrop-blur-md z-30 transition-opacity duration-300"
  );

  return (
    <>
      {isAIPanelExpanded && (
        <div 
          className={backdropClass}
          onClick={() => setIsAIPanelExpanded(false)}
        />
      )}

      <main className={mainLayout}>

        {/* TÍTULO DA PÁGINA TRADUZIDO */}
        <PageHero
          title={t("resultado:results_title", "Resultado da sua simulação")}
          subtitle={t("resultado:results_subtitle", "Com base no seu perfil financeiro e objetivos.")}
        />

        <div className={pageGridLayout}>

          {/* [Item 1]: Custo da Meta */}
          <div className={card1Wrapper}>
            <Card
              icon={Goal}
              label={t("simulationFormSteps:goalAmount_title", "Custo da Meta")}
              value={formatCardValue(data.goalAmount)}
              subtitle={data.goalName}
            />
          </div>

          {/* [Item 2]: Prazo */}
          <div className={card2Wrapper}>
            <Card
              icon={CalendarClock}
              label={t("simulationFormSteps:goalDeadline_title", "Prazo")}
              value={`${data.goalDeadline} ${
                data.goalDeadline === "1" 
                  ? t("simulationFormSteps:goalDeadline_suffix_years", "ano") 
                  : t("simulationFormSteps:goalDeadline_suffix_years", "anos")
              }`}
              subtitle={t("resultado:card_deadline_subtitle", "Tempo estimado para atingir o objetivo")}
            />
          </div>

          {/* [Item 3]: Capacidade de poupança mensal */}
          <div className={card3Wrapper}>
            <Card
              icon={PiggyBank}
              variant="primary"
              label={t("resultado:card_savings_title", "Capacidade de poupança")}
              value={formattedSavings}
              subtitle={t("resultado:card_savings_subtitle", "Quanto sobra livre por mês")}
            />
          </div>

          {/* [Item 4]: Renda Mensal */}
          <div className={card4Wrapper}>
            <Card
              icon={Wallet}
              label={t("simulationFormSteps:income_title", "Renda Mensal")}
              value={formatCardValue(data.income)}
              subtitle={t("resultado:card_income_subtitle", "Renda total bruta por mês")}
            />
          </div>

          {/* [Item 5]: Custos Fixos */}
          <div className={card5Wrapper}>
            <Card
              icon={CreditCard}
              label={t("simulationFormSteps:expenses_title", "Custos fixos de vida")}
              value={formatCardValue(data.expenses)}
              subtitle={t("resultado:card_expenses_subtitle", "Gastos essenciais por mês")}
            />
          </div>

          {/* [Item 6]: Dívidas/Parcelas */}
          <div className={card6Wrapper}>
            <Card
              icon={Landmark}
              label={t("simulationFormSteps:debts_title", "Dívidas / parcelas")}
              value={formatCardValue(data.debts)}
              subtitle={t("resultado:card_debts_subtitle", "Valor comprometido em parcelas/depósito")}
            />
          </div>

          {/* [Item 7]: Painel de Insights do Gemini */}
          <div className={aiCardWrapper}>
            <AIInsightsCard 
              simulationId={data.id} 
              isExpanded={isAIPanelExpanded}
              onToggleExpand={() => setIsAIPanelExpanded(!isAIPanelExpanded)}
            />
          </div>

        </div>
      </main>
    </>
  );
};

export default SimulationResultsPage;