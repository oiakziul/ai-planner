// src/data/simulation.ts
import {
  CalendarClock,
  CreditCard,
  Goal,
  Landmark,
  PiggyBank,
  Wallet,
} from "lucide-react";

import type { FormStepProps } from "@/pages/componentes/features/Simulation/FormStep";

export const simulationFormSteps: FormStepProps[] = [
  // Passo 1: Renda Mensal Bruta
  {
    id: "income",
    icon: PiggyBank,
    title: "income_title", // Passando a chave de tradução em vez de texto fixo!
    question: "income_question",
    inputProps: {
      placeholder: "income_placeholder",
      prefix: "income_prefix",
      maxLength: 12,
    },
  },
  // Passo 2: Custos Fixos
  {
    id: "expenses",
    icon: CreditCard,
    title: "expenses_title",
    question: "expenses_question",
    inputProps: {
      placeholder: "expenses_placeholder",
      prefix: "expenses_prefix",
      maxLength: 12,
    },
  },
  // Passo 3: Dívidas
  {
    id: "debts",
    icon: Landmark,
    title: "debts_title",
    question: "debts_question",
    inputProps: {
      placeholder: "debts_placeholder",
      prefix: "debts_prefix",
      maxLength: 12,
    },
  },
  // Passo 4: Nome da Meta
  {
    id: "goalName",
    icon: Goal,
    title: "goalName_title",
    question: "goalName_question",
    inputProps: {
      placeholder: "goalName_placeholder",
      maxLength: 50,
    },
  },
  // Passo 5: Custo da Meta
  {
    id: "goalAmount",
    icon: Wallet,
    title: "goalAmount_title",
    question: "goalAmount_question",
    inputProps: {
      placeholder: "goalAmount_placeholder",
      prefix: "goalAmount_prefix",
      maxLength: 12,
    },
  },
  // Passo 6: Prazo Desejado
  {
    id: "goalDeadline",
    icon: CalendarClock,
    title: "goalDeadline_title",
    question: "goalDeadline_question",
    inputProps: {
      type: "number",
      placeholder: "goalDeadline_placeholder",
      suffix: "goalDeadline_suffix",
      min: 1,
      max: 120,
    },
    submitButtonProps: {
      label: "goalDeadline_submit_label",
      emojiIcon: "✨",
    },
  },
];