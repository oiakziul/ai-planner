// --- PORTUGUÊS ---
import { headerPT } from  './pt/header';
import { inicioPT } from  './pt/inicio';
import { simulationFormStepsPT } from './pt/simulationFormSteps';
import { pagina2PT } from './pt/pagina2';
import { pagina3PT } from './pt/pagina3';
import { footerPT } from  './pt/footer';

// --- INGLÊS ---
import { headerEN } from  './en/header';
import { inicioEN } from  './en/inicio';
import { simulationFormStepsEN } from './en/simulationFormSteps';
import { pagina2EN } from './en/pagina2';
import { pagina3EN } from './en/pagina3';
import { footerEN } from  './en/footer';

// --- ESPANHOL ---
import { headerES } from  './es/header';
import { inicioES } from  './es/inicio';
import { simulationFormStepsES } from './es/simulationFormSteps';
import { pagina2ES } from './es/pagina2';
import { pagina3ES } from './es/pagina3';
import { footerES } from  './es/footer';

export const resources = {
  pt: { 
    header:  headerPT(), 
    inicio:  inicioPT(),
    pagina1: simulationFormStepsPT(),
    pagina2: pagina2PT(),
    pagina3: pagina3PT(),
    footer:  footerPT(),
  },
  en: { 
    header:  headerEN(), 
    inicio:  inicioEN(),
    pagina1: simulationFormStepsEN(),
    pagina2: pagina2EN(),
    pagina3: pagina3EN(),
    footer:  footerEN(),
  },
  es: { 
    header:  headerES(), 
    inicio:  inicioES(),
    pagina1: simulationFormStepsES(),
    pagina2: pagina2ES(),
    pagina3: pagina3ES(),
    footer:  footerES(),      
  },
};