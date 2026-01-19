# 📅 Week Page - Agenda Semanal de Palestras

> Sistema completo de gerenciamento de palestras e responsabilidades com visualização em lista e calendário

[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB)](https://reactjs.org/)
[![Zustand](https://img.shields.io/badge/Zustand-State-orange)](https://github.com/pmndrs/zustand)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)](https://tailwindcss.com/)

## ✨ Funcionalidades

### 📊 Gerenciamento de Palestras
- ✅ **CRUD Completo**: Criar, editar, visualizar e deletar palestras
- 🔍 **Busca Inteligente**: Busca em tempo real com debounce (500ms)
- 🎯 **Filtros por Status**: Confirmado, Atenção, Pendente
- 📋 **Visualização em Lista**: Cards detalhados com todas as informações
- 📅 **Visualização em Calendário**: Grid semanal (Segunda a Sexta)
- 💾 **Persistência Local**: Dados salvos automaticamente no localStorage

### ✅ Gerenciamento de Responsabilidades
- ➕ **Adicionar Responsabilidades**: Formulário inline rápido
- ⚠️ **Marcar como Crítico**: Destaque visual para itens importantes
- ☑️ **Toggle Completo/Incompleto**: Checkbox interativo
- 🗑️ **Deletar**: Remoção rápida de itens

### 🎨 Interface e UX
- 🌓 **Dark Mode**: Alternância entre tema claro e escuro
- 🔔 **Notificações Toast**: Feedback visual para todas as ações
- ⏳ **Loading States**: Indicadores de carregamento
- 📭 **Empty States**: Mensagens úteis quando não há dados
- ✅ **Validação de Formulários**: Validação em tempo real
- 📱 **Design Responsivo**: Funciona em desktop e mobile

## 🚀 Tecnologias

- **React 18** - Biblioteca UI
- **TypeScript** - Type safety
- **Vite** - Build tool e dev server
- **Zustand** - State management
- **React Hook Form** - Form handling
- **Radix UI** - Componentes acessíveis
- **Tailwind CSS** - Styling
- **Lucide React** - Ícones
- **Sonner** - Toast notifications

## 📦 Instalação

```bash
# Clone o repositório
git clone <repository-url>

# Entre na pasta do frontend
cd week-page/Frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O app estará disponível em `http://localhost:5173`

## 🏗️ Estrutura do Projeto

```
Frontend/src/
├── app/
│   ├── components/          # Componentes React
│   │   ├── AgendaCard.tsx
│   │   ├── WeeklyCalendar.tsx
│   │   ├── PalestraFormModal.tsx
│   │   ├── FilterBar.tsx
│   │   └── ...
│   └── App.tsx             # Componente principal
├── data/
│   └── mockData.ts         # Dados mockados
├── hooks/
│   ├── useDebounce.ts      # Hooks customizados
│   └── useLocalStorage.ts
├── services/
│   ├── palestraService.ts  # Serviços mock
│   └── responsibilityService.ts
├── stores/
│   ├── usePalestraStore.ts      # Zustand stores
│   ├── useResponsibilityStore.ts
│   └── useThemeStore.ts
├── types/
│   └── types.ts            # TypeScript types
└── utils/
    ├── dateUtils.ts        # Utilitários
    ├── localStorage.ts
    └── toast.ts
```

## 🎯 Como Usar

### Criar uma Palestra
1. Clique em "Nova Palestra"
2. Preencha o formulário:
   - Título
   - Dia da semana
   - Data (DD/MM)
   - Horário
   - Local
   - Público
   - Status
   - Observações (opcional)
3. Clique em "Criar Palestra"

### Editar uma Palestra
1. Clique no ícone ⋮ no card da palestra
2. Selecione "Editar"
3. Modifique os campos desejados
4. Clique em "Salvar Alterações"

### Deletar uma Palestra
1. Clique no ícone ⋮ no card da palestra
2. Selecione "Deletar"
3. Confirme a ação

### Filtrar Palestras
- Use a barra de busca para procurar por título, local ou público
- Clique nos botões de status para filtrar
- Clique em "Limpar filtros" para resetar

### Alternar Visualizações
- Clique em "Lista" para visualização em cards
- Clique em "Calendário" para visualização semanal

### Navegar no Calendário
- Use ← e → para navegar entre semanas
- Clique em "Hoje" para voltar à semana atual
- Clique em uma palestra para editá-la

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 🌐 Integração com Backend

O projeto está preparado para integração com backend. Para conectar:

### 1. Substituir Serviços Mock

Em `services/palestraService.ts` e `services/responsibilityService.ts`:

```typescript
// Antes (Mock)
export const getAll = async (): Promise<Palestra[]> => {
  await delay(300);
  return loadFromStorage(STORAGE_KEY) || mockPalestras;
};

// Depois (API Real)
export const getAll = async (): Promise<Palestra[]> => {
  const response = await fetch('/api/palestras');
  if (!response.ok) throw new Error('Failed to fetch');
  return response.json();
};
```

### 2. Adicionar Autenticação

- Implementar login real em `login/login.tsx`
- Armazenar JWT tokens
- Adicionar rotas protegidas

### 3. Remover localStorage

- Usar backend como fonte de verdade
- Manter apenas para preferências de tema

## 📝 Tipos de Dados

### Palestra
```typescript
interface Palestra {
  id: string;
  dia: string;           // "Segunda-feira"
  data: string;          // "13/01"
  horario: string;       // "09:00 - 11:00"
  titulo: string;
  local: string;
  publico: string;
  status: 'confirmado' | 'atenção' | 'pendente';
  observacao?: string;
}
```

### Responsabilidade
```typescript
interface Responsabilidade {
  id: string;
  texto: string;
  critico: boolean;
  completo: boolean;
}
```

## 🎨 Customização

### Cores de Status
Edite em `tailwind.config.js` ou nos componentes:
- **Confirmado**: Verde (#10b981)
- **Atenção**: Amarelo (#f59e0b)
- **Pendente**: Vermelho (#ef4444)

### Tema
O tema é gerenciado pelo `useThemeStore` e persiste no localStorage.

## 🐛 Troubleshooting

### Dados não persistem
- Verifique se o localStorage está habilitado no navegador
- Limpe o cache e recarregue a página

### Filtros não funcionam
- Certifique-se de que há palestras cadastradas
- Verifique se os dados têm o formato correto

### Calendário não mostra palestras
- Verifique se as datas estão no formato "DD/MM"
- Certifique-se de estar na semana correta

## 📄 Licença

Este projeto foi desenvolvido como parte de um sistema de gerenciamento de palestras.

## 👥 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte, abra uma issue no repositório ou entre em contato com a equipe de desenvolvimento.

---

**Desenvolvido com ❤️ usando React + TypeScript + Zustand**