# Vértice Contabilidade

Projeto demonstrativo de site institucional para escritório de contabilidade em São Raimundo Nonato – PI.

## Estrutura

- Início
- Escritório
- Serviços
- Páginas individuais de serviços
- Equipe
- Artigos
- Contato
- Política de privacidade
- Página 404
- Painel demonstrativo

## Recursos

- HTML pré-renderizado
- SEO por página
- Canonical
- Open Graph e Twitter Cards
- Rotas reais para GitHub Pages
- Layout responsivo
- Modo demonstração com `noindex, nofollow`
- Sitemap demonstrativo vazio
- Robots permitindo rastreamento
- Auditoria automática do build
- Deploy da pasta `dist`

## Executar localmente

```bash
npm ci
npm run build
npx serve dist
```

## Publicação

O workflow `.github/workflows/deploy-pages.yml` gera, audita e publica exclusivamente a pasta `dist`.

No GitHub, acesse **Settings → Pages** e escolha **Source: GitHub Actions**.

URL esperada:

```text
https://ricardoribeiro-prof.github.io/vertice-contabilidade/
```

## Projeto demonstrativo

Todos os nomes, profissionais, telefones, endereços e e-mails são fictícios. Antes de usar em produção, substitua os dados, revise a política de privacidade e altere as regras de indexação.
