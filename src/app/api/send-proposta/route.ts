import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import { Resend } from 'resend';

const FRAME_IDS_BY_TYPE: Record<string, string[]> = {
  Evolucao: ['43:230', '74:977', '85:1284', '149:358', '65:725', '58:407'],
};

function encodeFigmaIds(ids: string[]): string {
  return ids.map(id => id.replace(/:/g, '%3A')).join(',');
}

async function validateFigmaToken(): Promise<boolean> {
  const res = await fetch('https://api.figma.com/v1/me', {
    headers: { 'X-Figma-Token': process.env.FIGMA_TOKEN! },
  });
  return res.ok;
}

async function exportFramesAsPdf(fileKey: string, frameIds: string[]): Promise<Uint8Array> {
  const ids = encodeFigmaIds(frameIds);
  const res = await fetch(
    `https://api.figma.com/v1/images/${fileKey}?ids=${ids}&format=png&scale=1`,
    { headers: { 'X-Figma-Token': process.env.FIGMA_TOKEN! } }
  );
  if (!res.ok) throw new Error(`Figma export falhou: ${res.status}`);

  const data = await res.json();
  if (data.err) throw new Error(`Figma export erro: ${data.err}`);

  const images: Record<string, string> = data.images;
  const pdf = await PDFDocument.create();

  for (const frameId of frameIds) {
    const url = images[frameId];
    if (!url) continue;
    const pngBytes = await fetch(url).then(r => r.arrayBuffer());
    const pngImage = await pdf.embedPng(pngBytes);
    const { width, height } = pngImage;
    const page = pdf.addPage([width, height]);
    page.drawImage(pngImage, { x: 0, y: 0, width, height });
  }

  return pdf.save();
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ success: false, error: 'Body inválido' }, { status: 400 });
  }

  // frameIds pode vir direto ou via tipo
  const frameIds: string[] | undefined =
    body.frameIds ?? (body.tipo ? FRAME_IDS_BY_TYPE[body.tipo] : undefined);

  const { cliente, fileKey, emails } = body;

  const missing = [
    !cliente && 'cliente',
    !fileKey && 'fileKey',
    !frameIds?.length && 'frameIds (ou tipo)',
    !emails?.length && 'emails',
  ].filter(Boolean);

  if (missing.length > 0) {
    return NextResponse.json(
      { success: false, error: `Campos obrigatórios faltando: ${missing.join(', ')}` },
      { status: 400 }
    );
  }

  const tokenValid = await validateFigmaToken();
  if (!tokenValid) {
    return NextResponse.json(
      {
        success: false,
        error: 'FIGMA_TOKEN_EXPIRED',
        message:
          'O token do Figma expirou. Gere um novo em figma.com → Settings → Security → Personal access tokens e atualize a variável FIGMA_TOKEN na Vercel.',
      },
      { status: 401 }
    );
  }

  try {
    const pdfBytes = await exportFramesAsPdf(fileKey, frameIds!);
    console.log('[send-proposta] PDF gerado:', pdfBytes.length, 'bytes');

    const pdfBase64 = Buffer.from(pdfBytes).toString('base64');

    const resend = new Resend(process.env.RESEND_API_KEY);
    const defaultHtml = `
<p>Olá, tudo bem?</p>
<p>Como combinamos estou te enviando a proposta do nosso trabalho, listei um pouco sobre as oportunidades que conversamos inicialmente e a parte de valores e plano contratado.</p>
<p>Qualquer dúvida, não deixe de me acionar,<br>aguardo seu retorno neste email :)</p>
<p>Muito obrigado</p>
<p>Dup</p>
<p><a href="https://dup.agency">dup.agency</a></p>
`;

    const defaultText = `Olá, tudo bem?

Como combinamos estou te enviando a proposta do nosso trabalho, listei um pouco sobre as oportunidades que conversamos inicialmente e a parte de valores e plano contratado.

Qualquer dúvida, não deixe de me acionar,
aguardo seu retorno neste email :)

Muito obrigado

Dup
https://dup.agency`;

    const { data, error } = await resend.emails.send({
      from: 'Bruno Dup <connect@dup.agency>',
      to: emails,
      subject: `Proposta dup.agency — ${cliente}`,
      html: body.html || defaultHtml,
      text: body.text || defaultText,
      attachments: [
        {
          filename: `proposta-dup-agency-${cliente.toLowerCase().replace(/\s+/g, '-')}.pdf`,
          content: pdfBase64,
        },
      ],
    });

    console.log('[send-proposta] Resend data:', JSON.stringify(data));
    console.log('[send-proposta] Resend error:', JSON.stringify(error));

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, emailId: data?.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
