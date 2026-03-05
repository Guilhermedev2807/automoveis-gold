const API = 'http://localhost:3000/api';
let todosVeiculos = [];
let filtrados = [];

// ===== UTILITÁRIOS (duplicadas para autonomia da página) =====
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

// ===== MODAL =====
function abrirModal(veiculo) {
  const overlay = document.getElementById('modalOverlay');
  document.getElementById('modalTitle').textContent = veiculo.nome;
  document.getElementById('modalBody').innerHTML = `
    <div class="modal-image">
      <img src="${veiculo.imagem || 'https://via.placeholder.com/800x400?text=Sem+Imagem'}"
           alt="${veiculo.nome}" loading="lazy"
           onerror="this.src='https://via.placeholder.com/800x400?text=Imagem+Indisponível'" />
    </div>
    <div class="modal-specs">
      <div class="modal-spec">
        <div class="modal-spec-label">Ano</div>
        <div class="modal-spec-value">${veiculo.ano}</div>
      </div>
      <div class="modal-spec">
        <div class="modal-spec-label">Quilometragem</div>
        <div class="modal-spec-value">${formatarKm(veiculo.km)}</div>
      </div>
      <div class="modal-spec">
        <div class="modal-spec-label">Combustível</div>
        <div class="modal-spec-value">${veiculo.combustivel}</div>
      </div>
      <div class="modal-spec">
        <div class="modal-spec-label">Tipo</div>
        <div class="modal-spec-value">${veiculo.tipo}</div>
      </div>
      <div class="modal-spec">
        <div class="modal-spec-label">Marca</div>
        <div class="modal-spec-value">${veiculo.marca}</div>
      </div>
      <div class="modal-spec">
        <div class="modal-spec-label">Modelo</div>
        <div class="modal-spec-value">${veiculo.modelo}</div>
      </div>
    </div>
    <div class="modal-price">${formatarPreco(veiculo.preco)}</div>
    <p class="modal-desc">${veiculo.descricao || 'Sem descrição disponível.'}</p>
    <div class="modal-actions">
      <a href="https://wa.me/5511999998888?text=Olá! Tenho interesse no ${encodeURIComponent(veiculo.nome)}"
         target="_blank" class="btn btn-gold">💬 Falar no WhatsApp</a>
      <a href="index.html#contato" class="btn btn-outline">📧 Enviar E-mail</a>
    </div>
  `;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function fecharModal() {
  document.getElementById('modalOverlay').classList.remove('active');
  document.body.style.overflow = '';
}
document.getElementById('modalClose')?.addEventListener('click', fecharModal);
document.getElementById('modalOverlay')?.addEventListener('click', e => {
  if (e.target.id === 'modalOverlay') fecharModal();
});

// ===== CARD =====
function criarCard(v) {
  const card = document.createElement('div');
  card.className = 'vehicle-card fade-in';
  card.innerHTML = `
    <div class="card-image">
      <img src="${v.imagem || 'https://via.placeholder.com/400x250?text=Sem+Imagem'}"
           alt="${v.nome}" loading="lazy"
           onerror="this.src='https://via.placeholder.com/400x250?text=Imagem+Indisponível'" />
      ${v.destaque ? '<span class="card-badge badge-destaque">⭐ Destaque</span>' : `<span class="card-badge badge-tipo">${v.tipo}</span>`}
    </div>
    <div class="card-body">
      <div class="card-brand">${v.marca}</div>
      <div class="card-name">${v.nome}</div>
      <div class="card-specs">
        <div class="spec-item">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
          ${v.ano}
        </div>
        <div class="spec-item">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          ${formatarKm(v.km)}
        </div>
        <div class="spec-item">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 18h18M5 10l7-7 7 7"/></svg>
          ${v.combustivel}
        </div>
      </div>
      <div class="card-footer">
        <div>
          <div class="card-price-label">Preço</div>
          <div class="card-price">${formatarPreco(v.preco)}</div>
        </div>
        <button class="btn btn-gold btn-sm">Ver Detalhes</button>
      </div>
    </div>
  `;
  card.addEventListener('click', () => abrirModal(v));
  return card;
}

// ===== RENDERIZAR =====
function renderizarVeiculos(lista) {
  const grid = document.getElementById('catalogGrid');
  grid.innerHTML = '';
  document.getElementById('countSpan').textContent = lista.length;
  if (!lista.length) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <div class="empty-icon">🔍</div>
        <h3>Nenhum veículo encontrado</h3>
        <p>Tente ajustar os filtros de busca</p>
        <button class="btn btn-outline" style="margin-top:16px;" onclick="limparFiltros()">Limpar Filtros</button>
      </div>`;
    return;
  }
  lista.forEach(v => grid.appendChild(criarCard(v)));
}

// ===== FILTRAR + ORDENAR =====
function aplicarFiltros() {
  const tipo = document.querySelector('input[name="tipo"]:checked')?.value || '';
  const marca = document.querySelector('input[name="marca"]:checked')?.value || '';
  const comb = document.querySelector('input[name="combustivel"]:checked')?.value || '';
  const precoMax = parseInt(document.getElementById('priceSlider').value);
  const soDest = document.getElementById('soDestaques').checked;
  const busca = document.getElementById('searchInput').value.toLowerCase().trim();
  const sort = document.getElementById('sortSelect').value;

  filtrados = todosVeiculos.filter(v => {
    if (tipo && v.tipo !== tipo) return false;
    if (marca && v.marca !== marca) return false;
    if (comb && v.combustivel !== comb) return false;
    if (v.preco > precoMax) return false;
    if (soDest && !v.destaque) return false;
    if (busca && !`${v.nome} ${v.marca} ${v.modelo}`.toLowerCase().includes(busca)) return false;
    return true;
  });

  filtrados.sort((a, b) => {
    if (sort === 'preco_asc')  return a.preco - b.preco;
    if (sort === 'preco_desc') return b.preco - a.preco;
    if (sort === 'ano_desc')   return b.ano - a.ano;
    if (sort === 'km_asc')    return a.km - b.km;
    return b.destaque - a.destaque;
  });

  renderizarVeiculos(filtrados);
}

function limparFiltros() {
  document.querySelectorAll('input[name="tipo"]')[0].checked = true;
  document.querySelectorAll('input[name="marca"]')[0].checked = true;
  document.querySelectorAll('input[name="combustivel"]')[0].checked = true;
  document.getElementById('priceSlider').value = 3000000;
  document.getElementById('priceDisplay').textContent = 'Até R$ 3.000.000';
  document.getElementById('soDestaques').checked = false;
  document.getElementById('searchInput').value = '';
  document.getElementById('sortSelect').value = 'destaque';
  aplicarFiltros();
}

// ===== CARREGAR MARCAS =====
async function carregarMarcas() {
  try {
    const res = await fetch(`${API}/veiculos`);
    const veiculos = await res.json();
    const marcas = [...new Set(veiculos.map(v => v.marca))].sort();
    const container = document.getElementById('marcasFilter');
    marcas.forEach(m => {
      const label = document.createElement('label');
      label.className = 'filter-option';
      label.innerHTML = `<input type="radio" name="marca" value="${m}" /> ${m}`;
      label.querySelector('input').addEventListener('change', aplicarFiltros);
      container.appendChild(label);
    });
  } catch {}
}

// ===== CARREGAR VEÍCULOS =====
async function carregarVeiculos() {
  const grid = document.getElementById('catalogGrid');
  grid.innerHTML = '<div class="loading"><div class="spinner"></div> Carregando veículos...</div>';
  try {
    const res = await fetch(`${API}/veiculos`);
    todosVeiculos = await res.json();
    aplicarFiltros();
  } catch {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <div class="empty-icon">⚠️</div>
        <h3>Servidor offline</h3>
        <p>Inicie o servidor com <strong>npm start</strong> e recarregue a página</p>
      </div>`;
  }
}

// ===== PRICE SLIDER =====
document.getElementById('priceSlider')?.addEventListener('input', function () {
  const v = parseInt(this.value);
  document.getElementById('priceDisplay').textContent =
    'Até ' + new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v);
  aplicarFiltros();
});

// ===== EVENTOS =====
document.querySelectorAll('input[name="tipo"], input[name="combustivel"]').forEach(el =>
  el.addEventListener('change', aplicarFiltros)
);
document.getElementById('soDestaques')?.addEventListener('change', aplicarFiltros);
document.getElementById('sortSelect')?.addEventListener('change', aplicarFiltros);
document.getElementById('searchInput')?.addEventListener('input', aplicarFiltros);

// ===== NAVBAR =====
document.getElementById('navToggle')?.addEventListener('click', () => {
  document.getElementById('navMenu').classList.toggle('open');
});
window.addEventListener('scroll', () => {
  const nb = document.getElementById('navbar');
  if (nb) nb.classList.toggle('scrolled', window.scrollY > 60);
});

// ===== QUERY PARAMS (tipo na URL) =====
function lerQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const tipo = params.get('tipo');
  if (tipo) {
    const radio = document.querySelector(`input[name="tipo"][value="${tipo}"]`);
    if (radio) radio.checked = true;
  }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  lerQueryParams();
  carregarMarcas();
  carregarVeiculos();
});
