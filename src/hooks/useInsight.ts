// src/hooks/useInsight.ts
import { buildAIPrompt } from '@/data/aiPrompt';
import { InsightData, getInsight } from '@/services/aiService';
import { useCallback, useEffect, useState } from 'react';
import { useSimulationStorage } from './useSimulationStorage';

export const useInsight = (id: string) => {
  const [insight, setInsight] = useState<InsightData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getFormData } = useSimulationStorage();

  // Função que busca o insight – memoizada com useCallback
  const fetchInsight = useCallback(
    async (simulationId: string) => {
      const simulation = getFormData(simulationId);

      if (!simulation) {
        setError('Simulação não encontrada.');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const prompt = buildAIPrompt(simulation);
        const data = await getInsight(prompt);
        setInsight(data);
        return data;
      } catch {
        setError('Erro ao gerar o diagnóstico. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    },
    [getFormData] // dependência correta
  );

  // Efeito para disparar a busca automaticamente quando o ID mudar
  useEffect(() => {
    // Evita chamadas repetidas se já houver dados, carregamento ou erro
    if (insight || isLoading || error) {
      return;
    }

    fetchInsight(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, insight, isLoading, error]);

  // Retorna o estado e a função para busca manual
  return { insight, isLoading, error, fetchInsight };
};