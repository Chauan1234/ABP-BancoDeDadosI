# Backend - Producao Fabrica

Instruções rápidas:

- Copie `.env.example` para `.env` e ajuste as variáveis de conexão com seu MySQL.
- Instale dependências e rode em modo de desenvolvimento:

```powershell
cd backend
npm install
npm run dev
```

Endpoints base (REST):

- `/api/fornecedores` - CRUD de fornecedores
- `/api/materias` - CRUD de matéria-prima
- `/api/fabricacoes` - CRUD de fabricação
- `/api/produtos` - CRUD de produtos
- `/api/mpf` - relações matéria-prima <-> fabricação
