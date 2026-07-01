import { PiggyBank } from 'lucide-react'
import { FormStep } from './FormStep'
import { StepProgress } from './Progress'
import { useTranslation } from 'react-i18next';


export const SimulationForm = () => {
  const { t } = useTranslation("inicio");
  return (
    <>
      <StepProgress currentStep={6} totalSteps={10} />
      <FormStep
        icon={PiggyBank}
        title={t('msg_titulo_form')}
        question={t('msg_pergunta_form')} 
        inputProps={{
          type: 'text',
          placeholder: t('placeholder'),
          prefix: t('prefix'),
        }}
      />

    </>
  )
}