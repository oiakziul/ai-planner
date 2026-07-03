// src/pages/SimulationResultsPage.tsx
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

// [NOVO]: Importamos o componente oficial da Inteligência Artificial


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
  const { id } = useParams<{ id: string }>(); 
  const { getFormData } = useSimulationStorage(); 

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

  // ==========================================
  // CONFIGURAÇÃO DE CLASSES (DESIGN TOKENS OKLCH)
  // ==========================================

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

  // O Wrapper da IA: Mantém o card do Gemini ocupando as colunas 1 e 2 no PC!
  const aiCardWrapper = cn(
    "lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:row-span-3 h-full"
  );

  // ==========================================
  // ESTRUTURA VISUAL (JSX)
  // ==========================================

  return (
    <main className={mainLayout}>
      
      {/* Cabeçalho de alta fidelidade */}
      <PageHero
        title={t("resultado_title", "Resultado da sua simulação")}
        subtitle={t("resultado_subtitle", "Com base no seu perfil financeiro e objetivos.")}
      />

      <div className={pageGridLayout}>
        
        {/* [Item 1]: Custo da Meta */}
        <div className={card1Wrapper}>
          <Card
            icon={Goal}
            label="Custo da Meta"
            value={data.goalAmount}
            subtitle={data.goalName}
          />
        </div>

        {/* [Item 2]: Prazo */}
        <div className={card2Wrapper}>
          <Card
            icon={CalendarClock}
            label="Prazo"
            value={`${data.goalDeadline} ${data.goalDeadline === "1" ? "ano" : "anos"}`}
            subtitle="Tempo estimado para atingir o objetivo"
          />
        </div>

        {/* [Item 3]: Economia mensal */}
        <div className={card3Wrapper}>
          <Card
            icon={PiggyBank}
            variant="primary"
            label="Economia mensal"
            value={formattedSavings}
            subtitle="Economia mensal necessária"
          />
        </div>

        {/* [Item 4]: Renda Mensal */}
        <div className={card4Wrapper}>
          <Card
            icon={Wallet}
            label="Renda Mensal"
            value={data.income}
            subtitle="Renda total bruta por mês"
          />
        </div>

        {/* [Item 5]: Custos Fixos */}
        <div className={card5Wrapper}>
          <Card
            icon={CreditCard}
            label="Custos fixos de vida"
            value={data.expenses}
            subtitle="Gastos essenciais por mês"
          />
        </div>

        {/* [Item 6]: Dívidas/Parcelas */}
        <div className={card6Wrapper}>
          <Card
            icon={Landmark}
            label="Dívidas / parcelas"
            value={data.debts}
            subtitle="Valor comprometido em parcelas/depósito"
          />
        </div>

        {/* [Item 7]: Painel de Insights do Gemini (Ocupa as colunas 1 e 2) */}
        <div className={aiCardWrapper}>
          {/* [NOVO]: O componente oficial do Gemini injetado exatamente no seu Wrapper! */}
          <AIInsightsCard simulationId={data.id} />
        </div>

      </div>
    </main>
  );
};

export default SimulationResultsPage;