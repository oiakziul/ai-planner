// src/pages/componentes/features/simulationResults/AIInsightsCard.tsx
import { useTranslation } from "react-i18next";
import { useInsight } from "@/hooks/useInsight";
import { cn } from "@/lib/utils";

interface AIInsightCardProps {
  simulationId: string;
}

export function AIInsightsCard({ simulationId }: AIInsightCardProps) {
  const { t } = useTranslation("pagina2");
  const { insight, isLoading, error } = useInsight(simulationId);

  // ==========================================
  // CONFIGURAÇÃO DE CLASSES (DESIGN TOKENS)
  // ==========================================

  const aiAdvisorCardStyle = cn(
    // Altura mínima, altura máxima e o scroll (overflow-y-auto) para o texto longo da IA não quebrar o grid!
    "relative w-full h-full min-h-[520px] max-h-[600px] overflow-y-auto overflow-x-hidden transition-all duration-300",
    // Vidro fosco e bordas
    "flex flex-col rounded-3xl p-8 border border-border bg-card/30 backdrop-blur-md shadow-2xl text-card-foreground",
    "scrollbar-hide" 
  );

  const aiTitleStyle = cn(
    "drop-shadow-sm px-4 font-sans font-bold text-xl md:text-2xl text-foreground mb-2 text-center"
  );

  const aiSubtitleStyle = cn(
    "text-sm text-muted-foreground max-w-md font-medium text-center mx-auto"
  );

  // ==========================================
  // ESTRUTURA VISUAL (JSX) COM ESTADOS
  // ==========================================

  return (
    <div className={aiAdvisorCardStyle}>
      
      {/* ESTADO 1: CARREGANDO */}
      {(isLoading || (!insight && !error)) && (
        <div className="flex flex-col items-center justify-center h-full my-auto animate-pulse">
          <h2 className={aiTitleStyle}>
            {t('msg', 'Sua análise inteligente está sendo gerada...')}
          </h2>
          <p className={aiSubtitleStyle}>
            Nossos consultores de Inteligência Artificial estão calculando os juros compostos necessários para atingir o seu objetivo. Em breve as tabelas aparecerão aqui!
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

      {/* ESTADO 3: SUCESSO (A IA RESPONDEU!) */}
      {insight && !isLoading && (
        <div className="w-full h-full flex flex-col items-start text-left animate-in fade-in zoom-in duration-500">
          <h2 className="font-bold text-2xl mb-6 text-primary">✨ Plano de Ação Inteligente</h2>
          
          <pre className="text-sm font-sans whitespace-pre-wrap text-foreground/80 leading-relaxed">
            {JSON.stringify(insight, null, 2)}
          </pre>
        </div>
      )}

    </div>
  );
}