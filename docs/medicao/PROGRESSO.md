# Progresso da Fase 0

## Etapas
- [x] Tracking: `src/lib/origin.ts`, `src/lib/tracking.ts`, `TrackingListener`, script no layout, CTAs com `data-cta`, Calendly em popup. Commit `feat(medicao): camada de tracking...`
- [x] Monday: `src/lib/monday.ts`, `registrarLead` nas duas ferramentas, Attio removido. Commit `feat(medicao): leads no Monday...`
- [x] Landing pages: nada construído; regra em `plano.md` seção 7.
- [x] Docs: `plano.md`, `gtm-container.json`, `checklist-ga4-gtm.md`, `DECISOES.md`.
- [x] Validação (abaixo).

## Validação
- `npm run build`: passou (Next 16.2.4).
- `tsc --noEmit`: sem erros no código novo (só 2 erros em `.next/types` obsoletos de `api/send-proposta`, rota que não existe mais).
- Script de bootstrap testado em Node (sandbox `vm` com document/location simulados): `?interno=1` grava cookie e empurra `traffic_type: internal`; recarregar com cookie empurra de novo; UTM + referrer gravam `first` e `last`; segunda visita com outro UTM só troca `last`; `?interno=0` apaga o cookie e não empurra.
- `montarColumnValues` e `registrarLead` testados em Node: payload com rótulos reais; sem token e com fetch falhando retorna `false` sem lançar. Nenhuma chamada real ao Monday.
- Dev server: HTML de `/` e `/en/portal` contém o script de bootstrap e os `data-cta-location`.
- Lighthouse (home, build de produção local, mobile padrão, headless): main 0.91 (TBT 10 ms, LCP 3,2 s); branch 0.83 numa rodada, 0.90 e 0.88 em outras duas (TBT 0-10 ms, LCP 3,2-4,0 s). Variação de rodada a rodada; sem piora atribuível (o GTM não carrega no Lighthouse e o Calendly é sob demanda). Uma rodada só por build em main.
- **Não verificado em browser real:** clique nos CTAs, popup do Calendly, `schedule_call` e os formulários empurrando no `dataLayer`. Roteiro para conferir (console do navegador, dev server ou preview):
  1. `localhost:3000/?interno=1` e `dataLayer` mostra `{traffic_type:'internal'}`; `?interno=0` limpa.
  2. `/?utm_source=linkedin&utm_medium=organic-social&utm_campaign=t&utm_content=p1` e `document.cookie` contém `dup_origin`.
  3. Clicar no CTA de agenda (fim da home): `dataLayer` ganha `cta_click` (schedule, home-cta-final, home) e abre o popup; confira `utm_*` na URL do iframe.
  4. Concluir um agendamento de teste: `schedule_call`.
  5. WhatsApp no popup, nas ferramentas e no rodapé: `cta_click` whatsapp.
  6. Formulário de GEO Audit e de Redirect Checker: `tool_use` e `generate_lead`; com `MONDAY_API_TOKEN` de teste, item criado com "Detalhe da origem".
  7. Repetir em `/en` e `/es`.

## Passos manuais para o Bruno
Ver `checklist-ga4-gtm.md`: importar container (e editar o ID de medição), `traffic_type` na tag Google existente, Preview, key events, filtro interno, dimensões, Search Console, `MONDAY_API_TOKEN` na Vercel, conferir o roteiro acima em browser, congelar.

## Recomendação de congelamento
31/10/2026, depois de todos os passos e da conferência com um lead e um agendamento reais. Registrar a data no checklist.
