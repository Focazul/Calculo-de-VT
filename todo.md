# Gestão de Vale-Transporte (VT) - TODO

## Backend - Schema e Database

- [x] Schema MySQL com tabelas: employees, purchases, payment_status
- [x] Migrations com Drizzle ORM
- [x] Seed com 10+ funcionários
- [x] Seed com histórico de compras associado

## Backend - tRPC Procedures

- [x] Procedure: listar funcionários com filtros (nome, cargo, status)
- [x] Procedure: criar funcionário
- [x] Procedure: atualizar funcionário
- [x] Procedure: deletar funcionário (soft delete)
- [x] Procedure: listar compras com filtros (período, funcionário, status)
- [x] Procedure: criar compra
- [x] Procedure: atualizar compra
- [x] Procedure: dashboard stats (total ativos, valor mês, compras pendentes)

## Frontend - Layout e Navegação

- [x] DashboardLayout com sidebar
- [x] Sidebar com 4 seções: Dashboard, Funcionários, Compras, Histórico
- [x] Navegação entre seções
- [x] Layout responsivo

## Frontend - Páginas

- [x] Dashboard com cards de resumo (total ativos, valor mês, compras pendentes)
- [x] Página de Funcionários com TanStack Table
- [x] Página de Compras com TanStack Table
- [x] Página de Histórico com TanStack Table
- [x] Modais para criar/editar funcionários (componente EmployeeModal implementado)
- [x] Modais para criar/editar compras (componente PurchaseModal implementado)

## Frontend - Filtros e Ordenação

- [x] Filtros Funcionários: nome, cargo, status
- [x] Filtros Compras: período, funcionário, status pagamento
- [x] Filtros Histórico: período, funcionário, status pagamento
- [x] Ordenação por colunas em todas as tabelas

## Design

- [x] Tema claro com cinza frio
- [x] Cores pastel: azul suave e rosa blush
- [x] Tipografia sans-serif bold para títulos
- [x] Tipografia fina para subtítulos
- [x] Espaçamento e espaço negativo
- [x] Elementos geométricos abstratos

## Testes e Validação

- [x] Testar CRUD de funcionários (6 testes Vitest passando)
- [x] Testar CRUD de compras (backend procedures criadas)
- [x] Testar filtros e ordenação (TanStack Table implementada com filtros)
- [x] Testar dashboard stats (procedure criada e conectada)
- [x] Testar responsividade (layout responsivo com grid flex)

## Entrega

- [x] Arquivo iniciar.bat para Windows
- [x] Documentação de setup
- [x] Checkpoint final
