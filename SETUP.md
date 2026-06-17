# Gestão de Vale-Transporte (VT) - Guia de Setup

## 📋 Requisitos

- **Node.js** 18+ (https://nodejs.org/)
- **pnpm** (gerenciador de pacotes) - instale com: `npm install -g pnpm`
- **MySQL** ou **TiDB** (banco de dados)

## 🚀 Início Rápido (Windows)

### Opção 1: Usar o arquivo `iniciar.bat` (Recomendado)

1. Abra o explorador de arquivos e navegue até a pasta do projeto
2. Clique duas vezes no arquivo `iniciar.bat`
3. O script irá:
   - Verificar se pnpm e Node.js estão instalados
   - Instalar as dependências (primeira execução)
   - Iniciar o servidor de desenvolvimento em uma janela separada
   - Aguardar 8 segundos para o servidor estar pronto
   - Abrir o navegador automaticamente em `http://localhost:3000`
   - **Deixe a janela do terminal aberta enquanto usa o sistema**

### Opção 2: Iniciar Manualmente (Terminal)

```bash
# 1. Instalar dependências
pnpm install

# 2. Iniciar o servidor de desenvolvimento
pnpm run dev

# 3. Abra no navegador
http://localhost:3000
```

**Importante:** Deixe o terminal aberto enquanto usa o sistema. O servidor precisa estar rodando.

## 🗄️ Banco de Dados

**O banco já está configurado e populado com dados de teste!**

### Dados Iniciais
- ✅ 11 funcionários com dados completos
- ✅ 25 compras de VT registradas
- ✅ Histórico pronto para visualizar

### Se precisar resetar os dados:

```bash
# 1. Executar migrations
pnpm db:push

# 2. Popular com dados de teste
node seed.mjs
```

## 📁 Estrutura do Projeto

```
gestao-vt/
├── client/              # Frontend React
│   ├── src/
│   │   ├── pages/      # Páginas (Dashboard, Employees, Purchases, History)
│   │   ├── components/ # Componentes reutilizáveis
│   │   ├── types/      # Tipos TypeScript
│   │   └── index.css   # Estilos globais (tema escandinavo)
│   └── index.html
├── server/              # Backend Express + tRPC
│   ├── routers.ts      # Procedures tRPC
│   ├── db.ts           # Query helpers
│   └── _core/          # Configuração interna
├── drizzle/            # Schema e migrations
│   └── schema.ts       # Definição das tabelas
├── seed.mjs            # Script para popular dados
├── iniciar.bat         # Script para iniciar no Windows
└── package.json
```

## 🎨 Design

O projeto utiliza um **design escandinavo minimalista** com:

- **Tema claro** com cinza frio (background)
- **Cores pastel**: azul suave e rosa blush como acentos
- **Tipografia**: sans-serif bold para títulos, fina para subtítulos
- **Espaçamento generoso** e espaço negativo
- **Elementos geométricos abstratos** para interesse visual

## 📊 Funcionalidades Implementadas

### Dashboard
- Cards com resumo: total de funcionários ativos, valor total do mês, compras pendentes

### Funcionários
- Tabela TanStack com filtros por nome, cargo e status
- Ordenação por colunas
- Status: Ativo, Inativo, Desligado

### Compras
- Tabela de compras semanais
- Filtros por período e status de pagamento
- Valores e quantidade de passes

### Histórico
- Histórico completo de compras
- Filtros avançados por período, funcionário e status

## 🔧 Desenvolvimento

### Adicionar Nova Página

1. Crie o arquivo em `client/src/pages/NomePagina.tsx`
2. Adicione a rota em `client/src/App.tsx`
3. Adicione o menu item em `client/src/components/DashboardLayout.tsx`

### Adicionar Nova Procedure tRPC

1. Crie a função helper em `server/db.ts`
2. Adicione a procedure em `server/routers.ts`
3. Use no frontend com `trpc.feature.useQuery()` ou `trpc.feature.useMutation()`

### Estilizar Componentes

- Use as classes Tailwind CSS disponíveis
- Customize cores usando as variáveis CSS em `client/src/index.css`
- Mantenha o tema escandinavo minimalista

## 📦 Dependências Principais

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **TanStack Table** - Tabelas avançadas
- **tRPC** - Type-safe API
- **Drizzle ORM** - Database ORM
- **Express** - Backend server
- **Vite** - Build tool

## 🐛 Troubleshooting

### Erro: "pnpm não está instalado"
```bash
npm install -g pnpm
```

### Erro: "DATABASE_URL não configurada"
Verifique o arquivo `.env` e certifique-se que a string de conexão está correta.

### Erro: "Port 3000 já está em uso"
Altere a porta no arquivo `server/_core/index.ts` ou mate o processo usando a porta 3000:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

## 📝 Próximos Passos

1. Customizar cores e fontes conforme necessário
2. Adicionar validações de formulário
3. Implementar modais para criar/editar funcionários e compras
4. Adicionar exportação para Excel
5. Implementar autenticação de usuários
6. Adicionar notificações e alertas

## 📧 Suporte

Para dúvidas ou problemas, consulte a documentação:
- [React](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TanStack Table](https://tanstack.com/table)
- [tRPC](https://trpc.io)
- [Drizzle ORM](https://orm.drizzle.team)

---

**Desenvolvido com ❤️ para gestão eficiente de Vale-Transporte**
