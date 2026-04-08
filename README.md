<div align="center">

# 📅 Week Page

### Sistema de Gestão de Palestras e Onboarding Corporativo

*Substitua planilhas e WhatsApp por uma plataforma centralizada com perfis de acesso diferenciados.*

<br/>

[![Deploy Frontend](https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://week-pag.vercel.app)
[![Deploy Backend](https://img.shields.io/badge/Backend-Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)](https://railway.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)

<br/>

**[🌐 Acessar Demo ao Vivo](https://week-pag.vercel.app)**

</div>

---

## 📌 O Problema

Empresas que realizam treinamentos, onboarding e eventos internos frequentemente gerenciam essa agenda por e-mail, planilhas ou WhatsApp. Isso gera:

- Facilitadores sem visibilidade clara da agenda do dia
- Gestores sem controle centralizado do status de cada evento
- Participantes sem acesso fácil a detalhes das palestras
- Ausência de histórico e rastreabilidade

O **Week Page** resolve isso com dois perfis de acesso distintos em uma única plataforma:

| Perfil | Acesso | Função |
|---|---|---|
| **Gestor / Admin** | Painel protegido (JWT) | Cria, edita, exclui e monitora palestras |
| **Facilitador / Participante** | Tela pública | Consulta a agenda do dia e confirma presença |

---

## ✨ Funcionalidades

### 🔐 Painel Administrativo
- CRUD completo de palestras
- Filtros por status (`confirmado`, `atenção`, `pendente`), data e busca textual
- Alternância entre **visão de lista** e **calendário semanal**
- Gestão de responsabilidades de onboarding com flag de criticidade
- Indicador visual de status geral da agenda
- Autenticação JWT com **sessão persistente** (reload sem logout)

### 📋 Tela de Onboarding (pública)
- Timeline das palestras do dia com horário, local e facilitador
- Página de detalhe com carga horária, público-alvo e descrição
- Confirmação de presença pelo facilitador

---

## 🏗️ Arquitetura

### Fluxo de dados — Frontend

```
┌─────────────────────────────────────────────────┐
│                  COMPONENTE REACT                │
│  (nunca chama a API diretamente)                 │
└───────────────────────┬─────────────────────────┘
                        │ chama ações do store
┌───────────────────────▼─────────────────────────┐
│               STORE — Zustand                    │
│  usePalestraStore | useAuthStore | useThemeStore │
└───────────────────────┬─────────────────────────┘
                        │ delega chamadas HTTP
┌───────────────────────▼─────────────────────────┐
│              SERVICE LAYER                       │
│  palestraService | authService                   │
│  + adapter: toFrontend() / toBackend()           │
└───────────────────────┬─────────────────────────┘
                        │ HTTP / REST
┌───────────────────────▼─────────────────────────┐
│              API — Express 5 (Backend)           │
│  /api/palestras | /api/responsabilidades         │
│  /api/auth                                       │
└───────────────────────┬─────────────────────────┘
                        │ Prisma ORM
┌───────────────────────▼─────────────────────────┐
│              MySQL — Railway                     │
│  palestras | responsabilidades | usuarios        │
└─────────────────────────────────────────────────┘
```

### Estrutura de pastas

```
week-page/
├── Backend/
│   ├── src/
│   │   ├── controllers/       # Lógica de negócio por entidade
│   │   ├── middleware/        # authMiddleware (JWT) + errorHandler
│   │   ├── routes/            # Endpoints por recurso
│   │   └── validators/        # Schemas Zod para validação de entrada
│   └── prisma/
│       ├── schema.prisma      # Modelos do banco com índices
│       └── seed.ts            # Seed para popular o banco
└── Frontend/
    └── src/
        ├── app/components/    # Componentes de feature (AgendaCard, Modal, etc.)
        ├── pages/             # Telas (Onboarding, Admin, Login, EventoDetail)
        ├── routes/            # Roteamento + PrivateRoute com redirect
        ├── services/          # Camada HTTP + adapter pattern
        ├── stores/            # Zustand stores com ações assíncronas
        └── types/             # Tipos TypeScript globais
```

---

## 🛠️ Stack Completa

### Frontend

| Tecnologia | Versão | Propósito |
|---|---|---|
| React | 18 | Framework principal |
| TypeScript | 5 | Type safety |
| Vite | 6 | Build tool |
| Zustand | 5 | Gerenciamento de estado global |
| React Router DOM | 7 | Roteamento + proteção de rotas |
| Radix UI + Shadcn | latest | Componentes acessíveis/headless |
| Tailwind CSS | 4 | Estilização por utilitários |
| React Hook Form | 7 | Formulários performáticos |
| react-day-picker | 9 | Seleção de datas |

### Backend

| Tecnologia | Versão | Propósito |
|---|---|---|
| Node.js + Express | 5 | Servidor HTTP |
| TypeScript | 5 | Type safety |
| Prisma ORM | 6 | Acesso tipado ao banco |
| MySQL | - | Banco de dados relacional |
| JSON Web Token | 9 | Autenticação stateless |
| bcrypt | 6 | Hash seguro de senhas |
| Zod | 4 | Validação de dados de entrada |

---

## 🔧 Diferenciais Técnicos

| Diferencial | Detalhe |
|---|---|
| **Arquitetura em camadas** | Componentes nunca chamam a API diretamente — sempre via Store → Service |
| **Adapter pattern** | `toFrontend()` / `toBackend()` no service layer resolve inconsistências de enum entre banco e UI (`atencao` ↔ `atenção`) |
| **Zustand assíncrono** | Stores com `async/await` nativas, sem middleware adicional |
| **JWT + bcrypt do zero** | Sem libs de autenticação prontas (NextAuth, Passport, etc.) |
| **Zod em todos os controllers** | Dados nunca chegam sujos ao banco — validação na borda da API |
| **TypeScript ponta a ponta** | Frontend e backend 100% tipados |
| **CORS com whitelist** | Origens permitidas configuradas explicitamente (localhost + produção) |
| **PrivateRoute** | Proteção de rota no frontend com redirect automático para `/login` |
| **Índices no Prisma** | `@@index([status])`, `@@index([data])`, `@@index([email])` nos campos de busca frequente |
| **Seed script** | `npm run db:seed` popula o banco em qualquer ambiente sem configuração manual |

---

## 🚀 Como Rodar Localmente

### Pré-requisitos

- Node.js 18+
- MySQL rodando localmente (porta 3306)

### 1. Backend

```bash
cd Backend

# Copie e preencha as variáveis de ambiente
cp .env.example .env
# Edite .env: DATABASE_URL, JWT_SECRET, JWT_EXPIRES_IN, PORT

# Instale as dependências
npm install

# Rode as migrations e popule o banco
npm run prisma:migrate
npm run db:seed

# Inicie o servidor de desenvolvimento
npm run dev
# Servidor rodando em http://localhost:3001
```

### 2. Frontend

```bash
cd Frontend

# Copie e preencha as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local: VITE_API_URL=http://localhost:3001

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
# Acesse http://localhost:5173
```

### 🔑 Credenciais de Teste

```
Email:  admin@weekpage.com
Senha:  admin123
```

---

## 📡 Endpoints da API

| Método | Endpoint | Auth | Descrição |
|---|---|---|---|
| `POST` | `/api/auth/login` | ❌ | Login e geração do token JWT |
| `GET` | `/api/auth/me` | ✅ | Dados do usuário autenticado |
| `GET` | `/api/palestras` | ❌ | Lista todas as palestras |
| `GET` | `/api/palestras/:id` | ❌ | Busca palestra por ID |
| `POST` | `/api/palestras` | ✅ | Cria nova palestra |
| `PUT` | `/api/palestras/:id` | ✅ | Atualiza palestra |
| `DELETE` | `/api/palestras/:id` | ✅ | Remove palestra |
| `GET` | `/api/palestras/filter` | ❌ | Filtra por status, data e texto |
| `GET` | `/api/palestras/search` | ❌ | Busca por título/local/público |
| `GET` | `/api/responsabilidades` | ✅ | Lista responsabilidades |
| `POST` | `/api/responsabilidades` | ✅ | Cria responsabilidade |
| `PATCH` | `/api/responsabilidades/:id` | ✅ | Marca como completo/incompleto |
| `DELETE` | `/api/responsabilidades/:id` | ✅ | Remove responsabilidade |

---

## 📦 Deploy

| Camada | Plataforma | URL |
|---|---|---|
| Frontend | Vercel | [week-pag.vercel.app](https://week-pag.vercel.app) |
| Backend | Railway | Endpoint privado |
| Banco de dados | Railway — MySQL | Gerenciado |

---

## 👨‍💻 Autor

<div align="center">

Desenvolvido por **Cairo Carneiro**

[![GitHub](https://img.shields.io/badge/GitHub-Cairo--Carneiro-181717?style=for-the-badge&logo=github)](https://github.com/Cairo-Carneiro)

</div>
