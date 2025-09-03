# Game App - Monorepo Setup

## ✅ Estrutura Implementada

### Monorepo
- **Raiz**: Configurado com npm workspaces
- **Workspaces**: 
  - `apps/web` - Frontend Next.js
  - `apps/api` - Backend Express + TypeScript
  - `packages/shared` - Tipos e esquemas compartilhados

### Backend API (Express + TypeScript + Prisma)
- **URL**: http://localhost:9999
- **Banco**: SQLite local (`dev.db`)
- **Autenticação**: JWT
- **Validação**: Zod (do pacote shared)

#### Endpoints Implementados:
- `GET /health` - Health check
- `POST /auth/register` - Cadastro de usuário
- `POST /auth/login` - Login de usuário
- `GET /records/me` - Records do usuário (autenticado)
- `POST /records` - Criar novo record (autenticado)
- `GET /records/leaderboard` - Ranking global

### Frontend (Next.js + TypeScript)
- **URL**: http://localhost:3000
- **Variável de ambiente**: `NEXT_PUBLIC_API_URL=http://localhost:9999`
- **Dependência**: `@game-app/shared` para tipos compartilhados

### Pacote Shared
- **Tipos**: User, RecordEntry, UserId
- **Esquemas Zod**: registerSchema, loginSchema, recordCreateSchema
- **Constantes**: GAME_NAME, DEFAULT_LEADERBOARD_LIMIT
- **Utils**: formatScore

## 🚀 Como usar

### Desenvolvimento
```bash
# Na raiz do projeto
npm install                    # Instala todas as dependências
npm run dev                    # Roda web + api em paralelo (recomendado rodar separadamente)

# Ou executar separadamente:
npm --workspace api run dev    # API em http://localhost:9999
npm --workspace web run dev    # Web em http://localhost:3000
```

### Scripts Disponíveis
```bash
npm run build                  # Build de todos os projetos
npm run typecheck             # Type checking de todos os projetos
npm run lint                  # Lint de todos os projetos
```

### Banco de Dados
```bash
npm --workspace api run prisma:migrate    # Rodar migrações
npm --workspace api run prisma:studio     # Visualizar dados
npm --workspace api run prisma:generate   # Gerar Prisma Client
```

## 🧪 Teste da API

### Registrar usuário:
```bash
curl -X POST http://localhost:9999/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456","name":"Test User"}'
```

### Login:
```bash
curl -X POST http://localhost:9999/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'
```

### Health check:
```bash
curl http://localhost:9999/health
```

## 📂 Estrutura de Arquivos

```
game-app/
├── package.json              # Monorepo config
├── apps/
│   ├── web/                  # Next.js app
│   │   ├── .env.local        # NEXT_PUBLIC_API_URL
│   │   └── package.json      # Depende de @game-app/shared
│   └── api/                  # Express API
│       ├── .env              # PORT, JWT_SECRET, DATABASE_URL
│       ├── package.json      # Depende de @game-app/shared
│       ├── prisma/
│       │   └── schema.prisma # Modelos User e Record
│       └── src/
│           ├── index.ts      # Entry point
│           ├── server.ts     # Express app
│           ├── env.ts        # Environment config
│           ├── prisma.ts     # Prisma client
│           ├── auth/         # JWT + bcrypt + guards
│           ├── routes/       # Auth + Records routes
│           └── middlewares/  # Error handler
└── packages/
    └── shared/               # Tipos e esquemas compartilhados
        ├── package.json
        ├── src/
        │   ├── types.ts      # User, RecordEntry
        │   ├── schemas.ts    # Zod schemas
        │   ├── constants.ts  # Constantes
        │   └── utils.ts      # Funções utilitárias
        └── dist/             # Compiled JS/TS
```

## ✅ Validação Final

O monorepo está funcionando corretamente com:
1. ✅ API rodando em http://localhost:9999 
2. ✅ Frontend rodando em http://localhost:3000
3. ✅ Banco SQLite configurado e migrado
4. ✅ Endpoints de autenticação funcionais
5. ✅ Endpoints de records funcionais  
6. ✅ Pacote shared integrado em ambos os projetos
7. ✅ Scripts npm para desenvolvimento e build
8. ✅ TypeScript configurado em todos os projetos

🎉 **Projeto organizado e pronto para desenvolvimento!**
# Speed-Color-Game
