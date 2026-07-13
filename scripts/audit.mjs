import fs from 'node:fs/promises'
import path from 'node:path'

const dist=path.join(process.cwd(),'dist')
const failures=[]
const routes=['','escritorio/','servicos/','servicos/abertura-de-empresa/','servicos/contabilidade-para-mei/','servicos/gestao-fiscal-e-tributaria/','servicos/departamento-pessoal/','servicos/planejamento-tributario/','servicos/imposto-de-renda/','equipe/','artigos/','artigos/mei-quando-e-hora-de-mudar/','artigos/fluxo-de-caixa-e-contabilidade/','artigos/documentos-para-abrir-empresa/','contato/','politica-de-privacidade/']
const exists=(f)=>fs.access(f).then(()=>true).catch(()=>false)
const text=(html)=>html.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()

for(const route of routes){
  const file=path.join(dist,route,'index.html')
  if(!(await exists(file))){failures.push(`Página ausente: ${route||'/'}`);continue}
  const html=await fs.readFile(file,'utf8')
  const h1=(html.match(/<h1\b/gi)||[]).length
  const canonical=html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1]||''
  if(!/data-prerendered="true"/.test(html))failures.push(`${route||'/'}: pré-renderização ausente`)
  if(!/<title>[^<]+<\/title>/.test(html))failures.push(`${route||'/'}: title ausente`)
  if(!/<meta name="description" content="[^"]+"/.test(html))failures.push(`${route||'/'}: description ausente`)
  if(!/<meta name="robots" content="noindex, nofollow"/.test(html))failures.push(`${route||'/'}: noindex ausente`)
  if(h1!==1)failures.push(`${route||'/'}: esperado um H1; encontrado ${h1}`)
  if(!canonical.startsWith('https://ricardoribeiro-prof.github.io/vertice-contabilidade/'))failures.push(`${route||'/'}: canonical incorreto`)
  if(!html.includes('/vertice-contabilidade/assets/styles.css'))failures.push(`${route||'/'}: CSS fora do caminho-base`)
  if(!html.includes('/vertice-contabilidade/assets/images.css'))failures.push(`${route||'/'}: CSS de imagens ausente`)
  if(!html.includes('/vertice-contabilidade/assets/app.js'))failures.push(`${route||'/'}: JS fora do caminho-base`)
  if(text(html).length<220)failures.push(`${route||'/'}: conteúdo insuficiente`)
  if(!html.includes('>Início</a>'))failures.push(`${route||'/'}: menu Início ausente`)
}

const visualRoutes=['','escritorio/','equipe/','artigos/','artigos/mei-quando-e-hora-de-mudar/','artigos/fluxo-de-caixa-e-contabilidade/','artigos/documentos-para-abrir-empresa/']
for(const route of visualRoutes){
  const html=await fs.readFile(path.join(dist,route,'index.html'),'utf8')
  if(!html.includes('images.unsplash.com'))failures.push(`${route||'/'}: fotografia real ausente`)
  if(!/<img[^>]+alt="[^"]+"/.test(html))failures.push(`${route||'/'}: texto alternativo de imagem ausente`)
}

for(const file of ['assets/styles.css','assets/images.css','assets/app.js','assets/favicon.svg','assets/social.svg','manifest.webmanifest','robots.txt','sitemap.xml','404.html','admin/index.html'])if(!(await exists(path.join(dist,file))))failures.push(`Arquivo ausente: ${file}`)
const robots=await fs.readFile(path.join(dist,'robots.txt'),'utf8')
if(robots.trim()!=='User-agent: *\nAllow: /')failures.push('robots.txt incorreto')
const sitemap=await fs.readFile(path.join(dist,'sitemap.xml'),'utf8')
if(!/<urlset[^>]*><\/urlset>/i.test(sitemap.replace(/\s+/g,'')))failures.push('sitemap demonstrativo deve ser XML vazio válido')
if(failures.length){console.error(failures.map(x=>`- ${x}`).join('\n'));process.exit(1)}
console.log(`Auditoria concluída: ${routes.length} páginas públicas, fotografias reais e arquivos essenciais validados.`)
