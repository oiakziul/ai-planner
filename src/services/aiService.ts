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
  candidates: {
    content: {
      parts: {
        text: string
      }[]
    }
  }[]
}

// [MUITO IMPORTANTE]: Exportamos a interface das mensagens para o Chat [1]
export interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

// Nome exato da sua chave no .env.local [1]
const API_KEY = String(import.meta.env.VITE_AI_API_KEY)

// Usando o modelo flash oficial do tutor
const MODEL_NAME = 'gemini-flash-latest'

const GEMINI_API_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`

export const callGeminiAPI = async (
  prompt: string,
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
  })

  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.status}`)
  }

  return (await response.json()) as GeminiResponse
}

export const getInsight = async (
  prompt: string,
): Promise<InsightData> => {
  const response = await callGeminiAPI(prompt)
  let jsonText = response.candidates[0].content.parts[0].text
  jsonText = jsonText.replace(/```json/g, "").replace(/```/g, "").trim();

  return JSON.parse(jsonText) as InsightData
}

// [MUITO IMPORTANTE]: Exportamos a função de requisição de chat do Gemini [1]
export const callGeminiChatAPI = async (
  chatHistory: ChatMessage[],
): Promise<string> => {
  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: chatHistory,
    }),
  })

  if (!response.ok) {
    throw new Error(`Erro no chat da IA: ${response.status}`)
  }

  const data = (await response.json()) as GeminiResponse;
  return data.candidates[0].content.parts[0].text;
}