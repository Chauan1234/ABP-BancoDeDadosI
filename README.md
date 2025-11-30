**Requisitos e instruções para rodar o projeto (Frontend + Backend)**

Resumo rápido
- O repositório contém duas pastas principais: `frontend/` (Next.js) e `backend/` (API Node/Express).
- O `frontend` faz chamadas HTTP para o `backend` através de `NEXT_PUBLIC_API_URL`.

1) Requisitos locais
1) Requisitos locais
- Node.js (recomendado >= 18)
- pnpm (opcional, mas o `frontend` usa `pnpm` no package.json). Você pode usar `npm` também.

Nota: este backend foi adaptado para usar um armazenamento em arquivo (`backend/data.json`) por padrão. Não é necessário ter um banco de dados instalado para rodar em desenvolvimento.

-- Backend (desenvolvimento local): `backend/.env`

  O backend agora usa `backend/data.json` como armazenamento por padrão. Você pode rodar sem configurar um banco.

  Exemplo mínimo `backend/.env`:

```
PORT=3001
FRONTEND_URL=http://localhost:3000
```

  Observação: se você quiser conectar um banco de dados externo no futuro, restaure `database/connection.js` e ajuste dependências.
- Backend (desenvolvimento local): `backend/.env`
  2. (Opcional) Configure `backend/.env` caso queira alterar porta ou origem do frontend.
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
