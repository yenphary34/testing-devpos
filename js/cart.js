
/** @type {Object.<number, number>} productId → quantity */
const cart = {};

function cartAdd(productId) {
  cart[productId] = (cart[productId] || 0) + 1;
  cartSync();
}

function cartRemove(productId) {
  delete cart[productId];
  cartSync();
}

function cartChangeQty(productId, delta) {
  const next = (cart[productId] || 0) + delta;
  if (next <= 0) { cartRemove(productId); return; }
  cart[productId] = next;
  cartSync();
}

function cartTotalCount() {
  return Object.values(cart).reduce((s, q) => s + q, 0);
}

function cartTotalPrice() {
  return Object.entries(cart).reduce((s, [id, qty]) => {
    const p = PRODUCTS.find((x) => x.id === Number(id));
    return s + (p ? p.price * qty : 0);
  }, 0);
}

function cartHas(productId) {
  return (cart[productId] || 0) > 0;
}

function cartSync() {
  updateCartBadge();
  renderCart();
  renderProducts();
}

function updateCartBadge() {
  const count = cartTotalCount();
  const badge = document.getElementById('cart-badge');
  badge.textContent = count;
  badge.classList.toggle('visible', count > 0);
}

function renderCart() {
  const entries = Object.entries(cart);
  const itemsEl = document.getElementById('cart-items');
  const footerEl = document.getElementById('cart-footer');
  const countEl = document.getElementById('cart-item-count');
  const totalEl = document.getElementById('cart-total');

  countEl.textContent = entries.length
    ? `${entries.length} item${entries.length !== 1 ? 's' : ''}`
    : '';

  if (entries.length === 0) {
    itemsEl.innerHTML = '<p class="cart-empty">Your bag is empty — go add something beautiful!</p>';
    footerEl.classList.remove('visible');
    return;
  }

  itemsEl.innerHTML = entries.map(([id, qty]) => {
    const p = PRODUCTS.find((x) => x.id === Number(id));
    if (!p) return '';
    return `
      <div class="cart-item" data-id="${p.id}">
        <div class="cart-item-emoji">
  <img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;border-radius:6px;" />
</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${p.name}</div>
          <div class="cart-item-price">$${p.price.toFixed(2)} × ${qty} = $${(p.price * qty).toFixed(2)}</div>
        </div>
        <div class="qty-control" role="group" aria-label="Quantity">
          <button class="qty-btn" onclick="cartChangeQty(${p.id}, -1)" aria-label="Decrease">−</button>
          <span class="qty-num">${qty}</span>
          <button class="qty-btn" onclick="cartChangeQty(${p.id}, 1)" aria-label="Increase">+</button>
        </div>
        <button class="remove-btn" onclick="cartRemove(${p.id})" aria-label="Remove">✕</button>
      </div>`;
  }).join('');

  footerEl.classList.add('visible');
  totalEl.textContent = `$${cartTotalPrice().toFixed(2)}`;
}


function renderSummary() {
  const entries = Object.entries(cart);
  const subtotal = cartTotalPrice();

  document.getElementById('summary-subtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('summary-total').textContent = `$${subtotal.toFixed(2)}`;

  document.getElementById('summary-items').innerHTML = entries.map(([id, qty]) => {
    const p = PRODUCTS.find((x) => x.id === Number(id));
    if (!p) return '';
    return `
      <div class="summary-item">
        <div class="summary-item-emoji">
  <img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;border-radius:4px;" />
</div>
        <div class="summary-item-info">
          <div class="summary-item-name">${p.name}</div>
          <div class="summary-item-qty">Qty: ${qty}</div>
        </div>
        <div class="summary-item-price">$${(p.price * qty).toFixed(2)}</div>
      </div>`;
  }).join('');
}
