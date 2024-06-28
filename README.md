# Zhavia Marketplace

<p align="center" width="100%">
    <img width="25%" src="https://www.vectorlogo.zone/logos/reactjs/reactjs-ar21.svg" alt="Node.js Logo">
    <img width="15%" src="https://www.svgrepo.com/show/354112/nextjs.svg" alt="Express.js Logo">
</p>

## Descrição

Este é um projeto de frontend utilizando React e NextJS. Ele inclui a configuração inicial do projeto, componentes
básicos e rotas para manipulação de dados em um backend.

## Estrutura do Projeto

```
project-root/
├── public/
├── src/
│   ├── app/
│   │   ├── (pages)/
│   │   │   ├── auth/
│   │   │   │   ├── signin/
│   │   │   │   └── signup/
│   │   │   ├── dashboard/
│   │   │   ├── products/
│   │   │   └── users/
│   │   ├── actions/
│   │   ├── api/
│   │   ├── auth/
│   │   ├── hooks/
│   │   ├── providers/
│   │   │   ├── auth/
│   │   │   ├── data/
│   │   │   ├── query/
│   │   │   └── store/
│   │   ├── services/
│   │   │   └── api/
│   │   ├── favicon.ico
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── config/
│   │   ├── app/
│   │   └── mantine/
│   ├── shared/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── types/
│   │   └── validators/
│   ├── store/
│   │   ├── reducers/
│   │   └── slices/
│   │   ├── index.ts
│   │   ├── types.ts
│   │   ├── auth.ts
│   │   └── middleware.ts
│   ├── .env.local
│   └── ...
├── Dockerfile
├── docker-compose.yml
└── ...
```

## Pré-requisitos

- Node.js (v14 ou superior)
- npm ou yarn (Recomendado v4+, instruções de instalação logo abaixo)
- Banco de dados MySQL
- Docker (apenas para inicialização rápida)
- Docker Compose (apenas para inicialização rápida)

### Instalação do Yarn

Unix/macOS (Necessário ter o Node.js instalado):

```bash
corepack enable && corepack prepare yarn@stable --activate
```

## Build e Execução

- **Observação**: Suba o backend antes de executar o frontend.

### 1. Comando Unificado (clone, instalação de dependências, build e execução)

```bash
git clone https://github.com/thoggs/zhavia-marketplace-frontend.git && cd zhavia-marketplace-frontend && yarn && yarn build && yarn start
```

### 2. Acesse o Projeto:

> O projeto estará disponível em http://localhost:3000

## Inicialização Rápida

Subir o projeto com Docker:

### 1. Comando Unificado (clone e docker-compose)

- **Observação**: Suba o backend antes de executar o frontend.

```bash
git clone https://github.com/thoggs/zhavia-marketplace-frontend.git && cd zhavia-marketplace-frontend && docker-compose up -d
```

### 2. Acesse o Projeto:

> O projeto estará disponível em http://localhost:3000

## Configuração para Desenvolvimento

### Passo 1: Clonar o Repositório

```bash
git clone https://github.com/thoggs/zhavia-marketplace-frontend.git && cd zhavia-marketplace-frontend
```

### Passo 2: Instalar Dependências

```bash
npm install
# ou
yarn install
```

### Passo 3: Configurar Variáveis de Ambiente

Crie ou edite o arquivo `.env.local` na raiz do projeto e adicione suas configurações do banco de dados:

```env
# App configuration
NEXT_PUBLIC_BASE_URL=http://localhost:8083
NEXT_TELEMETRY_DISABLED=1

# Auth configuration
AUTH_TRUST_HOST=true
AUTH_SECRET=nextjs_secret
AUTH_GITHUB_ID=sua_id_do_github
AUTH_GITHUB_SECRET=sua_senha_do_github
```

### Passo 5: Rodar o Projeto

Para rodar o projeto em modo de desenvolvimento:

```bash
yarn dev
# ou
npm run dev
```

Para rodar o projeto em modo de produção:

```bash
npm run build
# ou
yarn build
yarn start
```

## Tecnologias Utilizadas

- **Next.js**: Runtime JavaScript
- **React**: Biblioteca JavaScript
- **TypeScript**: Superconjunto tipado de JavaScript
- **Axios**: Cliente HTTP para Node.js
- **Docker**: Plataforma de contêineres
- **Docker Compose**: Orquestrador de contêineres
- **Mantine**: Componentes React
- **React Query**: Biblioteca de gerenciamento de estado
- **Redux Toolkit**: Biblioteca de gerenciamento de estado

## License

Project license [Apache-2.0](https://opensource.org/license/apache-2-0)