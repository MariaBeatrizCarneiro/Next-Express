# Next.js + Express Project

Um projeto full-stack que combina Next.js para o frontend com Express.js para o backend, criando uma aplicação web completa para gestão de produtos.

## 🚀 Funcionalidades

- ✅ Listagem de produtos
- ✅ Adicionar novos produtos
- ✅ Editar produtos existentes
- ✅ Eliminar produtos
- ✅ Visualização detalhada de produtos
- ✅ Interface responsiva


## 🛠️ Tecnologias Utilizadas

- **Next.js** - Framework React para produção
- **Express.js** - Framework web para Node.js
- **React 19** - Biblioteca para interfaces de utilizador
- **TailwindCSS** - Framework CSS utilitário
- **CORS** - Middleware para Cross-Origin Resource Sharing
- **Nodemon** - Ferramenta de desenvolvimento para reinício automático


## 📁 Estrutura do Projeto

```
├── src/
│   ├── components/
│   │   ├── AdicionarProduto.jsx
│   │   ├── EditarProduto.jsx
│   │   ├── Footer.jsx
│   │   └── Navbar.jsx
│   ├── pages/
│   │   ├── _app.js
│   │   ├── _document.js
│   │   ├── index.js
│   │   ├── produtos.js
│   │   └── produto/[id].js
│   ├── services/
│   │   └── api.js
│   └── styles/
│       └── globals.css
├── public/
├── db.json
├── server.js
└── package.json
```


### 👩🏼‍💻 Passos para executar o projeto

1. **Instale as dependências e corra o projeto**
   ```bash
   npm install
   npm run dev
    ```

2. **Acesse a aplicação**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - API Backend: [http://localhost:3000/api](http://localhost:3000/api)


### Scripts Disponíveis

- `npm run dev` - Executa o servidor em modo desenvolvimento
- `npm run build` - Cria build de produção
- `npm start` - Executa o servidor em modo produção
- `npm run server` - Executa apenas o servidor Express


## 📡 API Endpoints

A aplicação inclui os seguintes endpoints da API:

- `GET /api/produtos` - Lista todos os produtos
- `GET /api/produto/:id` - Obtém detalhes de um produto específico
- `POST /api/produtos` - Adiciona um novo produto
- `PUT /api/produtos/:id` - Atualiza um produto existente
- `DELETE /api/produtos/:id` - Elimina um produto


## 🎨 Interface

A aplicação inclui as seguintes páginas:

- **Home** (`/`) - Página inicial
- **Produtos** (`/produtos`) - Lista e gestão de produtos
- **Detalhes do Produto** (`/produto/[id]`) - Visualização detalhada


# Tens um tutorial para fazeres este projeto do zero em `next_com_express.md`

