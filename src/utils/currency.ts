// src/utils/currency.ts

// [NOVO]: Tipagem rígida para as três moedas suportadas pelo aplicativo
export type Currency = "BRL" | "USD" | "EUR";

/**
 * Formata um valor numérico em string com base na moeda selecionada (BRL, USD ou EUR).
 * Usa o padrão decimal para não duplicar o símbolo visual do input.
 * 
 * @param value O valor digitado no input (com ou sem caracteres especiais)
 * @param currency A moeda desejada ('BRL', 'USD' ou 'EUR')
 */
export function formatCurrencyMask(value: string, currency: Currency = "BRL"): string {
  // 1. Remove qualquer caractere que não seja número
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  // 2. Transforma em centavos (divide por 100)
  const number = Number(digits) / 100;

  if (isNaN(number)) {
    return "";
  }

  // 3. Define o locale do país de acordo com a moeda
  let locale = "pt-BR";

  switch (currency) {
    case "USD":
      locale = "en-US"; // Dólar usa vírgula no milhar e ponto no centavo
      break;
    case "EUR":
      locale = "de-DE"; // Euro europeu usa ponto no milhar e vírgula no centavo
      break;
    case "BRL":
    default:
      locale = "pt-BR"; // Real usa ponto no milhar e vírgula no centavo
  }

  // 4. O navegador formata de acordo com as regras exatas de pontuação do país da moeda!
  return number.toLocaleString(locale, {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}