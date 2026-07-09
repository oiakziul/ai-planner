export const resultadoEN = () => ({
  loading_title:
    "Your intelligent analysis is being generated...",
  loading_subtitle:
    "Our Artificial Intelligence consultants are calculating the compound interest needed to achieve your goal. The report will appear here shortly!",
  error_title: "⚠️ Oops! Something went wrong.",
  error_subtitle:
    "Connection error. Please try again.",
  error_generic:
    "An unexpected error occurred. Please try again.",
  error_simulation_not_found:
    "Simulation not found.",
  quota_exceeded:
    "Free AI usage limit reached. Please try again in {{seconds}}s or later.",
  quota_exceeded_day:
    "Daily free AI usage limit reached. Please try again later.",

  plan_title: "✨ Smart Action Plan",
  section_feasibility: "Goal Feasibility",
  section_diagnosis: "Financial Diagnosis",
  section_suggestions: "Practical Suggestions",
  section_extra_income: "Extra Income",
  section_investments: "Recommended Investments",

  chat_title: "Chat with your Educator",
  chat_analyzing: "Educator is analyzing...",
  chat_placeholder:
    "Ask the Educator (e.g. 'How to save?')",
  chat_initial_model_message:
    "Understood! I will be your personal financial educator for this simulation. Ask me anything about your planning!",
  chat_system_prompt:
    `You are the personal financial educator for the AI Planner app.
    Answer questions about the simulation report you generated.
    Active simulation report: {{insight}}.
    Keep responses short (max 3 paragraphs), didactic, professional,
    and encouraging. Always respond in the same language as the user's question.`,

  status_viable: "Feasible goal within the deadline",
  status_needs_adjustment: "Needs adjustments",
  status_unfeasible: "Unfeasible goal",

  /* SimulationResultsPage */
  results_title: "Your Simulation Results",
  results_subtitle: "Based on your financial profile and objectives.",
  card_savings_title: "Savings Capacity",
  card_savings_subtitle: "What is left free per month",
  card_deadline_subtitle: "Estimated time to reach the goal",
  card_income_subtitle: "Total gross income per month",
  card_expenses_subtitle: "Essential spending per month",
  card_debts_subtitle: "Amount committed to installments",
});