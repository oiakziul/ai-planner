# 💰 EduFin - Educador Financeiro Inteligente com IA

Um Web App Progressivo (PWA) desenvolvido em React com Vite, TypeScript e Tailwind CSS. Este projeto é a entrega final do bootcamp **Santander 2026 - Frontend** da Digital Innovation One (DIO). O EduFin une gestão financeira a uma **Inteligência Artificial Generativa**, oferecendo conselhos personalizados, cálculo reverso de juros compostos e controle de gastos.

---

## 🎯 Escopo & Regras de Negócio

Este projeto foi desenhado sob premissas reais de educação financeira digital para investidores iniciantes. O sistema automatiza o planejamento de metas de aposentadoria de longo prazo transformando-as em aportes mensais de curto prazo.

- **Cálculo Reverso de Aportes:** Calcula o aporte necessário para atingir a renda mensal desejada no tempo planejado.
- **Efeito Bola de Neve:** Destaca de forma didática o total investido versus o montante gerado puramente por juros compostos.
- **Aconselhamento por IA:** Avalia o orçamento do usuário e propõe caminhos alternativos através de IA.

👉 Para ler o planejamento completo de negócios, premissas de cálculo e sugestões interativas, acesse o documento de [Escopo do Projeto](docs/escopo-do-projeto.md).

---

## 🛠️ Tecnologias Utilizadas

- **Framework:** React 19 + Vite (v6.x)
- **Compilador:** Babel + React Compiler
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS (v4) e Componentes Shadcn/ui
- **Gráficos:** Recharts (Otimizado para Tailwind)
- **Inteligência Artificial:** Integração com a API do Google Gemini
- **Tipografia:** `@fontsource-variable/geist`
- **Roteamento:** `react-router-dom`
- **PWA:** `vite-plugin-pwa` para suporte offline e cache avançado.

---

## 🎨 Sistema de Cores Dinâmicas por Rota

A interface escuta as mudanças de página através do hook `useLocation` e altera dinamicamente a paleta de cores aplicada nos detalhes visuais da tela. As classes fazem referência às variáveis globais do nosso tema Santander/IA do CSS:

### 📌 Mapeamento de Rotas

| Rota | Variável CSS | Contexto / Página | Descrição Psicologia das Cores |
| :--- | :--- | :--- | :--- |
| `/` | `var(--cor1)` | **Dashboard (Visão Geral)** | Vermelho Santander - Cor de confiança e ação. |
| `/receitas` | `var(--cor3)` | **Entradas / Receitas** | Verde Esmeralda - Dinheiro entrando e prosperidade. |
| `/despesas` | `var(--cor4)` | **Saídas / Despesas** | Rosa/Vermelho Rubi - Alerta, atenção com os gastos. |
| `/assistente-ia` | `var(--cor5)` | **Assistente IA** | Fuchsia/Magenta - Inteligência Artificial e inovação. |
| *Fallback* | `var(--cor2)` | **Configurações/Outros** | Slate Escuro - Neutro para navegação secundária. |

---

## ⚙️ Configuração do PWA & Ativos Visuais

O projeto possui suporte completo para instalação em dispositivos móveis e desktop, com cache de fontes, imagens e requisições offline. Os ativos estão estruturados na pasta `public/` (gerados com fundo transparente e compatibilidade nativa de recorte no Android e iOS):

### 📂 Estrutura da Pasta `public/`
- `favicon.ico` — Ícone de fallback para abas de navegadores antigos.
- `favicon.svg` — Ícone em vetor para nitidez máxima em navegadores modernos.
- `apple-touch-icon.png` — Ícone de alta densidade com fundo preenchido exigido pelo iOS.
- `logo192.png` — Launcher icon padrão de 192x192px utilizado pelo Android.
- `logo512.png` — Splash screen de 512x512px para telas de carregamento móvel/desktop.

---

## 🚀 Como Rodar o Projeto Localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/SEU_USUARIO/agente-financeiro.git
   cd agente-financeiro