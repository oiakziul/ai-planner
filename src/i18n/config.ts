import i18n from "i18next";  
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import resourcesToBackend from "i18next-resources-to-backend";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(
    resourcesToBackend((language: string, namespace: string) =>
      import(`./locales/${language}/${namespace}.ts`).then((module) => {
        const data = module.default || module[Object.keys(module)[0]];
        return typeof data === "function" ? data() : data;
      })
    )
  )
  .init({
    fallbackLng: "pt",
    load: 'languageOnly',
    debug: false,
    ns: ["header"], //listar todos os namespaces anula o lazyloading no i18n.
    defaultNS: "header",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;