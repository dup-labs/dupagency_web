/**
 * Origem do lead e tráfego interno. Módulo seguro para servidor e cliente
 * (sem 'use client', sem acesso a window no topo).
 *
 * Cookies de primeira parte, sem dado pessoal:
 *   dup_origin  — {first, last}: UTMs, referrer (só host), página de entrada.
 *   dup_interno — "1" marca tráfego interno (liga/desliga com ?interno=1 / 0).
 */

export const ORIGIN_COOKIE = 'dup_origin'
export const INTERNAL_COOKIE = 'dup_interno'

export type Touch = {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
  referrer?: string // só o host
  landing?: string // path de entrada, sem query
  ts?: string // ISO
}

export type LeadOrigin = { first?: Touch; last?: Touch }

const KEYS: (keyof Touch)[] = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
  'referrer', 'landing', 'ts',
]

/** Normaliza qualquer objeto vindo de cookie (não confiável) para Touch. */
function cleanTouch(raw: unknown): Touch | undefined {
  if (!raw || typeof raw !== 'object') return undefined
  const out: Touch = {}
  for (const k of KEYS) {
    const v = (raw as Record<string, unknown>)[k]
    if (typeof v === 'string' && v) out[k] = v.slice(0, 200)
  }
  return Object.keys(out).length ? out : undefined
}

export function parseOriginCookie(value: string | undefined | null): LeadOrigin {
  if (!value) return {}
  try {
    const obj = JSON.parse(decodeURIComponent(value))
    return { first: cleanTouch(obj?.first), last: cleanTouch(obj?.last) }
  } catch {
    return {}
  }
}

/** Texto do campo "Detalhe da origem" do Monday. */
export function formatDetalheOrigem(origin: LeadOrigin | null | undefined, extra?: string): string {
  const parts: string[] = []
  if (extra) parts.push(extra)
  const fmt = (label: string, t?: Touch) => {
    if (!t) return
    const utm = [t.utm_source, t.utm_medium, t.utm_campaign, t.utm_content]
      .map((v) => v || '-')
      .join(' / ')
    const hasUtm = utm !== '- / - / - / -'
    parts.push(
      `${label}: ${hasUtm ? `utm ${utm}` : 'sem utm'}` +
        `${t.referrer ? ` | ref ${t.referrer}` : ''}` +
        `${t.landing ? ` | entrada ${t.landing}` : ''}`,
    )
  }
  fmt('Última', origin?.last)
  fmt('Primeira', origin?.first)
  return parts.join('\n').slice(0, 1900)
}

/**
 * Script inline síncrono (vai no <head>, antes do GTM).
 * 1) ?interno=1 grava cookie por ~400 dias; ?interno=0 apaga.
 * 2) Cookie presente => dataLayer.push({traffic_type:'internal'}) antes do gtm.js.
 * 3) Registra primeira e última origem. A última só é sobrescrita quando a visita
 *    traz UTM ou referrer externo (navegação interna não apaga a origem).
 * Nunca lança erro.
 */
export const trackingBootstrapScript = `(function(){try{
var D=document,L=location,W=window;
function rc(n){var m=D.cookie.match(new RegExp('(?:^|; )'+n+'=([^;]*)'));return m?m[1]:''}
function wc(n,v,d){D.cookie=n+'='+v+'; path=/; max-age='+(d*86400)+'; SameSite=Lax'+(L.protocol==='https:'?'; Secure':'')}
var q=new URLSearchParams(L.search);
var i=q.get('interno');
if(i==='1')wc('${INTERNAL_COOKIE}','1',400);
if(i==='0')wc('${INTERNAL_COOKIE}','',0);
W.dataLayer=W.dataLayer||[];
if(rc('${INTERNAL_COOKIE}')==='1'&&i!=='0')W.dataLayer.push({traffic_type:'internal'});
var t={},has=false;
['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(function(k){var v=q.get(k);if(v){t[k]=v.slice(0,100);has=true}});
var rh='';try{if(D.referrer){var u=new URL(D.referrer);if(u.host!==L.host)rh=u.host}}catch(e){}
if(rh)t.referrer=rh.slice(0,100);
if(has||rh){
 t.landing=L.pathname.slice(0,100);t.ts=new Date().toISOString();
 var o={};try{o=JSON.parse(decodeURIComponent(rc('${ORIGIN_COOKIE}')))||{}}catch(e){}
 if(!o.first)o.first=t;
 o.last=t;
 wc('${ORIGIN_COOKIE}',encodeURIComponent(JSON.stringify(o)),90);
}
}catch(e){}})();`
