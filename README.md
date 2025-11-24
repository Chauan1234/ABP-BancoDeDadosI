**Requisitos e instruções para rodar o projeto (Frontend + Backend)**

Resumo rápido
- O repositório contém duas pastas principais: `frontend/` (Next.js) e `backend/` (API Node/Express).
- O `frontend` faz chamadas HTTP para o `backend` através de `NEXT_PUBLIC_API_URL`.

1) Requisitos locais
- Node.js (recomendado >= 18)
- pnpm (opcional, mas o `frontend` usa `pnpm` no package.json). Você pode usar `npm` também.
- MySQL (se você for manter o backend como está).

2) Estrutura importante
- `frontend/` — aplicação Next.js que chama a API.
- `backend/` — servidor Express/Node que fala com um banco SQL (atualmente MySQL). Este servidor precisa estar rodando (ou deployado) e expor endpoints públicos para o frontend chamar.

3) Onde colocar as variáveis de ambiente
- Frontend (desenvolvimento local): `frontend/.env.local`
  - Use apenas para variáveis públicas/voltadas ao cliente (ex.: `NEXT_PUBLIC_API_URL`).
  - Exemplo `frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

- Backend (desenvolvimento local): `backend/.env`
  
  Exemplo `backend/.env` (MySQL):

```
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=senha_local
MYSQL_DATABASE=producaofabrica
PORT=3001
```


4) Rodando localmente (passo-a-passo)

- Backend (dev)
  1. Abra um terminal na pasta `backend/`.
  2. Instale dependências:

```powershell
cd backend
npm install
```

  3. Configure `backend/.env` com as variáveis do seu banco local.
  4. Inicie o servidor:

```powershell
node server.js
# ou se usar script npm: npm run dev
```

- Frontend (dev)
  1. Abra outro terminal na pasta `frontend/`.
  2. Instale dependências:

```powershell
cd frontend
pnpm install
pnpm dev
# ou com npm: npm install && npm run dev
```


5) CORS e segurança
- Se o frontend e backend estiverem em domínios diferentes, o `backend` deve habilitar CORS para a origem do frontend. Exemplo em `backend/server.js`:

```js
const cors = require('cors');
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
```
