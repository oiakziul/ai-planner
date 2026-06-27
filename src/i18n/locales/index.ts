// --- PORTUGUÊS ---
import { headerPT } from  './pt/header';
import { inicioPT } from  './pt/inicio';
import { pagina1PT } from './pt/pagina1';
import { pagina2PT } from './pt/pagina2';
import { pagina3PT } from './pt/pagina3';
import { footerPT } from  './pt/footer';

// --- INGLÊS ---
import { headerEN } from  './en/header';
import { inicioEN } from  './en/inicio';
import { pagina1EN } from './en/pagina1';
import { pagina2EN } from './en/pagina2';
import { pagina3EN } from './en/pagina3';
import { footerEN } from  './en/footer';

// --- ESPANHOL ---
import { headerES } from  './es/header';
import { inicioES } from  './es/inicio';
import { pagina1ES } from './es/pagina1';
import { pagina2ES } from './es/pagina2';
import { pagina3ES } from './es/pagina3';
import { footerES } from  './es/footer';

export const resources = {
  pt: { 
    header:  headerPT(), 
    inicio:  inicioPT(),
    pagina1: pagina1PT(),
    pagina2: pagina2PT(),
    pagina3: pagina3PT(),
    footer:  footerPT(),
  },
  en: { 
    header:  headerEN(), 
    inicio:  inicioEN(),
    pagina1: pagina1EN(),
    pagina2: pagina2EN(),
    pagina3: pagina3EN(),
    footer:  footerEN(),
  },
  es: { 
    header:  headerES(), 
    inicio:  inicioES(),
    pagina1: pagina1ES(),
    pagina2: pagina2ES(),
    pagina3: pagina3ES(),
    footer:  footerES(),      
  },
};