// --- PORTUGUÊS ---
import { headerPT } from  './pt/header';
import { inicioPT } from  './pt/inicio';
import { simulationFormStepsPT } from './pt/simulationFormSteps';
import { resultadoPT } from './pt/resultado';
import { pagina3PT } from './pt/pagina3';
import { footerPT } from  './pt/footer';

// --- INGLÊS ---
import { headerEN } from  './en/header';
import { inicioEN } from  './en/inicio';
import { simulationFormStepsEN } from './en/simulationFormSteps';
import { resultadoEN } from './en/resultado';
import { pagina3EN } from './en/pagina3';
import { footerEN } from  './en/footer';

// --- ESPANHOL ---
import { headerES } from  './es/header';
import { inicioES } from  './es/inicio';
import { simulationFormStepsES } from './es/simulationFormSteps';
import { resultadoES } from './es/resultado';
import { pagina3ES } from './es/pagina3';
import { footerES } from  './es/footer';

export const resources = {
  pt: { 
    header:  headerPT(), 
    inicio:  inicioPT(),
    pagina1: simulationFormStepsPT(),
    pagina2: resultadoPT(),
    pagina3: pagina3PT(),
    footer:  footerPT(),
  },
  en: { 
    header:  headerEN(), 
    inicio:  inicioEN(),
    pagina1: simulationFormStepsEN(),
    pagina2: resultadoEN(),
    pagina3: pagina3EN(),
    footer:  footerEN(),
  },
  es: { 
    header:  headerES(), 
    inicio:  inicioES(),
    pagina1: simulationFormStepsES(),
    pagina2: resultadoES(),
    pagina3: pagina3ES(),
    footer:  footerES(),      
  },
};