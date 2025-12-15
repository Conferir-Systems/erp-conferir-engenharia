# Guia de Testes

Este documento descreve como configurar e executar testes de integração com banco de dados real.

## 📋 Índice

- [Arquitetura de Testes](#arquitetura-de-testes)
- [Configuração Inicial](#configuração-inicial)
- [Executando Testes](#executando-testes)
- [Escrevendo Testes](#escrevendo-testes)
- [Helpers de Teste](#helpers-de-teste)
- [Troubleshooting](#troubleshooting)

## 🏗️ Arquitetura de Testes

### Bancos de Dados

O projeto utiliza **um único container PostgreSQL** com **dois databases**:

- **conf** (porta 5432) - Banco de desenvolvimento
- **conf_test** (porta 5432) - Banco de testes

Ambos rodam no mesmo container PostgreSQL, mas são completamente isolados.

### Estrutura de Arquivos

```
backend/
├── src/
│   ├── test/
│   │   ├── setup.ts              # Configuração global dos testes
│   │   └── helpers/
│   │       ├── db-helpers.ts     # Funções auxiliares para testes
│   │       └── index.ts
│   ├── services/
│   │   └── __test__/
│   │       └── works/
│   │           └── createWork.integration.test.ts
│   └── database/
│       ├── db.ts                 # Conexão com banco (muda por ambiente)
│       ├── knexfile.ts           # Configurações de ambientes
│       └── migrations/           # Migrations (compartilhadas)
└── vitest.config.ts              # Configuração do Vitest
```

## ⚙️ Configuração Inicial

### 1. Variáveis de Ambiente

Certifique-se de que seu arquivo `.env` contém:

```bash
# Development Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=conf

# Test Database (mesmo container, database diferente)
DB_TEST_HOST=localhost
DB_TEST_PORT=5432
DB_TEST_USER=postgres
DB_TEST_PASSWORD=postgres
DB_TEST_NAME=conf_test
```

### 2. Iniciar o Ambiente

Execute o script de setup que criará ambos os bancos:

```bash
# Na raiz do projeto
./setup.sh
```

Ou manualmente:

```bash
# Iniciar containers
docker compose up -d

# Aguardar o postgres ficar healthy
docker compose ps conf-postgres

# Criar banco de testes (executado automaticamente pelo setup.sh)
docker exec -i conf-postgres psql -U postgres -d postgres <<-EOSQL
    SELECT 'CREATE DATABASE conf_test'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'conf_test')\gexec
EOSQL
```

### 3. Executar Migrations no Banco de Testes

```bash
cd backend
npm run db:test:setup
```

Isso executará todas as migrations no banco `conf_test`.

## 🚀 Executando Testes

### Comandos Disponíveis

```bash
# Executar todos os testes uma vez
npm test

# Executar testes em modo watch (re-executa ao salvar arquivos)
npm run test:watch

# Executar testes com coverage
npm run test:coverage
```

### Resetar Banco de Testes

Se precisar resetar o banco de testes:

```bash
# Rollback de todas migrations e re-executar
npm run db:test:reset
```

## ✍️ Escrevendo Testes

### Exemplo: Teste de Integração

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { createWork } from '../../works/works'
import { cleanDatabase, getWorkById } from '../../../test/helpers'

describe('createWork - Integration Tests', () => {
  // Limpar banco antes de cada teste
  beforeEach(async () => {
    await cleanDatabase()
  })

  it('should create work with all required fields', async () => {
    const params = {
      name: 'Obra Teste',
      address: 'Rua Teste, 123',
      code: 'OB-001',
      contractor: 'Construtora Teste',
      status: 'ATIVA',
    }

    const result = await createWork(params)

    expect(result).toMatchObject(params)

    // Verificar que foi salvo no banco
    const savedWork = await getWorkById(result.id)
    expect(savedWork).toMatchObject(params)
  })
})
```

### Boas Práticas

1. **Isolamento de Testes**
   - Use `beforeEach` para limpar o banco antes de cada teste
   - Não dependa da ordem de execução dos testes

2. **Nomenclatura**
   - Use `.integration.test.ts` para testes que usam banco de dados
   - Use `.test.ts` ou `.spec.ts` para testes unitários (com mocks)

3. **Assertions**
   - Verifique não só o retorno da função, mas também o estado do banco
   - Use `getWorkById()` ou helpers similares para confirmar persistência

4. **Performance**
   - Evite criar muitos dados desnecessários
   - Use `cleanDatabase()` ao invés de deletar manualmente

## 🛠️ Helpers de Teste

Localizados em `backend/src/test/helpers/db-helpers.ts`:

### `createTestWork(overrides?: Partial<Work>)`

Cria uma obra de teste no banco:

```typescript
const work = await createTestWork({
  name: 'Minha Obra',
  code: 'OB-123',
})
```

### `createTestWorks(count: number)`

Cria múltiplas obras de teste:

```typescript
const works = await createTestWorks(5) // Cria 5 obras
```

### `createTestUser(overrides?: Partial<User>)`

Cria um usuário de teste:

```typescript
const user = await createTestUser({
  name: 'João Silva',
  email: 'joao@example.com',
})
```

### `cleanDatabase()`

Limpa todas as tabelas:

```typescript
await cleanDatabase() // Remove todos os dados
```

### `getWorkById(id: string)`

Busca obra diretamente no banco:

```typescript
const work = await getWorkById('some-uuid')
```

### `getAllWorks()`

Retorna todas as obras do banco:

```typescript
const works = await getAllWorks()
expect(works).toHaveLength(3)
```

## 🐛 Troubleshooting

### Erro: "Work not found" nos testes

**Causa**: Banco de testes não tem as migrations aplicadas.

**Solução**:
```bash
npm run db:test:setup
```

### Erro: "Connection refused" no PostgreSQL

**Causa**: Container não está rodando ou não está healthy.

**Solução**:
```bash
docker compose ps
docker compose up -d conf-postgres
```

### Testes passam localmente mas falham em CI/CD

**Causa**: Variáveis de ambiente diferentes ou banco não configurado.

**Solução**:
- Verifique as variáveis de ambiente no CI
- Adicione step para criar o banco de testes
- Execute migrations antes dos testes

### Erro: "Database conf_test does not exist"

**Causa**: Banco de testes não foi criado.

**Solução**:
```bash
docker exec -i conf-postgres psql -U postgres -d postgres <<-EOSQL
    CREATE DATABASE conf_test;
EOSQL

npm run db:test:setup
```

### Testes muito lentos

**Possíveis causas**:
- Muitos dados sendo criados
- Limpeza de banco ineficiente
- Conexões de banco não sendo reutilizadas

**Soluções**:
- Use `cleanDatabase()` ao invés de criar/deletar manualmente
- Crie apenas os dados necessários para cada teste
- Verifique o pool de conexões no knexfile.ts

## 📚 Recursos Adicionais

- [Documentação do Vitest](https://vitest.dev/)
- [Documentação do Knex.js](https://knexjs.org/)
- [PostgreSQL Testing Best Practices](https://www.postgresql.org/docs/current/regress.html)
