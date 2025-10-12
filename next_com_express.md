# 🧾 Projeto Loja Online com Next.js + Express.js Integrados

Abre o terminal na pasta onde queres adicionar o projeto (nunca numa cloud: Google Drive, OneDrive, ...):

```bash
npx create-next-app@latest next-express-project --tailwind --no-app --eslint --src-dir --import-alias "@/*"
```

Depois:

* ✔ Would you like to use TypeScript? … No
* ✔ Would you like to use Turbopack? (recommended) … No

---

## ⚙️ 1️⃣ Instalar dependências e configurar scripts

Depois de criares a app, executa:

```bash
cd next-express-project
npm install express cors next
npm install -D nodemon
```

No ficheiro `package.json`, **substitui** os scripts pelos seguintes para integrar Next.js com Express:

```json
{
  "scripts": {
    "dev": "nodemon server.js",
    "build": "next build",
    "start": "NODE_ENV=production node server.js",
    "server": "nodemon server.js"
  }
}
```

Agora **só precisas de um terminal** para correr tudo:

```bash
npm run dev
```

---

## 🧠 2️⃣ Servidor Express + Next.js integrados (`server.js`)

Cria o ficheiro `server.js` na **raiz do projeto** que integra Express com Next.js:

```javascript
const express = require('express');
const next = require('next');
const cors = require('cors');
const fs = require('fs');
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const app = express();
app.use(cors());
app.use(express.json());

// ===== BASE DE DADOS LOCAL =====
const DB_FILE = './db.json';

function lerDaBD() {
  if (!fs.existsSync(DB_FILE)) return [];
  const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  return data.produtos || [];
}

function guardarNaBD(produtos) {
  const data = { produtos };
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// ===== ROTAS DA API REST =====

// GET /api/produtos - Carregar todos os produtos
app.get('/api/produtos', (req, res) => {
  res.json(lerDaBD());
});

// GET /api/produtos/:id - Carregar um produto específico por ID
app.get('/api/produtos/:id', (req, res) => {
  const produtos = lerDaBD();
  const produto = produtos.find(p => p.id === parseInt(req.params.id));
  if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });
  res.json(produto);
});

// POST /api/produtos - Criar novo produto
app.post('/api/produtos', (req, res) => {
  const produtos = lerDaBD();
  const { nome, preco } = req.body;
  
  const novoProduto = {
    id: produtos.length ? produtos[produtos.length - 1].id + 1 : 1,
    nome,
    preco: parseFloat(preco),
  };
  
  produtos.push(novoProduto);
  guardarNaBD(produtos);
  res.status(201).json(novoProduto);
});

// PUT /api/produtos/:id - Atualizar produto existente
app.put('/api/produtos/:id', (req, res) => {
  const produtos = lerDaBD();
  const index = produtos.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ erro: 'Produto não encontrado' });
  
  produtos[index] = { ...produtos[index], ...req.body };

  guardarNaBD(produtos);
  res.json(produtos[index]);
});

// DELETE /api/produtos/:id - Eliminar produto
app.delete('/api/produtos/:id', (req, res) => {
  let produtos = lerDaBD();
  const index = produtos.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ erro: 'Produto não encontrado' });
  produtos.splice(index, 1);
  guardarNaBD(produtos);
  res.json({ mensagem: 'Produto eliminado com sucesso' });
});

// ===== INICIALIZAÇÃO DO SERVIDOR =====

app.use((req, res) => {
  return handle(req, res);
});

const PORT = process.env.PORT || 3000;

nextApp.prepare().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor Next.js + Express a correr em http://localhost:${PORT}`);
    console.log(`📡 API disponível em http://localhost:${PORT}/api/produtos`);
  });
});
```

---

## 🎨 3️⃣ Página inicial (`src/pages/index.js`)

```javascript
import Link from 'next/link';

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Bem-vindo à Nossa Loja
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Gestão de produtos com Next.js e Express
      </p>
      
      <div className="space-x-4">
        <Link href="/produtos" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
          Ver Produtos
        </Link>
        <Link href="/api/produtos" className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors" target="_blank">
          API de Produtos
        </Link>
      </div>
    </div>
  );
}
```

---

## 🧩 4️⃣ Componentes de Layout, cria a pasta (`src/components`) e acrescenta os seguintes ficheiros:

### Navbar.jsx

```javascript
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter();
  const isActive = (path) => router.pathname === path;

  return (
    <nav className="bg-slate-900 text-white p-4 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold text-blue-400">🛒 TechStore</Link>

      <div className="flex space-x-6">
        <Link href="/" className={isActive('/') ? 'bg-blue-600 px-3 py-2 rounded' : 'px-3 py-2 hover:bg-slate-700 rounded'}>
          🏠 Início
        </Link>
        <Link href="/produtos" className={isActive('/produtos') ? 'bg-blue-600 px-3 py-2 rounded' : 'px-3 py-2 hover:bg-slate-700 rounded'}>
          🧾 Produtos
        </Link>
      </div>
    </nav>
  );
}
```

### Footer.jsx

```javascript
export default function Footer() {
  return (
    <footer className="p-4 mt-auto text-center text-gray-500 text-sm">
      <p>Desenvolvido com ❤️ usando Next.js, Tailwind CSS e Express.js</p>
    </footer>
  );
}
```

### AdicionarProduto.jsx

```javascript
import { useState } from 'react'
import { adicionarProdutoAPI } from '@/services/api'

export default function AdicionarProduto({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    nome: '',
    preco: ''
  })

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      await adicionarProdutoAPI(formData)
      setFormData({ nome: '', preco: '' })
      onSuccess()
      onClose()
    } catch (error) {
      alert('Erro ao adicionar produto')
    }
  }

  function handleClose() {
    setFormData({ nome: '', preco: '' })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-white bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">➕ Adicionar Produto</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-2xl">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Produto
            </label>
            <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: Smartphone Pro" />
          </div>

          <div>
            <label htmlFor="preco" className="block text-sm font-medium text-gray-700 mb-2">
              Preço (€)
            </label>
            <input type="number" step="0.01" id="preco" name="preco" value={formData.preco} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: 299.99" />
          </div>

          <div className="flex space-x-3 pt-4">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex-1">
              Adicionar
            </button>
            
            <button type="button" onClick={handleClose} className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex-1">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
```


### EditarProduto.jsx

```javascript
import { useState, useEffect } from 'react'
import { atualizarProdutoAPI } from '@/services/api'

export default function EditarProduto({ isOpen, onClose, onSuccess, produto }) {
  const [formData, setFormData] = useState({
    nome: '',
    preco: ''
  })

  useEffect(() => {
    if (produto) {
      setFormData({
        nome: produto.nome || '',
        preco: produto.preco?.toString() || ''
      })
    }
  }, [produto])

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      await atualizarProdutoAPI(produto.id, formData)
      onSuccess()
      onClose()
    } catch (error) {
      alert('Erro ao atualizar produto')
    }
  }

  function handleClose() {
    setFormData({ nome: '', preco: '' })
    onClose()
  }

  if (!isOpen || !produto) return null

  return (
    <div className="fixed inset-0 bg-white bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">✏️ Editar Produto</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-2xl">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Produto
            </label>
            <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: Smartphone Pro" />
          </div>

          <div>
            <label htmlFor="preco" className="block text-sm font-medium text-gray-700 mb-2">
              Preço (€)
            </label>
            <input type="number" step="0.01" id="preco" name="preco" value={formData.preco} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: 299.99" />
          </div>

          <div className="flex space-x-3 pt-4">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex-1">
              Atualizar
            </button>
            
            <button type="button" onClick={handleClose} className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex-1">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
``` 

---

## 📄 5️⃣ Layout global (`src/pages/_app.js`)

```javascript
import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function App({ Component, pageProps }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}
```

---

## 🛠️ 6️⃣ Serviço API (`src/services/api.js`)

Cria um serviço centralizado para todas as chamadas à API:

```javascript
// GET /api/produtos - Carregar todos os produtos
export async function carregarProdutosAPI() {
  try {
    const response = await fetch('/api/produtos')
    
    if (!response.ok) {
      console.error('Erro na resposta:', response.status, response.statusText)
      throw new Error('Erro ao carregar produtos')
    }
    
    const data = await response.json()
    return data

  } catch (error) {
    console.error('Erro ao carregar produtos:', error)
    throw error
  }
}

// GET /api/produtos/:id - Carregar um produto específico por ID
export async function carregarProdutoPorIdAPI(id) {
  try {
    const response = await fetch(`/api/produtos/${id}`)
    
    if (!response.ok) {
      console.error('Erro na resposta:', response.status, response.statusText)
      throw new Error('Erro ao carregar produto')
    }
    
    const data = await response.json()
    return data

  } catch (error) {
    console.error('Erro ao carregar produto:', error)
    throw error
  }
}

// POST /api/produtos - Criar novo produto
export async function adicionarProdutoAPI(dadosProduto) {
  try {
    const response = await fetch('/api/produtos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dadosProduto)
    })

    if (!response.ok) {
      console.error('Erro na resposta:', response.status, response.statusText)
      throw new Error('Erro ao adicionar produto')
    }
    
    const resultado = await response.json()
    return resultado

  } catch (error) {
    console.error('Erro ao adicionar produto:', error)
    throw error
  }
}

// PUT /api/produtos/:id - Atualizar produto existente
export async function atualizarProdutoAPI(id, dadosProduto) {
  try {
    const response = await fetch(`/api/produtos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dadosProduto)
    })

    if (!response.ok) {
      console.error('Erro na resposta:', response.status, response.statusText)
      throw new Error('Erro ao atualizar produto')
    }
    
    const resultado = await response.json()
    return resultado

  } catch (error) {
    console.error('Erro ao atualizar produto:', error)
    throw error
  }
}

// DELETE /api/produtos/:id - Eliminar produto
export async function eliminarProdutoAPI(id) {
  try {
    const response = await fetch(`/api/produtos/${id}`, { 
      method: 'DELETE' 
    })
    
    if (!response.ok) {
      console.error('Erro na resposta:', response.status, response.statusText)
      throw new Error('Erro ao eliminar produto')
    }

    return true

  } catch (error) {
    console.error('Erro ao eliminar produto:', error)
    throw error
  }
}
```

---

## 🧮 7️⃣ Página de gestão de produtos (`src/pages/produtos.js`)

```javascript
import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdicionarProduto from '@/components/AdicionarProduto'
import EditarProduto from '@/components/EditarProduto'
import { carregarProdutosAPI, eliminarProdutoAPI } from '@/services/api'

export default function Produtos() {
  const [produtos, setProdutos] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [produtoToEdit, setProdutoToEdit] = useState(null)

  useEffect(() => {
    carregarProdutos()
  }, [])

  async function carregarProdutos() {
    try {
      const data = await carregarProdutosAPI()
      setProdutos(data)
    } catch (error) {
      alert('Erro ao carregar produtos')
    }
  }

  async function eliminarProduto(id) {
    if (confirm('Tens a certeza que queres eliminar este produto?')) {
      try {
        await eliminarProdutoAPI(id)
        setProdutos(produtos.filter(p => p.id !== id))
      } catch (error) {
        alert('Erro ao eliminar produto')
      }
    }
  }

  function handleEditProduto(produto) {
    setProdutoToEdit(produto)
    setShowEditModal(true)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🧾 Gestão de Produtos</h1>
          <p className="text-gray-600">Gerencie todos os produtos da sua loja</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50">
          ➕ Adicionar Produto
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">ID</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Nome</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Preço</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map(produto => (
              <tr key={produto.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-900">{produto.id}</td>
                <td className="py-3 px-4 text-gray-900 font-medium">{produto.nome}</td>
                <td className="py-3 px-4 text-blue-600 font-bold">€{produto.preco}</td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <Link href={`/produto/${produto.id}`} className="bg-white border border-blue-600 text-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-50">
                      Ver
                    </Link>
                    <button onClick={() => handleEditProduto(produto)} className="bg-white border border-blue-600 text-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-50">
                      Editar
                    </button>
                    <button onClick={() => eliminarProduto(produto.id)} className="bg-white border border-blue-600 text-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-50">
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <AdicionarProduto
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={carregarProdutos}
      />

      <EditarProduto
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={carregarProdutos}
        produto={produtoToEdit}
      />
    </div>
  )
}
```

---

## 🔍 8️⃣ Página detalhes do produto (`src/pages/produto/[id].js`)

```javascript
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { carregarProdutoPorIdAPI } from '@/services/api'

export default function ProdutoDetalhes() {
  const router = useRouter()
  const { id } = router.query
  const [produto, setProduto] = useState(null)

  useEffect(() => {
    carregarProduto()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function carregarProduto() {
    if (!id) return
    
    try {
      const data = await carregarProdutoPorIdAPI(id)
      setProduto(data)
    } catch (error) {
      console.error(error)
      alert('Erro ao carregar produto')
    }
  }

  if (!produto) return <div className="text-center">Produto não encontrado</div>

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <Link href="/produtos" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Voltar aos Produtos
      </Link>

      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{produto.nome}</h1>
        <p className="text-3xl font-bold text-blue-600 mb-6">€{produto.preco}</p>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-gray-700">ID do Produto: <span className="font-semibold">{produto.id}</span></p>
        </div>
      </div>
    </div>
  )
}
```


---


## 💾 1️⃣1️⃣ Base de dados local (`db.json`)

Cria um ficheiro `db.json` na **raiz do projeto** com dados iniciais:

```json
{
  "produtos": [
    {
      "id": 1,
      "nome": "Laptop Gaming",
      "preco": "1299.99"
    },
    {
      "id": 2,
      "nome": "Smartphone Pro",
      "preco": 899.5
    },
    {
      "id": 3,
      "nome": "Headphones Bluetooth",
      "preco": 159.99
    },
    {
      "id": 4,
      "nome": "Smartwatch",
      "preco": 299.99
    }
  ]
}
```

---

## ⚙️ 1️⃣2️⃣ Ficheiros de configuração opcionais

### `nodemon.json` (opcional - melhora performance)

Se quiseres otimizar o `nodemon` para não reiniciar desnecessariamente:

```json
{
  "watch": ["server.js", "src/"],
  "ignore": [
    "node_modules/",
    ".next/",
    "public/",
    "*.log",
    "db.json"
  ],
  "ext": "js,jsx",
  "delay": 2000
}
```

> **Nota**: Este ficheiro é **opcional**. O `nodemon` funciona sem ele, mas com configuração é mais eficiente.

---

## 🚀 Como executar o projeto

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Executar em modo desenvolvimento** (um só comando):
   ```bash
   npm run dev
   ```

3. **Aceder à aplicação**:
   - **Frontend Next.js**: `http://localhost:3000`
   - **API REST**: `http://localhost:3000/api/produtos`

---

✅ **Funcionalidades implementadas**

* ✅ **Backend Express** integrado com Next.js
* ✅ **API REST completa** (GET, POST, PUT, DELETE)
* ✅ **Base de dados persistente** em ficheiro JSON
* ✅ **Frontend React/Next.js** com páginas dinâmicas
* ✅ **Componentes modais** para adicionar/editar produtos
* ✅ **Serviços API centralizados** com tratamento de erros
* ✅ **Navegação entre páginas** com Next.js Router
* ✅ **Design responsivo** com Tailwind CSS
* ✅ **Hot reload** tanto para frontend como backend

