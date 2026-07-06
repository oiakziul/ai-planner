import React from "react";

interface ColorWheelIconProps {
  className?: string;
}

export const ColorWheelIcon: React.FC<ColorWheelIconProps> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Gomo 1: Vermelho */}
      <path d="M12 1.5 A10.5 10.5 0 0 1 19.42 4.58 L17.3 6.7 A7.5 7.5 0 0 0 12 4.5 Z" fill="#ef4444" />
      {/* Gomo 2: Laranja */}
      <path d="M19.42 4.58 A10.5 10.5 0 0 1 22.42 12 L19.42 12 A7.5 7.5 0 0 0 17.3 6.7 Z" fill="#f97316" />
      {/* Gomo 3: Amarelo */}
      <path d="M22.42 12 A10.5 10.5 0 0 1 19.42 19.42 L17.3 17.3 A7.5 7.5 0 0 0 19.42 12 Z" fill="#eab308" />
      {/* Gomo 4: Verde */}
      <path d="M19.42 19.42 A10.5 10.5 0 0 1 12 22.42 L12 19.42 A7.5 7.5 0 0 0 17.3 17.3 Z" fill="#22c55e" />
      {/* Gomo 5: Teal / Ciano */}
      <path d="M12 22.42 A10.5 10.5 0 0 1 4.58 19.42 L6.7 17.3 A7.5 7.5 0 0 0 12 19.42 Z" fill="#06b6d4" />
      {/* Gomo 6: Azul */}
      <path d="M4.58 19.42 A10.5 10.5 0 0 1 1.5 12 L4.5 12 A7.5 7.5 0 0 0 6.7 17.3 Z" fill="#3b82f6" />
      {/* Gomo 7: Índigo */}
      <path d="M1.5 12 A10.5 10.5 0 0 1 4.58 4.58 L6.7 6.7 A7.5 7.5 0 0 0 4.5 12 Z" fill="#6366f1" />
      {/* Gomo 8: Rosa / Fúcsia */}
      <path d="M4.58 4.58 A10.5 10.5 0 0 1 12 1.5 L12 4.5 A7.5 7.5 0 0 0 6.7 6.7 Z" fill="#ec4899" />

      {/* Anel de espaçamento interno (vaza o fundo do app automaticamente) */}
      <circle cx="12" cy="12" r="4.5" fill="var(--background)" className="transition-colors duration-300" />

      {/* Círculo central aumentado para destacar mais a cor ativa */}
      <circle cx="12" cy="12" r="4.5" fill="var(--primary)" className="transition-all duration-300" />
    </svg>
  );
};

export default ColorWheelIcon;