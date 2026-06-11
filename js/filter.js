
function parsePriceRange(value) {
  if (!value) return { min: 0, max: Infinity };
  if (value === '200+') return { min: 200, max: Infinity };
  const [min, max] = value.split('-').map(Number);
  return { min, max };
}

function getFilteredProducts() {
  const query    = document.getElementById('search-input').value.trim().toLowerCase();
  const category = document.getElementById('cat-filter').value;
  const { min: priceMin, max: priceMax } = parsePriceRange(document.getElementById('price-filter').value);

  return PRODUCTS.filter((p) => {
    if (query && !p.name.toLowerCase().includes(query) && !p.category.toLowerCase().includes(query)) return false;
    if (category && p.category !== category) return false;
    if (p.price < priceMin || p.price > priceMax) return false;
    return true;
  });
}

function renderProducts() {
  const filtered = getFilteredProducts();
  const grid     = document.getElementById('product-grid');
  const countEl  = document.getElementById('results-count');

  countEl.textContent = `${filtered.length} item${filtered.length !== 1 ? 's' : ''}`;

  if (filtered.length === 0) {
    grid.innerHTML = '<p class="no-results">No dresses match — try adjusting the filters.</p>';
    return;
  }

  grid.innerHTML = filtered.map((p) => `
    <article class="product-card" role="listitem" data-id="${p.id}">
      <div class="card-image" aria-hidden="true">
        <img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;" />
      </div>
      <div class="card-body">
        <p class="card-category">${p.category}</p>
        <h3 class="card-name">${p.name}</h3>
        <p class="card-price">$${p.price.toFixed(2)}</p>
        <button
          class="add-to-cart-btn${cartHas(p.id) ? ' in-cart' : ''}"
          onclick="handleAddToCart(${p.id})"
          aria-label="${cartHas(p.id) ? 'Added' : 'Add ' + p.name + ' to cart'}"
        >${cartHas(p.id) ? '✓ Added' : 'Add to Cart'}</button>
      </div>
    </article>`).join('');
}

function initFilters() {
  document.getElementById('search-input').addEventListener('input', renderProducts);
  document.getElementById('cat-filter').addEventListener('change', renderProducts);
  document.getElementById('price-filter').addEventListener('change', renderProducts);
}
