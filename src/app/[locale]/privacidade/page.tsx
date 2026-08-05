import { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { localizedAlternates, localizedPath } from '@/i18n/metadata'
import { type Locale } from '@/i18n/routing'
import { publicRobots } from '@/lib/robotsMeta'
import Footer from '@/components/sections/Footer'
import LegalLayout, { Bloco } from '../_legal/LegalLayout'

// ─────────────────────────────────────────────────────────────────────────────
// POLÍTICA DE PRIVACIDADE
// ─────────────────────────────────────────────────────────────────────────────
// Existe por dois motivos: LGPD e exigência da Meta — publicar um app no Meta
// for Developers (o dup.publisher, que posta nos nossos próprios perfis) pede
// URL de política de privacidade e de exclusão de dados. Ver /exclusao-de-dados.
//
// Conteúdo em PT nos três locales de propósito: é texto jurídico de empresa
// brasileira, e traduzir sem revisão jurídica cria risco em vez de resolver.
// ─────────────────────────────────────────────────────────────────────────────

const ATUALIZADO = '5 de agosto de 2026'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  return {
    title: 'Política de Privacidade',
    description:
      'Como a dup.agency coleta, usa e protege dados pessoais, e como solicitar acesso ou exclusão.',
    openGraph: {
      title: 'Política de Privacidade',
      description: 'Como tratamos dados pessoais na dup.agency.',
      url: localizedPath('/privacidade', locale as Locale),
      siteName: 'dup.agency',
      type: 'website',
    },
    alternates: localizedAlternates('/privacidade', locale as Locale),
    robots: publicRobots,
  }
}

export default async function PrivacidadePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <LegalLayout titulo="Política de Privacidade" atualizado={ATUALIZADO}>
        <p>
          Esta política explica como a <strong>dup.agency</strong> trata dados pessoais nos
          seus sites, ferramentas e aplicações. Escrevemos em linguagem direta de propósito:
          se algo aqui não estiver claro, fale com a gente e nós explicamos.
        </p>

        <Bloco titulo="Quem somos">
          <p>
            dup.agency é uma agência brasileira de tecnologia e commerce. Para efeito da Lei
            Geral de Proteção de Dados (LGPD, Lei 13.709/2018), somos a{' '}
            <strong>controladora</strong> dos dados descritos aqui.
          </p>
          <p>
            Contato para qualquer assunto de privacidade:{' '}
            <a href="mailto:dup@dup.agency">dup@dup.agency</a>.
          </p>
        </Bloco>

        <Bloco titulo="Que dados coletamos">
          <p>Só o necessário, e sempre com uma razão clara:</p>
          <ul>
            <li>
              <strong>Dados que você nos envia.</strong> Nome, e-mail, empresa e mensagem,
              quando você preenche um formulário, pede uma proposta ou entra em contato.
            </li>
            <li>
              <strong>Dados de uso das ferramentas.</strong> Ao usar ferramentas públicas do
              site (como auditorias de URL), guardamos o endereço analisado e o resultado, pra
              conseguir te mostrar o relatório depois.
            </li>
            <li>
              <strong>Dados técnicos de navegação.</strong> Páginas visitadas, tipo de
              dispositivo e navegador, de forma agregada, pra entender o que funciona no site.
            </li>
          </ul>
          <p>
            Não coletamos dados sensíveis (saúde, biometria, convicção religiosa ou política) e
            não pedimos dados de pagamento pelo site.
          </p>
        </Bloco>

        <Bloco titulo="Por que usamos">
          <ul>
            <li>Responder seu contato e conduzir a conversa comercial</li>
            <li>Entregar o resultado das ferramentas que você mesmo solicitou</li>
            <li>Melhorar o site e nossos produtos, a partir de dados agregados</li>
            <li>Cumprir obrigações legais quando aplicável</li>
          </ul>
          <p>
            Não vendemos dados pessoais. Não repassamos sua informação para terceiros usarem em
            publicidade própria.
          </p>
        </Bloco>

        <Bloco titulo="Com quem compartilhamos">
          <p>
            Apenas com prestadores que sustentam a operação, e só no que é necessário pra eles
            funcionarem — hospedagem, envio de e-mail, banco de dados e analytics. Esses
            fornecedores tratam os dados em nosso nome e sob contrato.
          </p>
          <p>
            Parte da infraestrutura fica em servidores fora do Brasil. Nesses casos a
            transferência internacional acontece dentro das hipóteses previstas na LGPD.
          </p>
        </Bloco>

        <Bloco titulo="Aplicações conectadas a redes sociais">
          <p>
            Mantemos aplicações internas que publicam conteúdo nos <em>nossos próprios</em>{' '}
            perfis (Instagram e Facebook da dup.agency e das nossas marcas), usando as APIs
            oficiais da Meta.
          </p>
          <p>
            Essas aplicações são de uso interno da equipe. Elas não coletam, acessam nem
            armazenam dados de seguidores, de outros perfis ou de qualquer terceiro. O acesso se
            limita a publicar em contas que nós mesmos administramos.
          </p>
          <p>
            As imagens enviadas nessas publicações ficam hospedadas de forma temporária apenas
            durante o envio e são apagadas em seguida.
          </p>
        </Bloco>

        <Bloco titulo="Por quanto tempo guardamos">
          <p>
            Pelo tempo necessário à finalidade que motivou a coleta. Contatos comerciais ficam
            enquanto a relação estiver ativa; resultados de ferramentas públicas são descartados
            periodicamente. Havendo obrigação legal de retenção, seguimos o prazo da lei.
          </p>
        </Bloco>

        <Bloco titulo="Seus direitos">
          <p>A LGPD garante que você pode, a qualquer momento:</p>
          <ul>
            <li>Confirmar se tratamos dados seus e acessar esses dados</li>
            <li>Corrigir dado incompleto, desatualizado ou errado</li>
            <li>Pedir anonimização, bloqueio ou eliminação</li>
            <li>Pedir a portabilidade dos dados</li>
            <li>Revogar consentimento e se opor a um tratamento</li>
          </ul>
          <p>
            Para exercer qualquer um deles, escreva para{' '}
            <a href="mailto:dup@dup.agency">dup@dup.agency</a>. Respondemos em até 15 dias.
            Para exclusão, o passo a passo está em{' '}
            <a href="/exclusao-de-dados">/exclusao-de-dados</a>.
          </p>
        </Bloco>

        <Bloco titulo="Segurança">
          <p>
            Usamos conexão criptografada, acesso restrito por credencial e princípio de menor
            privilégio nas integrações. Nenhum sistema é imune a incidentes — se algo relevante
            acontecer, comunicamos os titulares afetados e a ANPD, como manda a lei.
          </p>
        </Bloco>

        <Bloco titulo="Mudanças nesta política">
          <p>
            Se mudarmos algo material, atualizamos a data no topo desta página. Vale sempre a
            versão publicada aqui.
          </p>
        </Bloco>
      </LegalLayout>
      <Footer />
    </>
  )
}
