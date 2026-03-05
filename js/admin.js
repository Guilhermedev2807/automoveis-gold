const API = 'http://localhost:3000/api';
let todosVeiculos = [];
let isLogado = false;

// ===== UTILITÁRIOS =====
function formatarPreco(valor) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(valor);
}
function formatarKm(km) {
  return new Intl.NumberFormat('pt-BR').format(km) + ' km';
}
function showToast(msg, tipo = 'success') {
  const toast = document.getElementById('toast');
  toast.className = `toast ${tipo}`;
  document.getElementById('toastMsg').textContent = msg;
  document.getElementById('toastIcon').textContent = tipo === 'success' ? '✓' : '✕';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ===== LOGIN =====
async function fazerLogin(e) {
  e.preventDefault();
  const senha = document.getElementById('loginSenha').value;
  try {
    const res = await fetch(`${API}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senha })
    });
    const data = await res.json();
    if (data.sucesso) {
      isLogado = true;
      sessionStorage.setItem('goldAdminToken', data.token);
      document.getElementById('adminLogin').style.display = 'none';
      document.getElementById('adminPanel').style.display = 'grid';
      carregarDashboard();
      carregarVeiculos();
    } else {
      showToast('Senha incorreta!', 'error');
      document.getElementById('loginSenha').value = '';
    }
  } catch {
    showToast('Servidor offline. Inicie com npm start.', 'error');
  }
  return false;
}

function fazerLogout() {
  sessionStorage.removeItem('goldAdminToken');
  isLogado = false;
  document.getElementById('adminPanel').style.display = 'none';
  document.getElementById('adminLogin').style.display = 'flex';
  document.getElementById('loginSenha').value = '';
}

// ===== SECTIONS =====
function showSection(name) {
  ['Dashboard', 'Veiculos', 'Adicionar'].forEach(s => {
    document.getElementById(`section${s}`).style.display = s.toLowerCase() === name ? 'block' : 'none';
    const link = document.getElementById(`link${s}`);
    if (link) link.classList.toggle('active', s.toLowerCase() === name);
  });
  if (name === 'veiculos') renderTabelaVeiculos(todosVeiculos);
  if (name === 'adicionar') resetForm();
}

// ===== DASHBOARD =====
async function carregarDashboard() {
  try {
    const res = await fetch(`${API}/veiculos`);
    todosVeiculos = await res.json();

    document.getElementById('statTotal').textContent = todosVeiculos.length;
    document.getElementById('statDestaque').textContent = todosVeiculos.filter(v => v.destaque).length;
    const marcas = new Set(todosVeiculos.map(v => v.marca));
    document.getElementById('statMarcas').textContent = marcas.size;
    const precoMedio = todosVeiculos.reduce((s, v) => s + v.preco, 0) / (todosVeiculos.length || 1);
    document.getElementById('statPreco').textContent = formatarPreco(precoMedio);

    const ultimos = [...todosVeiculos].slice(0, 5);
    const dashList = document.getElementById('dashboardList');
    dashList.innerHTML = renderTabela(ultimos);
  } catch {
    document.getElementById('dashboardList').innerHTML =
      '<div class="empty-state"><h3>⚠️ Servidor offline</h3><p>Inicie com npm start</p></div>';
  }
}

// ===== CARREGAR VEÍCULOS =====
async function carregarVeiculos() {
  try {
    const res = await fetch(`${API}/veiculos`);
    todosVeiculos = await res.json();
  } catch {}
}

function renderTabela(lista) {
  if (!lista.length) return '<div class="empty-state"><div class="empty-icon">🚗</div><h3>Nenhum veículo</h3></div>';
  return `
    <table>
      <thead>
        <tr>
          <th>Imagem</th>
          <th>Nome</th>
          <th>Marca</th>
          <th>Ano</th>
          <th>Preço</th>
          <th>Tipo</th>
          <th>Km</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        ${lista.map(v => `
          <tr>
            <td><img class="table-img" src="${v.imagem || 'https://via.placeholder.com/64x44?text=?'}"
                 alt="${v.nome}" onerror="this.src='https://via.placeholder.com/64x44?text=?'" /></td>
            <td class="td-name">${v.nome} ${v.destaque ? '⭐' : ''}</td>
            <td>${v.marca}</td>
            <td>${v.ano}</td>
            <td class="td-price">${formatarPreco(v.preco)}</td>
            <td><span class="badge-tipo-table">${v.tipo}</span></td>
            <td>${formatarKm(v.km)}</td>
            <td class="td-actions">
              <button class="btn btn-dark btn-sm" onclick="editarVeiculo(${v.id})">✏️ Editar</button>
              <button class="btn btn-danger btn-sm" onclick="confirmarExcluir(${v.id}, '${v.nome.replace(/'/g, "\\'")}')">🗑️</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function renderTabelaVeiculos(lista) {
  document.getElementById('veiculosList').innerHTML = renderTabela(lista);
}

// ===== BUSCA ADMIN =====
function filtrarAdmin() {
  const q = document.getElementById('adminSearch')?.value.toLowerCase() || '';
  const filtrados = todosVeiculos.filter(v =>
    `${v.nome} ${v.marca} ${v.modelo}`.toLowerCase().includes(q)
  );
  renderTabelaVeiculos(filtrados);
}

// ===== SALVAR =====
async function salvarVeiculo(e) {
  e.preventDefault();
  const id = document.getElementById('veiculoId').value;
  const dados = {
    nome:        document.getElementById('fNome').value.trim(),
    marca:       document.getElementById('fMarca').value.trim(),
    modelo:      document.getElementById('fModelo').value.trim(),
    ano:         parseInt(document.getElementById('fAno').value),
    preco:       parseFloat(document.getElementById('fPreco').value),
    km:          parseInt(document.getElementById('fKm').value),
    combustivel: document.getElementById('fCombustivel').value,
    tipo:        document.getElementById('fTipo').value,
    descricao:   document.getElementById('fDescricao').value.trim(),
    imagem:      document.getElementById('fImagem').value.trim(),
    destaque:    document.getElementById('fDestaque').checked ? 1 : 0
  };

  try {
    const url = id ? `${API}/veiculos/${id}` : `${API}/veiculos`;
    const method = id ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    if (!res.ok) throw new Error('Erro ao salvar');
    showToast(id ? 'Veículo atualizado com sucesso!' : 'Veículo adicionado com sucesso!', 'success');
    resetForm();
    await carregarDashboard();
    showSection('veiculos');
  } catch {
    showToast('Erro ao salvar veículo. Tente novamente.', 'error');
  }
  return false;
}

// ===== EDITAR =====
function editarVeiculo(id) {
  const v = todosVeiculos.find(x => x.id === id);
  if (!v) return;
  document.getElementById('veiculoId').value = v.id;
  document.getElementById('fNome').value = v.nome;
  document.getElementById('fMarca').value = v.marca;
  document.getElementById('fModelo').value = v.modelo;
  document.getElementById('fAno').value = v.ano;
  document.getElementById('fPreco').value = v.preco;
  document.getElementById('fKm').value = v.km;
  document.getElementById('fCombustivel').value = v.combustivel;
  document.getElementById('fTipo').value = v.tipo;
  document.getElementById('fDescricao').value = v.descricao || '';
  document.getElementById('fImagem').value = v.imagem || '';
  document.getElementById('fDestaque').checked = !!v.destaque;
  document.getElementById('formTitle').textContent = 'Editar Veículo';
  atualizarPreviewImagem(v.imagem);
  showSection('adicionar');
}

// ===== EXCLUIR =====
function confirmarExcluir(id, nome) {
  if (!confirm(`Tem certeza que deseja excluir "${nome}"?`)) return;
  excluirVeiculo(id);
}

async function excluirVeiculo(id) {
  try {
    const res = await fetch(`${API}/veiculos/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error();
    showToast('Veículo excluído com sucesso!', 'success');
    await carregarDashboard();
    renderTabelaVeiculos(todosVeiculos);
  } catch {
    showToast('Erro ao excluir veículo.', 'error');
  }
}

// ===== RESET FORM =====
function resetForm() {
  document.getElementById('veiculoForm').reset();
  document.getElementById('veiculoId').value = '';
  document.getElementById('formTitle').textContent = 'Adicionar Veículo';
  document.getElementById('imgPreview').innerHTML = '';
}

// ===== PREVIEW IMAGEM =====
function atualizarPreviewImagem(url) {
  const prev = document.getElementById('imgPreview');
  if (url) {
    prev.innerHTML = `<img src="${url}" alt="Preview" style="max-height:120px; border-radius:8px; border:1px solid var(--border);" onerror="this.parentElement.innerHTML='<span style=color:var(--gray);font-size:.8rem>URL inválida</span>'" />`;
  } else {
    prev.innerHTML = '';
  }
}
document.getElementById('fImagem')?.addEventListener('input', function () {
  atualizarPreviewImagem(this.value);
});

// ===== AUTO-LOGIN =====
document.addEventListener('DOMContentLoaded', () => {
  const token = sessionStorage.getItem('goldAdminToken');
  if (token) {
    isLogado = true;
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'grid';
    carregarDashboard();
    carregarVeiculos();
  }
});
