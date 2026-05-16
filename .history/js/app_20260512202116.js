// app.js — Home page: render menu cards, search, filter, add-to-cart
document.addEventListener("DOMContentLoaded", () => {
  const grid        = document.getElementById("food-grid");
  const searchInput = document.getElementById("search-input");
  const filterBtns  = document.querySelectorAll(".filter-btn");
  const cartCount   = document.getElementById("cart-count");

  let items       = getFoodItems();
  let activeFilter = "All";

  // ── Cart badge ──────────────────────────────────────────────
  function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const total = cart.reduce((s, i) => s + i.qty, 0);
    cartCount.textContent = total;
    cartCount.style.display = total ? "flex" : "none";
  }

  // ── Render cards ────────────────────────────────────────────
  function renderCards(list) {
    grid.innerHTML = "";
    if (!list.length) {
      grid.innerHTML = `<p class="no-results">No items found 😔</p>`;
      return;
    }
    list.forEach((item, idx) => {
      const card = document.createElement("div");
      card.className = "food-card";
      card.style.animationDelay = `${idx * 60}ms`;
      card.innerHTML = `
        <div class="card-img-wrap">
          <img src="${item.image}" alt="${item.name}" onerror="this.src='assets/placeholder.jpg'">
          <span class="card-badge">${item.category}</span>
        </div>
        <div class="card-body">
          <h3 class="card-title">${item.name}</h3>
          <div class="card-footer">
            <span class="card-price">₹${item.price}</span>
            <button class="add-btn" data-id="${item.id}" aria-label="Add to cart">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add
            </button>
          </div>
        </div>`;
      grid.appendChild(card);
    });

    // Add-to-cart handlers
    grid.querySelectorAll(".add-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id   = parseInt(btn.dataset.id);
        const food = getFoodItems().find(f => f.id === id);
        if (!food) return;
        addToCart(food);
        updateCartBadge();
        btn.classList.add("added");
        btn.textContent = "✓ Added";
        setTimeout(() => {
          btn.classList.remove("added");
          btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Add`;
        }, 1200);
      });
    });
  }

  function addToCart(food) {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find(i => i.id === food.id);
    if (existing) existing.qty += 1;
    else cart.push({ ...food, qty: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // ── Filter + search ─────────────────────────────────────────
  function getFiltered() {
    const q = searchInput.value.trim().toLowerCase();
    return items.filter(i => {
      const matchCat  = activeFilter === "All" || i.category === activeFilter;
      const matchText = !q || i.name.toLowerCase().includes(q);
      return matchCat && matchText;
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeFilter = btn.dataset.filter;
      renderCards(getFiltered());
    });
  });

  searchInput.addEventListener("input", () => renderCards(getFiltered()));

  // ── Init ────────────────────────────────────────────────────
  updateCartBadge();
  renderCards(getFiltered());
});
