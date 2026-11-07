# Quiz Educativo de Direitos Trabalhistas (CLT)

Aplicação Web Interativa (*Single Page Application* em React + TypeScript + Vite + TailwindCSS) desenvolvida como **Projeto de Extensão I — Curso Superior de Tecnologia em Análise e Desenvolvimento de Sistemas** (Programa de Contexto à Comunidade), em parceria com o escritório **Valdi Júnio Sociedade Individual de advocacia** (Advogado Titular: **Valdi Dionísio de Medeiros Júnior** — **OAB-PB 18.684**), atuante nas áreas Trabalhista, Previdenciária e Empresarial.

## Objetivos e Conformidade
- **ODS da ONU:** ODS 8 (Meta 8.8 — Proteger os direitos trabalhistas) e ODS 16 (Meta 16.10 — Acesso público à informação).
- **Conformidade Ética (Provimento nº 205/2021 do CFOAB):** Conteúdo 100% informativo, educativo e preventivo, sem captação de clientela, sem promessa de resultados e sem indução ao litígio.
- **Privacidade (LGPD — Lei nº 13.709/2018):** Armazenamento exclusivamente local e anônimo via `localStorage` no navegador do usuário.
- **Base Estática Completa:** Contém todas as **50 principais dúvidas sobre direitos trabalhistas (Mitos vs. Fatos da CLT)** divididas em 6 blocos temáticos (`public/data/questions.json` e `src/data/questions.ts`).

## Como Executar

```bash
# Instalar dependências
npm install

# Executar servidor de desenvolvimento
npm run dev

# Executar suíte de testes automatizados (Vitest)
npm test

# Gerar build de produção
npm run build
```
