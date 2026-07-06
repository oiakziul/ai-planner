// src/pages/componentes/features/simulationResults/AIInsightsCard.tsx
import { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useInsight } from "@/hooks/useInsight";
import { cn } from "@/lib/utils";
import {
  Target,
  Activity,
  Lightbulb,
  TrendingUp,
  Coins,
  Quote,
  Send,
  Sparkles,
  CircleUser
} from "lucide-react";
import { ScrollProgress } from "@/assets/styles/componentes/ScrollProgress";
import { Input } from "@/pages/componentes/shared/Input";
import { Button } from "@/components/ui/button"; 
import { callGeminiChatAPI, type ChatMessage } from "@/services/aiService"; 
interface AIInsightCardProps {
  simulationId: string;
}

export function AIInsightsCard({ simulationId }: AIInsightCardProps) {
  const { t } = useTranslation("pagina2");
  const { insight, isLoading, error } = useInsight(simulationId);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollActiveColor = "bg-primary";

  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(`chat_history_${simulationId}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(`chat_history_${simulationId}`, JSON.stringify(chatHistory));
  }, [chatHistory, simulationId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isChatLoading]);

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading || !insight) return;

    const userText = chatInput.trim();
    setChatInput("");
    setChatError(null);

    const userMsg: ChatMessage = { role: "user", parts: [{ text: userText }] };
    const updatedHistory = [...chatHistory, userMsg];
    setChatHistory(updatedHistory);
    setIsChatLoading(true);

    try {

      const systemContextPrompt = `Você é o educador financeiro pessoal do app AI Planner. Responda a dúvidas sobre o laudo de simulação que você gerou. 
      Laudo de simulação ativo: ${JSON.stringify(insight)}.
      Mantenha as respostas curtas (máximo 3 parágrafos), didáticas, profissionais e encorajadoras. Responda sempre no mesmo idioma da pergunta do usuário.`;

      const fullPayload: ChatMessage[] = [
        { role: "user", parts: [{ text: systemContextPrompt }] },
        { role: "model", parts: [{ text: "Entendido! Serei o seu educador financeiro pessoal nesta simulação. Pergunte-me qualquer dúvida sobre o seu planejamento!" }] },
        ...updatedHistory
      ];

      const aiResponseText = await callGeminiChatAPI(fullPayload);
      const modelMsg: ChatMessage = { role: "model", parts: [{ text: aiResponseText }] };

      setChatHistory((prev) => [...prev, modelMsg]);
    } catch (err) {
      console.error(err);
      setChatError("Erro ao enviar mensagem. Tente novamente.");
    } finally {
      setIsChatLoading(false);
    }
  };

  const cardOuterStyle = cn(
    "relative w-full h-full min-h-[400px] max-h-[459.5px] transition-all duration-300",
    "flex flex-col rounded-3xl border border-border bg-card/30 backdrop-blur-md shadow-2xl text-card-foreground",
    "overflow-hidden"
  );

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

      {insight && !isLoading && (
        <div className="absolute top-0 left-0 w-full z-50">
          <ScrollProgress containerRef={scrollContainerRef} activeColor={scrollActiveColor} />
        </div>
      )}

      <div ref={scrollContainerRef} className={cardInnerScrollStyle}>

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

        {error && (
          <div className="flex flex-col items-center justify-center h-full my-auto">
            <h2 className="text-destructive font-bold text-xl">⚠️ Ops! Algo deu errado.</h2>
            <p className="text-muted-foreground mt-2">{error}</p>
          </div>
        )}

        {insight && !isLoading && (
          <div className="w-full flex flex-col items-start text-left animate-in fade-in slide-in-from-bottom-4 duration-700 gap-8">

            <h2 className="font-bold text-2xl md:text-3xl text-primary flex items-center gap-2">
              ✨ Plano de Ação Inteligente
            </h2>

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

            <section className="w-full space-y-3">
              <h3 className="font-bold text-lg flex items-center gap-2 text-foreground">
                <Activity className="h-5 w-5 text-primary" /> Diagnóstico Financeiro
              </h3>
              <p className="text-foreground/80 leading-relaxed text-sm md:text-base">
                {insight.diagnosis.content}
              </p>
            </section>

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

            <section className="w-full mt-4 p-5 rounded-2xl bg-accent/20 border border-accent text-center relative overflow-hidden">
              <Quote className="absolute -top-2 -left-2 h-12 w-12 text-primary/10 rotate-180" />
              <p className="font-medium text-foreground/90 italic relative z-10">
                "{insight.motivation.content}"
              </p>
            </section>

            <div className="w-full border-t border-border/40 pt-8 mt-4 space-y-4">
              <h3 className="font-bold text-lg flex items-center gap-2 text-primary">
                <Sparkles className="h-5 w-5" /> Converse com seu Educador
              </h3>

                <div className="space-y-3 w-full">
                {chatHistory.map((msg, i) => {
                  const isUser = msg.role === "user";
                  return (
                    <div
                      key={i}
                      className={cn(
                        "flex items-start gap-2 max-w-[85%] rounded-2xl p-3.5 text-sm leading-relaxed",
                        isUser
                          ? "bg-primary text-primary-foreground ml-auto rounded-tr-sm"
                          : "bg-accent/25 border border-border mr-auto rounded-tl-sm"
                      )}
                    >
                      {!isUser && <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />}
                      {isUser && <CircleUser className="h-4 w-4 mt-0.5 shrink-0" />}
                      <span className="whitespace-pre-wrap">{msg.parts[0].text}</span>
                    </div>
                  );
                })}

                {isChatLoading && (
                  <div className="flex items-center gap-2 bg-accent/15 border border-border mr-auto max-w-[85%] rounded-2xl rounded-tl-sm p-3.5 text-sm">
                    <Sparkles className="h-4 w-4 text-primary animate-pulse shrink-0" />
                    <span className="text-muted-foreground animate-pulse">Educador está analisando...</span>
                  </div>
                )}

                {chatError && (
                  <p className="text-xs text-destructive font-semibold ml-2">{chatError}</p>
                )}
              </div>
            </div>

            <div ref={chatEndRef} className="h-2 w-full" />

          </div>
        )}

      </div>

      {insight && !isLoading && (
        <form
          onSubmit={handleSendChat}
          className="border-t border-border/40 p-4 bg-card/60 backdrop-blur-md flex items-center gap-2 relative z-30"
        >
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Pergunte ao Educador (ex: 'Como economizar nos custos fofos?')"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={isChatLoading}
              className="text-foreground placeholder:text-foreground/50 w-full bg-transparent text-sm outline-none px-2"
            />
          </div>
          <Button
            type="submit"
            size="icon"
            disabled={isChatLoading || !chatInput.trim()}
            className="h-11 w-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      )}

    </div>
  );
}