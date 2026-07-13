import fs from 'node:fs/promises'
import path from 'node:path'

const dist = path.join(process.cwd(), 'dist')

const images = {
  hero: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1500&q=84',
  office: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=84',
  meeting: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1400&q=84',
  ana: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=84',
  rafael: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=84',
  larissa: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=900&q=84',
  mei: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=84',
  fluxo: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=84',
  abertura: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=1200&q=84',
}

const picture = (src, alt, className, eager = false) =>
  `<figure class="${className}"><img src="${src}" alt="${alt}" width="1200" height="800" ${eager ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"'}></figure>`

async function readRoute(route = '') {
  return fs.readFile(path.join(dist, route, 'index.html'), 'utf8')
}

async function writeRoute(route, html) {
  await fs.writeFile(path.join(dist, route, 'index.html'), html)
}

let home = await readRoute('')
home = home.replace(
  '<div class="dashboard">',
  `<div class="dashboard dashboard-photo">${picture(images.hero, 'Equipe de profissionais reunida em escritório moderno', 'hero-real-photo', true)}`,
)
home = home.replace(
  '<div class="visual"><span class="eyebrow" style="color:#8fe7f1">Rotina digital</span>',
  `<div class="visual visual-with-photo">${picture(images.meeting, 'Profissionais analisando informações financeiras em reunião', 'section-real-photo')}<span class="eyebrow" style="color:#8fe7f1">Rotina digital</span>`,
)
await writeRoute('', home)

let office = await readRoute('escritorio')
office = office.replace(
  '<div class="visual"><span class="eyebrow" style="color:#8fe7f1">Propósito</span>',
  `<div class="visual visual-office">${picture(images.office, 'Ambiente contemporâneo de escritório contábil', 'office-real-photo')}<span class="eyebrow" style="color:#8fe7f1">Propósito</span>`,
)
await writeRoute('escritorio', office)

let team = await readRoute('equipe')
const people = [
  ['AM', images.ana, 'Ana Martins em retrato profissional'],
  ['RC', images.rafael, 'Rafael Costa em retrato profissional'],
  ['LS', images.larissa, 'Larissa Sousa em retrato profissional'],
]
for (const [initials, src, alt] of people) {
  team = team.replace(`<div class="avatar">${initials}</div>`, picture(src, alt, 'person-photo'))
}
await writeRoute('equipe', team)

const articleImages = [
  ['MEI: quando pode ser hora de mudar de categoria?', images.mei, 'Pessoa analisando documentos financeiros e calculadora', 'artigos/mei-quando-e-hora-de-mudar'],
  ['Fluxo de caixa e contabilidade: por que os dois precisam conversar?', images.fluxo, 'Equipe empresarial analisando gráficos e relatórios', 'artigos/fluxo-de-caixa-e-contabilidade'],
  ['Quais documentos ajudam a acelerar a abertura de uma empresa?', images.abertura, 'Documentos empresariais, calculadora e material de escritório', 'artigos/documentos-para-abrir-empresa'],
]

for (const route of ['', 'artigos']) {
  let html = await readRoute(route)
  for (const [title, src, alt] of articleImages) {
    html = html.replace(
      `<article class="article-card"><span class="meta">`,
      `<article class="article-card">${picture(src, alt, 'article-card-photo')}<span class="meta">`,
    )
  }
  await writeRoute(route, html)
}

for (const [, src, alt, route] of articleImages) {
  let html = await readRoute(route)
  html = html.replace(
    '<article class="section"><div class="container prose"><p class="meta">',
    `<article class="section"><div class="container prose"><p class="meta">`,
  )
  const metaEnd = '</p>'
  const index = html.indexOf(metaEnd, html.indexOf('<article class="section">'))
  if (index !== -1) {
    html = `${html.slice(0, index + metaEnd.length)}${picture(src, alt, 'article-cover')}${html.slice(index + metaEnd.length)}`
  }
  await writeRoute(route, html)
}

console.log('Fotografias reais aplicadas à página inicial, escritório, equipe e artigos.')
