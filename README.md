# Hospital Casa de Saude Santana - Dashboard MVP

Painel de gestao para bot de triagem automatica de pacientes via WhatsApp.

## Como rodar

```bash
npm install
npm run dev
```

Abra http://localhost:3000

## Estrutura

- **/** - Dashboard com KPIs e graficos
- **/atendimentos** - Historico de conversas com filtros e detalhe da conversa
- **/pacientes** - Lista de pacientes cadastrados pelo bot (com cadastro manual)
- **/simulador** - Simulacao interativa do bot do WhatsApp
- **/fluxo** - Editor visual do fluxo de triagem

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Recharts (graficos)
- Lucide React (icones)
- date-fns (datas)

## MVP - Dados mockados

Todos os dados sao gerados em memoria (`lib/mockData.ts`):
- 80 pacientes ficticios
- 180 atendimentos dos ultimos 30 dias
- Conversas WhatsApp simuladas por tipo de atendimento

Para integrar com WhatsApp real: substituir `getAtendimentos()` e `getPacientes()` por chamadas a API (Twilio, Meta WhatsApp Business API, ou Z-API).
