// cart.js — Cart page: display items, qty controls, order placement
document.addEventListener("DOMContentLoaded", () => {
  const cartList    = document.getElementById("cart-list");
  const subtotalEl  = document.getElementById("subtotal");
  const taxEl       = document.getElementById("tax");
  const totalEl     = document.getElementById("total");
  const placeBtn    = document.getElementById("place-order-btn");
  const emptyMsg    = document.getElementById("empty-msg");
  const cartSection = document.getElementById("cart-section");

  function getCart() { return JSON.parse(localStorage.getItem("cart") || "[]"); }
  function saveCart(c) { localStorage.setItem("cart", JSON.stringify(c)); }

  function calcTotals(cart) {
    const sub = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const tax = Math.round(sub * 0.05);
    return { sub, tax, total: sub + tax };
  }

  function renderCart() {
    const cart = getCart();
    cartList.innerHTML = "";

    if (!cart.length) {
      emptyMsg.style.display    = "flex";
      cartSection.style.display = "none";
      return;
    }
    emptyMsg.style.display    = "none";
    cartSection.style.display = "block";

    cart.forEach(item => {
      const row = document.createElement("div");
      row.className = "cart-row";
      row.innerHTML = `
        <img class="cart-img" src="${item.image}" alt="${item.name}" onerror="this.src='assets/placeholder.jpg'">
        <div class="cart-info">
          <p class="cart-name">${item.name}</p>
          <p class="cart-unit">₹${item.price} each</p>
        </div>
        <div class="qty-controls">
          <button class="qty-btn dec" data-id="${item.id}">−</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn inc" data-id="${item.id}">+</button>
        </div>
        <span class="cart-subtotal">₹${item.price * item.qty}</span>
        <button class="remove-btn" data-id="${item.id}" aria-label="Remove">✕</button>`;
      cartList.appendChild(row);
    });

    const { sub, tax, total } = calcTotals(cart);
    subtotalEl.textContent = `₹${sub}`;
    taxEl.textContent      = `₹${tax}`;
    totalEl.textContent    = `₹${total}`;

    // Controls
    cartList.querySelectorAll(".inc").forEach(btn =>
      btn.addEventListener("click", () => changeQty(parseInt(btn.dataset.id), 1)));
    cartList.querySelectorAll(".dec").forEach(btn =>
      btn.addEventListener("click", () => changeQty(parseInt(btn.dataset.id), -1)));
    cartList.querySelectorAll(".remove-btn").forEach(btn =>
      btn.addEventListener("click", () => removeItem(parseInt(btn.dataset.id))));
  }

  function changeQty(id, delta) {
    let cart = getCart();
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
    saveCart(cart);
    renderCart();
  }

  function removeItem(id) {
    saveCart(getCart().filter(i => i.id !== id));
    renderCart();
  }

  placeBtn && placeBtn.addEventListener("click", () => {
    const cart = getCart();
    if (!cart.length) return;
    const { total } = calcTotals(cart);
    localStorage.removeItem("cart");
    renderCart();
    showConfirmation(total);
  });

  function showConfirmation(total) {
    const modal = document.getElementById("confirm-modal");
    document.getElementById("confirm-total").textContent = `₹${total}`;
    modal.style.display = "flex";
    document.getElementById("close-modal").addEventListener("click", () => {
      modal.style.display = "none";
      window.location.href = "index.html";
    });
  }

  renderCart();
});
