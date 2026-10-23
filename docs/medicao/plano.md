# Plano de medição — dup.agency (estudo antes/depois)

Documento que vale durante o estudo. Depois do congelamento (ver checklist), nada daqui muda sem decisão humana registrada.

## 1. Métricas do estudo

| Métrica | Definição | Fonte | Como é lida |
|---|---|---|---|
| Acessos válidos | Sessões do GA4 menos (a) sessões cujo `session source` está na lista de exclusão e (b) eventos com `traffic_type = internal` | GA4 (property do site) | Exploração/relatório com filtro "source não contém" cada item da lista + o filtro de tráfego interno do GA4 ligado |
| Leads | Itens criados no board **Leads** do Monday (ID `18435549873`), com "Pré (antes do workflow)" desmarcado | Monday | Contagem de itens por "Data de entrada". Fonte oficial; o evento `generate_lead` do GA4 é só conferência |
| Calls agendadas | Agendamentos concluídos no Calendly (`dupagency/novos-projetos-agenda-de-30-minutos` e `dupagency/primeira-conversa`) | Calendly (oficial) e GA4 `schedule_call` (conferência) | Contagem de eventos agendados no Calendly por período; origem via UTMs gravadas no agendamento |

**Efeito da carga do GTM (régua do estudo, igual antes e depois).** O GTM carrega na primeira interação (scroll, mousemove, touch, tecla, clique) ou após 5 s. Visita que sai em menos de 5 s sem interagir não é contada no GA4. Isso subconta sessões de forma constante; por isso comparações valem só dentro do mesmo regime. Não mudar `src/components/analytics/gtm.tsx`.

## 2. Contrato de eventos

Todo evento sai por `track()` de `src/lib/tracking.ts`. Nenhum dado pessoal (e-mail, telefone, nome, domínio digitado) vai ao `dataLayer`.

| Evento | Quando dispara | Parâmetros |
|---|---|---|
| `cta_click` | Clique em `<a>` com `data-cta` ou com href Calendly / `wa.me` / `mailto:` (listener central) | `cta_type` (`schedule`/`whatsapp`/`email`), `cta_location`, `page_type` (`home`/`case`/`lp`/`ferramenta`/`outra`), `lp_slug` (só em LP) |
| `generate_lead` | Formulário enviado com sucesso | `lead_source` (`lp`/`geo_audit`/`redirect_checker`/`contato`), `lp_slug` (quando houver), `page_type` |
| `schedule_call` | Calendly emite `calendly.event_scheduled` | `page_type`, `lp_slug` |
| `tool_use` | Ferramenta iniciada com sucesso | `tool` (`geo_audit`/`redirect_checker`), `page_type` |

Além disso, `traffic_type: internal` entra no `dataLayer` (antes do `gtm.js`) quando o cookie interno existe.

Exemplos:
```js
{ event: 'cta_click', cta_type: 'schedule', cta_location: 'home-cta-final', page_type: 'home' }
{ event: 'generate_lead', lead_source: 'geo_audit', page_type: 'ferramenta' }
{ event: 'generate_lead', lead_source: 'lp', lp_slug: 'vtex-migracao', page_type: 'lp' }
{ event: 'schedule_call', page_type: 'home' }
{ event: 'tool_use', tool: 'redirect_checker', page_type: 'ferramenta' }
```

`cta_location` vem de `data-cta-location="..."`; sem ele usa o `id` da `<section>` mais próxima, `footer` ou o `id` do link. Valores atuais: `home-cta-final`, `portal-hero`, `portal-cta-final`, `lab-cta`, `cta-popup`, `geo-audit-upsell`, `redirect-checker-upsell`, `footer`.

`page_type` e `lp_slug` são derivados do path (sem prefixo de idioma): `/` home, `/cases/*` case, `/ferramentas/*` ferramenta, `/lp/<slug>` lp (slug = `lp_slug`), resto `outra`. Vale para PT, EN e ES.

Observações de cobertura: mailto: só é medido em componentes React do layout `[locale]` (as páginas legais e `/emcj` ficam fora do escopo: a primeira só tem e-mail de privacidade; `/emcj` está fora do layout de GTM).

## 3. Conversões (key events) do GA4
`generate_lead` e `schedule_call`. `cta_click` e `tool_use` ficam como eventos normais.

## 4. Atribuição
- UTMs: `utm_source` = plataforma (`instagram`, `linkedin`, `google`, `newsletter`...), `utm_medium` = `organic-social` | `paid-social` | `cpc` | `email` | `landing`, `utm_campaign` = slug da campanha ou pauta, `utm_content` = id da peça. `utm_term` opcional (anúncio de pesquisa).
- Cookie `dup_origin` (primeira parte, 90 dias, sem dado pessoal) guarda `first` e `last`: UTMs, host do referrer, path de entrada e data. A `last` só é sobrescrita quando a visita traz UTM ou referrer externo. Visita direta sem histórico não grava nada (lead sem cookie = direto/desconhecido).
- Formulários: o servidor lê o cookie (`lerOrigemDaRequisicao`) e `registrarLead` grava no Monday: "Detalhe da origem" (fonte, UTMs última e primeira, referrer, entrada), "Como chegou" (inferido: `cpc`/`paid-social` = Anúncio; instagram, linkedin, google pelos respectivos; senão Outros) e "Data de entrada".
- Calendly: o popup recebe as UTMs (última com origem; senão primeira) e o Calendly as grava no agendamento.
- Limite: "Como chegou" é uma inferência; a verdade está em "Detalhe da origem". Indicação / Já fui cliente são preenchidos à mão.

## 5. Tráfego interno e lista de exclusão
- `?interno=1` grava `dup_interno=1` (400 dias). Todo carregamento com o cookie empurra `traffic_type: internal` antes do `gtm.js`. `?interno=0` apaga o cookie.
- GA4: o `traffic_type` precisa ir em todos os eventos, inclusive `page_view` (ver checklist: campo na tag Google existente); depois a regra de tráfego interno (`traffic_type` igual a `internal`) e o filtro de dados em "Ativo".
- Lista de exclusão (aplicada nas leituras do estudo, não no GA4):
```json
{
  "session_sources": ["legobrasil", "spicy", "sharkclean", "dupagencypartnerbr", "localhost:3000", "tagassistant.google.com"],
  "internal_traffic_param": "traffic_type=internal",
  "notes": "Lojas de clientes que linkam o site com utm_source sem utm_medium, tráfego de desenvolvimento e teste, e tráfego interno marcado pelo cookie ?interno=1."
}
```

## 6. Arquivos congelados
Depois do congelamento, nenhum agente altera (bloquear escrita):
```
src/lib/tracking.ts
src/lib/origin.ts
src/lib/monday.ts
src/components/analytics/gtm.tsx
src/components/analytics/TrackingListener.tsx
src/app/[locale]/layout.tsx
docs/medicao/**
```
Também congelados, fora do repositório: container GTM-W3PSS4K e property GA4. Os `data-cta` / `data-cta-location` dos CTAs existentes e as chamadas `track()` em `AuditForm.tsx` e `RedirectCheckerApp.tsx` fazem parte do contrato: podem mudar visual e texto, mas não remover nem renomear.

## 7. Regras para páginas novas (inclui landing pages)
1. Fica sob `src/app/[locale]/` (herda o GTM, o listener e o script de origem do layout). Landings em `src/app/[locale]/lp/<slug>/`: com isso `page_type: lp` e `lp_slug` saem sozinhos.
2. Só fala com o `dataLayer` por `track()` de `src/lib/tracking.ts`. Proibido `dataLayer.push` direto, GTM novo, gtag ou pixel.
3. CTA: `<a data-cta="schedule|whatsapp|email" data-cta-location="nome-da-secao" href=...>`. Calendly continua o link normal: o listener abre o popup com UTMs.
4. Formulário: server action chama `registrarLead({... leadSource: 'lp', lpSlug })` (de `src/lib/monday.ts`), e o client chama `track('generate_lead', { lead_source: 'lp', lp_slug, page_type: 'lp' })` somente após sucesso. Sem dado pessoal no `track`.
5. Ferramenta nova: `track('tool_use', ...)` exige adicionar o valor ao contrato e ao container, o que é mudança de medição (proibida no estudo). Não criar.
6. Links de campanha sempre com o padrão de UTM da seção 4.
7. Não alterar nome de evento, parâmetros nem key events. `generate_lead` com `lead_source: lp` e `lp_slug` já existem no container.
