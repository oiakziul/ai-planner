
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App.tsx";
import { ThemeProvider } from "./context/ThemeContext";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n/config";
import "./assets/styles/index.css";


ReactDOM.createRoot(document.getElementById("root")!).render(

    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </I18nextProvider>

);