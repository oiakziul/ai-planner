import { useState } from "react";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { X, Download, Smartphone, Share } from "lucide-react";

const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
const isStandalone = window.matchMedia("(display-mode: standalone)").matches;

export function PWAInstallBanner() {
  const { isInstallable, promptInstall } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);

  if (isStandalone || dismissed) return null;

  if (isIOS) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm">
        <div className="rounded-xl border border-border bg-card text-card-foreground shadow-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
              <Share className="h-5 w-5 text-cor3" />
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">
                Instalar AI Planner
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Toque em <strong className="text-foreground">Compartilhar</strong>{" "}
                <span className="text-cor3">⎋</span> depois em{" "}
                <strong className="text-foreground">Adicionar à Tela de Início</strong>
              </p>
            </div>

            <button
              onClick={() => setDismissed(true)}
              className="shrink-0 text-muted-foreground transition hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isInstallable) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm">
      <div className="rounded-xl border border-border bg-card text-card-foreground shadow-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
            <Smartphone className="h-5 w-5 text-cor3" />
          </div>

          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">
              Instalar AI Planner
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Acesse mais rápido direto da tela inicial
            </p>

            <div className="mt-3 flex gap-2">
              <button
                onClick={promptInstall}
                className="flex items-center gap-1.5 rounded-lg bg-cor3 px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90"
              >
                <Download className="h-3.5 w-3.5" />
                Instalar
              </button>
              <button
                onClick={() => setDismissed(true)}
                className="rounded-lg px-3 py-1.5 text-xs text-muted-foreground transition hover:text-foreground"
              >
                Agora não
              </button>
            </div>
          </div>

          <button
            onClick={() => setDismissed(true)}
            className="shrink-0 text-muted-foreground transition hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}