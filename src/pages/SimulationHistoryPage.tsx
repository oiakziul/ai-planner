import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Trash2,
  ExternalLink,
  Target,
  ChevronLeft,
  ChevronRight,
  Search,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type SimulationRecord } from "@/data/simulation";
import { calcMonthlySavings } from "@/utils/simulation";
import { PageHero } from "./componentes/shared/PageHero";

const LOCAL_STORAGE_KEY = "ai_planner_simulation_history";
const ITEMS_PER_PAGE = 5;

type Currency = "BRL" | "USD" | "EUR";
type SortOption = "date-desc" | "date-asc" | "alpha-asc" | "alpha-desc";

const SORT_OPTIONS: { id: SortOption; labelKey: string }[] = [
  { id: "date-desc", labelKey: "sort_date_desc" },
  { id: "date-asc", labelKey: "sort_date_asc" },
  { id: "alpha-asc", labelKey: "sort_alpha_asc" },
  { id: "alpha-desc", labelKey: "sort_alpha_desc" },
];

const getCurrencyByLanguage = (langCode: string): Currency => {
  const lang = langCode.split("-")[0].toLowerCase();
  if (lang === "en") return "USD";
  if (lang === "es") return "EUR";
  return "BRL";
};

export const SimulationHistoryPage: React.FC = () => {
  const { t, i18n } = useTranslation("historico");
  const [history, setHistory] = useState<SimulationRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");
  const [isSortOpen, setIsSortOpen] = useState(false);

  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storage = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storage) {
      setHistory(JSON.parse(storage) as SimulationRecord[]);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (sortRef.current && !sortRef.current.contains(target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy]);

  const handleDelete = (id: string) => {
    const confirmMessage = t("confirm_delete", "Deseja realmente excluir esta simulação?");
    if (confirm(confirmMessage)) {
      const updatedHistory = history.filter((item) => item.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedHistory));
      setHistory(updatedHistory);

      const maxPagesAfterDelete = Math.ceil(updatedHistory.length / ITEMS_PER_PAGE);
      if (currentPage > maxPagesAfterDelete && maxPagesAfterDelete > 0) {
        setCurrentPage(maxPagesAfterDelete);
      }
    }
  };

  const activeCurrency = getCurrencyByLanguage(i18n.language);

  const filteredHistory = history.filter((item) =>
    item.goalName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedHistory = [...filteredHistory].sort((a, b) => {
    if (sortBy === "date-desc") {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    }
    if (sortBy === "date-asc") {
      return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
    }
    if (sortBy === "alpha-asc") {
      return a.goalName.localeCompare(b.goalName);
    }
    if (sortBy === "alpha-desc") {
      return b.goalName.localeCompare(a.goalName);
    }
    return 0;
  });

  const totalItems = sortedHistory.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedHistory = sortedHistory.slice(startIndex, endIndex);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const getFormattedDate = (createdAt?: string): string => {
    const date = createdAt ? new Date(createdAt) : new Date();
    const validDate = isNaN(date.getTime()) ? new Date() : date;

    return validDate.toLocaleDateString(
      i18n.language === "en" ? "en-US" : i18n.language === "es" ? "es-ES" : "pt-BR",
      { day: "2-digit", month: "2-digit", year: "numeric" }
    );
  };

  const activeSortOption = SORT_OPTIONS.find((opt) => opt.id === sortBy) || SORT_OPTIONS[0];

  // ==========================================
  // EXTRAÇÃO DE CLASSES (CLEAN CODE UI)
  // ==========================================

  const mainLayout = cn(
    "mx-auto max-w-6xl px-4 py-10 sm:py-14 font-sans select-none"
  );

  const historyListContainer = cn(
    "flex flex-col gap-4 mt-6",
    "min-h-[440px] lg:min-h-[580px]"
  );

  const historyCardStyle = cn(
    "relative w-full overflow-hidden transition-all duration-300",
    "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6",
    "rounded-2xl p-6 border border-border bg-card/30 backdrop-blur-md shadow-lg text-card-foreground"
  );

  const leftBrandingStyle = cn(
    "flex items-center gap-4 w-full lg:w-[280px] shrink-0"
  );

  const iconContainer = cn(
    "flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0"
  );

  const textGroup = cn(
    "flex flex-col text-left min-w-0 flex-1"
  );

  const metaTitleStyle = cn(
    "font-bold text-foreground text-base tracking-tight truncate block w-full"
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
    "flex h-10 w-10 items-center justify-center rounded-xl border border-destructive/20",
    "text-destructive bg-destructive/5 hover:bg-destructive/15 active:scale-95 transition-all cursor-pointer"
  );

  const detailsBtnStyle = cn(
    "gap-1.5 h-10 rounded-full font-semibold border border-border bg-background",
    "transition-all active:scale-95 duration-200 select-none cursor-pointer"
  );

  const fallbackEmptyStyle = cn(
    "relative w-full min-h-[250px] overflow-hidden transition-all duration-300",
    "flex flex-col items-center justify-center mx-auto rounded-3xl p-8 border border-border",
    "bg-card/30 backdrop-blur-md shadow-2xl text-card-foreground text-center"
  );

  const filterBarWrapper = cn(
    "flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 p-4",
    "bg-card/20 backdrop-blur-md rounded-2xl border border-border/80 w-full",
    "relative z-20"
  );

  const searchContainer = cn(
    "flex-1 flex items-center h-10 w-full rounded-xl border border-border/50 bg-background/50 p-3",
    "transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/35 focus-within:border-primary"
  );

  const searchIconClass = cn("h-4.5 w-4.5 text-muted-foreground mr-2 shrink-0");
  const searchInputClass = cn("w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none border-0 ring-0 h-full");

  const sortContainer = cn(
    "flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end relative"
  );

  const sortLabelClass = cn(
    "text-[10px] font-bold uppercase tracking-widest text-muted-foreground shrink-0"
  );

  const sortTriggerBtn = cn(
    "flex h-10 items-center justify-between gap-1.5 px-3 rounded-xl border border-border/50 font-medium text-sm cursor-pointer",
    "bg-background/50 hover:bg-accent hover:text-accent-foreground transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/35",
    "w-[160px] text-left",
    isSortOpen && "bg-accent"
  );

  const sortDropdownMenu = cn(
    "absolute top-[calc(100%+8px)] right-0 w-48 z-50 rounded-2xl p-1.5 border border-border/60 shadow-2xl bg-popover/98 backdrop-blur-xl overflow-hidden"
  );

  const sortDropdownHeader = cn(
    "px-3 py-2 border-b border-border/40 mb-1"
  );

  const getSortItemClass = (active: boolean) => cn(
    "flex items-center w-full px-3 py-2.5 cursor-pointer rounded-xl transition-all text-sm outline-none",
    active ? "bg-primary/10 text-primary font-semibold" : "hover:bg-accent hover:text-accent-foreground"
  );

  const activeDotClass = cn(
    "ml-auto h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_6px_1px_var(--primary)] animate-pulse"
  );

  const paginationWrapper = cn(
    "flex items-center justify-center gap-6 mt-10 w-full"
  );

  const paginationArrowBtn = cn(
    "flex h-10 w-10 items-center justify-center rounded-[0.5rem] border border-border/80",
    "bg-secondary/40 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all",
    "active:scale-95 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
  );

  const paginationNumbersContainer = cn(
    "flex items-center gap-2"
  );

  const getPaginationNumberClass = (isActive: boolean) => cn(
    "flex h-10 w-10 items-center justify-center rounded-[0.5rem] text-sm font-semibold transition-all border",
    isActive
      ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/10 dark:shadow-[0_0_12px_var(--primary)]"
      : "border-border/80 bg-secondary/40 text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer active:scale-95"
  );

  // --- Classes Novas (Para remover todo e qualquer CSS Inline do return) ---
  const brandIconClass = cn("h-5 w-5");
  const trashIconClass = cn("h-4 w-4");
  const detailsIconClass = cn("h-4 w-4");
  const paginationArrowIconClass = cn("h-4 w-4");

  const sortChevronClass = cn(
    "h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200",
    isSortOpen && "rotate-180"
  );

  const sortHeaderTitleClass = cn(
    "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
  );

  const fallbackTitleClass = cn(
    "drop-shadow-sm px-4 font-sans font-bold text-xl md:text-2xl text-foreground mb-2"
  );

  const fallbackTextClass = cn(
    "text-sm text-muted-foreground max-w-sm font-medium"
  );

  return (
    <main className={mainLayout}>

      <PageHero
        title={t("history_title", "Histórico de simulações")}
        subtitle={t("history_subtitle", "Acompanhe o histórico de seus planos financeiros.")}
      />

      {history.length > 0 ? (
        <>
          {/* BARRA DE PESQUISA E FILTROS DINÂMICOS */}
          <div className={filterBarWrapper}>

            <div className={searchContainer}>
              <Search className={searchIconClass} />
              <input
                type="text"
                placeholder={t("search_placeholder", "Pesquisar meta...")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={searchInputClass}
              />
            </div>

            {/* SELETOR CUSTOMIZADO DE ORDENAÇÃO */}
            <div className={sortContainer} ref={sortRef}>
              <span className={sortLabelClass}>
                {t("sort_by", "Ordenar por")}:
              </span>

              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className={sortTriggerBtn}
              >
                <span className="truncate flex-1">
                  {t(activeSortOption.labelKey)}
                </span>
                <ChevronDown className={sortChevronClass} />
              </button>

              {isSortOpen && (
                <div className={sortDropdownMenu}>
                  <div className={sortDropdownHeader}>
                    <p className={sortHeaderTitleClass}>
                      {t("sort_by", "Ordenar por")}
                    </p>
                  </div>

                  <ul className="space-y-0.5">
                    {SORT_OPTIONS.map((option) => {
                      const isActive = sortBy === option.id;
                      return (
                        <li key={option.id}>
                          <button
                            onClick={() => {
                              setSortBy(option.id);
                              setIsSortOpen(false);
                            }}
                            className={getSortItemClass(isActive)}
                          >
                            <span className="flex-1 text-left truncate">
                              {t(option.labelKey)}
                            </span>
                            {isActive && <span className={activeDotClass} />}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* LISTAGEM CONTROLES E EXIBIÇÃO */}
          {paginatedHistory.length > 0 ? (
            <div className={historyListContainer}>
              {paginatedHistory.map((record) => {
                const monthlySavings = calcMonthlySavings(record);
                const formattedSavings = monthlySavings.toLocaleString(
                  activeCurrency === "USD" ? "en-US" : activeCurrency === "EUR" ? "de-DE" : "pt-BR",
                  { style: "currency", currency: activeCurrency }
                );

                const deadlineSuffix = record.timeUnit === "years"
                  ? t("suffix_years", "anos")
                  : t("suffix_months", "meses");

                return (
                  <div key={record.id} className={historyCardStyle}>

                    {/* Identidade do Item */}
                    <div className={leftBrandingStyle}>
                      <div className={iconContainer}>
                        <Target className={brandIconClass} />
                      </div>
                      <div className={textGroup}>
                        <span className={metaTitleStyle} title={record.goalName}>
                          {record.goalName}
                        </span>
                        <span className={metaDateStyle}>
                          {getFormattedDate(record.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className={metricsGridStyle}>
                      <div className={metricBoxStyle}>
                        <span className={metricLabelStyle}>
                          {t("label_cost", "Custo da Meta")}
                        </span>
                        <span className={metricValueStyle}>
                          {record.goalAmount}
                        </span>
                      </div>

                      <div className={metricBoxStyle}>
                        <span className={metricLabelStyle}>
                          {t("label_deadline", "Prazo")}
                        </span>
                        <span className={metricValueStyle}>
                          {record.goalDeadline} {deadlineSuffix}
                        </span>
                      </div>

                      <div className={metricBoxStyle}>
                        <span className={metricLabelStyle}>
                          {t("label_savings", "Economia Mensal")}
                        </span>
                        <span className={metricValueStyle}>
                          {formattedSavings}
                        </span>
                      </div>
                    </div>

                    <div className={actionsWrapperStyle}>
                      <button
                        onClick={() => handleDelete(record.id)}
                        className={deleteBtnStyle}
                        title={t("tooltip_delete", "Excluir simulação")}
                      >
                        <Trash2 className={trashIconClass} />
                      </button>

                      <Button asChild variant="outline" className={detailsBtnStyle}>
                        <Link to={`/resultado/${record.id}`}>
                          <ExternalLink className={detailsIconClass} />
                          <span>
                            {t("btn_details", "Ver detalhes")}
                          </span>
                        </Link>
                      </Button>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className={fallbackEmptyStyle}>
              <h2 className={fallbackTitleClass}>
                {t("no_results")}
              </h2>
              <p className={fallbackTextClass}>
                {t("no_results_desc")}
              </p>
            </div>
          )}

          {totalPages > 1 && (
            <div className={paginationWrapper}>

              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={paginationArrowBtn}
                title={t("pagination_prev", "Anterior")}
              >
                <ChevronLeft className={paginationArrowIconClass} />
              </button>

              <div className={paginationNumbersContainer}>
                {pageNumbers.map((page) => {
                  const isActive = currentPage === page;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={getPaginationNumberClass(isActive)}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className={paginationArrowBtn}
                title={t("pagination_next", "Próximo")}
              >
                <ChevronRight className="paginationArrowIconClass" />
              </button>

            </div>
          )}
        </>
      ) : (
        <div className={fallbackEmptyStyle}>
          <h2 className={fallbackTitleClass}>
            {t("no_simulations", "Nenhuma simulação no histórico")}
          </h2>
          <p className={fallbackTextClass}>
            {t("no_simulations_desc",
              "Você ainda não completou nenhuma simulação. Vá até a aba 'Início' e crie o seu primeiro plano financeiro!"
            )}
          </p>
        </div>
      )}
    </main>
  );
};

export default SimulationHistoryPage;