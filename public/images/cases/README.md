# Imagens dos cases

Uma pasta por case, com o **mesmo nome do slug** (`src/content/cases/<slug>.ts`).
Exemplo: `public/images/cases/dux-human-health/`.

Os arquivos são resolvidos **por convenção de nome** (`src/lib/caseAssets.ts`) — não
precisa registrar nada em lugar nenhum. Soltou o arquivo, rebuildou, apareceu.

| Arquivo                              | Onde aparece                                          |
|--------------------------------------|-------------------------------------------------------|
| `hero.mp4` / `hero.webm`             | **Vídeo** dentro do browser do hero (autoplay, mudo, loop) |
| `hero.png` / `.jpg` / `.webp`        | Poster do vídeo. Sem vídeo, vira o print do hero       |
| `gallery-1.png` … `gallery-N.png`    | Galeria "telas do site" (na ordem)                    |
| `timeline-1.png` … `timeline-N.png`  | Print do marco N da timeline (mesma ordem do TS)      |

Extensões aceitas: `png`, `jpg`, `jpeg`, `webp`, `avif` (imagem) e `mp4`, `webm` (vídeo).

## Sem imagem, a página continua de pé

Nada aqui é obrigatório — a página foi feita pra ficar bonita vazia e ir melhorando
conforme você alimenta:

- **Sem `hero.*`** → o browser do hero mostra um poster sóbrio com o logo do cliente.
- **Sem `timeline-N.*`** → o card do marco fica só com texto, sem moldura de imagem.
- **Sem nenhum `gallery-*`** → a seção de galeria **some da página** (e a numeração
  dos títulos se reajusta sozinha: o depoimento vira "04" em vez de "05").

Se precisar de um caminho fora da convenção, dá pra apontar direto no content file:
`image: '/images/clients/dux.png'` no milestone ou no shot da galeria — override
explícito sempre vence a convenção.
