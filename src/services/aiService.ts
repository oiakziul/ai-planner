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

export interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

// Classe de erro customizada para estouro de cota (Erro 429)
export class QuotaExceededError extends Error {
  retryAfterSeconds?: number;

  constructor(message: string, retryAfterSeconds?: number) {
    super(message);
    this.name = 'QuotaExceededError';
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

// Analisa falhas HTTP e trata limite de requisições de forma robusta
async function throwForHttpError(
  response: Response, 
  contextLabel: string
): Promise<never> {
  const bodyText = await response.text().catch(() => '');

  if (response.status === 429) {
    let retryAfterSeconds: number | undefined;
    try {
      const parsed = JSON.parse(bodyText);
      const details = parsed?.error?.details || [];
      const retryInfo = details.find(
        (d: { '@type'?: string }) => d['@type']?.includes('RetryInfo')
      );
      
      const retryDelayStr = retryInfo?.retryDelay; // ex: "7s"
      if (retryDelayStr) {
        retryAfterSeconds = parseInt(retryDelayStr.replace('s', ''), 10);
      }
    } catch {
      // Ignora falhas de parse
    }

    throw new QuotaExceededError(
      'Limite de uso gratuito da IA atingido por hoje. Tente novamente mais tarde.',
      retryAfterSeconds
    );
  }

  const errMsg = bodyText ? ` - ${bodyText}` : '';
  throw new Error(`${contextLabel}: ${response.status}${errMsg}`);
}

const API_KEY = String(import.meta.env.VITE_AI_API_KEY)
const MODEL_NAME = 'gemini-flash-lite-latest'

const GEMINI_API_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`

// Garante o recebimento seguro e tratamento de erros no retorno da IA
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

// Executa a chamada bruta de geração de conteúdo para o endpoint do Gemini
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

// Geração de laudos estruturados com limpeza de tags Markdown de código
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

// Canal de conversação contínua para o Chat de dúvidas
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