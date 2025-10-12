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
