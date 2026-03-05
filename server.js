const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDB, getAll, getById, insert, update, remove, getMarcas, getTipos } = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

initDB();

app.get('/api/veiculos', (req, res) => {
  const { tipo, marca, busca, destaque } = req.query;
  res.json(getAll({ tipo, marca, busca, destaque }));
});

app.get('/api/veiculos/marcas', (req, res) => {
  res.json(getMarcas());
});

app.get('/api/veiculos/tipos', (req, res) => {
  res.json(getTipos());
});

app.get('/api/veiculos/:id', (req, res) => {
  const veiculo = getById(req.params.id);
  if (!veiculo) return res.status(404).json({ erro: 'Veículo não encontrado' });
  res.json(veiculo);
});

app.post('/api/veiculos', (req, res) => {
  try {
    const veiculo = insert(req.body);
    res.status(201).json(veiculo);
  } catch (e) {
    res.status(400).json({ erro: e.message });
  }
});

app.put('/api/veiculos/:id', (req, res) => {
  const veiculo = update(req.params.id, req.body);
  if (!veiculo) return res.status(404).json({ erro: 'Veículo não encontrado' });
  res.json(veiculo);
});

app.delete('/api/veiculos/:id', (req, res) => {
  const resultado = remove(req.params.id);
  if (!resultado) return res.status(404).json({ erro: 'Veículo não encontrado' });
  res.json({ mensagem: 'Veículo removido com sucesso' });
});

app.post('/api/admin/login', (req, res) => {
  const { senha } = req.body;
  if (senha === 'admin123') {
    res.json({ token: 'gold-admin-token', sucesso: true });
  } else {
    res.status(401).json({ erro: 'Senha incorreta', sucesso: false });
  }
});

app.listen(PORT, () => {
  console.log('\n========================================');
  console.log('   Automóveis Gold - Servidor iniciado  ');
  console.log('========================================');
  console.log(`   Acesse: http://localhost:${PORT}`);
  console.log('   Admin:  senha "admin123"');
  console.log('========================================\n');
});
