# Minha Biblioteca API

Bem-vindo à API do projeto "Minha Biblioteca"! Esta é uma API RESTful construída para gerenciar uma coleção pessoal de livros, permitindo que os usuários registrem os livros que leram, estão lendo ou pretendem ler, além de adicionar notas e avaliações.

## ✨ Sobre o Projeto

O objetivo desta API é ser o backend para uma aplicação de biblioteca pessoal. Ela gerencia usuários, livros, notas e avaliações, utilizando uma base de dados MongoDB para persistir as informações e autenticação via JWT para proteger as rotas.

## 🚀 Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript.
- **Express.js**: Framework para construção da API.
- **MongoDB**: Banco de dados NoSQL para armazenamento dos dados.
- **Mongoose**: ODM para modelar os dados da aplicação para o MongoDB.
- **JSON Web Token (JWT)**: Para autenticação e autorização de usuários.
- **bcryptjs**: Para criptografia de senhas.

## ⚙️ Como Executar

Siga os passos abaixo para configurar e executar o projeto localmente.

### Pré-requisitos

- [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
- [MongoDB](https://www.mongodb.com/try/download/community) (pode ser uma instância local ou um serviço como o MongoDB Atlas)

### Passos

1.  **Clone o repositório:**

    ```bash
    git clone <url-do-seu-repositorio>
    cd my-library-app/api
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    Crie um arquivo chamado `.env` na raiz da pasta `api/` e adicione as seguintes variáveis:

    ```env
    # String de conexão com o seu banco de dados MongoDB
    MONGO_URI=mongodb+srv://<user>:<password>@<cluster-url>/my-library?retryWrites=true&w=majority

    # Chave secreta para gerar os tokens JWT
    JWT_SECRET=sua_chave_secreta_super_segura

    # Porta em que o servidor irá rodar
    PORT=3000
    ```

4.  **Inicie o servidor:**
    ```bash
    npm start
    ```
    O servidor estará rodando em `http://localhost:3000`.

## Endpoints da API

Você pode encontrar uma coleção de requisições prontas no arquivo `.http` para testar os endpoints usando a extensão REST Client do VS Code.

### Autenticação (`/api/auth`)

- `POST /register`: Registra um novo usuário.
- `POST /login`: Autentica um usuário e retorna um token JWT.

### Livros (`/api/books`)

_(Requer autenticação)_

- `GET /`: Lista todos os livros na estante do usuário autenticado.
- `POST /`: Adiciona um novo livro à estante do usuário (usando o `googleBookId`).
- `GET /:id`: Busca um livro específico da estante pelo seu ID.
- `PUT /:id`: Atualiza o status de um livro (ex: "lendo" para "lido").
- `DELETE /:id`: Remove um livro da estante.
- `GET /search`: Pesquisa livros na API do Google Livros (não requer autenticação).

### Notas (`/api/book-notes`)

_(Requer autenticação)_

- `POST /:bookId/notes`: Adiciona uma nota a um livro específico.
- `GET /:bookId/notes`: Lista todas as notas de um livro específico.
- `DELETE /:bookId/notes/:noteId`: Remove uma nota de um livro.

### Avaliações (`/api/reviews`)

- `POST /`: Adiciona uma avaliação (rating e comentário) a um livro. _(Requer autenticação)_
- `GET /:googleBookId`: Lista todas as avaliações de um livro específico (não requer autenticação).

---

## ✅ Roadmap de Melhorias e Novas Funcionalidades

Esta seção serve como um guia para os próximos passos do projeto.

### Melhorias Essenciais (Fundação)

- [ ] **Validar os Dados de Entrada**: Implementar validação em todas as rotas que recebem dados para garantir a integridade e segurança.
- [ ] **Centralizar o Tratamento de Erros**: Criar um middleware de erro para padronizar as respostas de erro e limpar o código dos controllers.
- [ ] **Adicionar Camadas de Segurança Básicas**:
  - [ ] Utilizar `helmet` para adicionar cabeçalhos de segurança HTTP.
  - [ ] Utilizar `express-rate-limit` para proteger rotas de autenticação contra ataques de força bruta.
- [ ] **Refatorar para Camada de Serviço**: Separar a lógica de negócio (interação com o banco de dados) da lógica de HTTP (controllers), criando uma camada de `services`.

### Novas Funcionalidades (Evolução)

- [ ] **Paginação e Ordenação**: Adicionar paginação e opções de ordenação em rotas que retornam listas (ex: `GET /books`).
- [ ] **Prateleiras de Livros (Listas Personalizadas)**: Permitir que usuários criem e gerenciem suas próprias listas (ex: "Favoritos", "Lista de Desejos").
- [ ] **Progresso de Leitura**: Permitir que o usuário salve a página atual ou a porcentagem lida de um livro com status "lendo".
- [ ] **Estatísticas do Usuário**: Criar um endpoint que retorne estatísticas de leitura do usuário (livros lidos por ano, gêneros favoritos, etc.).
- [ ] **Perfil de Usuário**: Adicionar endpoints para o usuário visualizar e editar seu perfil (trocar senha, nome, etc.).

---
