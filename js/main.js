const API = 'http://localhost:3000/api';

// ===== UTILITÁRIOS =====
function formatarPreco(valor) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(valor);
}
function formatarKm(km) {
  return new Intl.NumberFormat('pt-BR').format(km) + ' km';
}

function showToast(msg, tipo = 'success') {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  const toastIcon = document.getElementById('toastIcon');
  toast.className = `toast ${tipo}`;
  toastMsg.textContent = msg;
  toastIcon.textContent = tipo === 'success' ? '✓' : '✕';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

function abrirModal(veiculo) {
  const overlay = document.getElementById('modalOverlay');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');
  title.textContent = veiculo.nome;
  body.innerHTML = `
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

function criarCardVeiculo(v) {
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
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
          ${v.ano}
        </div>
        <div class="spec-item">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          ${formatarKm(v.km)}
        </div>
        <div class="spec-item">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/><path d="M12 6v6l3 3"/></svg>
          ${v.combustivel}
        </div>
      </div>
      <div class="card-footer">
        <div>
          <div class="card-price-label">Preço</div>
          <div class="card-price">${formatarPreco(v.preco)}</div>
        </div>
        <button class="btn btn-gold btn-sm" onclick="event.stopPropagation()">Ver Detalhes</button>
      </div>
    </div>
  `;
  card.addEventListener('click', () => abrirModal(v));
  return card;
}

// ===== NAVBAR =====
document.getElementById('navToggle')?.addEventListener('click', () => {
  document.getElementById('navMenu').classList.toggle('open');
});
window.addEventListener('scroll', () => {
  const nb = document.getElementById('navbar');
  if (nb) nb.classList.toggle('scrolled', window.scrollY > 60);
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// ===== MODAL CLOSE =====
document.getElementById('modalClose')?.addEventListener('click', fecharModal);
document.getElementById('modalOverlay')?.addEventListener('click', e => {
  if (e.target === document.getElementById('modalOverlay')) fecharModal();
});

// ===== CONTATO =====
function enviarContato(e) {
  e.preventDefault();
  showToast('Mensagem enviada! Entraremos em contato em breve.', 'success');
  e.target.reset();
  return false;
}

// ===== DESTAQUES HOME =====
async function carregarDestaques() {
  const grid = document.getElementById('destaquesGrid');
  if (!grid) return;
  try {
    const res = await fetch(`${API}/veiculos?destaque=1`);
    const veiculos = await res.json();
    grid.innerHTML = '';
    if (!veiculos.length) {
      grid.innerHTML = '<div class="empty-state"><div class="empty-icon">🚗</div><h3>Nenhum destaque</h3></div>';
      return;
    }
    veiculos.forEach(v => grid.appendChild(criarCardVeiculo(v)));

    // Atualizar stat
    const statEl = document.getElementById('statVeiculos');
    if (statEl) {
      const allRes = await fetch(`${API}/veiculos`);
      const all = await allRes.json();
      animarContador(statEl, all.length);
    }
  } catch {
    grid.innerHTML = '<div class="empty-state"><div class="empty-icon">⚠️</div><h3>Servidor offline</h3><p>Inicie o servidor com <code>npm start</code></p></div>';
  }
}

function animarContador(el, alvo) {
  let atual = 0;
  const step = Math.ceil(alvo / 40);
  const timer = setInterval(() => {
    atual = Math.min(atual + step, alvo);
    el.textContent = atual + '+';
    if (atual >= alvo) clearInterval(timer);
  }, 40);
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', carregarDestaques);
