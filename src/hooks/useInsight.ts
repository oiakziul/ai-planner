// src/hooks/useInsight.ts
import { buildAIPrompt } from '@/data/aiPrompt';
import { type InsightData, getInsight, QuotaExceededError } from '@/services/aiService';
import { useCallback, useEffect, useState, useRef } from 'react';
import { useSimulationStorage } from './useSimulationStorage';

export const useInsight = (id: string) => {
  const [insight, setInsight] = useState<InsightData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const didFetch = useRef(false);
  const lastId = useRef<string | null>(null);
  // Rastreia qual id está "em voo" para ignorar respostas atrasadas de um id antigo
  const requestIdRef = useRef<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const { getFormData, getLatestFormData, saveInsightData } = useSimulationStorage();

  const fetchInsight = useCallback(
    async (simulationId: string) => {
      const simulation = simulationId ? getFormData(simulationId) : getLatestFormData();

      if (!simulation) {
        setError('Simulação não encontrada.');
        return;
      }

      // Se o laudo já existe no banco local, carrega ele em 0ms e não gasta a API!
      if (simulation.insightData) {
        console.log("♻️ Laudo carregado do Cache Local em 0ms!");
        setInsight(simulation.insightData);
        return simulation.insightData;
      }

      setIsLoading(true);
      setError(null);
      requestIdRef.current = simulationId;

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        console.log("🧠 Solicitando nova análise ao Google Gemini...");
        const prompt = buildAIPrompt(simulation);
        const data = await getInsight(prompt, controller.signal);

        // Se, enquanto a API respondia, o usuário já trocou de simulação,
        // essa resposta é "velha" e não deve sobrescrever o estado atual.
        if (requestIdRef.current !== simulationId) {
          return data;
        }

        setInsight(data);

        if (simulation.id) {
          saveInsightData(simulation.id, data);
        }

        return data;
      } catch (err) {
        // Cancelamento intencional (troca de simulação) — não é um erro de verdade.
        if (controller.signal.aborted) {
          return;
        }

        console.error("Erro na API do Gemini:", err);
        if (requestIdRef.current === simulationId) {
          if (err instanceof QuotaExceededError) {
            setError(
              err.retryAfterSeconds
                ? `Limite de uso gratuito da IA atingido. Tente novamente em ${err.retryAfterSeconds}s ou mais tarde.`
                : 'Limite de uso gratuito da IA atingido por hoje. Tente novamente mais tarde.'
            );
          } else {
            setError('Erro ao gerar o diagnóstico. Tente novamente.');
          }
        }
      } finally {
        if (requestIdRef.current === simulationId) {
          setIsLoading(false);
        }
      }
    },
    [getFormData, getLatestFormData, saveInsightData]
  );

  useEffect(() => {
    // Se o id realmente mudou, cancela qualquer request pendente da simulação
    // anterior e reseta TUDO relacionado a ela.
    if (lastId.current !== id) {
      abortControllerRef.current?.abort();
      didFetch.current = false;
      lastId.current = id;
      setInsight(null);
      setError(null);
      setIsLoading(false);
      // IMPORTANTE: não retornamos aqui. Se os estados já estavam em seus
      // valores padrão (ex: primeiro carregamento de uma simulação), o
      // setState acima é um no-op e o React NÃO agenda um novo render —
      // então o guard abaixo, nesta mesma execução, precisa decidir se busca.
    }

    if (didFetch.current || insight || isLoading || error) {
      return;
    }

    didFetch.current = true;
    fetchInsight(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, insight, isLoading, error]);

  // Cancela a request pendente ao desmontar o componente.
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return { insight, isLoading, error, fetchInsight };
};