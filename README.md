# My Library App

Repositório monorepo com dois subprojetos principais:

- **`api/`** → backend (Node.js, Express, MongoDB, etc.)
- **`app/`** → frontend (React)



## 🚀 Como começar

Clone o repositório e acesse a pasta:

```bash
git clone https://github.com/vitorhenrique-rgt/my-library-app.git
cd my-library-app
```
## 📦 Instalação de dependências

Cada subprojeto possui suas próprias dependências.
É necessário instalar separadamente:
```
cd api
npm install
```
```
cd ../app
npm install
```
## 🖥️ Scripts no diretório raiz

Para facilitar o desenvolvimento, existe um package.json na raiz que centraliza os comandos:

Comando	Descrição
npm run api	Sobe apenas o backend (api/) em modo de desenvolvimento.
npm run app	Sobe apenas o frontend (app/).
npm run dev	Sobe backend + frontend em paralelo.

## 📂 Estrutura de pastas
```
my-library-app/
│
├── api/             # Backend (Express + MongoDB)
│   ├── src/
│   └── package.json
│
├── app/             # Frontend (React)
│   ├── src/
│   └── package.json
│
├── package.json     # Scripts globais para rodar api/app
└── README.md
```

## ✅ Pré-requisitos

- Node.js
 (>= 18 recomendado)

- npm (ou Yarn/pnpm, se preferir adaptar os scripts)

## 🤝 Contribuindo

1. Faça um fork do projeto

2. Crie uma branch (git checkout -b feature/minha-feature)

3. Commit suas alterações (git commit -m 'feat: minha nova feature')

4. Envie para o repositório (git push origin feature/minha-feature)

5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT
.
