// src/utils/currency.ts

export type Currency = "BRL" | "USD" | "EUR";

/**
 * Formata um valor numérico em string com base na moeda selecionada (BRL, USD ou EUR).
 * Usa o padrão decimal para não duplicar o símbolo visual do input.
 */
export function formatCurrencyMask(value: string, currency: Currency = "BRL"): string {
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  const number = Number(digits) / 100;

  if (isNaN(number)) {
    return "";
  }

  let locale = "pt-BR";

  switch (currency) {
    case "USD":
      locale = "en-US";
      break;
    case "EUR":
      locale = "de-DE";
      break;
    case "BRL":
    default:
      locale = "pt-BR";
  }

  return number.toLocaleString(locale, {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * [NOVO - UNIVERSAL]: Converte qualquer string formatada de moeda (BRL, USD ou EUR)
 * de volta para um número puro do JavaScript para cálculos matemáticos.
 * 
 * @param value A string formatada (ex: "R$ 5.000,00", "$5,000.00" ou "5.000,00 €")
 * @returns O número puro (ex: 5000) [1]
 */
export function parseCurrency(value: string): number {
  // 1. Remove tudo o que não for número [1]
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return 0;
  }

  // 2. Transforma em número decimal dividindo por 100 para restaurar os centavos [1]
  const number = Number(digits) / 100;

  return isNaN(number) ? 0 : number;
}