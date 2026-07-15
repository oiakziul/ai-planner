export const resultadoPT = () => ({
  loading_title: "Sua análise inteligente está sendo gerada...",
  loading_subtitle:
    "Nossos consultores de Inteligência Artificial estão calculando os juros compostos necessários para atingir o seu objetivo. Em breve o laudo aparecerá aqui!",
  error_title: "⚠️ Ops! Algo deu errado.",
  error_subtitle: "Erro na conexão. Tente enviar novamente.",
  error_generic: "Ocorreu um erro inesperado. Tente novamente.",
  error_simulation_not_found: "Simulação não encontrada.",
  quota_exceeded:
    "Limite de uso gratuito da IA atingido. Tente novamente em {{seconds}}s ou mais tarde.",
  quota_exceeded_day:
    "Limite de uso gratuito da IA atingido por hoje. Tente novamente mais tarde.",

  plan_title: "✨ Plano de Ação Inteligente",
  section_feasibility: "Viabilidade da Meta",
  section_diagnosis: "Diagnóstico Financeiro",
  section_suggestions: "Sugestões Práticas",
  section_extra_income: "Renda Extra",
  section_investments: "Investimentos Recomendados",

  chat_title: "Converse com seu Educador",
  chat_analyzing: "Educador está analisando...",
  chat_placeholder: "Pergunte ao Educador (ex: 'Como economizar?')",
  chat_initial_model_message:
    "Entendido! Serei o seu educador financeiro pessoal nesta simulação. Pergunte-me qualquer dúvida sobre o seu planejamento!",
  chat_system_prompt: `Você é o educador financeiro pessoal do app AI Planner.
    Responda a dúvidas sobre o laudo de simulação que você gerou.
    Laudo de simulação ativo: {{insight}}.
    Mantenha as respostas curtas (máximo 3 parágrafos), didáticas,
    profissionais e encorajadoras. Responda sempre no mesmo idioma da pergunta do usuário.`,

  status_viable: "Meta viável no prazo",
  status_needs_adjustment: "Precisa de ajustes",
  status_unfeasible: "Meta inviável",

  /* SimulationResultsPage */
  results_title: "Resultado da sua simulação",
  results_subtitle: "Com base no seu perfil financeiro e objetivos.",
  card_savings_title: "Capacidade de poupança",
  card_savings_subtitle: "Quanto sobra livre por mês",
  card_deadline_subtitle: "Tempo estimado para atingir o objetivo",
  card_income_subtitle: "Renda total bruta por mês",
  card_expenses_subtitle: "Gastos essenciais por mês",
  card_debts_subtitle: "Valor comprometido em parcelas/depósito",
  recolher: "Recolher Painel",
  expandir: "Expandir Painel"
});
