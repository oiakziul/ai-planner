// src/hooks/useInsight.ts
import { buildAIPrompt } from '@/data/aiPrompt';
import { type InsightData, getInsight } from '@/services/aiService';
import { useCallback, useEffect, useState, useRef } from 'react';
import { useSimulationStorage } from './useSimulationStorage';

export const useInsight = (id: string) => {
  const [insight, setInsight] = useState<InsightData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // [CADEADOS SÊNIOS]: Travas síncronas de execução [1]
  const didFetch = useRef(false);
  const lastId = useRef<string | null>(null); // [NOVO]: Rastreia se o ID do plano realmente mudou [1]

  const { getFormData, getLatestFormData, saveInsightData } = useSimulationStorage();

  // Função que busca o laudo da IA
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

      try {
        console.log("🧠 Solicitando nova análise ao Google Gemini...");
        const prompt = buildAIPrompt(simulation);
        const data = await getInsight(prompt);
        
        setInsight(data);
        
        // Salva a resposta no Local Storage para as próximas vezes
        if (simulation.id) {
          saveInsightData(simulation.id, data);
        }

        return data;
      } catch (err) {
        console.error("Erro na API do Gemini:", err);
        setError('Erro ao gerar o diagnóstico. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    },
    [getFormData, getLatestFormData, saveInsightData]
  );

  // [UNIFICADO]: Único efeito que controla o bloqueio de requisições de forma 100% segura [1]
  useEffect(() => {
    // Se o ID mudou de verdade em relação ao último que processamos, aí sim nós liberamos o cadeado! [1]
    if (lastId.current !== id) {
      didFetch.current = false;
      lastId.current = id;
    }

    // Se a trava de fetch já estiver ativa, ou se já tiver laudo/carregamento, aborta imediatamente! [1]
    if (didFetch.current || insight || isLoading || error) {
      return;
    }

    // Ativa a trava síncrona [1]
    didFetch.current = true;
    
    fetchInsight(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, insight, isLoading, error]);

  return { insight, isLoading, error, fetchInsight };
};