import { useState } from "react";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { X, Download, Smartphone, Share } from "lucide-react";

// Detecta iOS
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
const isStandalone = window.matchMedia("(display-mode: standalone)").matches;

export function PWAInstallBanner() {
  const { isInstallable, promptInstall } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);

  // Já instalado ou dispensou — não mostra nada
  if (isStandalone || dismissed) return null;

  // Banner iOS — instrução manual
  if (isIOS) {
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
              <Share className="h-5 w-5 text-pink-400" />
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold text-white">
                Instalar AI Planner
              </p>
              <p className="mt-0.5 text-xs text-zinc-400">
                Toque em <strong className="text-white">Compartilhar</strong>{" "}
                <span className="text-pink-400">⎋</span> depois em{" "}
                <strong className="text-white">Adicionar à Tela de Início</strong>
              </p>
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

  // Banner Android / Desktop — prompt nativo
  if (!isInstallable) return null;

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