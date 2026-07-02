// src/hooks/useSimulationStorage.tsx
import { type SimulationFormData } from "../data/simulation";

const LOCAL_STORAGE_KEY = "ai_planner_simulation_history";

export type SimulationRecord = SimulationFormData & { id: string };

export const useSimulationStorage = () => {
  const saveFormData = (formData: SimulationFormData): string => {
    const storage = localStorage.getItem(LOCAL_STORAGE_KEY);

    const savedData = storage
      ? JSON.parse(storage)
      : [];

    const id = crypto.randomUUID();
    const record: SimulationRecord = { ...formData, id };

    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify([...savedData, record])
    );

    return id;
  };

  const getFormData = (id: string) => {
    const storage = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (!storage) {
      return null;
    }

    const savedData = JSON.parse(storage) as SimulationRecord[];
    return savedData.find((record) => record.id === id) || null;
  };

  return { saveFormData, getFormData };
};