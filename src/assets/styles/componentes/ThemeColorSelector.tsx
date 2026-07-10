import { useTheme, type ColorTheme } from "@/context/ThemeContext";
import { Palette } from "lucide-react";

interface ThemeOption {
  id: ColorTheme;
  name: string;
  dotClass: string; 
}

const THEME_OPTIONS: ThemeOption[] = [
  // Padrão / Vinho
  { id: "rose", name: "Vinho (Padrão)", dotClass: "bg-rose-500" },

  // Família dos Azuis
  { id: "sky", name: "Céu", dotClass: "bg-sky-500" },
  { id: "cyan", name: "Ciano", dotClass: "bg-cyan-500" },
  { id: "blue", name: "Azul", dotClass: "bg-blue-500" },
  { id: "indigo", name: "Índigo", dotClass: "bg-indigo-500" },

  // Família dos Verdes
  { id: "teal", name: "Teal", dotClass: "bg-teal-500" },
  { id: "emerald", name: "Esmeralda", dotClass: "bg-emerald-500" },
  { id: "green", name: "Verde", dotClass: "bg-green-500" },
  { id: "lime", name: "Limão", dotClass: "bg-lime-500" },

  // Família dos Amarelos / Laranjas / Vermelhos
  { id: "yellow", name: "Amarelo", dotClass: "bg-yellow-500" },
  { id: "amber", name: "Âmbar", dotClass: "bg-amber-500" },
  { id: "orange", name: "Laranja", dotClass: "bg-orange-500" },
  { id: "red", name: "Vermelho", dotClass: "bg-red-500" },

  // Família dos Roxos / Rosas
  { id: "violet", name: "Violeta", dotClass: "bg-violet-600" },
  { id: "purple", name: "Roxo", dotClass: "bg-purple-500" },
  { id: "fuchsia", name: "Fúcsia", dotClass: "bg-fuchsia-500" },
  { id: "pink", name: "Rosa", dotClass: "bg-pink-500" },
  { id: "slate", name: "Cinza Minimalista", dotClass: "bg-slate-500" }, 
];

export function ThemeColorSelector() {
  const { colorTheme, setColorTheme } = useTheme();

  return (
    <div className="flex flex-col gap-3 p-4 bg-card border border-border rounded-2xl shadow-lg max-w-sm font-sans select-none">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-1">
        <Palette className="h-4 w-4 text-primary" />
        <span>Selecione o Tema de Cor</span>
      </div>
      
      <div className="grid grid-cols-6 gap-2.5">
        {THEME_OPTIONS.map((theme) => {
          const isActive = colorTheme === theme.id;
          
          return (
            <button
              key={theme.id}
              onClick={() => setColorTheme(theme.id)}
              className={`group relative flex items-center justify-center h-10 w-10 rounded-xl transition-all duration-200 border cursor-pointer hover:scale-105 ${
                isActive 
                  ? "border-primary bg-primary/10 shadow-sm" 
                  : "border-border bg-secondary/20 hover:bg-secondary/40"
              }`}
              title={theme.name}
            >
              <span className={`h-5 w-5 rounded-full shadow-inner transition-transform ${theme.dotClass} ${
                isActive ? "scale-110 ring-2 ring-primary/25" : ""
              }`} />
            </button>
          );
        })}
      </div>
    </div>
  );
}