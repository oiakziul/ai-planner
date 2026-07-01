// import PiggyBankImage from '@/assets/images/piggy-bank.png'

import { useTranslation } from "react-i18next";

export function SimulationHero() {
    const { t } = useTranslation("inicio");
  return (
    <div className="mb-8 text-center">
      <div className="flex flex-col justify-center items-center sm:flex-row">
        <h1 className="text-foreground text-3xl font-semibold sm:text-4xl mb-3">
          {t('msg_1')}
        </h1>
        {/* <img
          src={PiggyBankImage}
          alt=""
          aria-hidden="true"
          className="h-16 w-16 sm:-mt-2 sm:-ml-3"
        /> */}
      </div>
      <p className="text-muted-foreground text-sm">
        {t('msg_2')}
      </p>
    </div>
  )
}