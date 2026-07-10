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
  CircleUser,
  Maximize2,
  Minimize2
} from "lucide-react";
import { ScrollProgress } from "@/assets/styles/componentes/ScrollProgress";
import { Button } from "@/components/ui/button";
import { callGeminiChatAPI, type ChatMessage, QuotaExceededError } from "@/services/aiService";

const CARD_OUTER = (isExpanded: boolean) =>
  cn(
    "relative w-full transition-all duration-300 flex flex-col rounded-3xl",
    "border border-border text-card-foreground shadow-2xl",
    isExpanded
      ? "h-[calc(100dvh-200px)] 2xl:h-full xl:mt-10 max-h-full bg-background overflow-hidden" //mt-10 painel mt-0 corrige
      : "h-full min-h-[400px] max-h-[459.5px] bg-card/30 backdrop-blur-md overflow-hidden"
  );

const CARD_INNER_SCROLL = (isExpanded: boolean) =>
  cn(
    "flex-1 w-full h-full overflow-y-auto scrollbar-hide p-8 flex flex-col relative",
    isExpanded ? "overflow-x-hidden" : "overflow-x-hidden"
  );

const TOGGLE_BTN = cn(
  "absolute top-4 right-4 z-50 p-2 rounded-xl bg-secondary/80 hover:bg-secondary",
  "border border-border text-muted-foreground hover:text-foreground",
  "transition-all shadow-md cursor-pointer flex items-center justify-center"
);

const LOADING_TITLE = cn(
  "drop-shadow-sm px-4 font-sans font-bold text-xl md:text-2xl",
  "text-foreground mb-2 text-center"
);

const LOADING_SUBTITLE = cn(
  "text-sm text-muted-foreground max-w-md font-medium text-center mx-auto"
);

const ERROR_CONTAINER = cn(
  "flex flex-col items-center justify-center h-full my-auto"
);

const CONTENT_WRAPPER = cn(
  "w-full flex flex-col items-start text-left",
  "animate-in fade-in slide-in-from-bottom-4 duration-700 gap-8 pr-4 sm:pr-8 pb-2"
);

const HEADER_TITLE = cn(
  "font-bold text-2xl md:text-3xl text-primary flex items-center gap-2"
);

const SECTION_TITLE = cn(
  "font-bold text-lg flex items-center gap-2 text-foreground"
);

const SECTION_TEXT = cn(
  "text-foreground/80 leading-relaxed text-sm md:text-base"
);

const LIST_ITEM = cn(
  "flex items-start gap-2 text-foreground/80 text-sm md:text-base leading-relaxed"
);

const QUOTE_CONTAINER = cn(
  "w-full mt-4 p-5 rounded-2xl bg-accent/20 border border-accent",
  "text-center relative overflow-hidden"
);

const CHAT_CONTAINER = cn(
  "w-full border-t border-border/40 pt-8 mt-4 space-y-4"
);

const getChatBubbleClass = (isUser: boolean) =>
  cn(
    "flex items-start gap-2 rounded-2xl p-3.5 text-sm leading-relaxed",
    isUser
      ? "bg-primary text-primary-foreground ml-auto rounded-tr-sm max-w-[85%]"
      : "bg-accent/25 border border-border mr-auto rounded-tl-sm w-[96%] max-w-[96%] md:w-auto md:max-w-[85%]"
  );

const CHAT_FORM = (isExpanded: boolean) =>
  cn(
    "border-t border-border/40 px-4 pt-4 pb-4 sm:pb-4",
    "flex items-center justify-between gap-3 relative z-30 shrink-0",
    isExpanded ? "bg-background" : "bg-card/90 backdrop-blur-md"
  );

const CHAT_INPUT_CONTAINER = cn(
  "flex-1 flex items-center h-11 rounded-xl border border-border",
  "bg-muted/50 px-4 transition-all duration-200",
  "focus-within:ring-2 focus-within:ring-primary/35 focus-within:border-primary"
);

const CHAT_INPUT_NATIVE = cn(
  "w-full bg-transparent text-sm text-foreground",
  "placeholder:text-muted-foreground outline-none border-0 ring-0 h-full"
);

const SEND_BUTTON = cn(
  "h-11 w-11 rounded-xl bg-primary text-primary-foreground",
  "hover:bg-primary/90 transition-all cursor-pointer shrink-0"
);

const STATUS_CONFIG = {
  viable: {
    labelKey: "status_viable",
    className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
  },
  needs_adjustment: {
    labelKey: "status_needs_adjustment",
    className: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20"
  },
  unfeasible: {
    labelKey: "status_unfeasible",
    className: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/20"
  },
};

interface AIInsightCardProps {
  simulationId: string;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

function loadChatHistory(simulationId: string): ChatMessage[] {
  try {
    const saved = localStorage.getItem(`chat_history_${simulationId}`);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

const getErrorTranslationKey = (err: string | null): string => {
  if (!err) return "error_generic";
  const lower = err.toLowerCase();
  if (
    lower.includes("não encontrada") ||
    lower.includes("not found") ||
    lower.includes("no encontrada")
  ) {
    return "error_simulation_not_found";
  }
  return "error_generic";
};

export function AIInsightsCard({ simulationId, isExpanded = false, onToggleExpand }: AIInsightCardProps) {
  const { t } = useTranslation("resultado");
  const { insight, isLoading, error } = useInsight(simulationId);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollActiveColor = "bg-primary";

  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => loadChatHistory(simulationId));
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  const activeSimIdRef = useRef(simulationId);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isFirstLoadRef = useRef(true);
  const initialChatHistoryLengthRef = useRef(0);

  useEffect(() => {
    activeSimIdRef.current = simulationId;
    abortControllerRef.current?.abort();
    const loadedChat = loadChatHistory(simulationId);
    setChatHistory(loadedChat);
    initialChatHistoryLengthRef.current = loadedChat.length;
    setChatInput("");
    setChatError(null);
    setIsChatLoading(false);
    isFirstLoadRef.current = true;

    // Reset scroll do painel quando carrega novo insight
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [simulationId]);

  // Reset scroll quando insight carrega
  useEffect(() => {
    if (insight && scrollContainerRef.current) {
      // Garante scroll no topo quando insight chega
      scrollContainerRef.current.scrollTop = 0;
      // Força novamente em 50ms para garantir
      const timeoutId = setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = 0;
        }
      }, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [insight]);

  useEffect(() => {
    localStorage.setItem(`chat_history_${simulationId}`, JSON.stringify(chatHistory));
  }, [chatHistory, simulationId]);

  useEffect(() => {
    // Scroll automático APENAS quando há NOVA mensagem da IA (não na primeira carga)
    // NÃO faz scroll quando o usuário escreve (última mensagem é do usuário)
    if (chatHistory.length > initialChatHistoryLengthRef.current && scrollContainerRef.current) {
      const lastMessage = chatHistory[chatHistory.length - 1];
      if (lastMessage.role === "model") {
        // IA respondeu com nova mensagem, rola para baixo
        setTimeout(() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
          }
        }, 100);
      }
      // Atualiza o tamanho inicial para próximas comparações
      initialChatHistoryLengthRef.current = chatHistory.length;
    }
  }, [chatHistory]);

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading || !insight) return;

    const userText = chatInput.trim();
    const requestSimId = simulationId;
    setChatInput("");
    setChatError(null);

    const userMsg: ChatMessage = { role: "user", parts: [{ text: userText }] };
    const updatedHistory = [...chatHistory, userMsg];

    setChatHistory((prev) => [...prev, userMsg]);
    setIsChatLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const systemContextPrompt = t("chat_system_prompt", {
        insight: JSON.stringify(insight)
      });

      const fullPayload: ChatMessage[] = [
        { role: "user", parts: [{ text: systemContextPrompt }] },
        {
          role: "model",
          parts: [{ text: t("chat_initial_model_message") }]
        },
        ...updatedHistory
      ];

      const aiResponseText = await callGeminiChatAPI(fullPayload, controller.signal);

      if (activeSimIdRef.current !== requestSimId) return;

      const modelMsg: ChatMessage = { role: "model", parts: [{ text: aiResponseText }] };
      setChatHistory((prev) => [...prev, modelMsg]);
    } catch (err) {
      if (controller.signal.aborted) return;
      console.error(err);
      if (activeSimIdRef.current !== requestSimId) return;

      if (err instanceof QuotaExceededError) {
        setChatError(
          err.retryAfterSeconds
            ? t("quota_exceeded", { seconds: err.retryAfterSeconds })
            : t("quota_exceeded_day")
        );
      } else {
        setChatError(t("error_subtitle"));
      }

      setChatHistory((prev) => prev.slice(0, -1));
      setChatInput(userText);
    } finally {
      if (activeSimIdRef.current === requestSimId) {
        setIsChatLoading(false);
      }
    }
  };

  return (
    <div className={CARD_OUTER(isExpanded)}>
      {insight && !isLoading && (
        <div className="absolute top-0 left-0 w-full z-50">
          <ScrollProgress containerRef={scrollContainerRef} activeColor={scrollActiveColor} />
        </div>
      )}

      {onToggleExpand && (
        <button
          type="button"
          onClick={onToggleExpand}
          className={TOGGLE_BTN}
          title={isExpanded ? "Recolher painel" : "Expandir leitura"}
        >
          {isExpanded ? <Minimize2 className="h-4.5 w-4.5" /> : <Maximize2 className="h-4.5 w-4.5" />}
        </button>
      )}

      <div className="flex-1 min-h-0 relative">
        <div ref={scrollContainerRef} className={CARD_INNER_SCROLL(isExpanded)}>
          {(isLoading || (!insight && !error)) && (
            <div className="flex flex-col items-center justify-center h-full my-auto animate-pulse">
              <h2 className={LOADING_TITLE}>{t("loading_title")}</h2>
              <p className={LOADING_SUBTITLE}>{t("loading_subtitle")}</p>
            </div>
          )}

          {error && (
            <div className={ERROR_CONTAINER}>
              <h2 className="text-destructive font-bold text-xl">{t("error_title")}</h2>
              <p className="text-muted-foreground mt-2">
                {chatError || t(getErrorTranslationKey(error))}
              </p>
            </div>
          )}

          {/* Conteúdo principal */}
          {insight && !isLoading && (
            <div className={CONTENT_WRAPPER}>
              <h2 className={HEADER_TITLE}>✨ {t("plan_title")}</h2>

              {/* Viabilidade */}
              <section className="w-full space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className={SECTION_TITLE}>
                    <Target className="h-5 w-5 text-primary" />
                    {t("section_feasibility")}
                  </h3>
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold border",
                      STATUS_CONFIG[insight.feasibility.status].className
                    )}
                  >
                    {t(STATUS_CONFIG[insight.feasibility.status].labelKey)}
                  </span>
                </div>
                <p className={SECTION_TEXT}>{insight.feasibility.content}</p>
              </section>

              {/* Diagnóstico */}
              <section className="w-full space-y-3">
                <h3 className={SECTION_TITLE}>
                  <Activity className="h-5 w-5 text-primary" />
                  {t("section_diagnosis")}
                </h3>
                <p className={SECTION_TEXT}>{insight.diagnosis.content}</p>
              </section>

              {/* Sugestões */}
              <section className="w-full space-y-3">
                <h3 className={SECTION_TITLE}>
                  <Lightbulb className="h-5 w-5 text-primary" />
                  {t("section_suggestions")}
                </h3>
                <ul className="space-y-2">
                  {insight.suggestions.items.map((item, i) => (
                    <li key={i} className={LIST_ITEM}>
                      <span className="text-primary mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Renda extra */}
              <section className="w-full space-y-3">
                <h3 className={SECTION_TITLE}>
                  <Coins className="h-5 w-5 text-primary" />
                  {t("section_extra_income")}
                </h3>
                <ul className="space-y-2">
                  {insight.extraIncome.items.map((item, i) => (
                    <li key={i} className={LIST_ITEM}>
                      <span className="text-primary mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Investimentos */}
              <section className="w-full space-y-3">
                <h3 className={SECTION_TITLE}>
                  <TrendingUp className="h-5 w-5 text-primary" />
                  {t("section_investments")}
                </h3>
                <ul className="space-y-2">
                  {insight.investment.items.map((item, i) => (
                    <li key={i} className={LIST_ITEM}>
                      <span className="text-primary mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Citação motivacional */}
              <section className={QUOTE_CONTAINER}>
                <Quote className="absolute -top-2 -left-2 h-12 w-12 text-primary/10 rotate-180" />
                <p className="font-medium text-foreground/90 italic relative z-10">
                  "{insight.motivation.content}"
                </p>
              </section>

              {/* Chat */}
              <div className={CHAT_CONTAINER}>
                <h3 className="font-bold text-lg flex items-center gap-2 text-primary">
                  <Sparkles className="h-5 w-5" />
                  {t("chat_title")}
                </h3>

                <div className="space-y-3 w-full">
                  {chatHistory.map((msg, i) => {
                    const isUser = msg.role === "user";
                    return (
                      <div key={i} className={getChatBubbleClass(isUser)}>
                        {!isUser && <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />}
                        {isUser && <CircleUser className="h-4 w-4 mt-0.5 shrink-0" />}
                        <span className="flex-1 whitespace-pre-wrap wrap-break-word">
                          {msg.parts[0].text}
                        </span>
                      </div>
                    );
                  })}

                  {isChatLoading && (
                    <div className={getChatBubbleClass(false)}>
                      <Sparkles className="h-4 w-4 text-primary animate-pulse shrink-0" />
                      <span className="text-muted-foreground animate-pulse">
                        {t("chat_analyzing")}
                      </span>
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
      </div>

      {/* Formulário do chat (fixo na base) */}
      {insight && !isLoading && (
        <form onSubmit={handleSendChat} className={CHAT_FORM(isExpanded)}>
          <div className={CHAT_INPUT_CONTAINER}>
            <input
              type="text"
              placeholder={t("chat_placeholder")}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={isChatLoading}
              className={CHAT_INPUT_NATIVE}
            />
          </div>

          <Button
            type="submit"
            size="icon"
            disabled={isChatLoading || !chatInput.trim()}
            className={SEND_BUTTON}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      )}
    </div>
  );
}