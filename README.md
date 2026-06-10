# Gruta das Estrelas

Site institucional estático da Gruta das Estrelas, restaurante e hospedagem no Saco do Céu, Ilha Grande, Angra dos Reis.

O projeto usa HTML, CSS e JavaScript puro, sem frameworks. O formulário de interesse envia leads para o Supabase e, após salvar com sucesso, abre o WhatsApp com uma mensagem automática.

## Estrutura

```text
index.html
robots.txt
sitemap.xml
vercel.json
assets/css/style.css
assets/js/main.js
assets/js/supabase.js
assets/img/
README.md
```

## 1. Rodar o projeto localmente

Como o site é estático, você pode abrir o arquivo `index.html` diretamente no navegador.

Para rodar com servidor local, use:

```bash
npx serve .
```

Outra opção, se estiver usando Node.js:

```bash
npx http-server .
```

Depois acesse a URL exibida no terminal, normalmente algo como:

```text
http://localhost:3000
```

## 2. Configurar SUPABASE_URL

Abra o arquivo:

```text
assets/js/supabase.js
```

Edite a constante, se precisar trocar de projeto:

```js
const SUPABASE_URL = "https://essoicjbsshlqvzqcrsw.supabase.co/rest/v1/";
```

Use a URL do projeto Supabase, encontrada em:

```text
Supabase Dashboard > Project Settings > API > Project URL
```

Exemplo:

```js
const SUPABASE_URL = "https://essoicjbsshlqvzqcrsw.supabase.co/rest/v1/";
```

## 3. Configurar SUPABASE_ANON_KEY

No mesmo arquivo:

```text
assets/js/supabase.js
```

Edite a constante, se precisar trocar a chave pública:

```js
const SUPABASE_ANON_KEY = "sb_publishable_2WQu7dIOdX5hOyHShn1LrQ_DJrYfSvY";
```

Use a chave pública `anon`, encontrada em:

```text
Supabase Dashboard > Project Settings > API > Project API keys > anon public
```

Importante: use apenas a chave `anon` pública no frontend. Nunca use `service_role` no navegador.

## 4. Configurar CLIENT_ID da Gruta das Estrelas

No arquivo:

```text
assets/js/supabase.js
```

Edite, se precisar trocar o cliente:

```js
const CLIENT_ID = "be67a108-32a4-4bd6-82a1-ac71f1b7232e";
```

Esse valor deve ser o ID do cliente Gruta das Estrelas no seu banco/Supabase.

O `client_slug` já está configurado como:

```js
const CLIENT_SLUG = "gruta-das-estrelas";
```

## 5. Configurar WHATSAPP_NUMBER

No arquivo:

```text
assets/js/supabase.js
```

Edite:

```js
const WHATSAPP_NUMBER = "5524992626383";
```

Use o número com código do país e DDD, sem espaços, parênteses ou sinais.

Formato:

```text
55 + DDD + número
```

Exemplo:

```js
const WHATSAPP_NUMBER = "5524992626383";
```

## 6. Leads no Supabase

O formulário salva os leads na tabela:

```text
public.site_leads
```

Os campos enviados são:

- `client_id`
- `client_slug`
- `name`
- `phone`
- `email`
- `interest_type`
- `desired_date`
- `people_count`
- `message`
- `source`
- `page_url`

Os leads da Gruta das Estrelas podem ser consultados pela view:

```text
public.gruta_leads
```

Fluxo do formulário:

1. O visitante preenche os dados.
2. O site valida os campos obrigatórios.
3. O lead é salvo em `public.site_leads`.
4. Após sucesso, o WhatsApp abre com uma mensagem automática.

## 7. SQL base sugerido

Caso a tabela ainda não exista, use uma estrutura compatível com o formulário:

```sql
create table if not exists public.site_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  client_id uuid not null,
  client_slug text not null,
  name text not null,
  phone text not null,
  email text,
  interest_type text not null,
  desired_date date,
  people_count integer,
  message text,
  source text,
  page_url text
);

alter table public.site_leads enable row level security;

create policy "Allow Gruta public lead insert"
on public.site_leads
for insert
to anon
with check (client_slug = 'gruta-das-estrelas');
```

Exemplo de view para consulta:

```sql
create or replace view public.gruta_leads as
select *
from public.site_leads
where client_slug = 'gruta-das-estrelas'
order by created_at desc;
```

## 8. Subir para o GitHub

Na pasta do projeto, rode:

```bash
git init
git add .
git commit -m "Cria site institucional da Gruta das Estrelas"
```

Crie um repositório vazio no GitHub e conecte o remoto:

```bash
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git
git push -u origin main
```

Substitua `SEU_USUARIO` e `NOME_DO_REPOSITORIO` pelos dados reais do repositório.

## 9. Fazer deploy na Vercel

Na Vercel:

1. Clique em `Add New Project`.
2. Importe o repositório do GitHub.
3. Configure o projeto como site estático.
4. Use as configurações:

```text
Framework Preset: Other
Build Command: vazio
Output Directory: vazio ou .
Install Command: vazio
```

5. Clique em `Deploy`.

Como o projeto não usa build, a Vercel publica os arquivos estáticos diretamente.

O arquivo `vercel.json` já está incluído para:

- publicar o projeto como site estático;
- manter URLs limpas;
- aplicar cache longo nos arquivos dentro de `assets/`.

Os arquivos `robots.txt` e `sitemap.xml` também estão na raiz para indexação básica.

## 10. Imagens

Os arquivos em `assets/img/` são placeholders SVG.

Troque pelas imagens reais da Gruta das Estrelas mantendo os mesmos nomes ou atualize os caminhos em:

```text
index.html
assets/css/style.css
```

## 11. Observações de segurança

- Não use `service_role` no frontend.
- A chave `anon` é pública, mas as regras de RLS no Supabase devem limitar o que ela pode fazer.
- A policy sugerida permite apenas insert de leads com `client_slug = 'gruta-das-estrelas'`.
- Para leitura dos leads, prefira consultar pelo painel do Supabase ou pela view `public.gruta_leads`.
