import { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { localizedAlternates, localizedPath } from '@/i18n/metadata'
import { type Locale } from '@/i18n/routing'
import { publicRobots } from '@/lib/robotsMeta'
import Footer from '@/components/sections/Footer'
import LegalLayout, { Bloco } from '../_legal/LegalLayout'

// ─────────────────────────────────────────────────────────────────────────────
// INSTRUÇÕES DE EXCLUSÃO DE DADOS
// ─────────────────────────────────────────────────────────────────────────────
// URL exigida pela Meta pra publicar um app no Meta for Developers, e também
// o canal prático do direito de eliminação da LGPD. Precisa ser objetiva: a
// pessoa tem que sair daqui sabendo exatamente o que fazer.
// ─────────────────────────────────────────────────────────────────────────────

const ATUALIZADO = '5 de agosto de 2026'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  return {
    title: 'Exclusão de Dados',
    description:
      'Como solicitar a exclusão dos seus dados pessoais na dup.agency, o que acontece depois e em quanto tempo.',
    openGraph: {
      title: 'Exclusão de Dados',
      description: 'Como pedir a exclusão dos seus dados pessoais.',
      url: localizedPath('/exclusao-de-dados', locale as Locale),
      siteName: 'dup.agency',
      type: 'website',
    },
    alternates: localizedAlternates('/exclusao-de-dados', locale as Locale),
    robots: publicRobots,
  }
}

export default async function ExclusaoDeDadosPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <LegalLayout titulo="Exclusão de Dados" atualizado={ATUALIZADO}>
        <p>
          Você pode pedir a exclusão dos seus dados pessoais a qualquer momento, sem precisar
          justificar. Esta página explica como fazer e o que acontece depois.
        </p>

        <Bloco titulo="Como pedir">
          <p>
            Envie um e-mail para <a href="mailto:hi@brunodup.com">hi@brunodup.com</a> com o
            assunto <strong>“Exclusão de dados”</strong>, informando:
          </p>
          <ul>
            <li>O e-mail que você usou no contato conosco</li>
            <li>Se souber, onde o dado foi deixado (formulário, ferramenta, proposta)</li>
          </ul>
          <p>
            Só pedimos isso pra localizar o registro certo. Se não lembrar dos detalhes, escreva
            mesmo assim — a gente procura.
          </p>
        </Bloco>

        <Bloco titulo="O que acontece depois">
          <ul>
            <li>
              <strong>Confirmação em até 5 dias úteis</strong>, avisando que recebemos o pedido.
            </li>
            <li>
              <strong>Exclusão em até 15 dias</strong>, contados do pedido, conforme a LGPD.
            </li>
            <li>
              <strong>Aviso de conclusão</strong>, dizendo o que foi apagado e, se for o caso, o
              que precisou ser mantido e por qual base legal.
            </li>
          </ul>
        </Bloco>

        <Bloco titulo="O que pode não ser apagado">
          <p>
            A lei permite — e às vezes obriga — reter certos dados mesmo após o pedido. Nesses
            casos avisamos você explicitamente:
          </p>
          <ul>
            <li>Registros fiscais e contábeis de contratos executados</li>
            <li>Logs de acesso, que o Marco Civil da Internet exige guardar por 6 meses</li>
            <li>Dados necessários ao exercício regular de direitos em processo</li>
          </ul>
          <p>
            Fora essas hipóteses, o dado é eliminado dos sistemas ativos e das cópias de
            segurança no ciclo seguinte de rotação.
          </p>
        </Bloco>

        <Bloco titulo="Aplicações conectadas à Meta">
          <p>
            Nossas aplicações no Facebook e Instagram publicam apenas em perfis que a própria
            dup.agency administra. Elas <strong>não coletam dados de usuários terceiros</strong>
            {' '}— nem de seguidores, nem de quem interage com as publicações.
          </p>
          <p>
            Se ainda assim quiser confirmar que não há dado seu conosco, use o mesmo e-mail
            acima. Verificamos e respondemos no mesmo prazo.
          </p>
        </Bloco>

        <Bloco titulo="Se não ficar satisfeito">
          <p>
            Você pode registrar reclamação junto à Autoridade Nacional de Proteção de Dados
            (ANPD). Mas fale com a gente primeiro — normalmente resolvemos direto e mais rápido.
          </p>
          <p>
            Detalhes sobre o que coletamos e por quê estão na{' '}
            <a href="/privacidade">Política de Privacidade</a>.
          </p>
        </Bloco>
      </LegalLayout>
      <Footer />
    </>
  )
}
