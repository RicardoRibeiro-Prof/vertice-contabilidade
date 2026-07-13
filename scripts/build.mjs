import fs from 'node:fs/promises'
import path from 'node:path'
import { site } from './data.mjs'
import { pages, notFound, admin } from './pages.mjs'

const root=process.cwd()
const dist=path.join(root,'dist')
const publicDir=path.join(root,'public')

await fs.rm(dist,{recursive:true,force:true})
await fs.cp(publicDir,dist,{recursive:true})

for(const [route,html] of pages){
  const dir=path.join(dist,route)
  await fs.mkdir(dir,{recursive:true})
  await fs.writeFile(path.join(dir,'index.html'),html)
}

await fs.mkdir(path.join(dist,'admin'),{recursive:true})
await fs.writeFile(path.join(dist,'admin/index.html'),admin)
await fs.writeFile(path.join(dist,'404.html'),notFound)
await fs.writeFile(path.join(dist,'.nojekyll'),'')
await fs.writeFile(path.join(dist,'robots.txt'),'User-agent: *\nAllow: /\n')
await fs.writeFile(path.join(dist,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n')
await fs.writeFile(path.join(dist,'manifest.webmanifest'),JSON.stringify({name:site.name,short_name:'Vértice',start_url:site.base,scope:site.base,display:'browser',theme_color:'#0d2d4f',background_color:'#f7fbfd',icons:[{src:`${site.base}assets/favicon.svg`,sizes:'any',type:'image/svg+xml'}]},null,2))
console.log(`Build concluído: ${pages.size} páginas públicas, painel e página 404.`)
