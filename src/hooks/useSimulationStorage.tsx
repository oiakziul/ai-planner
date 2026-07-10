// src/hooks/useSimulationStorage.tsx
import { type SimulationFormData, type SimulationRecord } from "../data/simulation";
import { type InsightData } from "@/services/aiService"; 

const LOCAL_STORAGE_KEY = "ai_planner_simulation_history";

export const useSimulationStorage = () => {
  
  const saveFormData = (formData: SimulationFormData, timeUnit?: "years" | "months"): string => {
    const storage = localStorage.getItem(LOCAL_STORAGE_KEY);
    const savedData = storage ? JSON.parse(storage) : [];
    const id = crypto.randomUUID();
    const record: SimulationRecord = { 
      ...formData, 
      id, 
      createdAt: new Date().toISOString(),
      timeUnit: timeUnit || "years" 
    };

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([...savedData, record]));
    return id;
  };

  const getFormData = (id: string) => {
    const storage = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!storage) return null;

    const savedData = JSON.parse(storage) as SimulationRecord[];
    return savedData.find((record) => record.id === id) || null;
  };

  const getLatestFormData = (): SimulationRecord | null => {
    const storage = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!storage) return null;

    const savedData = JSON.parse(storage) as SimulationRecord[];
    if (savedData.length === 0) return null;
    return savedData[savedData.length - 1];
  };

  // Função que atualiza uma simulação específica injetando o laudo da IA!
  const saveInsightData = (id: string, insight: InsightData) => {
    const storage = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!storage) return;

    const savedData = JSON.parse(storage) as SimulationRecord[];
    
    // Varre o banco, acha a simulação correta e adiciona o 'insightData' nela
    const updatedData = savedData.map(record => 
      record.id === id ? { ...record, insightData: insight } : record
    );

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedData));
  };

  return { saveFormData, getFormData, getLatestFormData, saveInsightData };
};