import { useState } from "react";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { X, Download, Smartphone } from "lucide-react";

export function PWAInstallBanner() {
  const { isInstallable, promptInstall } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);

  // Checa sessionStorage para não mostrar novamente na mesma sessão após dismiss
  if (!isInstallable || dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm">
      <div
        className="rounded-2xl p-4 shadow-2xl"
        style={{ backgroundColor: "#15080E", border: "1px solid #3a1a2a" }}
      >
        <div className="flex items-start gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: "#3a1a2a" }}
          >
            <Smartphone className="h-5 w-5 text-pink-400" />
          </div>

          <div className="flex-1">
            <p className="text-sm font-semibold text-white">
              Instalar AI Planner
            </p>
            <p className="mt-0.5 text-xs text-zinc-400">
              Acesse mais rápido direto da tela inicial
            </p>

            <div className="mt-3 flex gap-2">
              <button
                onClick={promptInstall}
                className="flex items-center gap-1.5 rounded-lg bg-pink-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-pink-500"
              >
                <Download className="h-3.5 w-3.5" />
                Instalar
              </button>
              <button
                onClick={() => setDismissed(true)}
                className="rounded-lg px-3 py-1.5 text-xs text-zinc-400 transition hover:text-white"
              >
                Agora não
              </button>
            </div>
          </div>

          <button
            onClick={() => setDismissed(true)}
            className="shrink-0 text-zinc-600 transition hover:text-zinc-400"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}