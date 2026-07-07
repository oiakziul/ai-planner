// src/pages/SimulationHistoryPage.tsx
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Trash2, ExternalLink, Target } from "lucide-react"; 
import { Button } from "@/components/ui/button"; 

import { cn } from "@/lib/utils";
import { type SimulationRecord } from "@/data/simulation";
import { calcMonthlySavings } from "@/utils/simulation";
import { PageHero } from "./componentes/shared/PageHero";

const LOCAL_STORAGE_KEY = "ai_planner_simulation_history";

type Currency = "BRL" | "USD" | "EUR";

const getCurrencyByLanguage = (langCode: string): Currency => {
  const lang = langCode.split("-")[0].toLowerCase();
  if (lang === "en") return "USD";
  if (lang === "es") return "EUR";
  return "BRL";
};

export const SimulationHistoryPage = () => {
  const { t, i18n } = useTranslation("pagina1");
  const [history, setHistory] = useState<SimulationRecord[]>([]);

  // 1. [LEITURA]: Carrega a lista completa de simulações salvas no Local Storage
  useEffect(() => {
    const storage = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storage) {
      setHistory(JSON.parse(storage) as SimulationRecord[]);
    }
  }, []);

  // 2. [EXCLUSÃO]: Apaga o item do Local Storage e atualiza o estado
  const handleDelete = (id: string) => {
    if (confirm(t("confirm_delete", "Deseja realmente excluir esta simulação?"))) {
      const updatedHistory = history.filter((item) => item.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedHistory));
      setHistory(updatedHistory);
    }
  };

  const mainLayout = cn(
    "mx-auto max-w-6xl px-4 py-10 sm:py-14 font-sans select-none "
  );

  const historyListContainer = cn(
    "flex flex-col gap-4 mt-6"
  );

  const historyCardStyle = cn(
    "relative w-full overflow-hidden transition-all duration-300",
    "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 rounded-2xl p-6 border border-border",
    "bg-card/30 backdrop-blur-md shadow-lg text-card-foreground"
  );

  const leftBrandingStyle = cn(
    "flex items-center gap-4 min-w-[200px]"
  );

  const iconContainer = cn(
    "flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0"
  );

  const textGroup = cn(
    "flex flex-col text-left"
  );

  const metaTitleStyle = cn(
    "font-bold text-foreground text-base tracking-tight"
  );

  const metaDateStyle = cn(
    "text-xs text-muted-foreground font-medium mt-0.5"
  );

  const metricsGridStyle = cn(
    "grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1 lg:max-w-xl xl:max-w-2xl w-full"
  );

  const metricBoxStyle = cn(
    "flex flex-col text-left justify-center"
  );

  const metricLabelStyle = cn(
    "text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1"
  );

  const metricValueStyle = cn(
    "text-sm font-bold text-foreground"
  );

  const actionsWrapperStyle = cn(
    "flex items-center justify-end gap-3 shrink-0"
  );

  const deleteBtnStyle = cn(
    "flex h-10 w-10 items-center justify-center rounded-xl border border-destructive/20 text-destructive bg-destructive/5 hover:bg-destructive/15 active:scale-95 transition-all cursor-pointer"
  );

  const detailsBtnStyle = cn(
    "gap-1.5 h-10 rounded-full font-semibold border border-border bg-background transition-all active:scale-95 duration-200 select-none cursor-pointer"
  );

  const fallbackEmptyStyle = cn(
    "relative w-full min-h-[250px] overflow-hidden transition-all duration-300",
    "flex flex-col items-center justify-center mx-auto rounded-3xl p-8 border border-border bg-card/30 backdrop-blur-md shadow-2xl text-card-foreground text-center"
  );

  return (
    <main className={mainLayout}>

      <PageHero
        title={t("historico_title", "Histórico de simulações")}
        subtitle={t("historico_subtitle", "Acompanhe o histórico de seus planos financeiros.")}
      />

      {history.length > 0 ? (
        <div className={historyListContainer}>
          {history.map((record) => {
            // Calcula dinamicamente o valor da economia de cada simulação
            const monthlySavings = calcMonthlySavings(record);

            // Formata o dinheiro baseado no idioma ativo atual do app!
            const activeCurrency = getCurrencyByLanguage(i18n.language);
            const formattedSavings = monthlySavings.toLocaleString(
              activeCurrency === "USD" ? "en-US" : activeCurrency === "EUR" ? "de-DE" : "pt-BR",
              { style: "currency", currency: activeCurrency }
            );

            const recordDate = new Date().toLocaleDateString(
              activeCurrency === "USD" ? "en-US" : "pt-BR"
            );

            return (
              <div key={record.id} className={historyCardStyle}>
                
                <div className={leftBrandingStyle}>
                  <div className={iconContainer}>
                    <Target className="h-5 w-5" />
                  </div>
                  <div className={textGroup}>
                    <span className={metaTitleStyle}>{record.goalName}</span>
                    <span className={metaDateStyle}>{recordDate}</span>
                  </div>
                </div>

                <div className={metricsGridStyle}>
                  <div className={metricBoxStyle}>
                    <span className={metricLabelStyle}>Custo da Meta</span>
                    <span className={metricValueStyle}>{record.goalAmount}</span>
                  </div>

                  <div className={metricBoxStyle}>
                    <span className={metricLabelStyle}>Prazo</span>
                    <span className={metricValueStyle}>
                      {record.goalDeadline} {record.timeUnit === "years" ? "anos" : "meses"}
                    </span>
                  </div>

                  <div className={metricBoxStyle}>
                    <span className={metricLabelStyle}>Economia Mensal</span>
                    <span className={metricValueStyle}>{formattedSavings}</span>
                  </div>
                </div>

                <div className={actionsWrapperStyle}>
                  <button
                    onClick={() => handleDelete(record.id)}
                    className={deleteBtnStyle}
                    title="Excluir simulação"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <Button asChild variant="outline" className={detailsBtnStyle}>
                    <Link to={`/resultado/${record.id}`}>
                      <ExternalLink className="h-4 w-4" />
                      <span>{t("ver_detalhes", "Ver detalhes")}</span>
                    </Link>
                  </Button>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className={fallbackEmptyStyle}>
          <h2 className="drop-shadow-sm px-4 font-sans font-bold text-xl md:text-2xl text-foreground mb-2">
            Nenhuma simulação no histórico
          </h2>
          <p className="text-sm text-muted-foreground max-w-sm font-medium">
            Você ainda não completou nenhuma simulação. Vá até a aba "Início" e crie o seu primeiro plano financeiro!
          </p>
        </div>
      )}
    </main>
  );
};