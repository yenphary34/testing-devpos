function showView(viewName) {
  document.querySelectorAll(".view").forEach((s) => {
    s.classList.toggle("active", s.id === `${viewName}-view`);
  });
  document.querySelectorAll(".nav-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.view === viewName);
  });
  if (viewName === "cart") renderCart();
  if (viewName === "checkout") renderSummary();
}

/* ── Add to cart ── */
function handleAddToCart(productId) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;
  cartAdd(productId);
  showToast(`${product.emoji} "${product.name}" added to your bag`);
}

/* ── Checkout ── */
document.getElementById("checkout-btn").addEventListener("click", () => {
  if (Object.keys(cart).length === 0) {
    showToast("Your bag is empty!");
    return;
  }
  showView("checkout");
  renderSummary();
});

document.getElementById("place-order-btn").addEventListener("click", () => {
  // Basic validation
  const email = document.getElementById("co-email").value.trim();
  const first = document.getElementById("co-first").value.trim();
  const address = document.getElementById("co-address").value.trim();
  const card = document.getElementById("co-card").value.trim();

  if (!email || !first || !address || !card) {
    showToast("Please fill in all required fields.");
    return;
  }

  // Generate order number
  const orderNum =
    "PD-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  document.getElementById("success-order-num").textContent =
    `Order number: ${orderNum}`;

  // Clear cart
  Object.keys(cart).forEach((k) => delete cart[k]);
  updateCartBadge();

  showView("success");
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ── Newsletter ── */
function handleNewsletter(btn) {
  const input = btn.previousElementSibling;
  if (!input.value.includes("@")) {
    showToast("Please enter a valid email address.");
    return;
  }
  showToast("✓ You're subscribed — welcome to Phary Dress!");
  input.value = "";
}

/* ── Toast ── */
let toastTimer = null;
function showToast(message, duration = 2400) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), duration);
}

/* ── Global click delegation for data-view buttons ── */
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-view]");
  if (btn) showView(btn.dataset.view);
});

/* ── Card number formatting ── */
document.addEventListener("input", (e) => {
  if (e.target.id === "co-card") {
    e.target.value = e.target.value
      .replace(/\D/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim()
      .slice(0, 19);
  }
  if (e.target.id === "co-expiry") {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length >= 3) v = v.slice(0, 2) + " / " + v.slice(2, 4);
    e.target.value = v;
  }
});

/* ── Boot ── */
function init() {
  initFilters();
  renderProducts();
  updateCartBadge();
}

init();
