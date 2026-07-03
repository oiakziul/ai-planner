// src/utils/prompt.ts
import { parseCurrency } from "@/utils/currency"; // [CORRIGIDO]: Adicionado o '/' no alias [1]
import { calcMonthlySavings } from "@/utils/simulation"; // [CORRIGIDO]: Adicionado o '/' no alias [1]
import type { SimulationRecord } from "@/data/simulation"; // [CORRIGIDO]: Ajustado o caminho correto [1]

const RESPONSE_SCHEMA = `{
  "feasibility": {
    "status": "viable" | "needs_adjustment" | "unfeasible",
    "content": "<Análise objetiva sobre se a meta é atingível no prazo com o valor disponível. Mencione os números relevantes.>"
  },
  "diagnosis": {
    "content": "<Diagnóstico focado no comprometimento do orçamento: quanto % da renda está comprometida com gastos e dívidas, e o...>"
  },
  "suggestions": {
    "items": ["<Sugestão prática e concreta para reduzir gastos ou reorganizar o orçamento>"]
  },
  "extraIncome": {
    "items": ["<Ideia prática para gerar renda extra compatível com a realidade brasileira>"]
  },
  "investment": {
    "items": ["<Sugestão de investimento acessível para o perfil apresentado, com foco em atingir a meta>"]
  },
  "motivation": {
    "content": "<Mensagem final motivacional e personalizada, citando a meta pelo nome.>"
  }
}`

export function buildAIPrompt(simulation: SimulationRecord) {
  // Puxamos o 'timeUnit' dinamicamente do histórico salvo para saber se o prazo é em Anos ou Meses [3]
  const { income, expenses, debts, goalName, goalAmount, goalDeadline, timeUnit } =
    simulation

  const monthlySavings = calcMonthlySavings(simulation)
  
  // [NOVO]: Se a unidade for anos, multiplicamos por 12 para calcular a economia mensal correta! [3]
  const isYears = timeUnit === "years" || !timeUnit;
  const totalMonths = isYears ? parseInt(goalDeadline) * 12 : parseInt(goalDeadline);

  const monthlySavingsNeeded =
    parseCurrency(goalAmount) / totalMonths

  // [CORRIGIDO]: Removido todas as barras invertidas '\' que estavam travando a leitura das variáveis reais!
  return `Você é um educador financeiro especializado em finanças pessoais.
  Analise os dados abaixo e gere um diagnóstico financeiro personalizado com linguagem clara, didática e encorajadora, voltado para pessoas sem conhecimento financeiro. O diagnóstico será exibido diretamente ao usuário no app, fale sempre em segunda pessoa ("você tem...", "sua meta...").

  Dados da simulação:
  - Renda mensal bruta: ${income}
  - Custos fixos essenciais: ${expenses}
  - Dívidas e parcelas mensais: ${debts}
  - Valor disponível por mês: ${monthlySavings.toLocaleString('pt-BR', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })} reais
  - Meta: ${goalName}
  - Custo da meta: ${goalAmount}
  - Prazo desejado: ${goalDeadline} ${isYears ? "anos" : "meses"}
  - Economia mensal necessária para atingir a meta no prazo: ${monthlySavingsNeeded.toLocaleString('pt-BR', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })} reais
  - Saldo após reserva para a meta: ${(monthlySavings - monthlySavingsNeeded).toLocaleString('pt-BR', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })} reais

  Retorne APENAS um JSON válido, sem texto adicional, sem blocos de código, neste formato exato:

  ${RESPONSE_SCHEMA}

  Regras:
  - Todos os textos em português do Brasil
  - Máximo de 4 itens por lista
  - Seja específico ao citar valores calculados
  - Não repita informações entre seções
  - Nunca use markdown dentro dos valores do JSON
  - Para o campo "feasibility.status", use os seguintes critérios:
    - "viable": saldo após reserva para a meta é maior ou igual a 0
    - "needs_adjustment": saldo negativo de até 20% do valor da economia mensal necessária
    - "unfeasible": saldo negativo superior a 20% do valor da economia mensal necessária`
}