// src/pages/SimulationResultsPage.tsx
import { useTranslation } from "react-i18next";

import { Goal, CalendarClock, PiggyBank, Wallet, CreditCard, Landmark } from 'lucide-react';
import { cn } from "@/lib/utils";
import { type SimulationFormData } from "@/data/simulation";
import { calcMonthlySavings } from "@/utils/simulation";
import { Card } from "./componentes/features/simulationResults/Card";
import { PageHero } from "./componentes/shared/PageHero";

const mockSimulation: SimulationFormData = {
  id: "simulation_test",
  income: 'R$ 5.000,00',
  expenses: 'R$ 2.000,00',
  debts: 'R$ 500,00',
  goalName: 'Viagem para o Japão',
  goalAmount: 'R$ 15.000,00',
  goalDeadline: '12',
};

type Currency = "BRL" | "USD" | "EUR";

const getCurrencyByLanguage = (langCode: string): Currency => {
  const lang = langCode.split("-")[0].toLowerCase();
  if (lang === "en") return "USD";
  if (lang === "es") return "EUR";
  return "BRL";
};

export const SimulationResultsPage = () => {
  const { t, i18n } = useTranslation("pagina2");

  const data: SimulationFormData = mockSimulation;

  const monthlySavings = calcMonthlySavings(data);

  const activeCurrency = getCurrencyByLanguage(i18n.language);
  const formattedSavings = monthlySavings.toLocaleString(
    activeCurrency === "USD" ? "en-US" : activeCurrency === "EUR" ? "de-DE" : "pt-BR",
    {
      style: "currency",
      currency: activeCurrency,
    }
  );


  const mainLayout = cn(
    "mx-auto max-w-7xl px-4 py-10 sm:py-14 font-sans select-none"
  );

  const pageGridLayout = cn(
    "grid grid-cols-1 lg:grid-cols-3 gap-6"
  );

  const aiAdvisorCardStyle = cn(
    "relative w-full h-full min-h-[460px] overflow-hidden transition-all duration-300",
    "flex flex-col items-center justify-center rounded-3xl p-8 border border-border bg-card/30 backdrop-blur-md shadow-2xl text-card-foreground text-center"
  );

  const aiTitleStyle = cn(
    "drop-shadow-sm px-4 font-sans font-bold text-xl md:text-2xl text-foreground mb-2"
  );

  const aiSubtitleStyle = cn(
    "text-sm text-muted-foreground max-w-md font-medium"
  );

  return (
    <main className={mainLayout}>
      
      <PageHero
        title={t("resultado_title", "Resultado da sua simulação")}
        subtitle={t("resultado_subtitle", "Com base no seu perfil financeiro e objetivos.")}
      />

      <div className={pageGridLayout}>

        <div className="lg:col-start-1 lg:row-start-1">
          <Card
            icon={Goal}
            label="Custo da Meta"
            value={data.goalAmount}
            subtitle={data.goalName}
          />
        </div>

        <div className="lg:col-start-2 lg:row-start-1">
          <Card
            icon={CalendarClock}
            label="Prazo"
            value={`${data.goalDeadline} ${data.goalDeadline === "1" ? "ano" : "anos"}`}
            subtitle="Tempo estimado para atingir o objetivo"
          />
        </div>

        <div className="lg:col-start-3 lg:row-start-1">
          <Card
            icon={PiggyBank}
            variant="primary"
            label="Economia mensal"
            value={formattedSavings}
            subtitle="Economia mensal necessária"
          />
        </div>

        <div className="lg:col-start-3 lg:row-start-2">
          <Card
            icon={Wallet}
            label="Renda Mensal"
            value={data.income}
            subtitle="Renda total bruta por mês"
          />
        </div>

        <div className="lg:col-start-3 lg:row-start-3">
          <Card
            icon={CreditCard}
            label="Custos fixos de vida"
            value={data.expenses}
            subtitle="Gastos essenciais por mês"
          />
        </div>

        <div className="lg:col-start-3 lg:row-start-4">
          <Card
            icon={Landmark}
            label="Dívidas / parcelas"
            value={data.debts}
            subtitle="Valor comprometido em parcelas/depósito"
          />
        </div>

        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:row-span-3 h-auto">
          <div className={aiAdvisorCardStyle}>
            <h2 className={aiTitleStyle}>
              {t('msg', 'Sua análise inteligente está sendo gerada...')}
            </h2>
            <p className={aiSubtitleStyle}>
              Nossos consultores de Inteligência Artificial estão calculando os juros compostos necessários para atingir o seu objetivo. Em breve as tabelas aparecerão aqui!
            </p>
          </div>
        </div>

      </div>
    </main>
  );
};

export default SimulationResultsPage;