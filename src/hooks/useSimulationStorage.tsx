// src/hooks/useSimulationStorage.tsx
import { type SimulationFormData, type SimulationRecord } from "../data/simulation";
import { type InsightData } from "@/services/aiService"; 

const LOCAL_STORAGE_KEY = "ai_planner_simulation_history";

// Migração: adiciona timeUnit aos registros antigos que não possuem
const migrateOldRecords = () => {
  const storage = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!storage) return;

  try {
    const savedData = JSON.parse(storage) as SimulationRecord[];
    const needsMigration = savedData.some(record => !record.timeUnit);

    if (needsMigration) {
      const migratedData = savedData.map(record => ({
        ...record,
        timeUnit: record.timeUnit || "years", // padrão: anos
        createdAt: record.createdAt || new Date().toISOString()
      }));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(migratedData));
    }
  } catch (error) {
    console.error("Erro ao migrar registros:", error);
  }
};

export const useSimulationStorage = () => {
  // Executa migração ao carregar o hook
  migrateOldRecords();
  
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