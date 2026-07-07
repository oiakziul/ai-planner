# 💎 AI Planner - Educador Financeiro Inteligente com IA

Um Web App Progressivo (PWA) de alto nível desenvolvido em **React 19** com **Vite**, **TypeScript** e **Tailwind CSS v4**. 

Este projeto é a entrega final do bootcamp **Santander 2026 - AI React Front-end** da [Digital Innovation One (DIO)](https://www.dio.me/). O AI Planner une gestão de metas financeiras à **Inteligência Artificial Generativa (Google Gemini)**, oferecendo planos de ação super personalizados, verificação de viabilidade e controle orçamentário.

---

## 🎯 Escopo & Regras de Negócio

Este projeto foi desenhado sob premissas reais de educação financeira digital para investidores iniciantes. O sistema automatiza o planejamento de metas de aquisição ou aposentadoria, transformando grandes montantes em aportes mensais práticos.

- **Cálculo Reverso e Diagnóstico:** Calcula a economia mensal necessária baseando-se na meta e no tempo. Confronta o valor com o orçamento livre do usuário (Renda vs Despesas + Dívidas).
- **Aconselhamento e Ajustes por IA:** Avalia o orçamento do usuário e propõe caminhos de adequação (corte de custos supérfluos, geração de renda extra e veículos de investimento).
- **Comunicação Interativa:** Painel de insights extenso com suporte a leitura em tela cheia (*Immersive Read Mode*).

👉 Para ler as diretrizes de prompt e as premissas de cálculo enviadas para a IA, acesse o documento de [Escopo do Projeto](docs/escopo-do-projeto.md).

---

## 🛠️ Tecnologias Utilizadas

- **Framework:** React 19 + Vite (v6.x)
- **Linguagem:** TypeScript Rigoroso
- **Estilização:** Tailwind CSS (v4) e Componentes Customizados Shadcn UI (Radix/Mira-style)
- **Inteligência Artificial:** Integração REST com API do **Google Gemini 1.5 Flash**
- **Internacionalização (i18n):** `react-i18next` com detecção de idioma do navegador e conversão síncrona de moedas (BRL, USD, EUR).
- **Tipografia:** `@fontsource-variable/geist` e Inter
- **Roteamento:** `react-router-dom`
- **Persistência Local:** Gravação de Histórico de Consultas e Cache de Respostas da IA (evitando chamadas duplicadas à API).

---

## 🎨 Sistema Avançado de Cores e Temas

A interface suporta a impressionante marca de **18 temas de cores nativos** e um botão de alternância global para `Light Mode` e `Dark Mode`.

O aplicativo altera a paleta dinamicamente em todos os botões, focos, ícones, textos e barras de scroll sem recarregar a tela, consumindo variáveis globais injetadas por escopo de classe no CSS (`.theme-teal`, `.theme-amber`, etc).

Além dos temas de usuário, a barra de progresso horizontal (`ScrollProgress`) da página escuta as rotas ativas para aplicar **radiais metálicos** complementares:

| Rota/Aba | Efeito de Brilho / Gradiente Radial | Descrição da Experiência Visual |
| :--- | :--- | :--- |
| `/` (Início) | **Ouro Solar** (`yellow-300`) | Indica planejamento; luz radiante de inserção de dados. |
| `/resultado` | **Prata / Diamante** (`slate-200`) | Leitura focada em insights da IA; sobriedade e limpeza visual. |
| `/historico` | **Bronze / Cobre** (`orange-700`) | Remete a arquivos antigos; calor e solidez de dados guardados. |

---

## ⚙️ Configuração do PWA & Ativos Visuais

O projeto possui suporte completo para instalação (Add to Home Screen) em dispositivos móveis e desktops, comportando-se como um App Nativo graças ao manifesto web.

### 📂 Estrutura da Pasta `public/`
- `favicon.ico` — Ícone de fallback para abas de navegadores antigos.
- `favicon.svg` — Ícone em vetor geométrico para nitidez máxima em telas retina.
- `apple-touch-icon.png` — Ícone de alta densidade formatado para telas e ícones do ecossistema Apple/iOS.
- `logo192.png` — Launcher icon padrão de 192x192px utilizado em atalhos do Android.
- `logo512.png` — Splash screen de 512x512px e PWA store icon.

---

## 🚀 Como Rodar o Projeto Localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/oiakziul/ai-planner
   cd ai-planner