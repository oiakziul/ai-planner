import { useTranslation } from "react-i18next";

export function SimulationHero() {
    const { t } = useTranslation("inicio");
  return (
    <div className="mb-6 text-center">
      <div className="flex flex-col justify-center items-center sm:flex-row">
        <h1 className="text-foreground text-2xl font-semibold sm:text-4xl mb-2">
          {t('msg_1')}
        </h1>
      </div>
      <p className="text-muted-foreground text-sm">
        {t('msg_2')}
      </p>
    </div>
  )
}