const photo = {
  fruit: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=82',
  coffee: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=82',
  milk: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=82',
  pasta: 'https://images.unsplash.com/photo-1556761223-4c4282c73f77?auto=format&fit=crop&w=800&q=82',
  drink: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=800&q=82',
  juice: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=800&q=82',
  clean: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=800&q=82',
  fryer: 'https://images.unsplash.com/photo-1647191475600-1ab0a1a2a378?auto=format&fit=crop&w=800&q=82',
  blender: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=82',
};

const products = [
  { id: 1, name: 'Maçã Gala, bandeja 1 kg', category: 'Hortifruti', price: 8.99, oldPrice: 11.49, image: photo.fruit },
  { id: 2, name: 'Banana Prata, 1 kg', category: 'Hortifruti', price: 5.99, oldPrice: 7.49, image: photo.fruit },
  { id: 3, name: 'Mix de legumes frescos, 500 g', category: 'Hortifruti', price: 9.9, oldPrice: 12.9, image: photo.fruit },
  { id: 4, name: 'Café Torrado e Moído 500 g', category: 'Mercearia', price: 16.49, oldPrice: 19.99, image: photo.coffee },
  { id: 5, name: 'Leite Integral UHT 1 litro', category: 'Mercearia', price: 4.79, oldPrice: 5.49, image: photo.milk },
  { id: 6, name: 'Macarrão Espaguete 500 g', category: 'Mercearia', price: 5.49, oldPrice: 6.99, image: photo.pasta },
  { id: 7, name: 'Refrigerante Cola 2 litros', category: 'Bebidas', price: 8.49, oldPrice: 10.99, image: photo.drink },
  { id: 8, name: 'Suco de Laranja Integral 1 L', category: 'Bebidas', price: 12.9, oldPrice: 15.49, image: photo.juice },
  { id: 9, name: 'Água Mineral sem gás 1,5 L', category: 'Bebidas', price: 2.29, oldPrice: 2.99, image: photo.drink },
  { id: 10, name: 'Detergente Neutro 500 ml', category: 'Limpeza', price: 2.49, oldPrice: 3.29, image: photo.clean },
  { id: 11, name: 'Desinfetante Lavanda 2 L', category: 'Limpeza', price: 7.99, oldPrice: 9.49, image: photo.clean },
  { id: 12, name: 'Lava-roupas líquido 3 L', category: 'Limpeza', price: 21.9, oldPrice: 27.9, image: photo.clean },
  { id: 13, name: 'Air Fryer Digital 4 litros', category: 'Eletro', price: 249.9, oldPrice: 319.9, image: photo.fryer },
  { id: 14, name: 'Liquidificador 1200W Inox', category: 'Eletro', price: 109.9, oldPrice: 149.9, image: photo.blender },
  { id: 15, name: 'Cafeteira elétrica 30 xícaras', category: 'Eletro', price: 129.9, oldPrice: 169.9, image: photo.coffee },
];

const icons = { Hortifruti: '🥬', Mercearia: '🛒', Bebidas: '🥤', Limpeza: '✨', Eletro: '⚡' };
const categories = [...new Set(products.map(p => p.category))];
const FREE_SHIPPING_THRESHOLD = 99;

let activeCategory = 'Todos';
let query = '';
let cart = [];
try { cart = JSON.parse(localStorage.getItem('supermax-cart') || '[]'); } catch { cart = []; }

const money = value => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const discountPct = p => Math.round(100 - (p.price / p.oldPrice) * 100);

const grid = document.querySelector('#product-sections');
const filtersEl = document.querySelector('#filters');
const navContent = document.querySelector('#nav-content');
const footerCategories = document.querySelector('#footer-categories');
const toast = document.querySelector('#toast');
const resultCount = document.querySelector('#result-count');
const freeShippingEl = document.querySelector('#free-shipping');

function save() { localStorage.setItem('supermax-cart', JSON.stringify(cart)); }
function qtyInCart(id) { const item = cart.find(p => p.id === id); return item ? item.quantity : 0; }

function visibleProducts() {
  const q = query.trim().toLocaleLowerCase('pt-BR');
  return products.filter(p =>
    (activeCategory === 'Todos' || p.category === activeCategory) &&
    `${p.name} ${p.category}`.toLocaleLowerCase('pt-BR').includes(q)
  );
}

/* ---------- static chrome: nav, filters, footer ---------- */
function renderNav() {
  navContent.innerHTML += categories.map(c =>
    `<a href="#ofertas" data-category="${c}">${icons[c] || ''} ${c}</a>`
  ).join('');
}
function renderFilters() {
  filtersEl.innerHTML = ['Todos', ...categories].map(c =>
    `<button class="filter ${c === activeCategory ? 'active' : ''}" type="button" data-category="${c}" aria-pressed="${c === activeCategory}">${c}</button>`
  ).join('');
}
function renderFooterCategories() {
  footerCategories.innerHTML = categories.map(c => `<li><a href="#ofertas" data-category="${c}">${c}</a></li>`).join('');
}

/* ---------- hero board ---------- */
function renderBoard() {
  const top = [...products].sort((a, b) => discountPct(b) - discountPct(a)).slice(0, 3);
  document.querySelector('#board-list').innerHTML = top.map(p => `
    <li class="ticket">
      <span class="ticket__badge">-${discountPct(p)}%</span>
      <span class="ticket__name">${p.name}</span>
      <span class="ticket__price"><strong>${money(p.price)}</strong><small>${money(p.oldPrice)}</small></span>
    </li>
  `).join('');
  const dateStr = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  document.querySelector('#board-date').textContent = dateStr;
  document.querySelector('#today-line').textContent = `Compre até 16h e receba ainda hoje`;
}

/* ---------- product grid ---------- */
function productControl(product) {
  const qty = qtyInCart(product.id);
  if (qty > 0) {
    return `<div class="stepper">
      <button type="button" data-change="${product.id}" data-delta="-1" aria-label="Diminuir quantidade">−</button>
      <span>${qty}</span>
      <button type="button" data-change="${product.id}" data-delta="1" aria-label="Aumentar quantidade">+</button>
    </div>`;
  }
  return `<button class="buy-button" type="button" data-add="${product.id}">Adicionar</button>`;
}

function card(product) {
  return `<article class="product">
    <div class="product__image-wrap">
      <img class="product__image" src="${product.image}" alt="${product.name}" loading="lazy">
      <span class="product__discount">-${discountPct(product)}%</span>
    </div>
    <span class="product__meta">${product.category}</span>
    <h4>${product.name}</h4>
    <div class="product__prices">
      <div class="product__old-price">${money(product.oldPrice)}</div>
      <div class="product__price">${money(product.price)} <small>à vista</small></div>
    </div>
    <div class="product__control" data-control="${product.id}">${productControl(product)}</div>
  </article>`;
}

function renderProducts() {
  const list = visibleProducts();
  resultCount.textContent = `${list.length} ${list.length === 1 ? 'produto encontrado' : 'produtos encontrados'}`;

  if (!list.length) {
    grid.innerHTML = '<div class="empty">Não encontramos produtos com esses filtros.<br>Experimente outra busca ou limpe os filtros.</div>';
    return;
  }

  const groups = activeCategory === 'Todos' ? categories : [activeCategory];
  grid.innerHTML = groups.map(category => {
    const items = list.filter(p => p.category === category);
    if (!items.length) return '';
    return `<section class="catalog-section">
      <div class="catalog-section__header">
        <span aria-hidden="true">${icons[category] || ''}</span>
        <h3>${category}</h3>
        <span class="catalog-section__count">${items.length} ${items.length === 1 ? 'item' : 'itens'}</span>
      </div>
      <div class="product-grid">${items.map(card).join('')}</div>
    </section>`;
  }).join('');
}

function refreshControls() {
  document.querySelectorAll('[data-control]').forEach(el => {
    const id = Number(el.dataset.control);
    const product = products.find(p => p.id === id);
    if (product) el.innerHTML = productControl(product);
  });
}

/* ---------- cart ---------- */
function renderCart() {
  const count = cart.reduce((t, i) => t + i.quantity, 0);
  const total = cart.reduce((t, i) => t + i.price * i.quantity, 0);
  const savings = cart.reduce((t, i) => t + (i.oldPrice - i.price) * i.quantity, 0);

  const counter = document.querySelector('#cart-count');
  counter.textContent = count;
  counter.classList.toggle('visible', count > 0);

  document.querySelector('#cart-total').textContent = money(total);
  document.querySelector('#checkout').disabled = !count;
  document.querySelector('#cart-savings').textContent = savings > 0 ? `Você está economizando ${money(savings)} nesta compra` : '';

  document.querySelector('#cart-items').innerHTML = count ? cart.map(item => `
    <div class="cart-item">
      <img class="cart-item__image" src="${item.image}" alt="">
      <div><h4>${item.name}</h4><p>${money(item.price)}</p></div>
      <div class="stepper">
        <button type="button" data-change="${item.id}" data-delta="-1" aria-label="Diminuir quantidade">−</button>
        <span>${item.quantity}</span>
        <button type="button" data-change="${item.id}" data-delta="1" aria-label="Aumentar quantidade">+</button>
      </div>
    </div>
  `).join('') : '<div class="cart-empty">Seu carrinho está vazio.<br>Adicione produtos para começar.</div>';

  const missing = FREE_SHIPPING_THRESHOLD - total;
  freeShippingEl.textContent = count === 0
    ? `Frete grátis a partir de ${money(FREE_SHIPPING_THRESHOLD)}`
    : missing > 0
      ? `Faltam ${money(missing)} para o frete grátis`
      : 'Você garantiu frete grátis nesta compra 🎉';

  refreshControls();
}

function add(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(p => p.id === id);
  if (!product) return;
  if (existing) existing.quantity++;
  else cart.push({ ...product, quantity: 1 });
  save();
  renderCart();
  show(`${product.name} adicionado ao carrinho`);
}

function change(id, delta) {
  const item = cart.find(p => p.id === id);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) cart = cart.filter(p => p.id !== id);
  save();
  renderCart();
}

/* ---------- toast + drawer ---------- */
let toastTimer;
function show(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

function openCart(open) {
  const overlay = document.querySelector('#cart-overlay');
  overlay.classList.toggle('open', open);
  overlay.setAttribute('aria-hidden', String(!open));
  if (open) document.querySelector('#close-cart').focus();
  else document.querySelector('#cart-button').focus();
}

/* ---------- events ---------- */
filtersEl.addEventListener('click', e => {
  const category = e.target.dataset.category;
  if (category) { activeCategory = category; renderFilters(); renderProducts(); }
});

grid.addEventListener('click', e => {
  const addId = Number(e.target.dataset.add);
  if (addId) return add(addId);
  const changeId = Number(e.target.dataset.change);
  if (changeId) change(changeId, Number(e.target.dataset.delta));
});

document.querySelector('#cart-items').addEventListener('click', e => {
  const id = Number(e.target.dataset.change);
  if (id) change(id, Number(e.target.dataset.delta));
});

document.querySelector('#cart-button').addEventListener('click', () => openCart(true));
document.querySelector('#close-cart').addEventListener('click', () => openCart(false));
document.querySelector('#cart-overlay').addEventListener('click', e => { if (e.target.id === 'cart-overlay') openCart(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') openCart(false); });

document.querySelector('#search-input').addEventListener('input', e => { query = e.target.value; renderProducts(); });
document.querySelector('#search-form').addEventListener('submit', e => {
  e.preventDefault();
  document.querySelector('#ofertas').scrollIntoView({ behavior: 'smooth' });
});

document.querySelector('#clear-filters').addEventListener('click', () => {
  activeCategory = 'Todos'; query = '';
  document.querySelector('#search-input').value = '';
  renderFilters(); renderProducts();
});

document.querySelectorAll('[data-scroll]').forEach(btn =>
  btn.addEventListener('click', () => document.querySelector(`#${btn.dataset.scroll}`).scrollIntoView({ behavior: 'smooth' }))
);

document.addEventListener('click', e => {
  const link = e.target.closest('[data-category]');
  if (link && link.tagName === 'A') {
    activeCategory = link.dataset.category;
    renderFilters(); renderProducts();
  }
});

document.querySelector('#account-button').addEventListener('click', () => show('Área da conta estará disponível em breve.'));
document.querySelector('#checkout').addEventListener('click', () => {
  show('Pedido iniciado! Escolha o pagamento no próximo passo.');
  openCart(false);
});
document.querySelector('#newsletter-form').addEventListener('submit', e => {
  e.preventDefault();
  show('Inscrição confirmada! Fique de olho no seu e-mail.');
  e.target.reset();
});

/* ---------- init ---------- */
renderNav();
renderFilters();
renderFooterCategories();
renderBoard();
renderProducts();
renderCart();
