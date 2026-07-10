// src/utils/currency.ts

export type Currency = "BRL" | "USD" | "EUR";

// Formata strings numéricas para decimais baseados no país da moeda selecionada
export function formatCurrencyMask(value: string, currency: Currency = "BRL"): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";

  const number = Number(digits) / 100;
  if (isNaN(number)) return "";

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

// Converte qualquer string formatada de moeda de volta para número puro
export function parseCurrency(value: string): number {
  const digits = value.replace(/\D/g, "");
  if (!digits) return 0;

  const number = Number(digits) / 100;
  return isNaN(number) ? 0 : number;
}