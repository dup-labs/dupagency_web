# Checklist de clique — GTM e GA4 (para o Bruno)

Tempo estimado: 40 minutos. Nada disso foi feito pelo agente.

## A. Importar o container
1. tagmanager.google.com, container `GTM-W3PSS4K`, Admin, **Importar contêiner**.
2. Escolha `docs/medicao/gtm-container.json`, espaço de trabalho **Novo** (ex.: `fase-0-medicao`).
3. Opção **Mesclar**. Em conflitos: **Renomear** os conflitantes (não sobrescrever).
4. Se o GTM recusar o arquivo (os campos de conta/contêiner são `0`), registre o erro: o formato foi montado à mão e não foi testado numa importação real.
5. Abra a variável **GA4 - Measurement ID (EDITAR)** e troque `G-XXXXXXXXXX` pelo ID real da property.

## B. traffic_type na tag Google existente (obrigatório)
O `page_view` sai da tag Google/GA4 que já existe no container. Nela: Configurações, **Parâmetros a definir**, adicionar `traffic_type` = nova variável `DLV - traffic_type`. Sem isso o filtro de tráfego interno não pega o `page_view`.

## C. Conferir no Preview
1. Visualizar, URL `https://dup.agency/?interno=1` (isso também marca seu navegador).
2. Clique em cada CTA e confira no resumo: `cta_click` com os parâmetros certos, tag `GA4 - Event - cta_click` disparada.
3. Faça um agendamento de teste no Calendly (popup): `schedule_call` aparece. Cancele o agendamento depois.
4. Ferramentas: um GEO Audit e um Redirect Checker de teste: `tool_use` e `generate_lead`.
5. Repita uma vez em `/en` e `/es`.
6. No GA4, Admin, DebugView: os eventos chegam com `traffic_type = internal`.
7. Publicar a versão com nome `fase-0-medicao-congelada`.

## D. GA4
1. **Key events**: Admin, Eventos, marque `generate_lead` e `schedule_call` como key event. Eles só aparecem na lista depois do primeiro disparo (o teste da seção C serve); se ainda não aparecerem, volte em algumas horas.
2. **Tráfego interno**: Admin, Fluxo de dados, Configurar tag, **Definir tráfego interno**, criar regra com `traffic_type` igual a `internal`, nome do valor `internal`.
3. **Filtro de dados**: Admin, Configurações de dados, Filtros de dados, o filtro "Internal Traffic": mude de Teste para **Ativo**.
4. **Dimensões personalizadas** (escopo Evento): `cta_type`, `cta_location`, `page_type`, `lp_slug`, `lead_source`, `tool`. (`traffic_type` já é tratado pelo filtro.)
5. **Search Console**: Admin, Vínculos de produtos, Vincular o Search Console da propriedade `dup.agency`.
6. Lista de exclusão (origens): salve uma Exploração com filtro "Origem da sessão" não contém `legobrasil`, `spicy`, `sharkclean`, `dupagencypartnerbr`, `localhost:3000`, `tagassistant.google.com`. É a leitura oficial de "acessos válidos".
7. Vercel: cadastre `MONDAY_API_TOKEN` (Production e Preview) com o token do Monday; sem ele os leads não são registrados (a ferramenta continua funcionando). Remova `ATTIO_API_KEY` se existir.

## E. Como e quando congelar
- **Recomendação:** congelar assim que A a D estiverem feitos e uma semana de dados passar na conferência (Preview + DebugView + 1 lead e 1 agendamento reais contados). Data-alvo sugerida: **31/10/2026**, para o corte de nov/2026 ("Pré" no board Leads) valer a partir de 01/11/2026.
- Registre aqui a data real: `Congelado em: ____/____/______` (e o nome da versão do GTM publicada).
- **Proibido a partir da data:** editar o container GTM; mexer em property, key events, dimensões, filtros ou vínculos do GA4; alterar os arquivos da lista de "Arquivos congelados" em `plano.md`; mudar nome de evento/parâmetro; trocar o fluxo do Calendly; mudar a estratégia de carga do GTM; mudar colunas ou rótulos do board Leads usados por `monday.ts`.
- Mudança inevitável: decisão humana, registrada com data em `DECISOES.md`, e a análise trata o período como corte.
