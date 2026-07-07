// src/services/aiService.ts

export interface InsightData {
  feasibility: {
    status: 'viable' | 'needs_adjustment' | 'unfeasible'
    content: string
  }
  diagnosis: {
    content: string
  }
  suggestions: {
    items: string[]
  }
  extraIncome: {
    items: string[]
  }
  investment: {
    items: string[]
  }
  motivation: {
    content: string
  }
}

interface GeminiResponse {
  candidates?: {
    content?: {
      parts?: {
        text: string
      }[]
    }
    finishReason?: string
  }[]
  promptFeedback?: {
    blockReason?: string
  }
}

// [MUITO IMPORTANTE]: Exportamos a interface das mensagens para o Chat [1]
export interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

/**
 * Erro específico para quando a cota gratuita do Gemini é excedida (HTTP 429).
 * Permite que a UI mostre uma mensagem amigável em vez do erro genérico,
 * e carrega o tempo sugerido de espera quando o Google o informa.
 */
export class QuotaExceededError extends Error {
  retryAfterSeconds?: number;

  constructor(message: string, retryAfterSeconds?: number) {
    super(message);
    this.name = 'QuotaExceededError';
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

/**
 * Verifica se a resposta HTTP indica erro e lança o tipo de erro apropriado.
 * Para 429, tenta extrair o retryDelay do corpo para dar uma estimativa de espera.
 */
async function throwForHttpError(response: Response, contextLabel: string): Promise<never> {
  const bodyText = await response.text().catch(() => '');

  if (response.status === 429) {
    let retryAfterSeconds: number | undefined;
    try {
      const parsed = JSON.parse(bodyText);
      const retryDelayStr: string | undefined = parsed?.error?.details
        ?.find((d: { '@type'?: string }) => d['@type']?.includes('RetryInfo'))
        ?.retryDelay; // ex: "7s"
      if (retryDelayStr) {
        retryAfterSeconds = parseInt(retryDelayStr.replace('s', ''), 10);
      }
    } catch {
      // corpo não é JSON ou não tem o formato esperado; segue sem retryAfterSeconds
    }

    throw new QuotaExceededError(
      'Limite de uso gratuito da IA atingido por hoje. Tente novamente mais tarde.',
      retryAfterSeconds
    );
  }

  throw new Error(`${contextLabel}: ${response.status}${bodyText ? ` - ${bodyText}` : ''}`);
}

// Nome exato da sua chave no .env.local [1]
const API_KEY = String(import.meta.env.VITE_AI_API_KEY)

// Usando o Flash-Lite: modelo com a cota gratuita mais generosa atualmente
// (evitamos o alias "-latest" pois ele pode apontar para modelos preview
// recém-lançados com cotas bem mais restritas no tier gratuito).
const MODEL_NAME = 'gemini-flash-lite-latest'

const GEMINI_API_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`

/**
 * Extrai o texto de uma resposta do Gemini, validando cada nível do payload.
 * Lança erros descritivos em vez de deixar o JS quebrar com "Cannot read
 * properties of undefined" quando a IA bloqueia, corta ou não retorna nada.
 */
function extractTextFromGeminiResponse(data: GeminiResponse): string {
  if (data.promptFeedback?.blockReason) {
    throw new Error(
      `Resposta bloqueada pelo filtro de segurança do Gemini (${data.promptFeedback.blockReason}).`
    );
  }

  const candidate = data.candidates?.[0];

  if (!candidate) {
    throw new Error('A IA não retornou nenhuma resposta (candidates vazio).');
  }

  if (candidate.finishReason && candidate.finishReason !== 'STOP') {
    throw new Error(`A resposta da IA foi interrompida (motivo: ${candidate.finishReason}).`);
  }

  const text = candidate.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('A resposta da IA veio vazia.');
  }

  return text;
}

export const callGeminiAPI = async (
  prompt: string,
  signal?: AbortSignal,
): Promise<GeminiResponse> => {
  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    }),
    signal,
  })

  if (!response.ok) {
    await throwForHttpError(response, 'Erro na requisição');
  }

  return (await response.json()) as GeminiResponse
}

export const getInsight = async (
  prompt: string,
  signal?: AbortSignal,
): Promise<InsightData> => {
  const response = await callGeminiAPI(prompt, signal)
  let jsonText = extractTextFromGeminiResponse(response);
  jsonText = jsonText.replace(/```json/g, "").replace(/```/g, "").trim();

  try {
    return JSON.parse(jsonText) as InsightData
  } catch {
    throw new Error('A IA retornou um formato inesperado. Tente gerar novamente.');
  }
}

// [MUITO IMPORTANTE]: Exportamos a função de requisição de chat do Gemini [1]
export const callGeminiChatAPI = async (
  chatHistory: ChatMessage[],
  signal?: AbortSignal,
): Promise<string> => {
  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: chatHistory,
    }),
    signal,
  })

  if (!response.ok) {
    await throwForHttpError(response, 'Erro no chat da IA');
  }

  const data = (await response.json()) as GeminiResponse;
  return extractTextFromGeminiResponse(data);
}