export const resultadoES = () => ({
  loading_title:
    "Su análisis inteligente se está generando...",
  loading_subtitle:
    "Nuestros consultores de Inteligencia Artificial están calculando el interés compuesto necesario para alcanzar su objetivo. ¡El informe aparecerá aquí en breve!",
  error_title: "⚠️ ¡Ups! Algo salió mal.",
  error_subtitle:
    "Error de conexión. Intente nuevamente.",
  error_generic:
    "Ocurrió un error inesperado. Intente nuevamente.",
  error_simulation_not_found:
    "Simulación no encontrada.",
  quota_exceeded:
    "Límite de uso gratuito de IA alcanzado. Intente nuevamente en {{seconds}}s o más tarde.",
  quota_exceeded_day:
    "Límite de uso gratuito de IA alcanzado por hoy. Intente nuevamente más tarde.",

  plan_title: "✨ Plan de Acción Inteligente",
  section_feasibility: "Viabilidad de la Meta",
  section_diagnosis: "Diagnóstico Financiero",
  section_suggestions: "Sugerencias Prácticas",
  section_extra_income: "Ingresos Extra",
  section_investments: "Inversiones Recomendadas",

  chat_title: "Hable con su Educador",
  chat_analyzing: "El educador está analizando...",
  chat_placeholder:
    "Pregunte al Educador (ej. '¿Cómo ahorrar?')",
  chat_initial_model_message:
    "¡Entendido! Seré su educador financiero personal en esta simulación. ¡Pregúnteme cualquier duda sobre su planificación!",
  chat_system_prompt:
    `Eres el educador financiero personal de la app AI Planner.
    Responde dudas sobre el informe de simulación que generaste.
    Informe de simulación activo: {{insight}}.
    Mantén las respuestas cortas (máximo 3 párrafos), didácticas,
    profesionales y alentadoras. Responde siempre en el mismo idioma de la pregunta del usuario.`,

  status_viable: "Meta viable en el plazo",
  status_needs_adjustment: "Necesita ajustes",
  status_unfeasible: "Meta inviable",

  /* SimulationResultsPage */
  results_title: "Resultado de tu simulación",
  results_subtitle: "Basado en tu perfil financiero y objetivos.",
  card_savings_title: "Capacidad de ahorro",
  card_savings_subtitle: "Lo que queda libre por mes",
  card_deadline_subtitle: "Tiempo estimado para alcanzar la meta",
  card_income_subtitle: "Ingresos brutos totales al mes",
  card_expenses_subtitle: "Gastos esenciales por mes",
  card_debts_subtitle: "Monto comprometido en cuotas",
});