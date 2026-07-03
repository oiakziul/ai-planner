// src/pages/componentes/features/simulationResults/AIInsightsCard.tsx
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useInsight } from "@/hooks/useInsight";
import { cn } from "@/lib/utils";
import { 
  Target, 
  Activity, 
  Lightbulb, 
  TrendingUp, 
  Coins, 
  Quote 
} from "lucide-react";
import { ScrollProgress } from "@/assets/styles/componentes/ScrollProgress";

interface AIInsightCardProps {
  simulationId: string;
}

export function AIInsightsCard({ simulationId }: AIInsightCardProps) {
  const { t } = useTranslation("pagina2");
  const { insight, isLoading, error } = useInsight(simulationId);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const scrollActiveColor = "bg-primary";

  // 1. CARD EXTERNO
  const cardOuterStyle = cn(
    "relative w-full h-full min-h-[400px] max-h-[459.5px] transition-all duration-300",
    "flex flex-col rounded-3xl border border-border bg-card/30 backdrop-blur-md shadow-2xl text-card-foreground",
    "overflow-hidden" 
  );

  // 2. CONTEÚDO INTERNO
  const cardInnerScrollStyle = cn(
     "flex-1 w-full h-full overflow-y-auto overflow-x-hidden scrollbar-hide p-8 flex flex-col"
  );

  const loadingTitleStyle = cn(
    "drop-shadow-sm px-4 font-sans font-bold text-xl md:text-2xl text-foreground mb-2 text-center"
  );

  const loadingSubtitleStyle = cn(
    "text-sm text-muted-foreground max-w-md font-medium text-center mx-auto"
  );

  const statusConfig = {
    viable: { 
      label: "Meta viável no prazo", 
      className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20" 
    },
    needs_adjustment: { 
      label: "Precisa de ajustes", 
      className: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20" 
    },
    unfeasible: { 
      label: "Meta inviável", 
      className: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/20" 
    },
  };

  return (
    <div className={cardOuterStyle}>
      
      {/* 👇 BARRA DE PROGRESSO FIXA! Fica grudada no topo do Card Externo e não rola com o texto! */}
      {insight && !isLoading && (
        <div className="absolute top-0 left-0 w-full z-50">
          <ScrollProgress containerRef={scrollContainerRef} activeColor={scrollActiveColor} />
        </div>
      )}

      {/* 👇 ÁREA DE ROLAGEM (A referência do scroll está aqui!) */}
      <div ref={scrollContainerRef} className={cardInnerScrollStyle}>
        
        {/* ESTADO 1: CARREGANDO */}
        {(isLoading || (!insight && !error)) && (
          <div className="flex flex-col items-center justify-center h-full my-auto animate-pulse">
            <h2 className={loadingTitleStyle}>
              {t('msg', 'Sua análise inteligente está sendo gerada...')}
            </h2>
            <p className={loadingSubtitleStyle}>
              Nossos consultores de Inteligência Artificial estão calculando os juros compostos necessários para atingir o seu objetivo. Em breve o laudo aparecerá aqui!
            </p>
          </div>
        )}

        {/* ESTADO 2: ERRO DA API */}
        {error && (
          <div className="flex flex-col items-center justify-center h-full my-auto">
            <h2 className="text-destructive font-bold text-xl">⚠️ Ops! Algo deu errado.</h2>
            <p className="text-muted-foreground mt-2">{error}</p>
          </div>
        )}

        {/* ESTADO 3: SUCESSO (LAUDO DA IA) */}
        {insight && !isLoading && (
          <div className="w-full flex flex-col items-start text-left animate-in fade-in slide-in-from-bottom-4 duration-700 gap-8">
            
            <h2 className="font-bold text-2xl md:text-3xl text-primary flex items-center gap-2">
              ✨ Plano de Ação Inteligente
            </h2>

            {/* SESSÃO 1: VIABILIDADE DA META */}
            <section className="w-full space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-bold text-lg flex items-center gap-2 text-foreground">
                  <Target className="h-5 w-5 text-primary" /> Viabilidade da Meta
                </h3>
                <span className={cn("px-3 py-1 rounded-full text-xs font-bold border", statusConfig[insight.feasibility.status].className)}>
                  {statusConfig[insight.feasibility.status].label}
                </span>
              </div>
              <p className="text-foreground/80 leading-relaxed text-sm md:text-base">
                {insight.feasibility.content}
              </p>
            </section>

            {/* SESSÃO 2: DIAGNÓSTICO FINANCEIRO */}
            <section className="w-full space-y-3">
              <h3 className="font-bold text-lg flex items-center gap-2 text-foreground">
                <Activity className="h-5 w-5 text-primary" /> Diagnóstico Financeiro
              </h3>
              <p className="text-foreground/80 leading-relaxed text-sm md:text-base">
                {insight.diagnosis.content}
              </p>
            </section>

            {/* SESSÃO 3: SUGESTÕES PRÁTICAS */}
            <section className="w-full space-y-3">
              <h3 className="font-bold text-lg flex items-center gap-2 text-foreground">
                <Lightbulb className="h-5 w-5 text-primary" /> Sugestões Práticas
              </h3>
              <ul className="space-y-2">
                {insight.suggestions.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-foreground/80 text-sm md:text-base leading-relaxed">
                    <span className="text-primary mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {/* SESSÃO 4: RENDA EXTRA */}
            <section className="w-full space-y-3">
              <h3 className="font-bold text-lg flex items-center gap-2 text-foreground">
                <Coins className="h-5 w-5 text-primary" /> Renda Extra
              </h3>
              <ul className="space-y-2">
                {insight.extraIncome.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-foreground/80 text-sm md:text-base leading-relaxed">
                    <span className="text-primary mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {/* SESSÃO 5: INVESTIMENTOS */}
            <section className="w-full space-y-3">
              <h3 className="font-bold text-lg flex items-center gap-2 text-foreground">
                <TrendingUp className="h-5 w-5 text-primary" /> Investimentos Recomendados
              </h3>
              <ul className="space-y-2">
                {insight.investment.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-foreground/80 text-sm md:text-base leading-relaxed">
                    <span className="text-primary mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {/* SESSÃO 6: MENSAGEM DE MOTIVAÇÃO */}
            <section className="w-full mt-4 p-5 rounded-2xl bg-accent/20 border border-accent text-center relative overflow-hidden">
              <Quote className="absolute -top-2 -left-2 h-12 w-12 text-primary/10 rotate-180" />
              <p className="font-medium text-foreground/90 italic relative z-10">
                "{insight.motivation.content}"
              </p>
            </section>

          </div>
        )}

      </div>
    </div>
  );
}