import { useEffect, useState } from "react";
import { AppRoutes } from "./routes/router";
import { PWAInstallBanner } from "./assets/styles/componentes/PWAInstallBanner";

const BANNER_DELAY_MS = 3000;

export const App = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowBanner(true), BANNER_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AppRoutes />
      {showBanner && <PWAInstallBanner />}
    </>
  );
};